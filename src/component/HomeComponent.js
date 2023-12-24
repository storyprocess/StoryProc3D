// import ToolbarManu from "./ToolBarManu";

import "../css/UrbanMobility.css";
import { setGlobalState, useGlobalState } from "../state";
import { Routes, Route, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { Suspense, lazy, useEffect } from "react";
import Spinner from "./Spinner";
import { gsap } from 'gsap';
import { Vector3 } from "@babylonjs/core";
import { ApplicationDB, assetsLocation } from "../assets/assetsLocation";
import { useState } from "react";
import { BaseAPI } from "../assets/assetsLocation";
import Landscape from "./Landscape";
import MainPage from "./MainPage";
import { spiralAnimation } from "../utils/libraries/CameraUtils"


const Home = lazy(() => import("../pages/Home"));

function HomeComponent() {
  const location = useLocation();
  const navbuttontext = "Reset";
  const [useCase, setUseCase] = useGlobalState("useCase");
  const [IsLoading, setIsLoading] = useGlobalState("IsLoading");
  const [extraData, setExtraData] = useState([[],[], [], [], [], [], [], [], [], [], [], ]);
  const [count, setCount] = useState(0);
  const [isWelcome, setIsWelcome] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [fetchedd, setFetchedd] = useState(false);
  // const [UmToManufacturing, setUmToManufacturing] = useGlobalState("UmToManufacturing");
  const [IsBackgroundBlur, setIsBackgroundBlur] = useGlobalState("IsBackgroundBlur");
	const [scene, setScene] = useGlobalState("scene");
	const [resetting, setResetting] = useState(false);
	
  let WelcomeData = [
    "Do you sell enterprise solutions to cross-functional teams?",
    "Explore this experience center as per your needs and interest",
    "All information and stories are available via this menu. ",
    "Hit Reset anytime to stop any running story and come back to the top level view",
    "Select any Use case to get a complete overview of the use case",
    "Let’s start with an overview",
    "Remember, you can interrupt by pressing Reset anytime",
  ];
  let navigate = useNavigate();
  useEffect(() => {
    setGlobalState("ApplicationDB", ApplicationDB);
  }, []);

  async function fetchData() {
    for (var id = 0; id < 9; id++) {
      var baseAPIUrl;
      var address;
      if (id === 8) {
        baseAPIUrl = `${BaseAPI}use_case_list/`;
        address = `${baseAPIUrl}?db=${ApplicationDB}`; //address for fetching sectiondata
      } else if (id === 5 || id === 3) {
        baseAPIUrl = `${BaseAPI}solutions`;
        address = `${baseAPIUrl}?db=${ApplicationDB}`; //address for fetching sectiondata
      } else {
        baseAPIUrl = `${BaseAPI}section/`;
        address = `${baseAPIUrl + id}?db=${ApplicationDB}`; //address for fetching sectiondata
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
    fetchData();
  }, []);
  const showHotspots = (show) => {
		if(!scene) return;
		if(scene.getMeshByName(`hotspotMesh`) != null) {
			scene.getMeshByName(`hotspotMesh`).setEnabled(false);
		}
		const texture = scene.getTextureByName('myUI');
		for(var i = 0; i <= 30; i++) {
			const currMesh = scene.getMeshByName(`usecase-${i}-fake-mesh`);
			const currContainer = texture.getControlByName(`usecase-${i}-container`);
			if(!currMesh || !currContainer) continue;
			currMesh.setEnabled(show);
			currContainer.isVisible = show;
		}
	}

	const resetCamera = () => {
		if(!scene) return;
		if(resetting) return;
		setResetting(true);
		const arcRotateCamera = scene.getCameraByName('camera-2');
		const cam3 = scene.getCameraByName('camera-3');
		const canvas = document.getElementsByClassName("main-canvas")[0];

		cam3.position.copyFrom(scene.activeCamera.position);
		cam3.setTarget(scene.activeCamera.target.clone());

		arcRotateCamera.restoreState();

		const target = arcRotateCamera.target;
		const x = arcRotateCamera.radius * Math.sin(arcRotateCamera.beta) * Math.cos(arcRotateCamera.alpha);
		const y = arcRotateCamera.radius * Math.cos(arcRotateCamera.beta);
		const z = arcRotateCamera.radius * Math.sin(arcRotateCamera.beta) * Math.sin(arcRotateCamera.alpha);

		const cameraPosition = new Vector3(x, y, z).add(target);

		spiralAnimation(scene, target, cam3.position, cameraPosition, 1000, 1, () => {arcRotateCamera.restoreState(); scene.activeCamera = arcRotateCamera; arcRotateCamera.attachControl(canvas, true); setResetting(false);});
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
                src={`${assetsLocation}${ApplicationDB}/graphics/${useCase}.mp4`}
                muted
                loop
                playsInline
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
                  element={<MainPage extraData={extraData} showHotspots={showHotspots} resetCamera={resetCamera}/>}
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
