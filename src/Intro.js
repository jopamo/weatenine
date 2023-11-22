import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Intro.css';

function Intro() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Intro mounted");

    const timer = setTimeout(() => {
      setIsVisible(false);
      console.log("Hiding Intro content and navigating to /app");
      navigate('/app');
    }, 5000);

    return () => {
      console.log("Intro unmounting");
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="intro-animation">
      {isVisible && <p>Loading…<br />(animation or some other form of communication placeholder)</p>}
    </div>
  );
}

export default Intro;
