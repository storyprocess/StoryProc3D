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
import { StoryProc3D, assetsLocation } from "../assets/assetsLocation";
import homeIcon from "../assets/Home button.png";
import { setTourState } from "../hooks/animations";
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
  const [extraData, setExtraData] = useState([
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ]);
  const [count, setCount] = useState(0);
  const [isWelcome, setIsWelcome] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [fetched, setFetched] = useState(false);

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
    setGlobalState("ApplicationDB", StoryProc3D);
  }, []);

  async function fetchData() {
    for (var id = 0; id < 9; id++) {
      var baseAPIUrl;
      var address;
      if (id === 8) {
        baseAPIUrl = `${BaseAPI}use_case_list/`;
        address = `${baseAPIUrl}?db=${StoryProc3D}`; //address for fetching sectiondata
      } else if (id === 5 || id === 3) {
        baseAPIUrl = `${BaseAPI}solutions`;
        address = `${baseAPIUrl}?db=${StoryProc3D}`; //address for fetching sectiondata
      } else {
        baseAPIUrl = `${BaseAPI}section/`;
        address = `${baseAPIUrl + id}?db=${StoryProc3D}`; //address for fetching sectiondata
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
  const handleNext = () => {
	if(count == 5){
		setIsWelcome(false)
	}
    setCount(count + 1);
  };
  const handlePrev = () => {
    setCount(count - 1);
  };
  const handleSkip = () => {
	setIsWelcome(false)
  };
console.log("count",count);
  if (fetched) {
    return (
      <>
        <Landscape />
        <div className="App">
          <div className="wrapper home-wrapper">
            <Suspense fallback={<Spinner />}>
              <Home extraData={extraData[7][0].use_case_list} />
            </Suspense>
            {useCase !== 0 ? (
              <video
                id="bgvideo"
                autoPlay="autoplay"
                preload="auto"
                className="bg manufacturing-bg-video"
                src={`${assetsLocation}${StoryProc3D}/graphics/${useCase}.mp4`}
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
                  element={<MainPage extraData={extraData} />}
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
