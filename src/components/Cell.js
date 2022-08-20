import React, { useMemo } from 'react'

import './Cell.css'

function Cell(props) {

    const cellColor = useMemo(() => {
        switch (props.color) {
            // Empty cell
            case "white":
                return "rgb(255, 255, 255)";
            // Wall 
            case "black":
                return "rgb(0, 0, 0)";
            case "red":
                return "rgb(255, 0, 0)";
            case "green":
                return "rgb(0, 255, 0)";
            case "blue":
                return "rgb(0, 0, 255)";
            case "yellow":
                return "rgb(255, 255, 0)";
            case "purple":
                return "rgb(128,0,128)"
            case "orange":
                return "rgb(255, 165, 0)";
            case "grey":
                return "rgb(128, 128, 128)";
            case "turquoise":
                return "rgb(64, 224, 208)";
            default:
                return "rgb(255, 255, 255)";
        }
    }, [props.color])



    return (
        <div
            onClick={() => { props.handleClick(props.index) }}
            className={props.tooltip ? `${props.containerClass} tooltip` : props.containerClass}
            onMouseEnter={(e) => {
                if (e.buttons > 0) {
                    props.handleClick(props.index)
                }
            }}
            style={{
                backgroundColor: cellColor,
                width: props.size,
                height: props.size,
            }}>
            <span className="tooltiptext">{props.tooltip}</span>
        </div>
    )
}

Cell.defaultProps = {
    index: 0,
    size: 10,
    color: 'white',
    containerClass: "cell-container",
    handleClick: () => { },
    tooltip: null, //String
}

export default Cell