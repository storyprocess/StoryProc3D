import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomeComponent from './HomeComponent';

function AnimatedRoutes() {
    const location = useLocation();

		return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>	
                <Route path="/" element={<HomeComponent />} />
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes