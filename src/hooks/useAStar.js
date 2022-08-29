import { useState, useEffect } from 'react'

function useAStar() {
    const [cellArray, setCellArray] = useState([])
    const [algorithmState, setAlgorithmState] = useState({
        count: 0,
        g_score: [],
        f_score: [],
        open_set: [],
    })
    const [visualizationState, setVisualizationState] = useState("idle") //idle, running, finished
    const [brush, setBrush] = useState("white")

    const size = 50

    // Initialize the visualization state on first render
    useEffect(() => {
        initialize(size)
    }, [])

    const initialize = (size = 50) => {
        setCellArray(
            Array.apply(null, Array(size ** 2)).map(function (x, i) {
                let neighbours = []
                let limitIndex = size ** 2 - 1

                // If not first element of the row
                if (Math.floor((i - 1) / size) === Math.floor(i / size) && i - 1 >= 0) {
                    neighbours.push(i - 1)
                }

                // If not last element of the row
                if (Math.floor((i + 1) / size) === Math.floor(i / size) && i + 1 <= limitIndex) {
                    neighbours.push(i + 1)
                }

                // If not first element of the column
                if (i - size >= 0) {
                    neighbours.push(i - size)
                }

                // If not last element of the column
                if (i + size <= limitIndex) {
                    neighbours.push(i + size)
                }

                return ({
                    index: i,
                    size: 10,
                    color: 'white',
                    neighbours: neighbours
                });
            })
        )
    }

    const startVisualization = () => {
        // check if has start and finish cell
        const hasStartAndFinishCell =
            cellArray.findIndex((cell) => cell.color === "orange") !== -1 &&
            cellArray.findIndex((cell) => cell.color === "turquoise") !== -1

        if (visualizationState === "idle" && hasStartAndFinishCell) {
            setVisualizationState((old) => "running")
            setTimeout(() => {
                run()
            }, 20)
        }
    }

    const stopVisualization = () => {
        setVisualizationState((old) => "idle")
    }

    const restartVisualization = () => {
        // Keep start, finish, wall cell
        // Convert all other cells to white
        const newCellArray = cellArray.map((cell) => {
            if (cell.color === "orange" || cell.color === "turquoise" || cell.color === "black") {
                return cell
            } else {
                return {
                    ...cell,
                    color: "white"
                }
            }
        })
        setCellArray((old) => newCellArray)
        setVisualizationState((old) => "idle")
    }

    const clearVisualization = () => {
        initialize()
        setVisualizationState((old) => "idle")
    }

    const run = () => {
        const startCellIndex = cellArray.find((cell) => cell.color === "orange").index
        const endCellIndex = cellArray.find((cell) => cell.color === "turquoise").index

        let cellsToCheckNext = []
        let cellsAlreadyChecked = []

        for (let cell of cellArray) {
            if (["green"].includes(cell.color)) {
                cellsToCheckNext.push(cell)
            }
            else if (cell.color === "red") {
                cellsAlreadyChecked.push(cell)
            }
        }

        const hasAlreadyStarted = cellsToCheckNext.length > 0 || cellsAlreadyChecked.length > 0

        let newAlgoState = algorithmState
        if (!hasAlreadyStarted) {
            newAlgoState.count = 0
            newAlgoState.g_score = Array(cellArray.length).fill(Infinity)
            newAlgoState.g_score.splice(startCellIndex, 1, 0)
            newAlgoState.f_score = Array(cellArray.length).fill(Infinity)
            newAlgoState.f_score.splice(startCellIndex, 1, h(startCellIndex, endCellIndex))
            newAlgoState.open_set = [{
                index: startCellIndex,
                score: 0,
                count: 0,
                path: []
            }]
            newAlgoState.open_set_hash = [startCellIndex]

            setAlgorithmState((old) => newAlgoState)
        }

        setTimeout(() => {
            nextStepRun(endCellIndex, newAlgoState)
        }, 200)
    }

    const nextStepRun = (endCellIndex, newAlgoState = { ...algorithmState }, newCellArray = [...cellArray]) => {
        // if (visualizationState === "running") {
        if (true) {
            // If no cells to check, finish
            if (newAlgoState.open_set.length < 1) {
                setVisualizationState((old) => "finished")
                return
            }

            // Get the cell with the lowest f_score
            let lowestFScoreCell = newAlgoState.open_set[0]
            newAlgoState.open_set_hash.splice(newAlgoState.open_set_hash.indexOf(lowestFScoreCell), 1)

            // Remove the cell from the open_set
            newAlgoState.open_set.splice(0, 1)

            // If current cell is end cell
            if (cellArray[lowestFScoreCell.index].color === "turquoise") {
                setVisualizationState((old) => "finished")
                paintPath(lowestFScoreCell.path)
                return
            }

            let count = lowestFScoreCell.count

            for (let neighbour of cellArray[lowestFScoreCell.index].neighbours) {
                if (cellArray[neighbour].color !== "black") {
                    let temp_g_score = newAlgoState.g_score[lowestFScoreCell.index] + 1
                    if (temp_g_score < newAlgoState.g_score[neighbour]) {
                        count = count + 1
                        newAlgoState.g_score.splice(neighbour, 1, temp_g_score)
                        newAlgoState.f_score.splice(neighbour, 1, temp_g_score + h(neighbour, endCellIndex))
                        newAlgoState.open_set_hash.push(neighbour)
                        newAlgoState.open_set.push({
                            index: neighbour,
                            score: newAlgoState.f_score[neighbour],
                            count: count,
                            path: [...lowestFScoreCell.path, lowestFScoreCell.index]
                        })

                        newCellArray.splice(neighbour, 1, { ...newCellArray[neighbour], color: "green" })
                    }
                }
            }

            newCellArray.splice(lowestFScoreCell.index, 1, { ...newCellArray[lowestFScoreCell.index], color: "red" })

            // Sort the open_set by increasing f_score
            newAlgoState.open_set = newAlgoState.open_set.sort((a, b) => a.score - b.score)
            setAlgorithmState((old) => newAlgoState)
            setCellArray((old) => newCellArray)
            setTimeout(() => {
                nextStepRun(endCellIndex, newAlgoState, newCellArray)
            }, 20)
        }
    }

    const getCoordinatesFromIndex = (index) => {
        const x = index % size
        const y = Math.floor(index / size)
        return { x, y }
    }

    const h = (p1, p2) => {
        const p1Coord = getCoordinatesFromIndex(p1)
        const p2Coord = getCoordinatesFromIndex(p2)

        const distance = Math.sqrt(
            Math.pow(p1Coord.x - p2Coord.x, 2) +
            Math.pow(p1Coord.y - p2Coord.y, 2)
        )

        return distance
    }

    const paint = (index) => {
        switch (brush) {
            // Empty cell
            case "white":
                setCellArray((old) => {
                    const newVal = { ...old[index], color: brush }
                    let newArr = [...old]
                    newArr.splice(index, 1, newVal)
                    return newArr
                })
                break
            // Wall 
            case "black":
                setCellArray((old) => {
                    const newVal = { ...old[index], color: brush }
                    let newArr = [...old]
                    newArr.splice(index, 1, newVal)
                    return newArr
                })
                break
            // Start
            case "orange":
                // Check if there is already an orange cell. Paint it white
                const orangeIndex = cellArray.findIndex((cell) => cell.color === "orange")
                if (orangeIndex !== -1) {
                    setCellArray((old) => {
                        const newVal = { ...old[orangeIndex], color: "white" }
                        let newArr = [...old]
                        newArr.splice(orangeIndex, 1, newVal)
                        return newArr
                    })
                }
                setCellArray((old) => {
                    const newVal = { ...old[index], color: brush }
                    let newArr = [...old]
                    newArr.splice(index, 1, newVal)
                    return newArr
                })
                break
            // End
            case "turquoise":
                // Check if there is already an turquoise cell. Paint it white
                const turquoiseIndex = cellArray.findIndex((cell) => cell.color === "turquoise")
                if (turquoiseIndex !== -1) {
                    setCellArray((old) => {
                        const newVal = { ...old[turquoiseIndex], color: "white" }
                        let newArr = [...old]
                        newArr.splice(turquoiseIndex, 1, newVal)
                        return newArr
                    })
                }

                setCellArray((old) => {
                    const newVal = { ...old[index], color: brush }
                    let newArr = [...old]
                    newArr.splice(index, 1, newVal)
                    return newArr
                })
                break
            default:
                break
        }
    }

    const paintPath = (path) => {
        path.splice(0, 1)
        for (let index of path) {
            setCellArray((old) => {
                const newVal = { ...old[index], color: "purple" }
                let newArr = [...old]
                newArr.splice(index, 1, newVal)
                return newArr
            })
        }
    }

    return {
        startVisualization,
        stopVisualization,
        restartVisualization,
        clearVisualization,
        paint,
        cellArray,
        brush,
        visualizationState,
        setBrush
    }

}

export default useAStar