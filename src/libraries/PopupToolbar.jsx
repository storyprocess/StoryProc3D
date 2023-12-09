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
import { Fade, MenuList, MenuItem, Paper, Popper , Grow, ClickAwayListener } from "@mui/material";

const PopupToolbar = (props) => {
	const { loadID } = useParams();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedUseCaseButton, setSelectedUseCaseButton] = useState(null);
  const [showDataCard, setShowDataCard] = useGlobalState("showDC");
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
		setGlobalState("showDC", false);
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
		setGlobalState("IsBackgroundBlur", true);
		setShowDataCard(true);
		setGlobalState("showDC", true);
		setStartUC(false);

    try {
      setSelectedButton(buttonId);
			const obj = solutionsData.find((element) => element.id === buttonId);
      setDataObject(obj);
      if (!showUC) {
        setShowDataCard(true);
				setGlobalState("showDC", true);
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
        <div className="popuptoolbar-container">
					<Popper
						anchorEl={props.anchorEl}
						open={props.open}
						TransitionComponent={Fade}
						role={undefined}
						placement="bottom-start"
						transition
						disablePortal
						className="popup-container"
					>
						{({ TransitionProps, placement }) => (
							<Grow
								{...TransitionProps}
								style={{
									transformOrigin:
										placement === 'bottom-start' ? 'left top' : 'left bottom',
								}}
							>
								<Paper>
									<ClickAwayListener onClickAway={props.handleClose}>
										<MenuList
											autoFocusItem={props.open}
											id="fade-menu"
											aria-labelledby="fade-button"
											TransitionComponent={Fade}
										>
											{props.sectionData && props.sectionData.map((element) => {
													return (
														<MenuItem  onClick={()=>{
														props.handleMenuItemClick();
														handleButtonClick(element.id)}}>
															{element.short_label}
														</MenuItem>
														);
											})}
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
					{showDataCard && (
						<DataCard
							data={dataObject}
							onClose={handleCloseClick}
							handlePreButton={handlePreButton}
							handleNexButton={handleNexButton}
						/>
					)}
        </div>
      </div>
    </div>
  );
};

export default PopupToolbar;
