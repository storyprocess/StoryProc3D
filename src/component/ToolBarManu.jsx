import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';
import ToolbarButton from "../libraries/ToolbarButton";
import MenuDispensor from "../libraries/MenuDispensor";
import UseCase from "../libraries/UseCase";
import { useParams, useNavigate } from "react-router-dom";
import { setGlobalState, useGlobalState } from "../state";
import { Howler, Howl } from "howler";
import bgpattern from "../assets/Pattern.png";
import "../css/toolbarManu.css";
import { BaseAPI, MainMenuIsButtons, StoryProc3D, assetsLocation } from "../assets/assetsLocation";
import { setTourState } from "../hooks/animations";
import useAnalyticsEventTracker from "./useAnalyticsEventTracker";
// import urlExist from 'url-exist';

const ToolbarManu = (props) => {
	const location = useLocation();
  const buttonRef = useRef(null);
	const { toPress, loadID } = useParams();
	const [extraData, setExtraData] = useState([[], [], [], [], [], [], [], [], [], [], []]);
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
  const [isHomeButtonClick, setIsHomeButtonClick] = useGlobalState("IsHomeButtonClick");
  const [playAndPause, setPlayAndPause] = useGlobalState("playAndPause");
  const gaEventTracker = useAnalyticsEventTracker("ToolBarMenu");
  const [anchorEl, setAnchorEl] = useState(null);
  let alignItems = true

  const open = anchorEl;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
	const links = new Map([
		["use_case_stories", "button8"],
		["outcomes", "button4"],
		["solutions", "button3"],
		["partners", "button5"]
	]);

//   selectedButton == "button4"
//   ? "Business Impact"
//   : selectedButton == "button8"
//   ? "Use Cases Enabled"
//   : selectedButton == "button2"
//   ? "Sales Challenges"
//   : selectedButton == "button3"
//   ? "StoryProc Solutions"
//   : selectedButton == "button7"
//   ? "Guiding Principles"
//   : "UC",
// selectedButton == "button4"
//   ? "4"
//   : selectedButton == "button8"
//   ? "8"
//   : selectedButton == "button2"
//   ? "2"
//   : selectedButton == "button3"
//   ? "3"
//   : selectedButton == "button7"
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

	useEffect(() =>{
		if(toPress != null) {
			if(toPress === "tour") {
				handleTourButtonClick(toPress);
			} else {
				handleButtonClick(links.get(toPress));
			}
		}
	}, [toPress]);

  useEffect(() => {
    if (modelUseCaseId) {
      handleUseCaseButtonClick("button8");
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

      if (buttonId === "button8") {
        setButtonType("Use_case");
        setGlobalState("IsButtonContainer", true);
        setUI_Element("popuptoolbar");
      } else {
        setUI_Element("cards");
      }
      setSectionData(data.use_case_list);

      setShowCardContainer(true);
      setDimBg(true);
      if (buttonId === "button8") {
        setShowUC(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return;
  };

	async function fetchData() {
		for(var id = 0; id < 9; id++) {
			var baseAPIUrl;
			var address;
			if (id === 8) {
				baseAPIUrl = `${BaseAPI}use_case_list/`;
				address = `${baseAPIUrl}?db=${StoryProc3D}`; //address for fetching sectiondata
			}
			else if (id === 5 || id === 3) {
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
					extraData[id-1].push(data);
					if(id === 8) {
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
		for(var id = 1; id <= 30; id++)
		{
			const src_url =
				`${assetsLocation}${StoryProc3D}/audio/uc` +
				String(id) +
				"/";
			const path = src_url + "10.mp3";
			try{
					Vosound = new Howl({
							src: path,
							html5: true,
							onpause: false,
							preload:true
					});
					audioClips.push(Vosound);
					audio_Paths.push(path);
			} catch{
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
		// window.history.pushState("", "", "/manufacturing/" + buttonId);

    // console.log("buttonName",buttonName);
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
		if(selectedButton === "button8") {
			fetchAudio();
		}
    if (selectedButton === buttonId) {
      // if same button clicked again, reset screen
			// window.history.pushState("", "", "/manufacturing/");
      resetScreen();
      return;
    }
    setSelectedButton(buttonId);

    if (buttonId !== "button8") {
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
      const id = buttonId.at(-1);
      if (buttonId === "button8") {
        baseAPIUrl = `${BaseAPI}use_case_list/`;
        address = `${baseAPIUrl}?db=${StoryProc3D}`; //address for fetching sectiondata
			}
			else if (buttonId === "button5" || buttonId === "button3") {
        baseAPIUrl = `${BaseAPI}solutions`;
        address = `${baseAPIUrl}?db=${StoryProc3D}`; //address for fetching sectiondata
      } else {
        baseAPIUrl = `${BaseAPI}section/`;
        address = `${baseAPIUrl + id}?db=${StoryProc3D}`; //address for fetching sectiondata
      }
      // CHANGES HERE
			if(extraData[id-1].length == 0) {
				// console.log("API CALLED");
				const response = await fetch(address); //fetch section data files for specific config id
        console.log("response",response);
				const data = await response.json();
				extraData[id-1].push(data);
				// console.log(extraData[id-1].length);
			}

			const data = extraData[id-1][0];
console.log("data",data);
      // Assign UI Element to display data
      if (buttonId === "button3") {
        setButtonType("D");
        setGlobalState("showUC", false);
      }
      if (buttonId === "button5") {
        setButtonType("P");
        setGlobalState("showUC", false);
      }
      if (buttonId === "button8") {
        setButtonType("Use_case");
        setGlobalState("modelUseCaseId", 0);
        setGlobalState("IsButtonContainer", true);
      }
      if (
        buttonId === "button3" ||
        buttonId === "button5" ||
        buttonId === "button8"
      ) {
        setUI_Element("popuptoolbar");
      } else {
        setUI_Element("cards");
      }
      if (buttonId === "button8") {
        setSectionData(data.use_case_list);
      } else if (buttonId === "button5" || buttonId === "button3") {
				let dataUsed = [];
				data.Solutions.map((item) => {
        if (buttonId === "button3" && item.soln_type == "D") {
          dataUsed.push(item);
        } else if (buttonId === "button5" && item.soln_type == "P"){
          dataUsed.push(item);
        }
      });
        setSectionData(dataUsed);
      } else {
        setSectionData(data.SectionData);
      }

      setShowCardContainer(true);
      setDimBg(true);
      if (buttonId === "button8") {
        setShowUC(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return;
  };
  
const handleResetButtonClick = () =>{
                setTourState(false)
								setGlobalState("IsTourOpen", false);
								setGlobalState("UCTourId", 0);
								setGlobalState("IsHomeButtonClick", true);
								Howler.stop();
								document.getElementById("close-btn").click();
}
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
      <div style={{justifyContent:MainMenuIsButtons ? "center":'end'}} className="toolbar">
        <ToolbarButton // Guided Tour button
          buttonId="button4"
          selectedButton={selectedButton}
          active={"button4" === selectedButton}
          buttonName = "Business Needs"
          handleButtonClick={handleButtonClick}
          handleMenuClick={()=>{}}

        >
          Business Needs
        </ToolbarButton>

        <ToolbarButton // DVS button
          buttonId="button7"
          active={"button7" === selectedButton}
          selectedButton={selectedButton}
          buttonName = "Guiding Principles"
          // onClick={() => handleButtonClick("3")}
          handleButtonClick={handleButtonClick}
          handleMenuClick={()=>{}}

        >
          Guiding Principles
        </ToolbarButton>

        <ToolbarButton // Outcomes button
          buttonId="button2"
          active={"button2" === selectedButton}
          selectedButton={selectedButton}
          buttonName = "Sales Challenges"
          // onClick={() => handleButtonClick("1")}
          handleButtonClick={handleButtonClick}
          handleMenuClick={()=>{}}
        >
          Sales Challenges
        </ToolbarButton>

        <ToolbarButton // Building Blocks button
          buttonId="button3"
          active={"button3" === selectedButton}
          selectedButton={selectedButton}
          buttonName = "StoryProc Solutions"
          // onClick={() => handleButtonClick("2")}
          handleButtonClick={handleButtonClick}
          handleMenuClick={handleClick}
        >
          StoryProc Solutions
        </ToolbarButton>

        <ToolbarButton // Guided Tour button
          buttonId="button8"
          selectedButton={selectedButton}
          active={"button8" === selectedButton}
          buttonName = "Use Cases Enabled"
          handleButtonClick={handleButtonClick}
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
          buttonName = "Immersive Overview"
          // handleButtonClick={handleButtonClick}
          handleButtonClick={handleTourButtonClick}
          handleMenuClick={()=>{}}

        >
          Immersive Overview
        </ToolbarButton>

        <ToolbarButton
          forwardRef={buttonRef}
          buttonId="reset"
          id="reset"
          selectedButton={selectedButton}
          active={"reset" === selectedButton}
          buttonName = "Reset the Experience"
          // handleButtonClick={handleButtonClick}
          handleButtonClick={handleResetButtonClick}
          handleMenuClick={()=>{}}

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
					buttonId = {selectedButton}
					useCaseMapping = {(selectedButton === "button4")}
          anchorEl = {anchorEl}
							handleClose = {handleClose}
							open = {open}
              alignItems={alignItems}
				/>
			)}

      {/* UseCases/Guided Tour tab */}
      {/* {showTour && fetched && <UseCase steps={stepData} useCaseID={5} />} */}
    </div>
  );
};

export default ToolbarManu;
