import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { runPaintManyExperiments, checkInput } from './paintTools';
import Background from './Background';
import './Experiments.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Experiments() {
  const [experimentSettings, setExperimentSettings] = useState({
    independentVar: 'D',
    inputValues: '',
    color1: '#ff0000',
    color2: '#00ff00',
    color3: '#0000ff',
    stoppingCriterion: 'allMixedColors',
    fixedX: 10,
    fixedY: 10,
    fixedR: 5
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [showGraphs, setShowGraphs] = useState(false);
  const [isComputing, setIsComputing] = useState(false);

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 14
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.8)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.8)'
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3
      },
      point: {
        radius: 5
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExperimentSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  const { independentVar, color1, color2, color3, stoppingCriterion, fixedX, fixedY, fixedR } = experimentSettings;

  // Check and parse inputValues
  const inputValues = experimentSettings.inputValues;
  let parsedValues;
  if (typeof inputValues === 'string') {
    parsedValues = inputValues.split(',').map(value => value.trim());
  } else if (Array.isArray(inputValues)) {
    parsedValues = inputValues; // Use as-is if it's already an array
  } else {
    setErrorMessage('Invalid input values');
    return;
  }

  // Check for errors after parsing
  let { error } = checkInput(parsedValues);
  if (error) {
    setErrorMessage(error);
    return;
  }
  setErrorMessage('');

  setIsComputing(true);
  const experimentResults = runPaintManyExperiments(independentVar, parsedValues, color1, color2, color3, stoppingCriterion, fixedX, fixedY, fixedR);
  setChartData(experimentResults);
  setIsComputing(false);
};



  const renderResultsTable = () => {
    if (!chartData || showGraphs || isComputing) return null;

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Independent Value</th>
              {chartData.datasets.map((dataset, index) => (
                <th key={index}>{dataset.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartData.labels.map((label, labelIndex) => (
              <tr key={labelIndex}>
                <td>{label}</td>
                {chartData.datasets.map((dataset, datasetIndex) => (
                  <td key={datasetIndex}>{dataset.data[labelIndex]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowGraphs(true)}>Continue</button>
      </div>
    );
  };

  const renderComputationProgress = () => {
    if (!isComputing) return null;

    return (
      <div>
        <p>Computing results, please wait...</p>
      </div>
    );
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="Experiments">
      <Background />
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
              <option value="X">X (X-Dimension with constant Y)</option>
              <option value="R">R (Number of Repetitions)</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Values:
            <input
              type="text"
              name="inputValues"
              value={experimentSettings.inputValues}
              onChange={handleInputChange}
            />
          </label>
        </div>
        {experimentSettings.independentVar === 'D' && (
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
        {experimentSettings.independentVar === 'X' && (
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
        {experimentSettings.independentVar === 'R' && (
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
          <label>Color 1:
            <input
              type="color"
              name="color1"
              value={experimentSettings.color1}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>Color 2:
            <input
              type="color"
              name="color2"
              value={experimentSettings.color2}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>Color 3:
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
              <option value="lastUnpainted">Last Unpainted Square</option>
              <option value="secondBlob">Second Paint Blob on a Square</option>
              <option value="allMixedColors">Entire Board Mixed Colors</option>
            </select>
          </label>
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit">Run Experiments</button>
      </form>

      <h1>Experiment Results</h1>
      {renderComputationProgress()}
      {renderResultsTable()}
      {showGraphs && chartData && chartData.datasets.map((dataset, index) => (
        <div key={index} className={isFullscreen ? "chart-fullscreen" : "chart-small"} onClick={toggleFullscreen}>
          <Line data={{ labels: chartData.labels, datasets: [dataset] }} options={chartOptions} />
        </div>
      ))}
    </div>
  );
}

export default Experiments;
