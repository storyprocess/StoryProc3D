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

	const spiralAnimation = (target, startPosition, endPosition, steps = 1000, animationTime = 3, func, ...params) => {
		const r1 = Math.sqrt((target.x - startPosition.x)*(target.x - startPosition.x) + (target.z - startPosition.z)*(target.z - startPosition.z));
		const r2 = Math.sqrt((target.x - endPosition.x)*(target.x - endPosition.x) + (target.z - endPosition.z)*(target.z - endPosition.z));

		var a1 = Math.atan2(startPosition.z - target.z, startPosition.x - target.x);
		var a2 = Math.atan2(endPosition.z - target.z, endPosition.x - target.x);

		if(a2 - a1 > Math.PI) {
			a2 = a2 - 2*Math.PI;
		}
		if(a2 - a1 < -Math.PI) {
			a2 = a2 + 2*Math.PI;
		}

		const cam = scene.getCameraByName('camera-3');
		scene.activeCamera = cam;
		cam.lockedTarget = target;
		cam.position.copyFrom(startPosition);
		const timeline = gsap.timeline();
		for(var i = 1; i <= steps; i++) {
			const r = r1 + i*(r2-r1)/steps;
			const a = a1 + i*(a2-a1)/steps;
			timeline.to(cam.position, {
				x: target.x + r * Math.cos(a),
				y: target.y + startPosition.y + (endPosition.y - startPosition.y)*i/steps,
				z: target.z + r * Math.sin(a),
				duration: (animationTime/steps)*(i === steps ? 1 : 1 - Math.pow(2, -10 * (i/steps))),
			});
		}
		timeline.to(cam.position, {
			x: target.x + r2 * Math.cos(a2),
			y: target.y + endPosition.y,
			z: target.z + r2 * Math.sin(a2),
			duration: (animationTime/steps),
			onComplete: () => {
				func(...params);
			}
		});
		timeline.play();
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

		spiralAnimation(new Vector3(-4,0,0), cam3.position, new Vector3(-0.981548002133906,11.79349915706501,23.171384014686772), 1000, 3, () => {arcRotateCamera.restoreState(); scene.activeCamera = arcRotateCamera; arcRotateCamera.attachControl(canvas, true); setResetting(false);});
	}

  if (fetched) {
    return (
      <>
        <Landscape />
        <div className="App">
          <div className={`wrapper home-wrapper ${IsBackgroundBlur ? "backgroung-blur" : ""}`}>
            <Suspense fallback={<Spinner />}>
              <Home extraData={extraData[7][0].use_case_list} showHotspots={showHotspots} spiralAnimation = {spiralAnimation}/>
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
