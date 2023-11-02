import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './component/App';
import ReactGA from "react-ga4";
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
// ReactGA.initialize("G-6DD71Q9RNH");
ReactGA.initialize("G-22MWCYHFSH");
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode> 
);
