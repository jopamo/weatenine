import React, { useState } from 'react';
import Background from './Background';
import './Intro.css';

function Intro({ setCurrentPage }) {
  const [showManual, setShowManual] = useState(false);

  const handleToApp = () => {
    if (!showManual) {
      setCurrentPage("app");
    }
  };

  const toggleManual = (event) => {
    event.stopPropagation();
    setShowManual(!showManual);
  };

  return (
    <div className="intro-animation" onClick={handleToApp}>
      <Background />
      {!showManual && (
        <div className="intro-text">
          <h1>Welcome to Random Paint</h1>
          <p>Touch the screen to continue</p>
          <button onClick={toggleManual}>User Manual</button>
        </div>
      )}

      {showManual && <UserManualPopup onClose={toggleManual} />}
    </div>
  );
}

const UserManualPopup = ({ onClose }) => {
  return (
    <div className="user-manual-popup">
      <div className="manual-text-background">
        <p>Hello, and thank you for utilizing our software! We're pleased to have you on our website.</p>
        <p>This application will allow you to create the picture of your dreams in only a few inputs from the user. This website was inspired by modern artists such as Jackson Pollock. Upon start-up, you should be able to view the following screen:</p>
        <img src="weatenine1.png" alt="Startup Screen" />

        <p>After clicking/touching the screen you will be able to view the following tools. Let's walk through them!</p>
        <p><u><b>Tools</b></u><br />
          - Dimension Boxes<br />
          - Color Section Tools<br />
          - Grid<br />
          - Grid Counter<br />
          - Stopping Criteria<br />
          - Drop Speed<br />
          - 'Continue Button'</p>
        <img src="weatenine2.png" alt="Startup Screen" />

        <p>You can utilize the 'X-Dimension' textbox to adjust the horizontal size of the graph and the 'Y-Dimension' to adjust the vertical size of the grid.</p>
        <p><b>Color 1</b>, <b>Color 2</b>, and <b>Color 3</b> can be used to choose 3 individual colors for your painting. Upon clicking any of the available colors, the following prompt will appear.</p>
        <img src="weatenine4.png" alt="Color-Picker" />

        <p>You can then click anywhere inside of the box to select your color. Additionally, you can use the below slider to look for more available colors. The 'RGB' values can also be utilized if you have a more specific color in mind. The 'color dropper' tool can be used as well to select any color on your desktop. Simply click the color dropper tool and then select a color in your web browser you would like to use and this color will then be copied into your desired color.</p>
        <p>The <b>Stopping Criterion</b> allows for the options of 'Entire Board Mixed Colors', 'Last Unpainted Square', or 'Second Paint Blob on Square.'
          <ul>
            <li>'Entire Board Mixed Colors' will continue to paint until the program is manually stopped by the user.</li>
            <li>'Last Unpainted Square' will paint until the entire canvas is filled.</li>
            <li>'Second Paint Blob on Square' will paint the canvas until the same 'square' is painted twice.</li>
          </ul>
        </p>
        <p>Press the '<b>Start Painting</b>' button to begin the program.</p>
        <img src="weatenine5.png" alt="Printing" />

        <p>Every second, one of your colors will be selected and will replace a random element on your grid. If a color is chosen that already has a color present, then the previous color will be blended with the new color. The <b>'color tracker'</b> on the left will keep track of all the colors used.</p>
        <p>Additionally, the color tracker will also keep track of the average number of paint drops used for the entirety of the canvas; another digit (on the grid itself) will keep track of how many times a specific tile has been painted. Each number will appear individually upon each specified tile.</p>
        <img src="weatenine3.png" alt="Color-Tracker" />

        <p>When you are satisfied with your newly created painting press the '<b>Stop Painting</b>' button in order to prevent the program from continuing. However if you want to add more colors, simply just push the '<b>Start Painting</b>' button again.</p>
        <p><i>Note: If you wish to save your painting, you can utilize the 'snipping tool' on your computer to select the image and save to your computer!</i></p>

        <p>You can press the '<b>Continue</b>' button to construct a detailed graph relating to the statistics. This product will keep track of various statistics such as what tiles were hit compared more to others and compare this with the total number of paintings during your session in order to show the insightful data related to the graph.</p>
        <img src="weatenine6.png" alt="Color-Tracker" />

        <p>
          <u><b>Tools</b></u><br />
          - Independent Variable<br />
          - Values<br />
          - Number of Repetitions<br />
          - Colors #1, #2, and #3<br />
          - Stopping Criterion<br />
          - 'Run Experiments' Button<br />
          - Experiment Results Tab<br /><br />
        </p>
        <p>The 'Independent Variable' can be set to 'D (Square Canvas Dimension)', 'X (Dimension with constant Y)', and 'R (Number of Repetitions).'
          <ul>
            <li>'D (Square Canvas Dimension)' will set the canvas horizontal and vertical values to equal size</li>
            <li>'X (Dimension with constant Y)' will increase the x-dimension but maintain the same y-dimension</li>
            <li>'R (Number of Repetitions)' will increase the number of repetitions every experiment</li>
          </ul>
        </p>
        <img src="weatenine9.png" alt="Color-Tracker" />

        <p>For the 'values' section you can manually change the values for the independent variable as long as input a space between each number in the text box. The total of three values are allowed.</p>
        <p>The 'stopping criterion' button selection remains unchanged from before.</p>
        <img src="weatenine7.png" alt="Color-Tracker" />

        <p>Upon running the 'Run Experiments' button, a detailed table containing your selections will be displayed. The top row will showcase all the independent and dependent variables and the left-most column will label all of the experiment numbers. If you want to change any of your criteria, feel free to modify the input and then press the 'Run Experiments' button once again.</p>
        <img src="weatenine8.png" alt="Color-Tracker" />
      </div>
        <button onClick={onClose} className="close-manual-button">Close Manual</button>
    </div>
  );
};

export default Intro;
