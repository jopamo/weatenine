import React, { useState } from 'react';
import './App.css';

function App() {
  const colors = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
  ];

  return (
    <div className="App">
      <div className="grid">
        {colors.map((color, index) => (
          <div
            key={index}
            className="grid-cell"
            style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default App;
