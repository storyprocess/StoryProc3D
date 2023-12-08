import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ToolbarButton from "../libraries/ToolbarButton";
import MenuDispensor from "../libraries/MenuDispensor";
import UseCase from "../libraries/UseCase";
import { useParams, useNavigate } from "react-router-dom";
import { setGlobalState, useGlobalState } from "../state";
import { Howler, Howl } from "howler";
import bgpattern from "../assets/Pattern.png";
import useWindowDimensions from '../hooks/useWindowDimensions';
import "../css/mainPage.css";
import {
  BaseAPI,
  MainMenuIsButtons,
  ApplicationDB,
  assetsLocation,
} from "../assets/assetsLocation";
import { setTourState } from "../hooks/animations";
import useAnalyticsEventTracker from "./useAnalyticsEventTracker";
// import urlExist from 'url-exist';

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
		setUseCaseMapping(false);
    setSelectedButton(null);
    setShowCardContainer(false);
    setUI_Element(null);
    setGlobalState("useCase", 0);
    setGlobalState("mapped_use_case", null);
		setGlobalState("HoverId",0);
		setGlobalState("HoverUseCaseId",0);
    setShowUC(false);
		setGlobalState("showDC", false);
		// props.resetCamera();
    Howler.stop();
  };

  const handleTourButtonClick = (buttonId) => {
    setGlobalState("IsBackgroundBlur", false);
    if (selectedButton === buttonId) {
      if (isTourOpen) {
        setTourState(false);
        Howler.stop();
        setGlobalState("UCTourId", 0);
        setGlobalState("IsTourOpen", false);
        document.getElementById("close-btn").click();
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
    handleUseCaseButtonClick("button8");
    setGlobalState("IsButtonContainer", false);
  }
  useEffect(() => {
    if (isHomeButtonClick) {
      setUI_Element("");
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
      document.getElementById("close-btn").click();
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
      document.getElementById("close-btn").click();
    }
    Howler.stop();
    setUI_Element("");

    setShowCardContainer(true);

    return;
  };

  const handleResetButtonClick = () => {
		setUseCaseMapping(false);
    setGlobalState("IsBackgroundBlur", false);
    if(MainMenuIsButtons){
      setIsResetClick(true)
    }
    setTimeout(() => {
      setIsResetClick(false)
    }, 1000);
    setTourState(false);
    setGlobalState("IsTourOpen", false);
    setGlobalState("UCTourId", 0);
    setGlobalState("IsHomeButtonClick", true);
		setGlobalState("HoverId",0);
		setGlobalState("HoverUseCaseId",0);
    Howler.stop();
    document.getElementById("close-btn").click();
  };

	const { height, width } = useWindowDimensions();

  return (
    <div>
      {HoverId > 0 && <div style={{top:clientYPosition1,left:clientXPosition1}} className="hot-spot-subMenu">
      <div>
      <div className="hover-label-text">{HoverLabel}</div>
      <hr style={{marginTop:"3%"}} className="card-divider"></hr>
      </div>
      <div className="button-group" >
        <div className="zoom-in" onClick={()=>setGlobalState("currentZoomedSection",HoverId)} >Zoom-in</div>
        <div className="learn-more" onClick={()=>handlePlayStory()}>Learn More</div>
      </div>
      </div>}

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
        >
          <svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_bd_47_83)">
          <rect x="6" y="3" width="52" height="52" rx="26" fill="#D8D8D8"/>
          </g>
          <path d="M40 29H24M24 29L30 23M24 29L30 35" stroke="#0C2055" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
          <filter id="filter0_bd_47_83" x="0" y="-3" width="64" height="67" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="3"/>
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_47_83"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="3"/>
          <feGaussianBlur stdDeviation="3"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="effect1_backgroundBlur_47_83" result="effect2_dropShadow_47_83"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_47_83" result="shape"/>
          </filter>
          </defs>
          </svg> Reset
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
          handleButtonClick={(buttonId,buttonName) => {
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
            setSectionData(extraData[0][0].SectionData);

            setUI_Element("");
            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
        >
          Business Needs
        </ToolbarButton>


        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton // DVS button
          buttonId="btnGuidingPrinciples" //4
          active={"btnGuidingPrinciples" === selectedButton}
          selectedButton={selectedButton}
          buttonName="Guiding Principles"
          handleButtonClick={(buttonId,buttonName) => {
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
            console.log(extraData[3][0]);
            console.log(extraData[3][0].SectionData);
            setSectionData(extraData[3][0].SectionData);

            setUI_Element("");
            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
        >
          Guiding Principles
        </ToolbarButton>


        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton 
          buttonId="btnSalesChallenges" 
          active={"btnSalesChallenges" === selectedButton}
          selectedButton={selectedButton}
          buttonName="Sales Challenges"
          handleButtonClick={(buttonId,buttonName) => {
						if (selectedButton === buttonId) {
							// if same button clicked again, reset screen
							resetScreen();
							return;
						}
						setUseCaseMapping(true);
            handleButtonClick(buttonId);            
            setGlobalState("IsBackgroundBlur", true);
            setGlobalState("useCase", 0);
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsTourOpen", false);
            setSectionData(extraData[1][0].SectionData);

            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
        >
          Sales Challenges
        </ToolbarButton>


        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton 
          buttonId="btnStoryProcSolutions"
          active={"btnStoryProcSolutions" === selectedButton}
          selectedButton={selectedButton}
          buttonName="StoryProc Solutions"
          handleButtonClick={(buttonId,buttonName) => {
						if (selectedButton === buttonId) {
							// if same button clicked again, reset screen
							resetScreen();
							// return;
						}
						setUseCaseMapping(false);
            handleButtonClick(buttonId);
            setGlobalState("useCase", 0);
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsTourOpen", false);
            setSectionData(extraData[6][0].Solutions);
            setButtonType("D");
						setGlobalState("showDC", false);
            setGlobalState("showUC", false);
            setUI_Element("popuptoolbar");
          }}
          handleMenuClick={handleClick}
        >
          StoryProc Solutions
        </ToolbarButton>
        
        
        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton // Use Case Story Button
          buttonId="btnUseCasesEnabled" //8
          selectedButton={selectedButton}
          active={"btnUseCasesEnabled" === selectedButton}
          buttonName="Use Cases Enabled"
          handleButtonClick={(buttonId,buttonName) => {
						fetchAudio();
						if (selectedButton === buttonId) {
							// if same button clicked again, reset screen
							resetScreen();
							return;
						}
						setUseCaseMapping(false);
            handleButtonClick(buttonId);
            setGlobalState("IsTourOpen", false);
            setSectionData(extraData[7][0].use_case_list);

            setUI_Element("popuptoolbar");
            setButtonType("Use_case");
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsButtonContainer", true);
            setShowUC(true);
          }}
          handleMenuClick={handleClick}
        >
          Use Cases Enabled


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
        >
          Immersive Overview
        </ToolbarButton>
      </div>
			</div>


      {/* Display elements if clicked */}

      {/* Cards or DVS tab */}
      {showCardContainer && (
        <MenuDispensor
          buttonType={buttonType}
          sectionData={sectionData}
          ui_element={ui_Element}
          buttonId={selectedButton}
          useCaseMapping={useCaseMapping}
          handleMenuItemClick = {handleMenuItemClick}
          anchorEl={anchorEl}
          handleClose={handleClose}
          open={open}
          alignItems={alignItems}
        />
      )}

      {/* UseCases/Guided Tour tab */}
      {/* {showTour && fetched && <UseCase steps={stepData} useCaseID={5} />} */}
    </div>
  );
};

export default MainPage;