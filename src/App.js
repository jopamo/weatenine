import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { mixColors } from './paintTools';
import { checkStoppingCriteria } from './paintTools';

function App() {
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
    const height = window.innerHeight;
    const isMobile = width < 768;

    const xDimension = Math.min(Math.floor(width / 50), 25);
    const yDimension = isMobile ? 5 : Math.min(Math.floor(height / 50), 25);

    return { xDimension, yDimension };
  };

  const { xDimension: initialXDimension, yDimension: initialYDimension } = calculateInitialDimensions();

  const [xDimension, setXDimension] = useState(initialXDimension);
  const [yDimension, setYDimension] = useState(initialYDimension);

  let navigate = useNavigate();

  const handleContinue = () => {
    navigate('/experiments');
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

  // Function to draw the entire grid
  const drawGrid = useCallback(() => {
    const ctx = ctxRef.current;
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        drawCell(ctx, x, y, cell.color || 'grey');
    });
  });
}, [grid, ctxRef]);

  // Set up the canvas and its context
  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext('2d');
    canvas.width = xDimension * 20; // Assuming each cell is 20x20 pixels
    canvas.height = yDimension * 20;
    drawGrid();
  }, [xDimension, yDimension, drawGrid]);

  // Draw a single cell onto canvas
  const drawCell = (ctx, x, y, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * 20, y * 20, 20, 20);
  };

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

  // Chooses a random cell and a random color to paint that cell.
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

  // useEffect that depends on paintRandomCell
  useEffect(() => {
    if (!isPainting) return;

    const interval = setInterval(() => {
      paintRandomCell();
    }, 10);

    return () => clearInterval(interval);
  }, [isPainting, paintRandomCell]);

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
          <select value={stoppingCriterion} onChange={(e) => setStoppingCriterion(e.target.value)} disabled={isPainting}>
            <option value="lastUnpainted">Last Unpainted Square</option>
            <option value="secondBlob">Second Paint Blob on a Square</option>
            <option value="allMixedColors">Entire Board Mixed Colors</option>
          </select>
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
