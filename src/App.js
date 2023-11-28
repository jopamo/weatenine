import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { checkStoppingCriteria, paintRandomCell, initializeGrid } from './paintTools';
import Background from './Background';
import { debounce } from 'lodash';
import './App.css';

function App({ setCurrentPage }) {
  const paintingIntervalRef = useRef(null);
  const isPaintingRef = useRef(false);

  // Define a function to calculate the initial dimensions for the grid based on the window size
  const calculateInitialDimensions = () => {
    // Get the inner width of the window (the width of the viewport)
    const width = window.innerWidth;

    // Determine if the current device is a mobile device based on the width
    // Consider it a mobile device if the width is less than 768 pixels
    const isMobile = width < 768;

    // Calculate the xDimension (number of cells horizontally) for the grid
    // If it's a mobile device, set xDimension to 10
    // For non-mobile devices, calculate it based on the width of the window:
    // Divide the window width by 50 to get the number of cells, but limit it to a maximum of 25 cells
    const xDimension = isMobile ? 10 : Math.min(Math.floor(width / 50), 25);

    // Calculate the yDimension (number of cells vertically) for the grid.
    // Similar to xDimension, but using the window's inner height for the calculation
    // If it's a mobile device, set yDimension to 10.
    // For non-mobile devices, divide the window height by 50 for the number of cells
    // with a maximum limit of 25 cells.
    const yDimension = isMobile ? 10 : Math.min(Math.floor(window.innerHeight / 50), 25);

    // Return an object containing the calculated dimensions (xDimension and yDimension)
    return { xDimension, yDimension };
  };

  // Retrieve initial dimensions for the grid from calculateInitialDimensions function
  const {
    xDimension: initialXDimension,
    yDimension: initialYDimension
  } = calculateInitialDimensions();

  // xDimension and yDimension using the initial values obtained
  const [xDimension, setXDimension] = useState(initialXDimension);
  const [yDimension, setYDimension] = useState(initialYDimension);

  // Handle the continue action, transitioning to the 'experiments' page
  const handleContinue = () => {
    setCurrentPage('experiments');
  };

  // useRef hooks to keep references to the canvas and its drawing context
  const canvasRef = useRef(null); // Ref for the canvas element
  const ctxRef = useRef(null); // Ref for the canvas's 2D drawing context

  // Object to map color values to human-readable color names
  // Each property is a color in RGB format mapped to its name
  const colorOptions = {
    'rgb(255,0,0)': 'Red',
    'rgb(0,255,0)': 'Green',
    'rgb(0,0,255)': 'Blue',
    'rgb(255,255,0)': 'Yellow',
    'rgb(0,255,255)': 'Cyan',
    'rgb(255,0,255)': 'Magenta',
    'rgb(128,0,0)': 'Maroon',
    'rgb(0,128,128)': 'Teal'
  };

  // State for managing the selected colors
  const [color1, setColor1] = useState('rgb(255,0,0)');
  const [color2, setColor2] = useState('rgb(0,255,0)');
  const [color3, setColor3] = useState('rgb(0,0,255)');

  // State for managing the stopping criterion and its message
  const [stoppingCriterion, setStoppingCriterion] = useState('allMixedColors');
  const [stoppingCriteriaMessage, setStoppingCriteriaMessage] = useState('');

  // State for the grid data structure. It's a 2D array representing the grid cells
  const [grid, setGrid] = useState([]);

  // State to track whether the painting process is active
  const [isPainting, setIsPainting] = useState(false);

  // State for managing the speed at which paint drops are applied
  const [dropSpeed, setDropSpeed] = useState(10);

  // Render color options in the UI, excluding chosen colors
  const renderColorOptions = (excludeColors) => {
    return Object.entries(colorOptions)
      .filter(([colorValue]) => !excludeColors.includes(colorValue)) // Exclude specified colors
      .map(([colorValue, colorName]) => (
        <option key={colorValue} value={colorValue}>{colorName}</option> // Render each color option
      ));
  };

  // This is the callback function provided to 'useCallback'. It takes four parameters:
  // ctx: The canvas rendering context where the cell will be drawn
  // x: The x-coordinate of the cell on the grid
  // y: The y-coordinate of the cell on the grid
  // color: The color to fill the cell with
  const drawCell = useCallback((ctx, x, y, color) => {
    // Set the fill style of the context to the specified color
    ctx.fillStyle = color;

    // Draw a filled rectangle (the cell) on the canvas at the specified coordinates
    // The rectangle starts at (x * 20, y * 20) and has a size of 20x20 pixels
    // The multiplication by 20 scales the grid coordinates to canvas coordinates
    ctx.fillRect(x * 20, y * 20, 20, 20);
  }, []); // Empty dependency array since drawCell doesn't depend on external values

  // Draw the entire grid
  const drawGrid = useCallback(
    // This is the callback function provided to 'useCallback'. It does not take parameters
    () => {
      // Retrieve the current canvas context stored in 'ctxRef'.
      // 'ctxRef' is a ref object that persists for the lifetime of the component
      // and provides access to the canvas context
      const ctx = ctxRef.current;

      // Iterate over each row in the grid.
      // 'grid' is a 2D array representing the grid of cells
      // 'y' is the index of the current row in the grid
      grid.forEach((row, y) => {

        // Iterate over each cell in the current row
        // 'x' is the index of the current cell in the row
        row.forEach((cell, x) => {

          // Call 'drawCell' to draw the current cell
          // 'ctx' is the canvas context.
          // 'x' and 'y' are the coordinates of the cell
          // 'cell.color || '#282c34'' determines the color to use for the cell:
          //   If 'cell.color' is defined, use it; otherwise, default to background color
          drawCell(ctx, x, y, cell.color || 'transparent');
        });
      });
    },

    // The dependency array for useCallback
    // The function will be recreated if any of these dependencies change:
    // - 'grid': The data structure representing the grid of cells
    // - 'ctxRef': The ref object pointing to the canvas context
    // - 'drawCell': The function used to draw individual cells
    [grid, ctxRef, drawCell]
  );


  // Set up the canvas and its context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext('2d');
      canvas.width = xDimension * 20; // Assuming each cell is 20x20 pixels
      canvas.height = yDimension * 20;
      drawGrid();
    }
  }, [xDimension, yDimension, drawGrid]);

  // When grid dimensions change, we generate a new empty grid with the new dimensions
  useEffect(() => {
    if (xDimension && yDimension) {
      const newGrid = initializeGrid(xDimension, yDimension);
      setGrid(newGrid);
    }
  }, [xDimension, yDimension]);

  useEffect(() => {
    document.title = "weatenine"
  }, []);

  const initialColorCounts = useMemo(() => ({
    totalColor1: 0,
    totalColor2: 0,
    totalColor3: 0
  }), []);

  const [colorCounts, setColorCounts] = useState(initialColorCounts);

  const resetBoardAndCounts = useCallback(() => {
    const newGrid = initializeGrid(xDimension, yDimension);

    setGrid(newGrid);
    setColorCounts({
      totalColor1: 0,
      totalColor2: 0,
      totalColor3: 0
    });

    // Clear the canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1c1c1c'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Remove the stop message
    setStoppingCriteriaMessage('');
  }, [xDimension, yDimension]);

  const stopPaintingAndReset = useCallback(() => {
    setIsPainting(false);
    resetBoardAndCounts();
  }, [resetBoardAndCounts]);

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      const {
        xDimension: newXDimension,
        yDimension: newYDimension
      } = calculateInitialDimensions();

      if (newXDimension !== xDimension || newYDimension !== yDimension) {
        stopPaintingAndReset();
        setXDimension(newXDimension);
        setYDimension(newYDimension);
      }
    }, 250);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [xDimension, yDimension, stopPaintingAndReset]);

  const paintAndCheck = useCallback(() => {
    if (!isPaintingRef.current) return; // Add this check

    // Execute the painting function
    const {
      grid: updatedGrid,
      counts: updatedCounts,
      paintedCell
    } = paintRandomCell(grid, xDimension, yDimension, color1, color2, color3, colorCounts);

    // Update states based on the painting action
    setGrid(updatedGrid);

    setColorCounts(prevCounts => ({
      totalColor1: prevCounts.totalColor1 + (paintedCell.color === color1 ? 1 : 0),
      totalColor2: prevCounts.totalColor2 + (paintedCell.color === color2 ? 1 : 0),
      totalColor3: prevCounts.totalColor3 + (paintedCell.color === color3 ? 1 : 0),
      squareMostDrops: Math.max(prevCounts.squareMostDrops, updatedCounts.squareMostDrops)
    }));

    drawCell(ctxRef.current, paintedCell.x, paintedCell.y, updatedGrid[paintedCell.y][paintedCell.x].color);

    // Check stopping criteria
    const result = checkStoppingCriteria(updatedGrid, stoppingCriterion, color1, color2, color3);
    if (result.met) {
      clearInterval(paintingIntervalRef.current);
      setIsPainting(false);
      setStoppingCriteriaMessage(result.message);
      console.log(`Stopping painting: ${result.message}`);
      if (!isPainting) return;
    }
  }, [grid, xDimension, yDimension, color1, color2, color3, colorCounts, setGrid, setColorCounts, drawCell, stoppingCriterion, isPainting]);

  useEffect(() => {
    if (!isPainting) return;

    // Set the interval to repeatedly call paintAndCheck
    paintingIntervalRef.current = setInterval(paintAndCheck, 1000 / dropSpeed);

    // Clean up the interval when the component unmounts or conditions change
    return () => clearInterval(paintingIntervalRef.current);
  }, [isPainting, paintAndCheck, dropSpeed]);

  // Starts painting
  const handleSubmit = (e) => {
    e.preventDefault();

    if (xDimension <= 0 || yDimension <= 0) {
      alert("Dimensions cannot be negative or zero!");
      return;
    }
    startPainting();
  };

  const startPainting = () => {
    resetBoardAndCounts();
    console.log("Starting painting");
    isPaintingRef.current = true;
    setIsPainting(true);
  };

return (
  <div className="App">
    <Background />
    <div className="control-panel">
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-row">
        <div className="form-group">
          <label>X:</label>
          <input
            type="number"
            min="2"
            max="30"
            value={xDimension}
            onChange={(e) => setXDimension(e.target.value)}
            disabled={isPainting}
            maxLength="2" />
        </div>
        <div className="form-group">
          <label>Y:</label>
          <input
            type="number"
            min="2"
            max="30"
            value={yDimension}
            onChange={(e) => setYDimension(e.target.value)}
            disabled={isPainting}
            maxLength="2" />
        </div>
        </div>
        <div className="form-row">
        <div className="form-group">
          <label>Color 1:</label>
          <select
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            disabled={isPainting}
          >
            {renderColorOptions([color2, color3])}
          </select>
        </div>
        <div className="form-group">
          <label>Color 2:</label>
          <select
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
            disabled={isPainting}
          >
            {renderColorOptions([color1, color3])}
          </select>
        </div>
        <div className="form-group">
          <label>Color 3:</label>
          <select
            value={color3}
            onChange={(e) => setColor3(e.target.value)}
            disabled={isPainting}
          >
            {renderColorOptions([color1, color2])}
          </select>
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
            <option value="secondBlob">Second Paint Blob on a Square</option>
            <option value="allMixedColors">Entire Board Mixed Colors</option>
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
        <div className="buttons-container">
            <button onClick={startPainting} disabled={xDimension === 0 || yDimension === 0}>Start Painting</button>
            <button onClick={handleContinue}>Continue</button>
          </div>
        </form>
      </div>

      <div className="stopping-criteria-message">
        {stoppingCriteriaMessage && <p>{stoppingCriteriaMessage}</p>}
      </div>

      <div className="canvas-and-chart-container">
        <div className="canvas-container">
          <canvas ref={canvasRef} className="paintCanvas"></canvas>
        </div>

        <div className="color-counts">
          <table>
            <thead>
              <tr>
                <th>Color</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="color-swatch" style={{ backgroundColor: color1 }}></td>
                <td>{colorCounts.totalColor1}</td>
              </tr>
              <tr>
                <td className="color-swatch" style={{ backgroundColor: color2 }}></td>
                <td>{colorCounts.totalColor2}</td>
              </tr>
              <tr>
                <td className="color-swatch" style={{ backgroundColor: color3 }}></td>
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
