import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { runExperiments, checkInput } from './paintTools';
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

  const MAX_VALUES = 99;

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { independentVar, color1, color2, color3, stoppingCriterion, fixedX, fixedY, fixedR, inputValues } = experimentSettings;
    const { values, error } = checkInput(inputValues, MAX_VALUES);

    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage('');
    setIsComputing(true);

    setTimeout(async () => {
      try {
        const experimentResults = await runExperiments(independentVar, values, color1, color2, color3, stoppingCriterion, fixedX, fixedY, fixedR);

        let allExperimentResults = [];

        if (independentVar === 'R') {
          let rCounter = 0;

          values.forEach(rVal => {
            for (let i = 0; i < rVal; i++) {
              allExperimentResults.push({ ...experimentResults[rCounter], independentVarValue: rVal });
              rCounter++;
            }
          });
        }
        else {
          const resultsPerValue = experimentResults.length / values.length;
          allExperimentResults = experimentResults.map((result, index) => {
            const varValue = values[Math.floor(index / resultsPerValue)];
            return { ...result, independentVarValue: varValue };
          });
        }

        setChartData(allExperimentResults);
      }
      catch (err) {
        setErrorMessage(`Error running experiments: ${err.message}`);
      }
      finally {
        setIsComputing(false);
      }
    }, 0);
  };

  const renderResultsTable = () => {
    if (!chartData || isComputing) return null;

    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{experimentSettings.independentVar} Value</th>
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
              <td>{parseFloat(data.A.min).toFixed(1)}</td>
              <td>{parseFloat(data.A.max).toFixed(1)}</td>
              <td>{parseFloat(data.A.average).toFixed(1)}</td>
              <td>{parseFloat(data.A1.min).toFixed(1)}</td>
              <td>{parseFloat(data.A1.max).toFixed(1)}</td>
              <td>{parseFloat(data.A1.average).toFixed(1)}</td>
              <td>{parseFloat(data.A2.min).toFixed(1)}</td>
              <td>{parseFloat(data.A2.max).toFixed(1)}</td>
              <td>{parseFloat(data.A2.average).toFixed(1)}</td>
              <td>{parseFloat(data.A3.min).toFixed(1)}</td>
              <td>{parseFloat(data.A3.max).toFixed(1)}</td>
              <td>{parseFloat(data.A3.average).toFixed(1)}</td>
              <td>{parseFloat(data.B.min).toFixed(1)}</td>
              <td>{parseFloat(data.B.max).toFixed(1)}</td>
              <td>{parseFloat(data.B.average).toFixed(1)}</td>
              <td>{parseFloat(data.C.min).toFixed(1)}</td>
              <td>{parseFloat(data.C.max).toFixed(1)}</td>
              <td>{parseFloat(data.C.average).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
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

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="Experiments">
      <Background />
      {isComputing ? (
        renderComputationProgress()
      ) : (
        <>
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
          {renderResultsTable()}
          {showGraphs && chartData && chartData.datasets.map((dataset, index) => (
            <div key={index} className={isFullscreen ? "chart-fullscreen" : "chart-small"} onClick={toggleFullscreen}>
              <Line data={{ labels: chartData.labels, datasets: [dataset] }} options={chartOptions} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Experiments;
