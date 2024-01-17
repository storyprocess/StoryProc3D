import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ToolbarButton from "../utils/libraries/ToolbarButton";
import MenuDispensor from "../utils/libraries/MenuDispensor";
import { useParams, useNavigate } from "react-router-dom";
import { setGlobalState, useGlobalState } from "../utils/state";
import { Howler, Howl } from "howler";
import "../utils/css/mainPage.css";
import {
  BaseAPI,
  MainMenuIsButtons,
  ApplicationDB,
  assetsLocation,
} from "../assets/assetsLocation";
import { setTourState } from "../hooks/animations";
import useAnalyticsEventTracker from "./useAnalyticsEventTracker";
import { CSSTransition } from "react-transition-group";

const MainPage = (props) => {
  const location = useLocation();
  const buttonRef = useRef(null);
  const { toPress, loadID } = useParams();
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
  const [selectedButton, setSelectedButton] = useGlobalState("selectedButton");
  const [showCardContainer, setShowCardContainer] = useState(false);
  const [sectionData, setSectionData] = useState([]);

  const [ui_Element, setUI_Element] = useState(null);

  const [showTour, setShowTour] = useGlobalState("showTour");
  const [buttonType, setButtonType] = useState("");

  const [showUC, setShowUC] = useGlobalState("showUC");
  const [useCase, setUseCase] = useGlobalState("useCase");
  
  const [isResetClick, setIsResetClick] = useState(false);
	const [useCaseMapping, setUseCaseMapping] = useState(false);
  const [HoverId, setHoverId] = useGlobalState("HoverId");
  const [HoverLabel, setHoverLabel] = useGlobalState("HoverLabel");
  const [clientXPosition1, setClientXPosition1] = useGlobalState("clientXPosition1");
  const [clientYPosition1, setClientYPosition1] = useGlobalState("clientYPosition1");
  const [isTourOpen, setIsTourOpen] = useGlobalState("IsTourOpen");
  const [isHomeButtonClick, setIsHomeButtonClick] =
    useGlobalState("IsHomeButtonClick");
  const [playAndPause, setPlayAndPause] = useGlobalState("playAndPause");
  const gaEventTracker = useAnalyticsEventTracker("ToolBarMenu");
  const [anchorEl, setAnchorEl] = useState(null);
	const [scene, setScene] = useGlobalState("scene");
	let alignItems = false;

  const open = anchorEl;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedButton("selectedButton")
  };
  const handleMenuItemClick = () => {
    setAnchorEl(null);
    // setSelectedButton("selectedButton")
  };
  const links = new Map([
    ["needs", "btnBusinessNeeds"],
    ["principles", "btnGuidingPrinciples"],
    ["challenges", "btnSalesChallenges"],
    ["solutions", "btnStoryProcSolutions"],
    ["use_case_stories", "btnUseCasesEnabled"]
  ]);

  // Set screen to initial state
  const resetScreen = () => {
    setGlobalState("IsBackgroundBlur", false);
    setTourState(false);
    setSelectedButton(null);
    setShowCardContainer(false);
		// setUseCaseMapping(false);
    // setUI_Element(null);
    setGlobalState("useCase", 0);
		setGlobalState("solutionsId", -1);
		// setGlobalState("IsButtonContainer", true);
    // setGlobalState("mapped_use_case", null);
		// setGlobalState("HoverId",0);
		setGlobalState("HoverUseCaseId",0);
    setShowUC(false);
		setGlobalState("showDC", false);
		setGlobalState("showUC", false);
		// props.resetCamera();
    Howler.stop();
  };

	useEffect(() => {
		if(selectedButton == "tour" && isTourOpen == false) {
			setSelectedButton(null);
		}
	}, [isTourOpen]);

  const handleTourButtonClick = (buttonId) => {
    setGlobalState("IsBackgroundBlur", false);
    if (selectedButton === buttonId) {
      if (isTourOpen) {
        setTourState(false);
        Howler.stop();
        setGlobalState("UCTourId", 0);
        setGlobalState("IsTourOpen", false);
        // document.getElementById("close-btn").click();
				props.resetCamera();
      } // if same button clicked again, reset screen
      resetScreen();
      return;
    } else {
      setTourState(true);
      setSelectedButton(buttonId);
      setUI_Element("");
      setShowCardContainer(false);
      setGlobalState("IsTourOpen", true);
      setGlobalState("useCase", 0);
      Howler.stop();
    }
  };

  useEffect(() => {
    if (toPress != null) {
      if (toPress === "tour") {
        handleTourButtonClick(toPress);
      } else {
        handleButtonClick(links.get(toPress));
      }
    }
  }, [toPress]);

  const handlePlayStory =()=>{
		if(HoverId > 0) {
			setGlobalState("HoverUseCaseId", HoverId);
		}
    handleUseCaseButtonClick("btnUseCasesEnabled");
    setGlobalState("IsButtonContainer", false);
  }
  useEffect(() => {
    if (isHomeButtonClick) {
      // setUI_Element("");
      setGlobalState("useCase", 0);
      setGlobalState("HoverUseCaseId", 0);
      setSelectedButton(null);
      // setGlobalState("IsButtonContainer", false);
    }
  }, [isHomeButtonClick]);

  const handleUseCaseButtonClick = async (buttonId) => {
    setGlobalState("IsHomeButtonClick", false);
    setGlobalState("ApplicationDB", ApplicationDB);
    if (isTourOpen) {
      // document.getElementById("close-btn").click();
			props.resetCamera();
    }
    Howler.stop();
    setUI_Element("");
    if (selectedButton === buttonId) {
      // if same button clicked again, reset screen
      resetScreen();
      return;
    }
    setSelectedButton(buttonId);
    try {
      const baseAPIUrl = `${BaseAPI}use_case_list/?db=${ApplicationDB}`;
      const id = buttonId.at(-1);
      const address = baseAPIUrl; //address for fetching sectiondata
      // const address = baseAPIUrl + id;//address for fetching sectiondata
      const response = await fetch(address); //fetch section data files for specific config id
      const data = await response.json();

      if (buttonId === "btnUseCasesEnabled") {
        setButtonType("Use_case");
        setGlobalState("IsButtonContainer", true);
        setUI_Element("popuptoolbar");
      } else {
        setUI_Element("cards");
      }
      setSectionData(data.use_case_list);

      setShowCardContainer(true);
      if (buttonId === "btnUseCasesEnabled") {
        setShowUC(true);
				setGlobalState("showUC", true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return;
  };

  async function fetchData() {
    for (var id = 0; id < 9; id++) {
      var baseAPIUrl;
      var address;
      if (id === 8) {
        baseAPIUrl = `${BaseAPI}use_case_list/`;
        address = `${baseAPIUrl}?db=${ApplicationDB}`; //address for fetching sectiondata
      } else if (id === 7) {
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
  }


  async function fetchAudio() {
    let Vosound;
    const audioClips = [];
    const audio_Paths = [];
    for (var id = 1; id <= 30; id++) {
      const src_url =
        `${assetsLocation}${ApplicationDB}/audio/uc` + String(id) + "/";
      const path = src_url + "10.mp3";
      try {
        Vosound = new Howl({
          src: path,
          html5: true,
          onpause: false,
          preload: true,
        });
        audioClips.push(Vosound);
        audio_Paths.push(path);
      } catch {
        audioClips.push("");
      }
    }
    setGlobalState("audioVO1", audioClips);
    setGlobalState("audioPathVO1", audio_Paths);
  }

  useEffect(() => {
    fetchData();
    fetchAudio();
  }, []);

  const handleButtonClick = async (buttonId) => {
    gaEventTracker(buttonId);

		setSelectedButton(buttonId);
    setTourState(false);
    if (!playAndPause) {
      setGlobalState("playAndPause", true);
    }
    setGlobalState("IsAutoPlay", false);
    setGlobalState("IsHomeButtonClick", false);
    setGlobalState("ApplicationDB", ApplicationDB);
    if (isTourOpen) {
      setGlobalState("UCTourId", 0);
      // document.getElementById("close-btn").click();
			props.resetCamera();
    }
    Howler.stop();
    setUI_Element("");

    setShowCardContainer(true);

    return;
  };

  const handleResetButtonClick = () => {
		// setUseCaseMapping(false);
    setGlobalState("IsBackgroundBlur", false);
    if(MainMenuIsButtons){
      setIsResetClick(true)
    }
    setTimeout(() => {
      setIsResetClick(false)
    }, 1000);
    setTourState(false);
		setSelectedButton(null);
		setShowCardContainer(false);
		setGlobalState("solutionsId", -1);
		setGlobalState("showDC", false);
		setGlobalState("showUC", false);
    setGlobalState("IsTourOpen", false);
    setGlobalState("UCTourId", 0);
    setGlobalState("IsHomeButtonClick", true);
		setGlobalState("HoverId",0);
		setGlobalState("HoverUseCaseId",0);
    Howler.stop();
    // document.getElementById("close-btn").click();
		props.resetCamera();
  };

  return (
    <div>
			<CSSTransition
        in={HoverId > 0}
        timeout={300} // Duration of the animation in milliseconds
        classNames="animationHover" // Your CSS class for animations
        unmountOnExit
        mountOnEnter
      >
				<div style={{top:clientYPosition1,left:clientXPosition1}} className="hot-spot-subMenu">
				<div>
				<div className="hover-label-text">{HoverLabel}</div>
				<hr style={{marginTop:"5%"}} className="card-divider"></hr>
				</div>
				<div className="button-group" >
					{ (isTourOpen || useCase !== 0) ? "" :
						scene.activeCamera.name.includes("security") == false ?
						<div className="zoom-in" onClick={()=> setGlobalState("currentZoomedSection",HoverId)}>Zoom-in</div>
						:
						<div className="zoom-in" onClick={()=> props.resetCamera()}>Zoom-out</div>
					}
					<div className="learn-more" onClick={()=>handlePlayStory()}>{useCase !== 0 ? "End Story" : "Learn More"}</div>
				</div>
				</div>
			</CSSTransition>

			<div style={{display:'flex'}}>

      <div className={`${MainMenuIsButtons ? "toolbar reset-toolbar" : "plain-reset-toolbar"} `} >
      <ToolbarButton
          forwardRef={buttonRef}
          id="reset"
          buttonId="reset"
          selectedButton={selectedButton}
          active={"reset" === selectedButton}
          buttonName="Reset the Experience"
          handleButtonClick={handleResetButtonClick}
          handleMenuClick={() => {}}
					MainMenuIsButtons = {MainMenuIsButtons}
        >
        
        <svg width="4vh" height="4vh" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_bd_38_67)">
        <rect x="6" y="3" width="52" height="52" rx="26" fill="#D8D8D8"/>
        </g>
        <path d="M31.6279 40C28.3821 40 25.6323 38.8867 23.3787 36.6601C21.1262 34.4324 20 31.714 20 28.5049C20 25.2959 21.1262 22.5764 23.3787 20.3465C25.6323 18.1155 28.3821 17 31.6279 17C33.6024 17 35.4507 17.4638 37.1728 18.3915C38.8959 19.3192 40.2846 20.6143 41.3389 22.2769V17H43V25.5921H34.3123V23.9493H40.4585C39.5936 22.3119 38.3765 21.0179 36.8073 20.0672C35.2403 19.1176 33.5138 18.6429 31.6279 18.6429C28.8594 18.6429 26.5061 19.6012 24.5681 21.5179C22.6301 23.4345 21.6611 25.7619 21.6611 28.5C21.6611 31.2381 22.6301 33.5655 24.5681 35.4821C26.5061 37.3988 28.8594 38.3571 31.6279 38.3571C33.7597 38.3571 35.6838 37.7548 37.4003 36.55C39.1168 35.3452 40.3211 33.7571 41.0133 31.7857H42.7757C42.0437 34.2456 40.6523 36.2296 38.6013 37.7378C36.5504 39.2459 34.2259 40 31.6279 40Z" fill="black"/>
        <defs>
        <filter id="filter0_bd_38_67" x="0" y="-3" width="64" height="67" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="3"/>
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_38_67"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="3"/>
        <feGaussianBlur stdDeviation="3"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
        <feBlend mode="normal" in2="effect1_backgroundBlur_38_67" result="effect2_dropShadow_38_67"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_38_67" result="shape"/>
        </filter>
        </defs>
        </svg>
          
          Reset
        </ToolbarButton>
      </div>


      <div
        // style={{ justifyContent: MainMenuIsButtons ? "center" : "end" }}
        className={`${MainMenuIsButtons ? "toolbar" : "plain-toolbar"} `}
      >
        <ToolbarButton // Guided Tour button
          buttonId="btnBusinessNeeds" //1
          selectedButton={selectedButton}
          active={"btnBusinessNeeds" === selectedButton}
          buttonName="Business Needs"
          handleButtonClick={async (buttonId,buttonName) => {
						if (selectedButton === buttonId) {
							// if same button clicked again, reset screen
							resetScreen();
							return;
						}
						setUseCaseMapping(false);
            handleButtonClick(buttonId);
            setGlobalState("IsBackgroundBlur", true);
            setGlobalState("useCase", 0);
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsTourOpen", false);

						if(extraData[0][0] == null) {
							const baseAPIUrl = `${BaseAPI}section/`;
							const address = `${baseAPIUrl + "1"}?db=${ApplicationDB}`;
							try {
								const response = await fetch(address);
								const data = await response.json();
								extraData[0].push(data);
							} catch (error) {
								// console.error("Error fetching data:", error);
							}
						}

            setSectionData(extraData[0][0].SectionData);

            setUI_Element("");
            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
					MainMenuIsButtons = {MainMenuIsButtons}
        >
          Business Needs
        </ToolbarButton>


        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton // DVS button
          buttonId="btnGuidingPrinciples" //4
          active={"btnGuidingPrinciples" === selectedButton}
          selectedButton={selectedButton}
          buttonName="Guiding Principles"
          handleButtonClick={async (buttonId,buttonName) => {
						if (selectedButton === buttonId) {
							// if same button clicked again, reset screen
							resetScreen();
							return;
						}
						setUseCaseMapping(false);
            handleButtonClick(buttonId);
            setGlobalState("IsBackgroundBlur", true);
            setGlobalState("useCase", 0);
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsTourOpen", false);

            if(extraData[3][0] == null) {
							const baseAPIUrl = `${BaseAPI}section/`;
							const address = `${baseAPIUrl + "4"}?db=${ApplicationDB}`; //address for fetching sectiondata
							// CHANGES HERE
							try {
								// console.log("API CALLED");
								const response = await fetch(address); //fetch section data files for specific config id
								const data = await response.json();
								extraData[3].push(data);
							} catch (error) {
								// console.error("Error fetching data:", error);
							}
						}

            setSectionData(extraData[3][0].SectionData);

            setUI_Element("");
            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
					MainMenuIsButtons = {MainMenuIsButtons}
        >
          Guiding Principles
        </ToolbarButton>


        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton 
          buttonId="btnSalesChallenges" 
          active={"btnSalesChallenges" === selectedButton}
          selectedButton={selectedButton}
          buttonName="Sales Challenges"
          handleButtonClick={async (buttonId,buttonName) => {
						if (selectedButton === buttonId) {
							// if same button clicked again, reset screen
							resetScreen();
							return;
						}
						setUseCaseMapping(false);
            handleButtonClick(buttonId);            
            setGlobalState("IsBackgroundBlur", true);
            setGlobalState("useCase", 0);
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsTourOpen", false);

						if(extraData[1][0] == null) {
							const baseAPIUrl = `${BaseAPI}section/`;
							const address = `${baseAPIUrl + "2"}?db=${ApplicationDB}`; //address for fetching sectiondata
							// CHANGES HERE
							try {
								// console.log("API CALLED");
								const response = await fetch(address); //fetch section data files for specific config id
								const data = await response.json();
								extraData[1].push(data);
							} catch (error) {
								// console.error("Error fetching data:", error);
							}
						}

            setSectionData(extraData[1][0].SectionData);

            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
					MainMenuIsButtons = {MainMenuIsButtons}
        >
          Sales Challenges
        </ToolbarButton>


        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton 
          buttonId="btnStoryProcSolutions"
          active={"btnStoryProcSolutions" === selectedButton}
          selectedButton={selectedButton}
          buttonName="StoryProc Solutions"
          handleButtonClick={async (buttonId,buttonName) => {
						if (selectedButton === buttonId) {
							// if same button clicked again, reset screen
							resetScreen();
							return;
						}
						setShowCardContainer(true);
						setUseCaseMapping(false);
            // handleButtonClick(buttonId);
            setGlobalState("useCase", 0);
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsTourOpen", false);
						setGlobalState("solutionsId", "1");
						setSelectedButton("btnStoryProcSolutions");
						if(extraData[6][0] == null) {
							const baseAPIUrl = `${BaseAPI}solutions`;
							const address = `${baseAPIUrl}?db=${ApplicationDB}`; //address for fetching sectiondata
							// CHANGES HERE
							try {
								// console.log("API CALLED");
								const response = await fetch(address); //fetch section data files for specific config id
								const data = await response.json();
								extraData[6].push(data);
							} catch (error) {
								// console.error("Error fetching data:", error);
							}
						}

            setSectionData(extraData[6][0].Solutions);
            setButtonType("D");
            setGlobalState("showUC", false);
            setUI_Element("popuptoolbar");
						setGlobalState("IsButtonContainer", false);
          }}
          handleMenuClick={handleClick}
					MainMenuIsButtons = {MainMenuIsButtons}
        >
          StoryStudio3D
        </ToolbarButton>
        
        
        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton // Use Case Story Button
          buttonId="btnUseCasesEnabled" //8
          selectedButton={selectedButton}
          active={"btnUseCasesEnabled" === selectedButton}
          buttonName="Use Cases Enabled"
          handleButtonClick={async (buttonId,buttonName) => {
						fetchAudio();
						if (selectedButton === buttonId) {
							// if same button clicked again, reset screen
							resetScreen();
							// return;
						}
						setShowCardContainer(true);
						setUseCaseMapping(false);
            handleButtonClick(buttonId);
            setGlobalState("IsTourOpen", false);
						setGlobalState("IsBackgroundBlur", false);

						if(extraData[7][0] == null) {
							const baseAPIUrl = `${BaseAPI}use_case_list`;
							const address = `${baseAPIUrl}?db=${ApplicationDB}`;
							try {
								const response = await fetch(address);
								const data = await response.json();
								extraData[7].push(data);
							} catch (error) {
								// console.error("Error fetching data:", error);
							}
						}
            setSectionData(extraData[7][0].use_case_list);

            setUI_Element("popuptoolbar");
            setButtonType("Use_case");
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsButtonContainer", true);
						setGlobalState("playUCDirectly", false);
          }}
          handleMenuClick={handleClick}
					MainMenuIsButtons = {MainMenuIsButtons}
        >
          Use Cases


        </ToolbarButton>
        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton
          forwardRef={buttonRef}
          buttonId="tour"
          id="tour"
          selectedButton={selectedButton}
          active={"tour" === selectedButton}
          buttonName="Immersive Overview"
          handleButtonClick={handleTourButtonClick}
          handleMenuClick={() => {}}
					MainMenuIsButtons = {MainMenuIsButtons}
        >
          Immersive Overview
        </ToolbarButton>
      </div>
			</div>


      {/* Display elements if clicked */}

      {/* Cards or DVS tab */}
				<MenuDispensor
          buttonType={buttonType}
          sectionData={sectionData}
          ui_element={ui_Element}
          buttonId={selectedButton}
					useCaseMapping = {useCaseMapping}
          handleMenuItemClick = {handleMenuItemClick}
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
          alignItems={alignItems}
					showCardContainer={showCardContainer}
				/>

      {/* UseCases/Guided Tour tab */}
      {/* {showTour && fetched && <UseCase steps={stepData} useCaseID={5} />} */}
    </div>
  );
};

export default MainPage;