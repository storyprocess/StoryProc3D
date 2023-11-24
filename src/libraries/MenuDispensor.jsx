import React, { useState } from "react";
import CardContainer from "./CardContainer";
import PopupToolbar from "./PopupToolbar";
import "../css/cardcontainer.css";
import "../css/popuptoolbar.css";
import UseCasePopupToolbar from "./UseCasePopupToolbar";

function MenuDispensor(props) {
  return (
    <div>
      {props.ui_element === "cards" && (
        <div className="cardcontainer">
          <CardContainer
					 sectionData={props.sectionData}
					 useCaseMapping={props.useCaseMapping}
           alignItems={props.alignItems}
					/>
        </div>
      )}
      {props.ui_element === "popuptoolbar" && (
        <div className="popuptoolbar">
          {props.buttonType == "Use_case" ? (
            <UseCasePopupToolbar
              buttonType={props.buttonType}
              sectionData={props.sectionData}
              anchorEl = {props.anchorEl}
							handleClose = {props.handleClose}
							handleMenuItemClick = {props.handleMenuItemClick}
							open = {props.open}
            />
          ) : (
            <PopupToolbar
              buttonType={props.buttonType}
              sectionData={props.sectionData}
							buttonId = {props.buttonId}
							anchorEl = {props.anchorEl}
							handleClose = {props.handleClose}
							handleMenuItemClick = {props.handleMenuItemClick}
							open = {props.open}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default MenuDispensor;
