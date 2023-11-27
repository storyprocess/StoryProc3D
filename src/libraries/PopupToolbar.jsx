import React, { useState, useEffect, useMemo } from "react";
import PopupToolbarButton from "./PopupToolbarButton";
// import SectionData from './dvsData';
import DataCard from "./DataCard";
import "../css/popuptoolbar.css";
import UseCase from "./UseCase";
import { setGlobalState, useGlobalState } from "../state";
import ucData from "./ucData";
import { async } from "q";
import { BaseAPI} from "../assets/assetsLocation";
import { useParams } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
const PopupToolbar = (props) => {
	const { loadID } = useParams();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedUseCaseButton, setSelectedUseCaseButton] = useState(null);
  const [showDataCard, setShowDataCard] = useState(false);
  // const [sectionData, setSectionData] = useState([]);
  const [dataObject, setDataObject] = useState(null);
  const [showUC, setShowUC] = useGlobalState("showUC");
  const [startUC, setStartUC] = useState(false);
  const [useCaseID, setUseCaseID] = useState(null);
  const [HoverUseCaseId, setModelUseCaseId] = useGlobalState("HoverUseCaseId");

  const [fetched, setFetched] = useGlobalState("fetched");
  const [isButtonContainer, setIsButtonContainer] =
    useGlobalState("IsButtonContainer");
  const [uc, setUc] = useState("");
  const [solutionsData, setSolutionsData] = useState(props.sectionData);
  const [solutionsDataDell, setSolutionsDell] = useState();
  const [solutionsDataPartner, setSolutionsDataPartner] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [applicationDB, setApplicationDB] =
    useGlobalState("ApplicationDB");

  const handleCloseClick = () => {
    setShowDataCard(false);
    setSelectedButton(null);
  };

  const handlePreButton = () => {
    document.getElementsByClassName("control-prev")[0]?.click();
  };

  const handleNexButton = () => {
    document.getElementsByClassName("control-next")[0]?.click();
  };

  useEffect(() => {
    fatchSolutionData();
  }, [props.buttonType]);

  const fatchSolutionData = async () => {
    try {
			// if(props.buttonType == "U") {
			// 	const baseAPIUrl = `${
			// 		BaseAPI
			// 	}solutions?db=${applicationDB}`;
			// 	const address = baseAPIUrl; //address for fetching sectiondata
			// 	const response = await fetch(address); //fetch section data files for specific config seq
			// 	const responseData = await response.json();
			// 	setSolutionsData(responseData.Solutions);
			// }
      setSolutionsData(props.sectionData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

	useEffect(() => {
		setSolutionsData(props.sectionData);
    if (loadID != null) {
      handleButtonClick(loadID);
    }
  }, [loadID, props.sectionData]);

	function timeout(delay) {
    return new Promise( res => setTimeout(res, delay) );
	}
  const handleButtonClick = async (buttonId) => {
    if (props.buttonId == "button3" || props.buttonId == "button5") {
      setGlobalState("IsBackgroundBlur", true);
    }
		// if(props.buttonType === "D")
		// {window.history.pushState("", "", "/manufacturing/solutions/" + buttonId);}
		// else if(props.buttonType === "P")
		// {window.history.pushState("", "", "/manufacturing/partners/" + buttonId);}
		if (selectedButton === buttonId) {
      setSelectedButton(null);
      setShowDataCard(false);
      setStartUC(false);
      return;
    }

    try {
      setSelectedButton(buttonId);
			const obj = solutionsData.find((element) => element.id === buttonId);
      setDataObject(obj);
      if (!showUC) {
        setShowDataCard(true);
      } else {
        const ucid = "uc" + String(buttonId);
        setUseCaseID(buttonId);
        setUc(ucid);
        setStartUC(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return;
  };

  useEffect(() => {
    handleCloseClick();
  }, [props.buttonType]);
  // console.log("sectionData",props.sectionData);
  return (
    <div className="wrapper popup-wrapper">
      <div style={{ display: "flex" }}>
        {/* <div className="popuptoolbar-container tooltip-content"> */}
        <Menu
        id="fade-menu"
        className="popup-container"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={props.anchorEl}
        open={props.open}
        onClose={props.handleClose}
        TransitionComponent={Fade}
      >
          {props.sectionData &&
            props.sectionData.map((element) => {
              return (
        
								<MenuItem  onClick={()=>{props.handleMenuItemClick();handleButtonClick(element.id)}}>
									{element.short_label}
								</MenuItem>
                // <PopupToolbarButton
                //   buttonType={props.buttonType}
                //   key={element.id}
                //   buttonId={element.id}
                //   selectedButton={selectedButton}
                //   handleButtonClick={handleButtonClick}
                // >
                //   {element.short_label}
                // </PopupToolbarButton>
            
              );
            })}
      </Menu>

          {showDataCard && (
            <DataCard
              data={dataObject}
              onClose={handleCloseClick}
              handlePreButton={handlePreButton}
              handleNexButton={handleNexButton}
            />
          )}
        {/* </div> */}
      </div>
    </div>
  );
};

export default PopupToolbar;
