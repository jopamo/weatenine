import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { runExperiments, checkInput } from "./paintTools";
import Background from "./Background";
import "./Experiments.css";
import getChartOptions from './chartConfig';

// Registering necessary components for ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function Experiments({ setCurrentPage }) {
  // Mapping labels to various experiment variables
  const labelMapping = {
    A: "Total Number of Paint Drops",
    A1: "Number of Paint Drops (Color 1)",
    A2: "Number of Paint Drops (Color 2)",
    A3: "Number of Paint Drops (Color 3)",
    B: "Maximum Paint Drops on a Square",
    C: "Average Paint Drops on All Squares",
  };

  // State hooks for experiment settings and UI control
  const [experimentSettings, setExperimentSettings] = useState({
    independentVar: "D",
    inputValues: "",
    color1: "#ff0000",
    color2: "#00ff00",
    color3: "#0000ff",
    stoppingCriterion: "allMixedColors",
    fixedX: 10,
    fixedY: 10,
    fixedR: 5,
  });

  const [selectedDependentVars, setSelectedDependentVars] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [chartData, setChartData] = useState(null);
  const [showTable, setShowTable] = useState(true);
  const [showGraph, setShowGraph] = useState(false);
  const [isComputing, setIsComputing] = useState(false);
  const [experimentsCompleted, setExperimentsCompleted] = useState(false);
  const [showExperimentConfig, setShowExperimentConfig] = useState(true);

  // Constants defining maximum allowed values
  const MAX_VALUES = 99;
  const MAX_INT_VALUE = 99;

  const chartOptions = getChartOptions(experimentSettings);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExperimentSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const {
      independentVar,
      color1,
      color2,
      color3,
      stoppingCriterion,
      fixedX,
      fixedY,
      fixedR,
      inputValues,
    } = experimentSettings;

    e.preventDefault();

    const { values, error } = checkInput(
      inputValues,
      MAX_VALUES,
      MAX_INT_VALUE,
    );
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage("");
    setIsComputing(true);

    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      let experimentResults = await runExperiments(
        independentVar,
        values,
        color1,
        color2,
        color3,
        stoppingCriterion,
        fixedX,
        fixedY,
        fixedR,
      );

      let allExperimentResults = [];

      if (independentVar === "R") {
        let rCounter = 0;

        values.forEach((rVal) => {
          for (let i = 0; i < rVal; i++) {
            allExperimentResults.push({
              ...experimentResults[rCounter],
              independentVarValue: rVal,
            });
            rCounter++;
          }
        });
      } else {
        const resultsPerValue = experimentResults.length / values.length;
        allExperimentResults = experimentResults.map((result, index) => {
          const varValue = values[Math.floor(index / resultsPerValue)];
          return { ...result, independentVarValue: varValue };
        });
      }

      setChartData(allExperimentResults);
    } catch (err) {
      setErrorMessage(`Error running experiments: ${err.message}`);
    } finally {
      setIsComputing(false);
      setExperimentsCompleted(true);
      setShowExperimentConfig(false);
    }
  };

  function formatFixedValues() {
    const { independentVar, fixedX, fixedY, fixedR } = experimentSettings;

    let fixedValues = [];

    if (independentVar === "D") {
      fixedValues.push(`R: ${fixedR}`);
    }

    if (independentVar === "X") {
      fixedValues.push(`Y: ${fixedY}`);
      fixedValues.push(`R: ${fixedR}`);
    }

    if (independentVar === "R") {
      fixedValues.push(`X: ${fixedX}`);
      fixedValues.push(`Y: ${fixedY}`);
    }

    return fixedValues.join(", ");
  }

  const handleDependentVarSelection = (varName) => {
    setSelectedDependentVars((prevSelection) => {
      if (prevSelection.includes(varName)) {
        return prevSelection.filter((item) => item !== varName);
      }
      if (prevSelection.length < 2) {
        return [...prevSelection, varName];
      }
      return prevSelection;
    });
  };

  const renderDependentVarSelection = () => {
    if (!experimentsCompleted) return null;
    const dependentVariables = ["A", "A1", "A2", "A3", "B", "C"];
    return (
      <div>
        {dependentVariables.map((varName) => (
          <label key={varName}>
            <input
              type="checkbox"
              checked={selectedDependentVars.includes(varName)}
              onChange={() => handleDependentVarSelection(varName)}
            />
            {varName}
          </label>
        ))}
      </div>
    );
  };

  const renderReducedTable = () => {
    if (selectedDependentVars.length === 0 || !chartData) return null;

    const formatValue = (value) => {
      if (value === null || value === undefined) return "N/A";
      return Math.floor(value) === value
        ? value.toFixed(0)
        : parseFloat(value).toFixed(1);
    };

    return (
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{experimentSettings.independentVar} Value</th>
              <th>Fixed</th>
              {selectedDependentVars.map((varName) => (
                <React.Fragment key={varName}>
                  <th>{`${varName} Min`}</th>
                  <th>{`${varName} Max`}</th>
                  <th>{`${varName} Avg`}</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.map((data, index) => (
              <tr key={index}>
                <td>{data.independentVarValue}</td>
                <td>{formatFixedValues()}</td>
                {selectedDependentVars.map((varName) => (
                  <React.Fragment key={varName}>
                    <td>{formatValue(data[varName]?.min)}</td>
                    <td>{formatValue(data[varName]?.max)}</td>
                    <td>{formatValue(data[varName]?.average)}</td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderResultsTable = () => {
    if (!chartData || isComputing) return null;

    const formatValue = (value) => {
      if (Math.floor(value) === value) {
        return value.toFixed(0);
      }
      return parseFloat(value).toFixed(1);
    };

    return (
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>{experimentSettings.independentVar} Value</th>
              <th>Fixed</th>
              <th>A Min</th>
              <th>A Max</th>
              <th>A Avg</th>
              <th>A1 Min</th>
              <th>A1 Max</th>
              <th>A1 Avg</th>
              <th>A2 Min</th>
              <th>A2 Max</th>
              <th>A2 Avg</th>
              <th>A3 Min</th>
              <th>A3 Max</th>
              <th>A3 Avg</th>
              <th>B Min</th>
              <th>B Max</th>
              <th>B Avg</th>
              <th>C Min</th>
              <th>C Max</th>
              <th>C Avg</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((data, index) => (
              <tr key={index}>
                <td>{data.independentVarValue}</td>
                <td>{formatFixedValues()}</td>
                <td>{formatValue(data.A.min)}</td>
                <td>{formatValue(data.A.max)}</td>
                <td>{formatValue(data.A.average)}</td>
                <td>{formatValue(data.A1.min)}</td>
                <td>{formatValue(data.A1.max)}</td>
                <td>{formatValue(data.A1.average)}</td>
                <td>{formatValue(data.A2.min)}</td>
                <td>{formatValue(data.A2.max)}</td>
                <td>{formatValue(data.A2.average)}</td>
                <td>{formatValue(data.A3.min)}</td>
                <td>{formatValue(data.A3.max)}</td>
                <td>{formatValue(data.A3.average)}</td>
                <td>{formatValue(data.B.min)}</td>
                <td>{formatValue(data.B.max)}</td>
                <td>{formatValue(data.B.average)}</td>
                <td>{formatValue(data.C.min)}</td>
                <td>{formatValue(data.C.max)}</td>
                <td>{formatValue(data.C.average)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const handleContinue = () => {
    setShowTable(false);
    setShowGraph(true);
  };

  const handleNewTableGraph = () => {
    setShowTable(true);
    setShowGraph(false);
  };

  const handleNewExperiment = () => {
    setExperimentSettings({
      independentVar: "D",
      inputValues: "",
      color1: "#ff0000",
      color2: "#00ff00",
      color3: "#0000ff",
      stoppingCriterion: "allMixedColors",
      fixedX: 10,
      fixedY: 10,
      fixedR: 5,
    });

    setSelectedDependentVars([]);
    setShowTable(true);
    setShowGraph(false);
    setChartData(null);
    setExperimentsCompleted(false);
    setShowExperimentConfig(true);
  };

  const handleQuit = () => {
    setCurrentPage("intro");
  };

  const renderGraph = () => {
    if (!showGraph || !chartData) return null;

    const variablesToDisplay =
      selectedDependentVars.length > 0
        ? selectedDependentVars
        : ["A", "A1", "A2", "A3", "B", "C"];

    const colors = {
      min: "#FF6384",
      max: "#36A2EB",
      average: "#FFCE56",
    };

    const createDatasets = (varName) => {
      return ["min", "max", "average"].map((metric) => {
        return {
          label: `${metric.toUpperCase()}`,
          data: chartData.map((item) => parseFloat(item[varName][metric])),
          borderColor: colors[metric],
          backgroundColor: colors[metric],
          borderWidth: 2,
          fill: false,
          pointBackgroundColor: colors[metric],
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: colors[metric],
        };
      });
    };

    return variablesToDisplay.map((varName) => {
      const datasets = createDatasets(varName);
      const graphData = {
        labels: chartData.map((data) => data.independentVarValue),
        datasets: datasets,
      };

      return (
        <div className="graph-container">
          <h2 className="graph-title">{labelMapping[varName] || varName}</h2>
          <Line data={graphData} options={chartOptions} />
        </div>
      );
    });
  };

  const renderUserOptions = () => {
    if (!showGraph) return null;
    return (
      <div className="button-container">
        <button onClick={handleNewTableGraph}>Make a new table/graph</button>
        <br />
        <button onClick={handleNewExperiment}>New experiment</button>
        <br />
        <button onClick={handleQuit}>Quit</button>
        <div class="background"></div>
      </div>
    );
  };

  const renderComputationProgress = () => {
    if (isComputing) {
      return (
        <div className="loading-container">
          <p>Computing results, this might take a minute. Please wait...</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="Experiments">
      <Background />
      {isComputing ? (
        renderComputationProgress()
      ) : (
        <>
          {showExperimentConfig && (
            <>
              <div className="config-container">
                <h1>Experiment Configuration</h1>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>
                      Independent Variable:
                      <select
                        name="independentVar"
                        value={experimentSettings.independentVar}
                        onChange={handleInputChange}
                      >
                        <option value="D">D (Square Canvas Dimension)</option>
                        <option value="X">
                          X (X-Dimension with constant Y)
                        </option>
                        <option value="R">R (Number of Repetitions)</option>
                      </select>
                    </label>
                  </div>
                  <div>
                    <label>
                      Values:
                      <input
                        type="tel"
                        name="inputValues"
                        value={experimentSettings.inputValues}
                        onChange={handleInputChange}
                        placeholder="Ascending (1 2 3 ..)"
                      />
                    </label>
                  </div>
                  {experimentSettings.independentVar === "D" && (
                    <div>
                      <label>
                        Number of Repetitions:
                        <input
                          type="number"
                          name="fixedR"
                          value={experimentSettings.fixedR}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                  )}
                  {experimentSettings.independentVar === "X" && (
                    <div>
                      <label>
                        Fixed Y Dimension:
                        <input
                          type="number"
                          name="fixedY"
                          value={experimentSettings.fixedY}
                          onChange={handleInputChange}
                        />
                      </label>
                      <label>
                        Number of Repetitions:
                        <input
                          type="number"
                          name="fixedR"
                          value={experimentSettings.fixedR}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                  )}
                  {experimentSettings.independentVar === "R" && (
                    <div>
                      <label>
                        Fixed X Dimension:
                        <input
                          type="number"
                          name="fixedX"
                          value={experimentSettings.fixedX}
                          onChange={handleInputChange}
                        />
                      </label>
                      <label>
                        Fixed Y Dimension:
                        <input
                          type="number"
                          name="fixedY"
                          value={experimentSettings.fixedY}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                  )}
                  <div>
                    <label>
                      Color 1:
                      <input
                        type="color"
                        name="color1"
                        value={experimentSettings.color1}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Color 2:
                      <input
                        type="color"
                        name="color2"
                        value={experimentSettings.color2}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Color 3:
                      <input
                        type="color"
                        name="color3"
                        value={experimentSettings.color3}
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  <div>
                    <label>
                      Stopping Criterion:
                      <select
                        name="stoppingCriterion"
                        value={experimentSettings.stoppingCriterion}
                        onChange={handleInputChange}
                      >
                        <option value="lastUnpainted">
                          Last Unpainted Square
                        </option>
                        <option value="secondBlob">
                          Second Paint Blob on a Square
                        </option>
                        <option value="allMixedColors">
                          Entire Board Mixed Colors
                        </option>
                      </select>
                    </label>
                  </div>
                  {errorMessage && <p className="error">{errorMessage}</p>}
                </form>
              </div>

              <div className="button-container">
                <button onClick={handleSubmit}>Run Experiments</button>
                <div className="background"></div>
              </div>
            </>
          )}

          {experimentsCompleted && showTable && (
            <div className="config-container">
              <h1>Experiment Results</h1>
              {renderDependentVarSelection()}
              {selectedDependentVars.length > 0
                ? renderReducedTable()
                : renderResultsTable()}
            </div>
          )}

          {showGraph && (
            <>
              {renderGraph()}
              {renderUserOptions()}
            </>
          )}

          {experimentsCompleted && showTable && (
            <div className="button-container">
              <button onClick={handleContinue}>Continue (Generate Graphs)</button>
              <div className="background"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Experiments;
