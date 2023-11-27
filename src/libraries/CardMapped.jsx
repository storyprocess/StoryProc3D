import React, { useMemo, useEffect, useRef, useState } from "react";
import "../css/cardcontainer.css";
import rightArrow from '../assets/Icon (1).png'
import { BaseAPI, ApplicationDB } from "../assets/assetsLocation";
import { setGlobalState } from "../state";
import { Fade, Menu, MenuItem } from "@mui/material";

const contentArr = [
  {
    title: "Building Insights",
    description:
      "Processing and merging disparate data streams in real-time for live insights at the edge",
  },
  {
    title: "Security & scale",
    description:
      "Security of data and assets while scaling their performance, resiliency, and low latency across the edge estate",
  },
  {
    title: "Building Insights",
    description:
      "Processing and merging disparate data streams in real-time for live insights at the edge",
  },
  {
    title: "Security & scale",
    description:
      "Security of data and assets while scaling their performance, resiliency, and low latency across the edge estate",
  },
  {
    title: "Building Insights",
    description:
      "Processing and merging disparate data streams in real-time for live insights at the edge",
  },
  {
    title: "Security & scale",
    description:
      "Security of data and assets while scaling their performance, resiliency, and low latency across the edge estate",
  },
  {
    title: "Security & scale",
    description:
      "Security of data and assets while scaling their performance, resiliency, and low latency across the edge estate",
  },
  {
    title: "Building Insights",
    description:
      "Processing and merging disparate data streams in real-time for live insights at the edge",
  },
  {
    title: "Security & scale",
    description:
      "Security of data and assets while scaling their performance, resiliency, and low latency across the edge estate",
  },
];
function CardMapped(props) {
  const [transitionValue, setTransitionValue] = useState();
  const [transformValue, setTransformValue] = useState();
  const [linkedData, setLinkedData] = useState(null);
  const panelValue = useRef();
  const [anchorEl, setAnchorEl] = useState(null);

  let mouseX, mouseY;
  let transformAmount = 20;
  const transformPanel = (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;

    const centerX =
      panelValue.current.offsetLeft + panelValue.current.clientWidth / 2;
    const centerY =
      panelValue.current.offsetTop + panelValue.current.clientHeight / 2;

    const percentX = (centerX - mouseX) / (panelValue.current.clientWidth / 2);
    const percentY = -(
      (centerY - mouseY) /
      (panelValue.current.clientHeight / 2)
    );

    setTransformValue(
      "perspective(1000px) rotateY(" +
        percentX * transformAmount +
        "deg) rotateX(" +
        percentY * transformAmount +
        "deg) scale3d(1.1,1.1,1.1)"
    );
  };

  const handleMouseEnter = () => {
    setTimeout(() => {
      setTransitionValue("");
    }, 100);
    setTransitionValue("transform 0.1s");
  };

  const handleMouseLeave = () => {
    setTransitionValue("transform 0.1s scale3d(1,1,1)");

    setTimeout(() => {
      setTransitionValue("");
    }, 100);
    setTransformValue(
      "perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)"
    );
  };
  const [currentPage, setCurrentPage] = useState(0);

  const indexArr = [1, 4];

  const data = useMemo(() => {
    let filteredArr = contentArr.slice(currentPage * 6, 6 * (currentPage + 1));
    return filteredArr;
  }, [currentPage]);

	const [isOpen, setIsOpen] = useState(false);

  const toggleTooltip = () => {
    props.handleUcClick(props.id);
  };

	const fetchData = async () => {
		const address = `${BaseAPI}element_linkages?db=${ApplicationDB}&element_id=${props.id}`;
		const response = await fetch(address); //fetch section data files for specific config id
		const data = await response.json();
		setLinkedData(data);
	}

	useEffect(() => {
		if(props.id != null) fetchData();
	}, [props.id]);

	useEffect(() => {
		if(props.selectedCard == props.id && !isOpen) {
			setIsOpen(true);
		}
		if(props.selectedCard != props.id && isOpen) {
			setIsOpen(false);
		}
	}, [props.selectedCard, linkedData]);
  const open = anchorEl;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    // setSelectedButton("selectedButton")
  };
  const handleMenuItemClick = () => {
    setAnchorEl(null);
    // setSelectedButton("selectedButton")
  };
  return (
    <div id="container" className="big-container">
      <div
        ref={panelValue}
        id="panel"
        // onMouseMove={(e) => transformPanel(e)}
        // onMouseEnter={() => handleMouseEnter()}
        // onMouseLeave={() => handleMouseLeave()}
        // style={{boxShadow:props.index == 0 ? "-30px 30px 35px -10px #00000066" : ""}}
      >
				<div
					id="panel-container"
					style={{ transition: transitionValue, transform: transformValue,boxShadow:"-30px 30px 35px -10px #00000066" }}
				>
					<div
						className={`card big-card ${
							indexArr.includes(props.index) ? props.alignItems ? "" : "extra-margin-card" : ""
						}`}
					>
						<h2 className="card-heading">{props.heading}</h2>
						<hr className="card-divider" />
						<p className="card-content">{props.content}</p>

						<div className="tooltip-container">
							<button onClick={(event)=>{{toggleTooltip();handleClick(event)}}} className="tooltip-button">
              {`Achieved through >`} 
							</button>
						</div>
						{isOpen && linkedData && (
                      <Menu
                      id="fade-menu"
                      MenuListProps={{
                        'aria-labelledby': 'fade-button',
                      }}
                      className="card-mapped-container"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      TransitionComponent={Fade}
                    >
                        {linkedData &&
                          linkedData.element_linkages.map((element) => {
                            return (
                              <MenuItem  onClick={() => {handleMenuItemClick();setGlobalState("HoverUseCaseId",element.linked_id); toggleTooltip();}}>{element.short_label}</MenuItem>
                            )
                          })}
                      </Menu>
							// <div className="tooltip-content" >
							// 	<ul>
							// 		{linkedData.element_linkages.map((element, index) => (
							// 			<li onClick={() => {setGlobalState("HoverUseCaseId",element.linked_id); toggleTooltip();}}>{element.short_label}</li>
							// 		))}
							// 	</ul>
							// </div>
						)}
					</div>
				</div>
      </div>
    </div>
  );
}

export default CardMapped;
