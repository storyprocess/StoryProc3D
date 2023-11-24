import React, { useMemo, useEffect, useRef, useState } from "react";
import "../css/cardcontainer.css";
import rightArrow from '../assets/chevron-right-double.png'


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
function Card(props) {
  const [transitionValue, setTransitionValue] = useState();
  const [transformValue, setTransformValue] = useState();
  const panelValue = useRef();

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
    setIsOpen(!isOpen);
  };

  return (
    <div id="container">
      <div
        ref={panelValue}
        id="panel"
        onMouseMove={(e) => transformPanel(e)}
        onMouseEnter={() => handleMouseEnter()}
        onMouseLeave={() => handleMouseLeave()}
      >
				<div
					id="panel-container"
					style={{ transition: transitionValue, transform: transformValue,boxShadow:"-30px 30px 35px -10px #00000066" }}
				>
					<div
						className={`card ${
							indexArr.includes(props.index) ? props.alignItems ? "" : "extra-margin-card" : ""
						}`}
					>
						<h2 className="card-heading">{props.heading}</h2>
						<hr className="card-divider" />
						<p className="card-content">{props.content}</p>

						{props.use_case_mapping && 
							<div className="tooltip-container">
								<button onClick={toggleTooltip} className="tooltip-button">
									Achieved Through <img src={rightArrow} alt="Right Arrow" className="right-arrow" />
								</button>
								{isOpen && (
									<div className="tooltip-content" >
										<ul>
											<li>Item 1</li>
											<li>Item 2</li>
											<li>Item 3</li>
										</ul>
									</div>
								)}
								
							</div>
						}
					</div>
				</div>
      </div>
    </div>
  );
}

export default Card;
