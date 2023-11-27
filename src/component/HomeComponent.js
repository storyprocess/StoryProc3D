// import ToolbarManu from "./ToolBarManu";

import "../css/UrbanMobility.css";
import { setGlobalState, useGlobalState } from "../state";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import verticalLine from "../assets/Group 27.png";
import React, { Suspense, lazy, useEffect } from "react";
import Spinner from "./Spinner";
import { Howl, Howler } from "howler";
import { ApplicationDB, assetsLocation } from "../assets/assetsLocation";
import homeIcon from "../assets/Home button.png";
import { setTourState } from "../hooks/animations";
import { useState } from "react";
import { BaseAPI } from "../assets/assetsLocation";
import Landscape from "./Landscape";
import MainPage from "./MainPage";
import ManufacturingBG from "../assets/Manufacturing BG.mp4";
import EnterFactory from "../assets/Start icon.png";


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
  const arcRotateCamera = scene.getCameraByName('camera-2');
  arcRotateCamera.minZ = 0;
  arcRotateCamera.alpha = 1.57;
  arcRotateCamera.beta = 0.8;
  arcRotateCamera.radius = 70;

  // set limnitations for camera
  arcRotateCamera.upperBetaLimit = 1.57;
  arcRotateCamera.lowerRadiusLimit = 10;
  arcRotateCamera.upperRadiusLimit = 100;
  arcRotateCamera.lowerAlphaLimit = arcRotateCamera.alpha;
  arcRotateCamera.upperAlphaLimit = arcRotateCamera.alpha;

  // set panning
  // Enable panning
  // make panning axis to model axis (x,z)

  arcRotateCamera.inputs.addMouseWheel();
  arcRotateCamera.inputs.addPointers();
  arcRotateCamera.wheelPrecision = 20;

  // Set panning options
  arcRotateCamera.panningSensibility = 170; // Adjust the panning speed as needed
  // set limits for panning
  arcRotateCamera.panningDistanceLimit = 80;
  arcRotateCamera.allowUpsideDown = false;
  // arcRotateCamera._panningMouseButton = 0;

  // Disable pinch zoom
  arcRotateCamera.pinchDeltaPercentage = 0;

  // Disable double-click zoom
  arcRotateCamera.useInputToRestoreState = false;
  // This attaches the camera to the canvas
  scene.activeCamera = arcRotateCamera;

  arcRotateCamera.storeState();
}
  if (fetched) {
    return (
      <>
        <Landscape />
        <div className="App">
        {/* {UmToManufacturing && <div className='wrapper' style={{zIndex:fetched ? 1 :9}}>
            <video onEnded={()=>setFetchedd(true)} autoPlay="autoplay" preload="auto" className="bg" style={{filter:'none'}} src={ManufacturingBG} muted playsInline></video>
            </div>}
            {fetchedd && <div onClick={()=>{setFetched(true);setFetchedd(false)}} className="enter-factory">
				<img src={EnterFactory}/>
				<div >
				Enter Factory
				</div>
				</div>} */}
          <div className={`wrapper home-wrapper ${IsBackgroundBlur ? "backgroung-blur" : ""}`}>
            <Suspense fallback={<Spinner />}>
              <Home extraData={extraData[7][0].use_case_list} showHotspots={showHotspots}/>
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
            {/* <div className="blur-ell1 manu-blur"></div>
            <div className="blur-ell3"></div>
            <div className="blur-ell4"></div>
            <div className="blur-rect"></div> */}
            {/* {count >= 0 && isWelcome && !IsLoading &&(
              <div className="Welcome-card" style={{ zIndex: 999 }}>
                <div className="Tour-box-title">
                  {WelcomeData[count]} <br/>
                  {count == 5 ? WelcomeData[count + 1] : ''}
                </div>
                <div className="Tour-box-content">
                  <div
                    style={{ display: "flex", justifyContent: "space-between",cursor:'pointer' }}
                  >
                    <div
                      className="welcome-btn"
                      onClick={() => handlePrev()}
                    >
                      Prev
                    </div>
                    <div
                      className="welcome-btn"
                      onClick={() => handleNext()}
                    >
                      Next
                    </div>
                    <div
                      className="welcome-btn"
                      onClick={() => handleSkip()}
                    >
                      Skip
                    </div>
                  </div>
                </div>
				<input type="checkbox" value={"Never show this again"} onChange={(e)=>{}}/><label>Never show this again</label>
              </div>
            )} */}
            {/* <button
							className="mf-nav-button"
							onClick={() => {
								setTourState(false)
								setGlobalState("IsTourOpen", false);
								setGlobalState("UCTourId", 0);
								setGlobalState("IsHomeButtonClick", true);
								Howler.stop();
								document.getElementById("close-btn").click();
							}}
						>
							<img width={'20px'} height={"20px"} src={homeIcon}></img>
							{navbuttontext}
						</button> */}
            {/* <h1 className="um-head">StoryProc</h1> */}
            {/* <p className="um-sub">Streamline traffic, enforce regulations, and optimize transportation systems.</p> */}

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
