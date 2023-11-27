import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ToolbarButton from "../libraries/ToolbarButton";
import MenuDispensor from "../libraries/MenuDispensor";
import UseCase from "../libraries/UseCase";
import { useParams, useNavigate } from "react-router-dom";
import { setGlobalState, useGlobalState } from "../state";
import { Howler, Howl } from "howler";
import bgpattern from "../assets/Pattern.png";
import "../css/toolbarManu.css";
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
  const [dimBg, setDimBg] = useGlobalState("dimBg");
  const [buttonType, setButtonType] = useState("");

  const [showUC, setShowUC] = useGlobalState("showUC");
  
  const [isResetClick, setIsResetClick] = useState(false);

  const [HoverUseCaseId, setModelUseCaseId] = useGlobalState("HoverUseCaseId");
  const [HoverLabel, setHoverLabel] = useGlobalState("HoverLabel");
  const [clientXPosition1, setClientXPosition1] = useGlobalState("clientXPosition1");
  const [clientYPosition1, setClientYPosition1] = useGlobalState("clientYPosition1");
  const [isTourOpen, setIsTourOpen] = useGlobalState("IsTourOpen");
  const [isHomeButtonClick, setIsHomeButtonClick] =
    useGlobalState("IsHomeButtonClick");
  const [playAndPause, setPlayAndPause] = useGlobalState("playAndPause");
  const gaEventTracker = useAnalyticsEventTracker("ToolBarMenu");
  const [anchorEl, setAnchorEl] = useState(null);
  let alignItems = true;

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
    setUI_Element(null);
    setGlobalState("useCase", 0);
    setGlobalState("mapped_use_case", null);
    setShowUC(false);
    setDimBg(false);
		props.resetCamera();
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
      setDimBg(true);
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
    console.log("buttonId",buttonId);
    setSelectedButton(buttonId);
    gaEventTracker(buttonId);
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
    if (selectedButton === buttonId) {
      // if same button clicked again, reset screen
      resetScreen();
      return;
    }

    setShowCardContainer(true);
    setDimBg(true);

    return;
  };

  const handleResetButtonClick = () => {
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
    Howler.stop();
    document.getElementById("close-btn").click();
  };

  return (
    <div>
      {/* { dimBg && <img id="pattern" className='bg-front' src={bgpattern} preload="auto"></img>} */}
      {HoverUseCaseId > 0  && !showUC && <div style={{top:clientYPosition1-120,left:clientXPosition1-30}} className="hot-spot-subMenu">
      <div>
      <div className="hover-label-text">{HoverLabel}</div>
      <hr style={{marginTop:"5%"}} className="card-divider"></hr>
      </div>
      <div className="button-group" >
        <div className="zoom-in" onClick={()=>setGlobalState("currentZoomedSection",HoverUseCaseId)} >Zoom-in</div>
        <div className="learn-more" onClick={()=>handlePlayStory()}>Learn More</div>
      </div>
      </div>}
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
        <ToolbarButton // Outcomes button
          buttonId="btnSalesChallenges" //2
          active={"btnSalesChallenges" === selectedButton}
          selectedButton={selectedButton}
          buttonName="Sales Challenges"
          handleButtonClick={(buttonId,buttonName) => {
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
        <ToolbarButton // Building Blocks button
          buttonId="btnStoryProcSolutions" //7
          active={"btnStoryProcSolutions" === selectedButton}
          selectedButton={selectedButton}
          buttonName="StoryProc Solutions"
          handleButtonClick={(buttonId,buttonName) => {
            handleButtonClick(buttonId);
            setGlobalState("IsBackgroundBlur", true);
            setGlobalState("useCase", 0);
            setGlobalState("HoverUseCaseId", 0);
            setGlobalState("IsTourOpen", false);
            setSectionData(extraData[6][0].Solutions);

            setButtonType("D");
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
            handleButtonClick(buttonId);            
            setGlobalState("IsBackgroundBlur", false);
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
        {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
        <ToolbarButton
          forwardRef={buttonRef}
          buttonId="reset"
          id="reset"
          selectedButton={selectedButton}
          active={"reset" === selectedButton}
          buttonName="Reset the Experience"
          handleButtonClick={handleResetButtonClick}
          handleMenuClick={() => {}}
        >
          Reset the Experience
        </ToolbarButton>
      </div>

      {/* Display elements if clicked */}

      {/* Cards or DVS tab */}
      {showCardContainer && (
        <MenuDispensor
          buttonType={buttonType}
          sectionData={sectionData}
          ui_element={ui_Element}
          buttonId={selectedButton}
          useCaseMapping={selectedButton === "btnBusinessNeeds"}
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
