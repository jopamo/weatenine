import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Experiments() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/app');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="intro-animation">
      <p>Experiments are under construction.</p>
    </div>
  );
}

export default Experiments;
