// import ToolbarManu from "./ToolBarManu";

import "../utils/css/UrbanMobility.css";
import { setGlobalState, useGlobalState } from "../utils/state";
import { Routes, Route, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { Suspense, lazy, useEffect } from "react";
import Spinner from "../utils/libraries/Spinner";
import { Vector3 } from "@babylonjs/core";
import { ApplicationDB, assetsLocation, packageApp } from "../assets/assetsLocation";
import { useState } from "react";
import { BaseAPI } from "../assets/assetsLocation";
import Landscape from "../utils/libraries/Landscape";
import MainPage from "./MainPage";
import { spiralAnimation, rotateToTarget } from "../utils/libraries/CameraUtils";
import gsap from "gsap";

const Home = lazy(() => import("../pages/Home"));

function HomeComponent() {
	const location = useLocation();
	const navbuttontext = "Reset";
	const [useCase, setUseCase] = useGlobalState("useCase");
	const [IsLoading, setIsLoading] = useGlobalState("IsLoading");
	const [extraData, setExtraData] = useState([[], [], [], [], [], [], [], [], [], [], [],]);
	const [fetched, setFetched] = useState(false);
	const [IsBackgroundBlur, setIsBackgroundBlur] = useGlobalState("IsBackgroundBlur");
	const [scene, setScene] = useGlobalState("scene");
	const [resetting, setResetting] = useState(false);

	useEffect(() => {
		setGlobalState("ApplicationDB", ApplicationDB);
	}, []);

	async function fetchData() {
		for (var id = 0; id < 9; id++) {
			var baseAPIUrl;
			var address;
			if (id === 8) {
				baseAPIUrl = `${BaseAPI}use_case_list/`;
				address = !packageApp ? `${baseAPIUrl}?db=${ApplicationDB}` : `../../${ApplicationDB}/use_case_list.json`; //address for fetching sectiondata
			} else if (id === 5 || id === 3) {
				baseAPIUrl = `${BaseAPI}solutions`;
				address = !packageApp ? `${baseAPIUrl}?db=${ApplicationDB}` : `../../${ApplicationDB}/solutions.json`; //address for fetching sectiondata
			} else {
				baseAPIUrl = `${BaseAPI}section/`;
				address = !packageApp ? `${baseAPIUrl + id}?db=${ApplicationDB}` : `../../${ApplicationDB}/section/${id}.json`; //address for fetching sectiondata
			}
			// CHANGES HERE
			try {
				// console.log("API CALLED");
				const response = await fetch(address); //fetch section data files for specific config id
				const data = await response.json();
				extraData[id - 1].push(data);
				if (id === 8) {
					setGlobalState("use_case_list", data);
				}
			} catch (error) {
				// console.error("Error fetching data:", error);
			}
		}
		setFetched(true);
	}

	useEffect(() => {
		setGlobalState("currentZoomedSection", String(useCase).substring(2));
	}, [useCase]);

	useEffect(() => {
		fetchData();
	}, []);
	const showHotspots = (name) => {
		if (!scene) return;
		const texture = scene.getTextureByName('myUI');
		const names = ["usecase", "tradeShows"];

		names.forEach((curr) => {
			const enable = curr == name;
			for (var i = 0; i <= 30; i++) {
				const currMesh = scene.getMeshByName(`${curr}-${i}-fake-mesh`);
				const currContainer = texture.getControlByName(`${curr}-${i}-container`);
				if (!currMesh || !currContainer) continue;
				currMesh.setEnabled(enable);
				currContainer.isVisible = enable;
			}
		});
	}

	const resetCamera = () => {
		if (!scene) return;
		if (resetting) return;
		setResetting(true);
		const arcRotateCamera = scene.getCameraByName('camera-2');
		const cam3 = scene.getCameraByName('camera-3');
		const canvas = document.getElementsByClassName("main-canvas")[0];

		if (scene.getMeshByName('tradeshow').isEnabled()) {
			const crCamera = scene.getCameraByName('cr-camera');
			showHotspots("");
			scene.activeCamera = crCamera;
			const timeline = gsap.timeline();
			timeline.to(crCamera, {
				radius: 300,
				duration: 1.5,
				ease: "power1.in",
				onComplete: () => {
					scene.getMeshByName('tradeshow').setEnabled(false);
					scene.getMeshByName('factory-model').setEnabled(true);
					const security = scene.getCameraByName('security-camera-3');
					security.computeWorldMatrix();
					const initTarget = security.target.clone();
					const initPosition = security.position.clone();
					cam3.position.copyFrom(initPosition);
					cam3.setTarget(initTarget);
					arcRotateCamera.restoreState();
					arcRotateCamera.computeWorldMatrix();
					scene.activeCamera = cam3;
					crCamera.dispose();
					showHotspots("usecase");
					spiralAnimation(scene, initTarget, initPosition, arcRotateCamera.position, 1000, 1, rotateToTarget, scene, arcRotateCamera.target, cam3, .4, (arcRotateCamera, canvas) => { arcRotateCamera.detachControl(); scene.activeCamera = arcRotateCamera; arcRotateCamera.attachControl(canvas, true); setResetting(false); }, arcRotateCamera, canvas);
				}
			});
			timeline.play();
		}
		else {
			scene.activeCamera.computeWorldMatrix();
			const initTarget = scene.activeCamera.target.clone();
			const initPosition = scene.activeCamera.position.clone();
			cam3.position.copyFrom(initPosition);
			cam3.setTarget(initTarget);
			arcRotateCamera.restoreState();
			arcRotateCamera.computeWorldMatrix();
			scene.activeCamera = cam3;
			showHotspots("usecase");
			spiralAnimation(scene, initTarget, initPosition, arcRotateCamera.position, 1000, 1, rotateToTarget, scene, arcRotateCamera.target, cam3, .4, (arcRotateCamera, canvas) => { arcRotateCamera.detachControl(); scene.activeCamera = arcRotateCamera; arcRotateCamera.attachControl(canvas, true); setResetting(false); }, arcRotateCamera, canvas);
		}
	}

	if (fetched) {
		return (
			<>
				<Landscape />
				<div className="App">
					<div className={`wrapper home-wrapper ${IsBackgroundBlur ? "backgroung-blur" : ""}`}>
						<Suspense fallback={<Spinner />}>
							<Home extraData={extraData[7][0].use_case_list} showHotspots={showHotspots} />
						</Suspense>
						{useCase !== 0 ? (
							<video
								id="bgvideo"
								autoPlay="autoplay"
								preload="auto"
								className="bg manufacturing-bg-video"
								src={!packageApp ? `${assetsLocation}${ApplicationDB}/graphics/${useCase}.mp4` : `../../${ApplicationDB}/graphics/${useCase}.mp4`}
								muted
								loop
								playsInline
								onError={(e) => e.target.style.display = 'none'}
							></video>
						) : (
							""
						)}
					</div>

					<motion.div
						className="wrapper"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 2 }}
					>
						{IsLoading ? (
							""
						) : (
							<Routes location={location} key={location.pathname}>
								<Route
									path="/:toPress?/:loadID?"
									element={<MainPage extraData={extraData} showHotspots={showHotspots} resetCamera={resetCamera} />}
								/>
							</Routes>
						)}
					</motion.div>
				</div>
			</>
		);
	}
}

export default HomeComponent;
