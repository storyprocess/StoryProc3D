import React, { useState } from 'react';
import './TooltipMenu.css'; // Import your CSS file
import rightArrow from '../assets/chevron-right-double.png'

function TooltipMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTooltip = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="tooltip-container">
      <button onClick={toggleTooltip} className="tooltip-button">
        Achieved Through <img src={rightArrow} alt="Right Arrow" className="right-arrow" />
      </button>
      {isOpen && (
        <div className="tooltip-content">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default TooltipMenu;
