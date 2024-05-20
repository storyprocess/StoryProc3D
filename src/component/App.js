import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';
import ReactGA from 'react-ga';
import { packageApp } from '../assets/assetsLocation';
import InitializeGoogleAnalytics from '../utils/libraries/googleanalytics.tsx';
import { TRACKING_ID } from "../assets/assetsLocation"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

function App() {
	useEffect(() => {
		InitializeGoogleAnalytics();
		ReactGA.pageview(window.location.pathname + window.location.search);
	}, []);

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
