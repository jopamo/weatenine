// Import necessary hooks and components from React and other files
import React, { useState, useEffect, useCallback } from 'react';
import { PAINT_ONCE } from './paintTools';
import './Experiments.css'; // Importing CSS for styling

// Define the Experiments component. It receives 'setCurrentPage' as a prop for navigation
function Experiments({ setCurrentPage }) {
  // A function to handle returning to the main app. It changes the current page using 'setCurrentPage'
  const handleReturnToApp = () => {
    setCurrentPage("app");
  };

  // State variables for the component.
  // Tracks the independent variable for experiments
  const [independentVar, setIndependentVar] = useState("");
  const [values, setValues] = useState(""); // Stores the values entered by the user
  const [fixedY, setFixedY] = useState(""); // Stores a fixed value for Y dimension
  // Stores a fixed value for R (radius or another variable)
  const [fixedR, setFixedR] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To display any error messages
  const [results, setResults] = useState([]); // Array to store the results of experiments

  const defaultColor1 = "rgb(255, 0, 0)"; // Red
  const defaultColor2 = "rgb(0, 255, 0)"; // Green
  const defaultColor3 = "rgb(0, 0, 255)"; // Blue

  // Function to handle running an experiment. Wrapped in 'useCallback'
  // to prevent unnecessary re-renders
  const handleRunExperiment = useCallback(() => {
    setResults([]); // Reset results before running a new experiment

    // Convert the entered values to an array of numbers
    const inputValues = values.split(',').map(Number);

    // Process each value to run the experiment
    inputValues.forEach(value => {
      let X, Y, R;
      const counts = {
        totalColor1: 0,
        totalColor2: 0,
        totalColor3: 0,
        squareMostDrops: 0,
        averageTotal: 0,
      };

      // Determine the parameters for the experiment based on the independent variable chosen
      switch (independentVar) {
        case "D":
          X = Y = value; // For 'D' case, set both X and Y to the input value
          R = parseInt(fixedR, 10);
          break;
        case "X":
          X = value; // Set X to the input value and Y to a fixed value
          Y = parseInt(fixedY, 10);
          R = parseInt(fixedR, 10);
          break;
        case "R":
          // For 'R', assuming a square canvas and setting both X and Y
          X = Y = parseInt(values, 10);
          R = value;
          break;
        default:
          // Set error message if the variable is invalid
          setErrorMessage("Invalid independent variable");
          return;
      }

      // Run the paint experiment with the determined parameters
      const experimentResult = PAINT_ONCE(X, Y, defaultColor1, defaultColor2, defaultColor3, 'allMixedColors', counts);

      // Add the result of the experiment to the results array
      setResults(prevResults => [...prevResults, { X, Y, R, ...experimentResult }]);
    });

    setErrorMessage(""); // Clear any error messages after running the experiment
  }, [values, independentVar, fixedY, fixedR]); // Dependencies for useCallback

  // useEffect to set default values and run the experiment when the component mounts
  useEffect(() => {
    setIndependentVar("D");
    setValues("10");
    setFixedY("10");
    setFixedR("1");
    handleRunExperiment();
  }, [handleRunExperiment]); // Dependency array

  // Render the component
  return (
  <div className="Experiments">
    <h1>Experiment Setup</h1>
    <button onClick={handleRunExperiment} className="button-spacing">Run Experiments</button>
    <button onClick={handleReturnToApp}>Return to Canvas</button>
    {errorMessage && <p className="error-message">Error: {errorMessage}</p>}
    <div className="results">
      <h2>Results</h2>
      {/* Map through the results array to display each experiment's result. */}
      {results.map((result, index) => (
        <div key={index} className="result-item">
          <p>Experiment {index + 1}:</p>
          {/* Display details of the experiment result. */}
          <p>X: {result.X}, Y: {result.Y}, R: {result.R}</p>
          <p>Count: {result.count}</p>
            <p>Painted Cells: {result.paintedCells}</p>
            <p>Stopping Criterion (S): {result.S}</p>
            <p>Total Color 1 Drops: {result.counts.totalColor1}</p>
            <p>Total Color 2 Drops: {result.counts.totalColor2}</p>
            <p>Total Color 3 Drops: {result.counts.totalColor3}</p>
            <p>Square with Most Drops: {result.counts.squareMostDrops}</p>
            <p>Average Drops Per Square: {result.counts.averageTotal}</p>
          </div>
        ))}
      </div>
    </div>
  );

}

export default Experiments;
