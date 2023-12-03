import React from 'react';
import Background from './Background';
import './Intro.css';

function Intro({ setCurrentPage }) {

  const handleToApp = () => {
    setCurrentPage("app");
  };

  return (
    <div className="intro-animation" onClick={handleToApp}>
      <Background />
      <div className="intro-text">
        <h1>Welcome to Random Paint</h1>
        <p>Touch the screen to continue</p>
      </div>
    </div>
  );
}

export default Intro;
