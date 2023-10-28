import React from 'react';
import './App.css';

function App() {
  // 500 random colors: red, green, or blue
  const colors = Array.from({ length: 504 }, () => {
    const randomNum = Math.floor(Math.random() * 3);
    switch (randomNum) {
      case 0:
        return { r: 255, g: 0, b: 0 }; // Red
      case 1:
        return { r: 0, g: 255, b: 0 }; // Green
      default:
        return { r: 0, g: 0, b: 255 }; // Blue
    }
  });

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
