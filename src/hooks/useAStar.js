import { useState, useEffect } from 'react'

function useAStar() {
    const [cellArray, setCellArray] = useState([])
    const [visualizationState, setVisualizationState] = useState("idle") //idle, running, finished
    const [brush, setBrush] = useState("white")

    // Initialize the visualization state on first render
    useEffect(() => {
        initialize(50)
    }, [])

    // TODO
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
        //TODO check if has start and finish cell
        if (visualizationState === "idle") {
            setVisualizationState((old) => "running")
        }

        // TODO start visualization
    }

    const stopVisualization = () => {
        setVisualizationState((old) => "idle")
    }

    const restartVisualization = () => {
        // TODO keep start, finish, wall cell
        // Convert all other cells to white
        setVisualizationState((old) => "idle")
    }

    const clearVisualization = () => {
        initialize()
        setVisualizationState((old) => "idle")
    }

    // TODO
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
            case "red":
                break
            case "green":
                break
            case "blue":
                break
            case "yellow":
                break
            case "purple":
                break
            case "orange":
                break
            case "grey":
                break
            case "turquoise":
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