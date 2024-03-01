import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './component/App';
import ReactGA from "react-ga4";
import "./index.css"

const root = ReactDOM.createRoot(document.getElementById('root'));
const TRACKING_ID = "G-728XS2G376"; // OUR_TRACKING_ID
// const TRACKING_ID = "G-22MWCYHFSH"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode> 
);
