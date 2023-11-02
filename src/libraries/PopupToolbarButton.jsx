import React from "react";
import PropTypes from "prop-types";
import "../css/popuptoolbar.css";

const PopupToolbarButton = ({
  buttonId,
  selectedButton,
  handleButtonClick,
  children,
  buttonType,
}) => {
  const handleClick = () => {
    handleButtonClick(buttonId);
  };
  const buttonText = children.split(" ");
  var str1 = "";
  var str2 = "";
  var startIdx = 1;
  for (let x = 0; x < buttonText.length / 2; x++) {
    str1 += buttonText[x];
    str1 += " ";
    startIdx = x + 1;
  }
  for (let x = startIdx; x < buttonText.length; x++) {
    str2 += buttonText[x];
    str2 += " ";
    startIdx = x;
  }
  return (
    <div className="ButtonContainer">
      {buttonType == "D" ? (
        <button
          className={`ButtonList popuptoolbar-button ${
            selectedButton === buttonId ? "selected" : ""
          }`}
          onClick={handleClick}
          id={buttonId}
        >
          {str1}
          <br></br>
          {str2}
        </button>
      ) : (
        <button
          className={`ButtonList popuptoolbar-button ${
            selectedButton === buttonId ? "selected" : ""
          }`}
          onClick={handleClick}
          id={buttonId}
        >
          {children}
        </button>
      )}
    </div>
  );
};

PopupToolbarButton.propTypes = {
  buttonId: PropTypes.string.isRequired,
  selectedButton: PropTypes.string,
  handleButtonClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default PopupToolbarButton;
