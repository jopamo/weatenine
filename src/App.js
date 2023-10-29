import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [xDimension, setXDimension] = useState(0);
  const [yDimension, setYDimension] = useState(0);
  const [color1, setColor1] = useState('rgb(255,0,0)');
  const [color2, setColor2] = useState('rgb(0,255,0)');
  const [color3, setColor3] = useState('rgb(0,0,255)');
  const [grid, setGrid] = useState([]);
  const [isPainting, setIsPainting] = useState(false);

  const rgbStringToArray = (str) => str.slice(4, -1).split(',').map(Number);

  const mixColors = (colorA, colorB) => {
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


  useEffect(() => {
    if (xDimension && yDimension) {
      const newGrid = Array.from({ length: yDimension }, () => Array.from({ length: xDimension }, () => ({ color: null, count: 0 })));
      setGrid(newGrid);
    }
  }, [xDimension, yDimension]);

  const paintRandomCell = () => {
    if (xDimension === 0 || yDimension === 0) return;

    const x = Math.floor(Math.random() * xDimension);
    const y = Math.floor(Math.random() * yDimension);
    const chosenColor = [color1, color2, color3][Math.floor(Math.random() * 3)];

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      newGrid[y][x].color = mixColors(newGrid[y][x].color, chosenColor);
      newGrid[y][x].count++;
      return newGrid;
    });
  };

  useEffect(() => {
    if (!isPainting) return;

    const interval = setInterval(() => {
      paintRandomCell();
    }, 100);

    return () => clearInterval(interval);
  }, [isPainting]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPainting(true);
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${xDimension}, 20px)`,
    justifyContent: 'center'
  };

  const handleStop = () => {
    setIsPainting(false);
  };

  return (
  <div className="App">
    <form onSubmit={handleSubmit}>
      <label>
        X Dimension:
        <input type="number" value={xDimension} onChange={(e) => setXDimension(e.target.value)} />
      </label>
      <label>
        Y Dimension:
        <input type="number" value={yDimension} onChange={(e) => setYDimension(e.target.value)} />
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
          ></div>
        )))}
      </div>
    </div>
  );
}

export default App;
