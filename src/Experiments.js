import React, { useEffect } from 'react';

function Experiments({ setCurrentPage }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage('app');
    }, 3000); // 3 seconds timeout

    return () => clearTimeout(timer);
  }, [setCurrentPage]);

  return (
    <div>
      <h1>Experiments Page</h1>
      {/* whatever */}
    </div>
  );
}

export default Experiments;
