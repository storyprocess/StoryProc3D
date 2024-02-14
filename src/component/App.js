import React from 'react';
import Navbar from './Navbar';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';
import ReactGA from 'react-ga';
import { packageApp } from '../assets/assetsLocation';
// const TRACKING_ID = "UA-279090988-1"; // OUR_TRACKING_ID
const TRACKING_ID = "G-728XS2G376"; // OUR_TRACKING_ID
// const TRACKING_ID = "G-22MWCYHFSH"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

ReactGA.pageview(window.location.pathname + window.location.search);

function App() {

	return (
		<>
			{
				packageApp ?
					<HashRouter>
						<Navbar />
						<AnimatedRoutes />
					</HashRouter>
					:
					<BrowserRouter>
						<Navbar />
						<AnimatedRoutes />
					</BrowserRouter>
			}
		</>
	);
}

export default App;
