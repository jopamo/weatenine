import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Dimensions
  const [xDimension, setXDimension] = useState(5);
  const [yDimension, setYDimension] = useState(5);

  // default values
  const [color1, setColor1] = useState('rgb(255,0,0)');
  const [color2, setColor2] = useState('rgb(0,255,0)');
  const [color3, setColor3] = useState('rgb(0,0,255)');

  // grid's data structure: a 2D array representing color and how many paint drops.
  const [grid, setGrid] = useState([]);

  // flag indicating whether random painting is currently occurring
  const [isPainting, setIsPainting] = useState(false);

  // window dimensions from browser, let's not have a giant grid on small screens
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // converts "rgb(255,0,0)" into an array ([255,0,0])
  const rgbStringToArray = (str) => str.slice(4, -1).split(',').map(Number);

  // calculate color mix.
  const mixColors = (colorA, colorB) => {
    // If no first color, just return the second
    if (!colorA) return colorB;
    if (!colorB) return colorA;

    const [r1, g1, b1] = rgbStringToArray(colorA);
    const [r2, g2, b2] = rgbStringToArray(colorB);

    // 20% blend each drop
    const r = Math.round(r1 + 0.2 * (r2 - r1));
    const g = Math.round(g1 + 0.2 * (g2 - g1));
    const b = Math.round(b1 + 0.2 * (b2 - b1));

    return `rgb(${r},${g},${b})`;
  };

  // When grid dimensions change, we generate a new empty grid with the new dimensions.
  useEffect(() => {
    if (xDimension && yDimension) {
      const newGrid = Array.from({ length: yDimension }, () => Array.from({ length: xDimension }, () => ({ color: null, count: 0 })));
      setGrid(newGrid);
    }
  }, [xDimension, yDimension]);

  const [colorCounts, setColorCounts] = useState({
    'rgb(255,0,0)': 0,  // Red
    'rgb(0,255,0)': 0,  // Green
    'rgb(0,0,255)': 0,  // Blue
    'rgb(255,255,0)': 0,  // Yellow
    'rgb(0,255,255)': 0,  // Cyan
    'rgb(255,0,255)': 0,  // Magenta
    'rgb(128,0,0)': 0,  // Maroon
    'rgb(0,128,128)': 0  // Teal
  });

  // Chooses a random cell and a random color to paint that cell.
  const paintRandomCell = () => {
    if (xDimension === 0 || yDimension === 0) return;

    const x = Math.floor(Math.random() * xDimension);
    const y = Math.floor(Math.random() * yDimension);
    const chosenColor = [color1, color2, color3][Math.floor(Math.random() * 3)];

    // Update grid state with new color for the chosen cell.
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      newGrid[y][x].color = mixColors(newGrid[y][x].color, chosenColor);
      newGrid[y][x].count++;
      return newGrid;
    });

    setColorCounts((prevCounts) => ({
      ...prevCounts,
      [chosenColor]: prevCounts[chosenColor] + 1
    }));
  };

  // If painting is active, this effect sets up an interval to paint a random cell every 100ms.
  useEffect(() => {
    if (!isPainting) return;

    const interval = setInterval(() => {
      paintRandomCell();
    }, 1000);

    return () => clearInterval(interval);
  }, [isPainting]);

  // starts painting
  const handleSubmit = (e) => {
    e.preventDefault();

    if (xDimension <= 0 || yDimension <= 0) {
        alert("Dimensions cannot be negative or zero!");
        return;
    }

    setIsPainting(true);
};

  // gridStyle is an object defining CSS styles for the grid, 'grid' sets display mode to grid
  // gridTemplateColumns sets number and size of columns, justifyContent centers grid
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${xDimension}, 20px)`,
    justifyContent: 'center'
  };

  //stop painting
  const handleStop = () => {
    setIsPainting(false);
  };

  return (
  <div className="App">
    <form onSubmit={handleSubmit}>
      <label>
        X Dimension:
        <input type="number" min="2" value={xDimension} onChange={(e) => setXDimension(e.target.value)} />
      </label>
      <label>
        Y Dimension:
        <input type="number" min="2" value={yDimension} onChange={(e) => setYDimension(e.target.value)} />
      </label>
      <label>
        Color 1:
        <select value={color1} onChange={(e) => setColor1(e.target.value)}>
          <option value="rgb(255,0,0)">Red</option>
          <option value="rgb(0,255,0)">Green</option>
          <option value="rgb(0,0,255)">Blue</option>
          <option value="rgb(255,255,0)">Yellow</option>
          <option value="rgb(0,255,255)">Cyan</option>
          <option value="rgb(255,0,255)">Magenta</option>
          <option value="rgb(128,0,0)">Maroon</option>
          <option value="rgb(0,128,128)">Teal</option>
        </select>
      </label>
      <label>
        Color 2:
        <select value={color2} onChange={(e) => setColor2(e.target.value)}>
          <option value="rgb(255,0,0)">Red</option>
          <option value="rgb(0,255,0)">Green</option>
          <option value="rgb(0,0,255)">Blue</option>
          <option value="rgb(255,255,0)">Yellow</option>
          <option value="rgb(0,255,255)">Cyan</option>
          <option value="rgb(255,0,255)">Magenta</option>
          <option value="rgb(128,0,0)">Maroon</option>
          <option value="rgb(0,128,128)">Teal</option>
        </select>
      </label>
      <label>
        Color 3:
        <select value={color3} onChange={(e) => setColor3(e.target.value)}>
          <option value="rgb(255,0,0)">Red</option>
          <option value="rgb(0,255,0)">Green</option>
          <option value="rgb(0,0,255)">Blue</option>
          <option value="rgb(255,255,0)">Yellow</option>
          <option value="rgb(0,255,255)">Cyan</option>
          <option value="rgb(255,0,255)">Magenta</option>
          <option value="rgb(128,0,0)">Maroon</option>
          <option value="rgb(0,128,128)">Teal</option>
        </select>
      </label>
      <button type="submit" disabled={xDimension === 0 || yDimension === 0}>Start Painting</button>
    </form>

    <button onClick={handleStop}>Stop Painting</button>

    <div className="grid" style={gridStyle}>
      {grid.map((row, rowIndex) => row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          className="cell"
          style={{ backgroundColor: cell.color || 'grey' }}
         >
        </div>
      )))}
      </div>
    <table>
      <thead>
        <tr>
          <th>Color</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(colorCounts).map(([color, count]) => (
        <tr key={color}>
          <td style={{ backgroundColor: color, width: '50px', height: '20px' }}></td>
          <td>{count}</td>
        </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}

export default App;
