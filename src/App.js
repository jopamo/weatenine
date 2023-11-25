import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { mixColors } from './paintTools';
import { checkStoppingCriteria } from './paintTools';

function App({ setCurrentPage }) {
  // Define a debounce function to limit the rate at which a function can fire
  function debounce(fn, ms) {
    // Declare a variable 'timer' to keep track of the setTimeout
    let timer;

    // Return a new function that will be the actual debounced function
    return _ => {
      // Clear any existing timeout to reset the timer.
      // This prevents the previous function call from executing if it's within the timeout period
      clearTimeout(timer);

      // Set a new timeout. The original function 'fn' will be called after 'ms' milliseconds
      // if this returned function is not called again during that time
      timer = setTimeout(_ => {
        // Reset the timer to null once the delay is over
        timer = null;

        // Call the original function 'fn' with the context 'this' and any arguments passed
        // 'apply' is used to call 'fn' with the context 'this' and an array-like object 'arguments'
        fn.apply(this, arguments);
      }, ms);
    };
  }


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
  const { xDimension: initialXDimension, yDimension: initialYDimension } = calculateInitialDimensions();

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

  // Render color options in the UI, excluding certain colors
  const renderColorOptions = (excludeColors) => {
    return Object.entries(colorOptions)
      .filter(([colorValue]) => !excludeColors.includes(colorValue)) // Exclude specified colors
      .map(([colorValue, colorName]) => (
        <option key={colorValue} value={colorValue}>{colorName}</option> // Render each color option
      ));
  };

  // Update stopping criteria, wrapped with useCallback for performance optimization
  const updateStoppingCriteria = useCallback(() => {
    const result = checkStoppingCriteria(grid, stoppingCriterion, color1, color2, color3);
    if (result.met) {
      setIsPainting(false); // Stop painting if the criterion is met
      setStoppingCriteriaMessage(result.message); // Update the message indicating why painting stopped
    }
  }, [grid, stoppingCriterion, color1, color2, color3]);

  // Draw the entire grid, wrapped with useCallback
  const drawGrid = useCallback(() => {
    const ctx = ctxRef.current; // Access the canvas context
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        drawCell(ctx, x, y, cell.color || 'grey'); // Draw each cell
      });
    });
  }, [grid, ctxRef]);

  // useEffect hook for setting up the canvas and its context.
  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext('2d'); // Set the context reference.
    canvas.width = xDimension * 20; // Set canvas width based on the grid dimensions.
    canvas.height = yDimension * 20; // Set canvas height.
    drawGrid(); // Draw the initial grid.
  }, [xDimension, yDimension, drawGrid]);

  // Draw a single cell on the canvas.
  const drawCell = (ctx, x, y, color) => {
    ctx.fillStyle = color; // Set the color to fill the cell
    ctx.fillRect(x * 20, y * 20, 20, 20); // Draw the cell at the specified coordinates
  };

  // When grid dimensions change, we generate a new empty grid with the new dimensions
  useEffect(() => {
    if (xDimension && yDimension) {
      const newGrid = Array.from({ length: yDimension }, () => Array.from({ length: xDimension }, () => ({ color: null, count: 0 })));
      setGrid(newGrid);
    }
  }, [xDimension, yDimension]);

  useEffect(() => {
    document.title = "weatenine"
  }, []);

  const initialColorCounts = Object.keys(colorOptions).reduce((acc, color) => {
    acc[color] = 0;
    return acc;
  }, {});

  const [colorCounts, setColorCounts] = useState(initialColorCounts);

  const resetColorCounts = useCallback(() => {
    setColorCounts(initialColorCounts);
  }, [initialColorCounts]);

  const resetBoardAndCounts = useCallback(() => {
    const newGrid = Array.from({ length: yDimension }, () =>
      Array.from({ length: xDimension }, () => ({ color: null, count: 0 }))
    );
    setGrid(newGrid);
    resetColorCounts();

    // Clear the canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#1c1c1c'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Remove the stop message
    setStoppingCriteriaMessage('');
  }, [xDimension, yDimension, resetColorCounts]);

  const stopPaintingAndReset = useCallback(() => {
    setIsPainting(false);
    resetBoardAndCounts();
  }, [resetBoardAndCounts]);

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      const { xDimension: newXDimension, yDimension: newYDimension } = calculateInitialDimensions();

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

  // Chooses a random cell and a random color to paint that cell
  // Define paintRandomCell using useCallback
  const paintRandomCell = useCallback(() => {
    if (xDimension === 0 || yDimension === 0) return;

    const x = Math.floor(Math.random() * xDimension);
    const y = Math.floor(Math.random() * yDimension);
    const chosenColor = [color1, color2, color3][Math.floor(Math.random() * 3)];

  setGrid((prevGrid) => {
    const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
    const mixedColor = mixColors(newGrid[y][x].color, chosenColor);
    newGrid[y][x].color = mixedColor;
    newGrid[y][x].count++;
    drawCell(ctxRef.current, x, y, mixedColor);
    updateStoppingCriteria(newGrid);
    return newGrid;
  });

  setColorCounts((prevCounts) => ({
    ...prevCounts,
    [chosenColor]: prevCounts[chosenColor] + 1
  }));
}, [xDimension, yDimension, color1, color2, color3, setGrid, setColorCounts, updateStoppingCriteria]);

  useEffect(() => {
    if (!isPainting) return;

    const interval = setInterval(() => {
      paintRandomCell();
    }, 1000 / dropSpeed);

    return () => clearInterval(interval);
  }, [isPainting, paintRandomCell, dropSpeed]);

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
    if (xDimension <= 0 || yDimension <= 0) {
      alert("Dimensions cannot be negative or zero!");
      return;
    }

    if (isPainting) {
      resetBoardAndCounts();
    }

    console.log("Starting painting");
    setIsPainting(true);
  };

return (
  <div className="App">
    <div className="control-panel">
      <form onSubmit={handleSubmit} className="settings-form">
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
        <div className="form-group">
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
        <div className="form-group">
          <label>Drop Speed:</label>
          <input
            type="range"
            min="1"
            max="100"
            value={dropSpeed}
            onChange={(e) => setDropSpeed(e.target.value)}
          />
        </div>
        <div className="buttons-container">
          <button onClick={startPainting} disabled={xDimension === 0 || yDimension === 0}>Start Painting</button>
          <button onClick={handleContinue}>Continue</button>
        </div>
      </form>
    </div>
    <div className="canvas-container">
      <canvas ref={canvasRef} className="paintCanvas"></canvas>
    </div>
    <div className="stopping-criteria-message">
      {stoppingCriteriaMessage && <p>{stoppingCriteriaMessage}</p>}
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
          {Object.entries(colorCounts)
            .filter(([color]) => [color1, color2, color3].includes(color))
            .map(([color, count]) => (
              <tr key={color}>
                <td style={{ backgroundColor: color, width: '50px', height: '20px' }}></td>
                <td>{count}</td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default App;
