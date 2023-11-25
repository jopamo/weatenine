import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './App.css';
import { checkStoppingCriteria, paintRandomCell } from './paintTools';

function App({ setCurrentPage }) {
 function debounce(fn, ms) {
    let timer;
    return _ => {
      clearTimeout(timer);
      timer = setTimeout(_ => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }

  const calculateInitialDimensions = () => {
    const width = window.innerWidth;
    const isMobile = width < 768;

    const xDimension = isMobile ? 10 : Math.min(Math.floor(width / 50), 25);
    const yDimension = isMobile ? 10 : Math.min(Math.floor(window.innerHeight / 50), 25);


    return { xDimension, yDimension };
  };

  const { xDimension: initialXDimension, yDimension: initialYDimension } = calculateInitialDimensions();

  const [xDimension, setXDimension] = useState(initialXDimension);
  const [yDimension, setYDimension] = useState(initialYDimension);

  const handleContinue = () => {
    setCurrentPage('experiments');
  };

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

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

  // default values
  const [color1, setColor1] = useState('rgb(255,0,0)');
  const [color2, setColor2] = useState('rgb(0,255,0)');
  const [color3, setColor3] = useState('rgb(0,0,255)');

  const [stoppingCriterion, setStoppingCriterion] = useState('allMixedColors');
  const [stoppingCriteriaMessage, setStoppingCriteriaMessage] = useState('');

  // grid's data structure: a 2D array representing color and how many paint drops.
  const [grid, setGrid] = useState([]);

  // flag indicating whether random painting is currently occurring
  const [isPainting, setIsPainting] = useState(false);

  const [dropSpeed, setDropSpeed] = useState(10);

  const renderColorOptions = (excludeColors) => {
    return Object.entries(colorOptions)
      .filter(([colorValue]) => !excludeColors.includes(colorValue))
      .map(([colorValue, colorName]) => (
        <option key={colorValue} value={colorValue}>{colorName}</option>
      ));
  };

  const updateStoppingCriteria = useCallback(() => {
    const result = checkStoppingCriteria(grid, stoppingCriterion, color1, color2, color3);

    if (result.met) {
      setIsPainting(false);
      setStoppingCriteriaMessage(result.message);
    }
  }, [grid, stoppingCriterion, color1, color2, color3]);

  // Draw a single cell onto canvas
  const drawCell = useCallback((ctx, x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * 20, y * 20, 20, 20);
  }, []); // Empty dependency array since drawCell doesn't depend on external values

  // Function to draw the entire grid
  const drawGrid = useCallback(() => {
    const ctx = ctxRef.current;
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        drawCell(ctx, x, y, cell.color || 'grey');
    });
  });
}, [grid, ctxRef, drawCell]);

  // Set up the canvas and its context
  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext('2d');
    canvas.width = xDimension * 20; // Assuming each cell is 20x20 pixels
    canvas.height = yDimension * 20;
    drawGrid();
  }, [xDimension, yDimension, drawGrid]);

  // When grid dimensions change, we generate a new empty grid with the new dimensions.
  useEffect(() => {
    if (xDimension && yDimension) {
      const newGrid = Array.from({ length: yDimension }, () => Array.from({ length: xDimension }, () => ({ color: null, count: 0 })));
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

  const handlePaintRandomCell = useCallback(() => {
  if (xDimension === 0 || yDimension === 0) return;

  const { grid: updatedGrid, counts: updatedCounts, paintedCell } = paintRandomCell(grid, xDimension, yDimension, color1, color2, color3, colorCounts);

  setGrid(updatedGrid);

  setColorCounts(prevCounts => {
    // Increment only by the amount returned by paintRandomCell for the specific color
    return {
      totalColor1: prevCounts.totalColor1 + (updatedCounts.totalColor1 - colorCounts.totalColor1),
      totalColor2: prevCounts.totalColor2 + (updatedCounts.totalColor2 - colorCounts.totalColor2),
      totalColor3: prevCounts.totalColor3 + (updatedCounts.totalColor3 - colorCounts.totalColor3),
      squareMostDrops: Math.max(prevCounts.squareMostDrops, updatedCounts.squareMostDrops)
    };
  });

  drawCell(ctxRef.current, paintedCell.x, paintedCell.y, updatedGrid[paintedCell.y][paintedCell.x].color);

  updateStoppingCriteria(updatedGrid);
}, [grid, xDimension, yDimension, color1, color2, color3, colorCounts, setGrid, setColorCounts, drawCell, updateStoppingCriteria]);

  useEffect(() => {
    //console.log('Current colorCounts state:', colorCounts);
  }, [colorCounts]);

  useEffect(() => {
    if (!isPainting) return;

    const interval = setInterval(() => {
      handlePaintRandomCell();
    }, 1000 / dropSpeed);

    return () => clearInterval(interval);
  }, [isPainting, handlePaintRandomCell, dropSpeed]);

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
          <tr>
            <td style={{ backgroundColor: color1, width: '50px', height: '20px' }}></td>
            <td>{colorCounts.totalColor1}</td>
          </tr>
          <tr>
            <td style={{ backgroundColor: color2, width: '50px', height: '20px' }}></td>
            <td>{colorCounts.totalColor2}</td>
          </tr>
          <tr>
            <td style={{ backgroundColor: color3, width: '50px', height: '20px' }}></td>
            <td>{colorCounts.totalColor3}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);
}

export default App;
