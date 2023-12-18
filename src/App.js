import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  checkStoppingCriteria,
  paintRandomCell,
  initializeGrid,
} from "./paintTools";
import Background from "./Background";
import { debounce } from "lodash";
import "./App.css";

function App({ setCurrentPage }) {
  const paintingIntervalRef = useRef(null);
  const isPaintingRef = useRef(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const cellSize = 15;

  const calculateInitialDimensions = () => {
    const width = window.innerWidth;

    const xDimension = Math.floor(width / cellSize);
    const yDimension = Math.floor(window.innerHeight / cellSize);

    return { xDimension, yDimension };
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setCurrentPage("experiments");
  };

  const [dimensions, setDimensions] = useState(calculateInitialDimensions());
  const [grid, setGrid] = useState([]);
  const [color1, setColor1] = useState("#ff0000");
  const [color2, setColor2] = useState("#00ff00");
  const [color3, setColor3] = useState("#0000ff");
  const [stoppingCriterion, setStoppingCriterion] = useState("allMixedColors");
  const [stoppingCriteriaMessage, setStoppingCriteriaMessage] = useState("");
  const [isPainting, setIsPainting] = useState(false);
  const [dropSpeed, setDropSpeed] = useState(50);
  const [colorCounts, setColorCounts] = useState({
    totalColor1: 0,
    totalColor2: 0,
    totalColor3: 0,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      if (!isPainting) {
        setDimensions(calculateInitialDimensions());
      }
    }, 250);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", debouncedHandleResize);
      }
    };
  }, [isPainting]);

  const drawCell = useCallback((ctx, x, y, color) => {
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  }, []);

  const drawGrid = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        drawCell(ctx, x, y, cell.color || "transparent");
      });
    });
  }, [grid, drawCell]);

  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext("2d");
    canvas.width = dimensions.xDimension * cellSize;
    canvas.height = dimensions.yDimension * cellSize;
    drawGrid();
  }, [dimensions, drawGrid]);

  const resetBoardAndCounts = useCallback(() => {
    //console.log("Resetting board and counts");

    const initialGrid = initializeGrid(
      dimensions.xDimension,
      dimensions.yDimension,
    );
    setGrid(initialGrid);

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    setColorCounts({ totalColor1: 0, totalColor2: 0, totalColor3: 0 });

    setStoppingCriteriaMessage("");
  }, [dimensions]);

  const paintAndCheck = useCallback(() => {
    if (!isPaintingRef.current) return;

    //console.log("Painting cell");

    const { grid: updatedGrid, paintedCell } = paintRandomCell(
      grid,
      dimensions.xDimension,
      dimensions.yDimension,
      color1,
      color2,
      color3,
      colorCounts,
    );

    setGrid(updatedGrid);

    setColorCounts((prevCounts) => {
      return {
        totalColor1:
          prevCounts.totalColor1 + (paintedCell.color === color1 ? 1 : 0),
        totalColor2:
          prevCounts.totalColor2 + (paintedCell.color === color2 ? 1 : 0),
        totalColor3:
          prevCounts.totalColor3 + (paintedCell.color === color3 ? 1 : 0),
      };
    });

    drawCell(
      ctxRef.current,
      paintedCell.x,
      paintedCell.y,
      updatedGrid[paintedCell.y][paintedCell.x].color,
    );

    const result = checkStoppingCriteria(
      updatedGrid,
      stoppingCriterion,
      color1,
      color2,
      color3,
    );
    if (result.met) {
      //console.log("Stopping criteria met:", result.message);

      clearInterval(paintingIntervalRef.current);
      setIsPainting(false);
      setStoppingCriteriaMessage(result.message);
    }
  }, [
    grid,
    dimensions,
    drawCell,
    color1,
    color2,
    color3,
    colorCounts,
    stoppingCriterion,
  ]);

  useEffect(() => {
    if (isPainting) {
      const intervalId = setInterval(paintAndCheck, 1 / dropSpeed);
      return () => clearInterval(intervalId);
    }
  }, [isPainting, paintAndCheck, dropSpeed]);

  const startPainting = () => {
    resetBoardAndCounts();
    //console.log("Starting painting");
    isPaintingRef.current = true;
    setIsPainting(true);

    requestAnimationFrame(() => {
      const colorsTable = document.getElementById("color-counts");

      if (colorsTable) {
        const scrollPosition =
          colorsTable.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      } else {
        console.error("Colors table not found in the DOM");
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (dimensions.xDimension <= 0 || dimensions.yDimension <= 0) {
      alert("Dimensions cannot be negative or zero!");
      return;
    }

    //console.log("Form submitted, starting painting");
    startPainting();
  };

  return (
    <div className="App">
      <Background />
      <div className="config-container">
        <h1>Random Paint</h1>
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-row">
            <div className="form-group">
              <label>X:</label>
              <input
                type="number"
                min="2"
                max="30"
                value={dimensions.xDimension}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    xDimension: Number(e.target.value),
                  }))
                }
                disabled={isPainting}
                maxLength="2"
              />
            </div>
            <div className="form-group">
              <label>Y:</label>
              <input
                type="number"
                min="2"
                max="30"
                value={dimensions.yDimension}
                onChange={(e) =>
                  setDimensions((prev) => ({
                    ...prev,
                    yDimension: Number(e.target.value),
                  }))
                }
                disabled={isPainting}
                maxLength="2"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Color 1:</label>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                disabled={isPainting}
              />
            </div>
            <div className="form-group">
              <label>Color 2:</label>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                disabled={isPainting}
              />
            </div>
            <div className="form-group">
              <label>Color 3:</label>
              <input
                type="color"
                value={color3}
                onChange={(e) => setColor3(e.target.value)}
                disabled={isPainting}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group stopping-criterion">
              <label>Stopping Criterion:</label>
              <select
                value={stoppingCriterion}
                onChange={(e) => setStoppingCriterion(e.target.value)}
                disabled={isPainting}
              >
                <option value="lastUnpainted">Last Unpainted Square</option>
                <option value="secondBlob">
                  Second Paint Blob on a Square
                </option>
                <option value="allMixedColors">
                  Entire Board Mixed Colors
                </option>
              </select>
            </div>
            <div className="form-group drop-speed">
              <label>Drop Speed:</label>
              <input
                type="range"
                min="1"
                max="100"
                value={dropSpeed}
                onChange={(e) => setDropSpeed(e.target.value)}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="button-container">
        <button
          onClick={startPainting}
          disabled={dimensions.xDimension === 0 || dimensions.yDimension === 0}
        >
          Start Painting
        </button>
        <br />
        <button onClick={handleContinue}>Continue</button>
          <div class="background"></div>

      </div>

      <div className="stopping-criteria-message">
        {stoppingCriteriaMessage && <p>{stoppingCriteriaMessage}</p>}
      </div>

      <div className="canvas-and-chart-container">
        <div className="canvas-container">
          <canvas ref={canvasRef} className="paintCanvas"></canvas>
        </div>

        <div id="color-counts" className="color-counts">
          <table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className="color-swatch"
                  style={{ backgroundColor: color1 }}
                ></td>
                <td>{colorCounts.totalColor1}</td>
              </tr>
              <tr>
                <td
                  className="color-swatch"
                  style={{ backgroundColor: color2 }}
                ></td>
                <td>{colorCounts.totalColor2}</td>
              </tr>
              <tr>
                <td
                  className="color-swatch"
                  style={{ backgroundColor: color3 }}
                ></td>
                <td>{colorCounts.totalColor3}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
