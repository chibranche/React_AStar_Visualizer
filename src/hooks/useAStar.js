import { useState, useEffect } from 'react'

function useAStar() {
    const [cellArray, setCellArray] = useState([])
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
                return ({
                    index: i,
                    size: 10,
                    color: 'white',
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
        }

        // TODO start visualization
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
        setCellArray(newCellArray)


        setVisualizationState((old) => "idle")
    }

    const clearVisualization = () => {
        initialize()
        setVisualizationState((old) => "idle")
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