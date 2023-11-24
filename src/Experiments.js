import React, { useState, useEffect, useCallback } from 'react';
import { PAINT_ONCE } from './paintTools';

function Experiments() {
  const [independentVar, setIndependentVar] = useState("");
  const [values, setValues] = useState("");
  const [fixedY, setFixedY] = useState("");
  const [fixedR, setFixedR] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [results, setResults] = useState([]);

  const handleRunExperiment = useCallback(() => {
    setResults([]); // reset results

    const inputValues = values.split(',').map(Number);

    inputValues.forEach(value => {
      let X, Y, R;
      const statistics = {
        totalColor1: 0,
        totalColor2: 0,
        totalColor3: 0,
        squareMostDrops: 0,
        averageTotal: 0,
      };

      switch (independentVar) {
        case "D":
          X = Y = value;
          R = parseInt(fixedR, 10);
          break;
        case "X":
          X = value;
          Y = parseInt(fixedY, 10);
          R = parseInt(fixedR, 10);
          break;
        case "R":
          X = Y = parseInt(values, 10); // square canvas for R
          R = value;
          break;
        default:
          setErrorMessage("Invalid independent variable");
          return;
      }

      const experimentResult = PAINT_ONCE(X, Y, 'C1', 'C2', 'C3', 'allMixedColors', statistics);

      setResults(prevResults => [...prevResults, { X, Y, R, ...experimentResult }]);
    });

    setErrorMessage(""); // clear errors
  }, [values, independentVar, fixedY, fixedR]); // deps

  useEffect(() => {
    // defaults
    setIndependentVar("D");
    setValues("10");
    setFixedY("10");
    setFixedR("1");
    handleRunExperiment();
  }, [handleRunExperiment]); // dep

  return (
    <div>
      <h1>Experiment Setup</h1>
      <button onClick={handleRunExperiment}>Run Experiments</button>
      {errorMessage && <p>Error: {errorMessage}</p>}
      <div>
        <h2>Results</h2>
        {results.map((result, index) => (
          <div key={index}>
            <p>Experiment {index + 1}:</p>
            <p>X: {result.X}, Y: {result.Y}, R: {result.R}</p>
            <p>Count: {result.count}</p>
            <p>Painted Cells: {result.paintedCells}</p>
            <p>Stopping Criterion (S): {result.S}</p>
            <p>Total Color 1 Drops: {result.statistics.totalColor1}</p>
            <p>Total Color 2 Drops: {result.statistics.totalColor2}</p>
            <p>Total Color 3 Drops: {result.statistics.totalColor3}</p>
            <p>Square with Most Drops: {result.statistics.squareMostDrops}</p>
            <p>Average Drops Per Square: {result.statistics.averageTotal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Experiments;
