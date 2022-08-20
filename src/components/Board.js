import React, { useMemo } from 'react'

import Cell from './Cell'

import './Board.css'

function Board(props) {

    let size = useMemo(() => {
        return (
            Math.sqrt(props.visualizationState.cellArray.length)
        )
    }, [props.visualizationState])

    // Build the board as JSX element
    let boardArray = useMemo(() => {
        let arr = []

        for (let i = 0; i < size; i++) {
            let arr2 = []

            for (let j = 0; j < size; j++) {
                let cellData = props.visualizationState.cellArray[(50 * i) + j]

                arr2.push(
                    <Cell
                        key={i + "-" + j}
                        index={cellData.index}
                        size={cellData.size}
                        color={cellData.color}
                        handleClick={(i) => {
                            if (props.visualizationState.state === "idle") {
                                props.handlePaint(i)
                            }
                        }}
                    />
                )
            }

            arr.push(
                <div className="flex-row" key={i}>
                    {arr2}
                </div>
            )

        }

        return (
            <div className="flex-column">
                {arr}
            </div>
        )

    }, [props, size])

    return (
        <div className="board-container">
            {boardArray}
        </div>
    )
}

Board.defaultProps = {
    visualizationState: {
        state: "idle",
        cellArray: Array.apply(null, Array(50 ** 2)).map(function (x, i) {
            return ({
                index: i,
                size: 10,
                color: 'white',
            });
        }),
    },
    handlePaint: (i) => { }
}

export default Board