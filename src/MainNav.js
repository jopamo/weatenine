import React, { useState } from 'react';
import Intro from './Intro';
import App from './App';
import Experiments from './Experiments';

function MainNav() {
  const [currentPage, setCurrentPage] = useState('intro');

  return (
    <div>
      {currentPage === 'intro' && <Intro setCurrentPage={setCurrentPage} />}
      {currentPage === 'app' && <App setCurrentPage={setCurrentPage} />}
      {currentPage === 'experiments' && <Experiments setCurrentPage={setCurrentPage} />}
    </div>
  );
}

export default MainNav;
