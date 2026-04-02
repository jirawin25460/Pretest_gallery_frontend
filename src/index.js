import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Gallery from './views/Gallery'; 
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Gallery />
  </React.StrictMode>
);

reportWebVitals();