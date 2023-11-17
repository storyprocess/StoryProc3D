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
  StoryProc3D,
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

  const [modelUseCaseId, setModelUseCaseId] = useGlobalState("modelUseCaseId");
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
  };
  const links = new Map([
    ["use_case_stories", "btnUseCasesEnabled"],
    ["outcomes", "btnBusinessNeeds"],
    ["solutions", "btnStoryProcSolutions"],
  ]);

  //   selectedButton == "btnBusinessNeeds"
  //   ? "Business Impact"
  //   : selectedButton == "btnUseCasesEnabled"
  //   ? "Use Cases Enabled"
  //   : selectedButton == "btnSalesChallenges"
  //   ? "Sales Challenges"
  //   : selectedButton == "btnGuidingPrinciples"
  //   ? "StoryProc Solutions"
  //   : selectedButton == "btnGuidingPrinciples"
  //   ? "Guiding Principles"
  //   : "UC",
  // selectedButton == "btnBusinessNeeds"
  //   ? "4"
  //   : selectedButton == "btnUseCasesEnabled"
  //   ? "8"
  //   : selectedButton == "btnSalesChallenges"
  //   ? "2"
  //   : selectedButton == "btnGuidingPrinciples"
  //   ? "3"
  //   : selectedButton == "btnGuidingPrinciples"
  //   ? "7"
  //   : "UC"
  // Set screen to initial state

  const resetScreen = () => {
    setTourState(false);
    setSelectedButton(null);
    setShowCardContainer(false);
    setUI_Element(null);
    setGlobalState("useCase", 0);
    setGlobalState("mapped_use_case", null);
    setShowUC(false);
    setDimBg(false);

    Howler.stop();
  };

  const handleTourButtonClick = (buttonId) => {
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

  useEffect(() => {
    if (modelUseCaseId) {
      handleUseCaseButtonClick("btnUseCasesEnabled");
      setGlobalState("IsButtonContainer", false);
    }
  }, [modelUseCaseId]);

  useEffect(() => {
    if (isHomeButtonClick) {
      setUI_Element("");
      setGlobalState("useCase", 0);
      setGlobalState("modelUseCaseId", 0);
      setSelectedButton(null);
      // setGlobalState("IsButtonContainer", false);
    }
  }, [isHomeButtonClick]);

  const handleUseCaseButtonClick = async (buttonId) => {
    setGlobalState("IsHomeButtonClick", false);
    setGlobalState("ApplicationDB", StoryProc3D);
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
      const baseAPIUrl = `${BaseAPI}use_case_list/?db=${StoryProc3D}`;
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
          console.log(data.use_case_list);
          setGlobalState("use_case_list", data);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
      }
    }
  }

  useEffect(() => {
    setExtraData(props.extraData);
  }, [props.extraData]);

  async function fetchAudio() {
    let Vosound;
    const audioClips = [];
    const audio_Paths = [];
    for (var id = 1; id <= 30; id++) {
      const src_url =
        `${assetsLocation}${StoryProc3D}/audio/uc` + String(id) + "/";
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

    // for(var id = 1; id <= 14; id++) {
    // 	console.log(audioClips[id-1]);
    // }
    // Howler.stop();
  }

  useEffect(() => {
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
    setGlobalState("ApplicationDB", StoryProc3D);
    if (isTourOpen) {
      setGlobalState("UCTourId", 0);
      document.getElementById("close-btn").click();
    }
    Howler.stop();
    setUI_Element("");
    // if (selectedButton === "btnUseCasesEnabled") {
    //   fetchAudio();
    // }
    if (selectedButton === buttonId) {
      // if same button clicked again, reset screen
      resetScreen();
      return;
    }

    if (buttonId !== "btnUseCasesEnabled") {
      setGlobalState("useCase", 0);
      setGlobalState("modelUseCaseId", 0);
    }

    if (buttonId !== "tour") {
      setGlobalState("IsTourOpen", false);
    }

    try {
      // Fetch data from API
      let baseAPIUrl;
      let address;
      let id = 0;
      if (buttonId === "btnBusinessNeeds") {
        id = 1;
        baseAPIUrl = `${BaseAPI}section/`;
        address = `${baseAPIUrl + 1}?db=${StoryProc3D}`;
      } else if (buttonId === "btnSalesChallenges") {
        id = 2;
        baseAPIUrl = `${BaseAPI}section/`;
        address = `${baseAPIUrl + 2}?db=${StoryProc3D}`;
      } else if (buttonId === "btnGuidingPrinciples") {
        id = 3;
        baseAPIUrl = `${BaseAPI}section/`;
        address = `${baseAPIUrl + 3}?db=${StoryProc3D}`;
      } else if (buttonId === "btnStoryProcSolutions") {
        id = 7;
        baseAPIUrl = `${BaseAPI}solutions`;
        address = `${baseAPIUrl}?db=${StoryProc3D}`;
      } else {
        id = 8;
        baseAPIUrl = `${BaseAPI}use_case_list/`;
        address = `${baseAPIUrl}?db=${StoryProc3D}`;
      }

      // if (buttonId === "btnUseCasesEnabled") {
      //   baseAPIUrl = `${BaseAPI}use_case_list/`;
      //   address = `${baseAPIUrl}?db=${StoryProc3D}`; //address for fetching sectiondata
      // }
      // else if (buttonId === "btnStoryProcSolutions") {
      //   baseAPIUrl = `${BaseAPI}solutions`;
      //   address = `${baseAPIUrl}?db=${StoryProc3D}`; //address for fetching sectiondata
      // }
      //  else {
      //   baseAPIUrl = `${BaseAPI}section/`;
      //   address = `${baseAPIUrl + id}?db=${StoryProc3D}`; //address for fetching sectiondata
      // }
      // CHANGES HERE

      if (extraData[id - 1].length == 0) {
        const response = await fetch(address); //fetch section data files for specific config id
        const data = await response.json();
        extraData[id - 1].push(data);
      }
      const data = extraData[id - 1][0];
      // Assign UI Element to display data
      // if (buttonId === "btnStoryProcSolutions") {
      //   setButtonType("D");
      //   setGlobalState("showUC", false);
      // }
      // if (buttonId === "btnUseCasesEnabled") {
      //   setButtonType("Use_case");
      //   setGlobalState("modelUseCaseId", 0);
      //   setGlobalState("IsButtonContainer", true);
      // }

      // if (
      //   buttonId === "btnStoryProcSolutions" ||
      //   buttonId === "btnUseCasesEnabled"
      // ) {
      //   setUI_Element("popuptoolbar");
      // } else {
      //   setUI_Element("cards");
      // }
console.log("data",data);
      if (buttonId === "btnUseCasesEnabled") {
        setSectionData(data.use_case_list);
      } else if (buttonId === "btnStoryProcSolutions") {
        let dataUsed = [];
        data.Solutions.map((item) => {
          if (buttonId === "btnStoryProcSolutions" && item.soln_type == "D") {
            dataUsed.push(item);
          }
        });
        setSectionData(dataUsed);
      } else if (buttonId === "btnGuidingPrinciples"){
        setSectionData(data.Solutions);
      }else {
        setSectionData(data.SectionData);
      }

      setShowCardContainer(true);
      setDimBg(true);
      // if (buttonId === "btnUseCasesEnabled") {
      //   setShowUC(true);
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return;
  };

  const handleResetButtonClick = () => {
    setTourState(false);
    setGlobalState("IsTourOpen", false);
    setGlobalState("UCTourId", 0);
    setGlobalState("IsHomeButtonClick", true);
    Howler.stop();
    document.getElementById("close-btn").click();
  };
  // Get usecases data from API

  // Dimming Background on opening any component

  // useEffect(() => {
  //     if (dimBg){
  //         document.getElementById("bgvideo").style.setProperty('filter', 'brightness(35%)');
  //     }
  //     else{
  //         document.getElementById("bgvideo").style.setProperty('filter', 'brightness(100%)');
  //     }
  // }, [dimBg]);

  // return all buttons

  return (
    <div>
      {/* { dimBg && <img id="pattern" className='bg-front' src={bgpattern} preload="auto"></img>} */}
      <div
        style={{ justifyContent: MainMenuIsButtons ? "center" : "end" }}
        className="toolbar"
      >
        <ToolbarButton // Guided Tour button
          buttonId="btnBusinessNeeds" //1
          selectedButton={selectedButton}
          active={"btnBusinessNeeds" === selectedButton}
          buttonName="Business Needs"
          handleButtonClick={(buttonId,buttonName) => {
            handleButtonClick(buttonId,buttonName);
            setUI_Element("");
            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
        >
          Business Needs
        </ToolbarButton>

        <ToolbarButton // DVS button
          buttonId="btnGuidingPrinciples" //3
          active={"btnGuidingPrinciples" === selectedButton}
          selectedButton={selectedButton}
          buttonName="Guiding Principles"
          handleButtonClick={(buttonId,buttonName) => {
            handleButtonClick(buttonId,buttonName);
            setUI_Element("");
            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
        >
          Guiding Principles
        </ToolbarButton>

        <ToolbarButton // Outcomes button
          buttonId="btnSalesChallenges" //2
          active={"btnSalesChallenges" === selectedButton}
          selectedButton={selectedButton}
          buttonName="Sales Challenges"
          handleButtonClick={(buttonId,buttonName) => {
            handleButtonClick(buttonId,buttonName);
            setUI_Element("");
            setUI_Element("cards");
          }}
          handleMenuClick={() => {}}
        >
          Sales Challenges
        </ToolbarButton>

        <ToolbarButton // Building Blocks button
          buttonId="btnStoryProcSolutions" //7
          active={"btnStoryProcSolutions" === selectedButton}
          selectedButton={selectedButton}
          buttonName="StoryProc Solutions"
          handleButtonClick={(buttonId,buttonName) => {
            handleButtonClick(buttonId,buttonName);
            setButtonType("D");
            setGlobalState("showUC", false);
            setUI_Element("");
            setUI_Element("popuptoolbar");
          }}
          handleMenuClick={handleClick}
        >
          StoryProc Solutions
        </ToolbarButton>

        <ToolbarButton // Guided Tour button
          buttonId="btnUseCasesEnabled" //8
          selectedButton={selectedButton}
          active={"btnUseCasesEnabled" === selectedButton}
          buttonName="Use Cases Enabled"
          handleButtonClick={(buttonId,buttonName) => {
            fetchAudio();
            handleButtonClick(buttonId,buttonName);
            setUI_Element("");
            setUI_Element("popuptoolbar");
            setButtonType("Use_case");
            setGlobalState("modelUseCaseId", 0);
            setGlobalState("IsButtonContainer", true);
            setShowUC(true);
          }}
          handleMenuClick={handleClick}
        >
          Use Cases Enabled
        </ToolbarButton>

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
