import React, { useState, useEffect, useMemo } from "react";
import PopupToolbarButton from "./PopupToolbarButton";
// import SectionData from './dvsData';
import DataCard from "./DataCard";
import "../css/popuptoolbar.css";
import UseCase from "./UseCase";
import { setGlobalState, useGlobalState } from "../state";
import ucData from "./ucData";
import { async } from "q";
import UseCasePopupToolbarButton from "./UseCasePopupToolbarButton";
import DownArrowHover from "../assets/Group 110.png";
import UpArrowHover from "../assets/Group 111.png";
import DownArrow from "../assets/Group 112.png";
import UpArrow from "../assets/Group 113.png";
import { useParams } from "react-router-dom";
import { Fade, MenuList, MenuItem, Paper, Popper , Grow, ClickAwayListener } from "@mui/material";

const UseCasePopupToolbar = (props) => {
	const { loadID } = useParams();
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedUseCaseButton, setSelectedUseCaseButton] = useState(null);
  const [showDataCard, setShowDataCard] = useState(false);
  const [dataObject, setDataObject] = useState(null);
  const [showUC, setShowUC] = useGlobalState("showUC");
  const [startUC, setStartUC] = useState(false);
  const [useCaseID, setUseCaseID] = useState(null);
  const [HoverUseCaseId, setModelUseCaseId] = useGlobalState("HoverUseCaseId");
  const [HoverLabel, setHoverLabel] = useGlobalState("HoverLabel");

  const [fetched, setFetched] = useGlobalState("fetched");
  const [isButtonContainer, setIsButtonContainer] =
    useGlobalState("IsButtonContainer");
  const [uc, setUc] = useState("");
  const [solutionsData, setSolutionsData] = useState();
  const [solutionsDataDell, setSolutionsDell] = useState();
  const [solutionsDataPartner, setSolutionsDataPartner] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [isHoverUp, setIsHoverUp] = useState(false);
  const [isHoverDown, setIsHoverDown] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);

  useEffect(() => {
    if (HoverUseCaseId) {
      console.log("HoverUseCaseId",HoverUseCaseId);
      handleUseCaseButtonClick(HoverUseCaseId);
    }
  }, [HoverUseCaseId]);


	useEffect(() => {
    if (loadID != null) {
      handleUseCaseButtonClick(loadID);
    }
  }, [loadID]);

  const handleUseCaseButtonClick = async (buttonId) => {
		// window.history.pushState("", "", "/manufacturing/use_case_stories/" + buttonId);
    setGlobalState("useCase", "uc" + String(buttonId));
    setGlobalState("IsButtonContainer", false);

    if (selectedUseCaseButton === buttonId) {
      setSelectedUseCaseButton(null);
      setShowDataCard(false);
      setStartUC(false);
      return;
    }

    try {
      setSelectedUseCaseButton(buttonId);
      if (!showUC) {
        setShowDataCard(false);
      } else {
        const ucid = "uc" + String(buttonId);
        setUseCaseID(buttonId);
        setUc(ucid);
        setStartUC(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return;
  };

  const useCaseSectionData = useMemo(() => {
    if (props.sectionData.length > 12) {
      setContentOverflow(true);
    }
    let filteredArr;
    if (currentPage) {
      filteredArr = props.sectionData.slice(currentPage * 6, 12 + (currentPage * 6));
    } else {
      filteredArr = props.sectionData.slice(0, 12);
    }
    return filteredArr;
  }, [currentPage]);

	return (
    <div className="wrapper popup-wrapper">
      {startUC && (
        <UseCase
          steps={ucData[uc]}
          useCaseID={useCaseID}
          uc={uc}
          setStartUC={setStartUC}
        />
      )}
      <div style={{ display: "flex" }}>
        <div className="popuptoolbar-container" style={{right:currentPage >= 1 || useCaseSectionData?.length == 12 && contentOverflow  ? '45px' : '0px'}}>
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
					
											{useCaseSectionData && useCaseSectionData.map((element) => {
													return isButtonContainer ? (
														<MenuItem  onClick={()=>{
														props.handleMenuItemClick();
														handleUseCaseButtonClick(element.use_case_id)}}>
															{element.short_label}
														</MenuItem>)
														: ""
											})}
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper>
        </div>
          <div className="popupArrow">
          {currentPage >= 1 && <div
              className="page-up"
              onClick={() => {
                setCurrentPage((index) => index - 1);
                setIsHoverUp(false);
              }}
            >
              <img
                onMouseEnter={() => setIsHoverUp(true)}
                onMouseLeave={() => setIsHoverUp(false)}
                width="40px"
                height={"40px"}
                src={isHoverUp ? UpArrowHover : UpArrow}
              />
            </div>
              }
           {useCaseSectionData?.length == 12 && contentOverflow &&  <div
              className="page-down"
              onClick={() => {
                setCurrentPage((index) => index + 1);
                setIsHoverDown(false);
              }}
            >
              <img
                onMouseEnter={() => setIsHoverDown(true)}
                onMouseLeave={() => setIsHoverDown(false)}
                width="40px"
                height={"40px"}
                src={isHoverDown ? DownArrowHover : DownArrow}
              />
            </div>
						}
          </div>
      </div>
    </div>
  );
};

export default UseCasePopupToolbar;
