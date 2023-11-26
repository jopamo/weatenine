import React from 'react';
import { createRoot } from 'react-dom/client';
import MainNav from './MainNav';
import './index.css';

// Select the HTML element where you want to mount your React app
const container = document.getElementById('root');

// Create a root using React 18's createRoot method
const root = createRoot(container);

// Render the MainNav component into the root
root.render(
  <React.StrictMode>
    <MainNav />
  </React.StrictMode>
);
