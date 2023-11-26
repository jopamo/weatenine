import React, { useEffect } from 'react';
import './Intro.css'; // Assuming you have a CSS file for global styles

function Intro({ setCurrentPage }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('app');
    }, 3000); // 3 seconds timeout

    return () => clearTimeout(timer);
  }, [setCurrentPage]);

  return (
    <div>
      <h1>Intro Page</h1>
      {/* stuff */}
    </div>
  );
}

export default Intro;
