import React from "react"

import './App.css';

import Board from "./components/Board"
import Cell from "./components/Cell"
import useAStar from './hooks/useAStar';

function App() {

  const {
    startVisualization,
    stopVisualization,
    restartVisualization,
    clearVisualization,
    paint,
    cellArray,
    brush,
    visualizationState,
    setBrush
  } = useAStar()

  const displayBrushSelector = () => {
    const brushText = {
      "white": "Free cell",
      "black": "Wall",
      "green": "",
      "red": "",
      "blue": "",
      "yellow": "",
      "purple": "",
      "orange": "",
      "grey": "",
      "turquoise": ""
    }

    let colorArray = []
    for (const property in brushText) {
      colorArray.push(
        <Cell
          key={property}
          containerClass="cell-container-space-around"
          tooltip={brushText[property]}
          color={property}
          handleClick={() => { setBrush(property) }}
        />
      )
    }

    return (
      <div className="brush-selector-container flex-column">
        <div className="brush-selected-container flex-row">
          <div>Currently selected</div>
          <Cell
            tooltip={brushText[brush]}
            color={brush}
          />
        </div>
        <div className="brush-selector flex-row">
          {colorArray}
        </div>
      </div>
    )
  }

  const displayToolbar = () => {
    return (
      <div className="toolbar flex-row">
        {visualizationState === "idle" &&
          <button className="toolbar-item" onClick={startVisualization}>
            Start visualization
          </button>
        }
        {visualizationState === "running" &&
          <button className="toolbar-item" onClick={stopVisualization}>
            Stop visualization
          </button>
        }
        {visualizationState === "finished" &&
          <button className="toolbar-item" onClick={restartVisualization}>
            Restart visualization
          </button>
        }
        {["idle", "running"].includes(visualizationState) &&
          <button className="toolbar-item" onClick={clearVisualization}>
            Clear
          </button>
        }
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="App-title">
          An A* Visualization tool
        </p>
      </header>
      <div
        className="App-main-content-container"
        style={{ width: Math.sqrt(cellArray.length) * 10 + 5 }}
      >
        <div className="cell-container">
          <Board
            visualizationState={{
              state: visualizationState,
              cellArray: cellArray
            }}
            handlePaint={(i) => { paint(i) }}
          />
        </div>
      </div>
      {displayBrushSelector()}
      {displayToolbar()}
    </div>
  );
}

export default App;
