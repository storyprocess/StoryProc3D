import React from "react";
import PropTypes from "prop-types";
import "../css/toolbar.css";
import { MainMenuIsButtons } from "../assets/assetsLocation";

const ToolbarButton = ({
  buttonId,
  buttonName,
  selectedButton,
  handleButtonClick,
  handleMenuClick,
  open,
  children,
  id,
  isDisable,
}) => {
  const handleClick = () => {
    
    handleButtonClick(buttonId, buttonName);
  };
  return (
    <>
      {MainMenuIsButtons ? (
        <button
          className={`toolbar-button ${
            selectedButton === buttonId ? "selected" : ""
          }`}
          onClick={(e)=>{handleClick();handleMenuClick(e)}}
          id={buttonId}
          disabled={isDisable}
          // style={{boxShadow:"rgba(0, 0, 0, 0.4) 0px 25px 20px 0px"}}
        >
          {children}
        </button>
      ) : (
       <> <button
          className={`plain-toolbar-button ${
            selectedButton === buttonId ? "plain-button-selected" : ""
          }`}
          aria-controls={open ? 'fade-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(e)=>{handleClick();handleMenuClick(e)}}
          id={buttonId}
          disabled={isDisable}
        >
          {children}
        </button>
</>
      )}
    </>
  );
};

ToolbarButton.propTypes = {
  buttonId: PropTypes.string.isRequired,
  selectedButton: PropTypes.string,
  handleButtonClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default ToolbarButton;
