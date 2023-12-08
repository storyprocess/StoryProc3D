import React, { useMemo, useState } from "react";
import Card from "./Card";
// import MyFirstLib from "storyproc-libs/src"
import CardMapped from "./CardMapped";
import "../css/cardcontainer.css";
import { useEffect } from "react";
import { setGlobalState, useGlobalState } from "../state";
import DownArrowHover from "../assets/Group 110.png";
import UpArrowHover from "../assets/Group 111.png";
import DownArrow from "../assets/Group 112.png";
import UpArrow from "../assets/Group 113.png";
function CardContainer(props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isHoverUp, setIsHoverUp] = useState(false);
  const [isHoverDown, setIsHoverDown] = useState(false);
  const [contentOverflow, setContentOverflow] = useState(false);
	const [selectedCard, setSelectedCard] = useGlobalState("mapped_use_case");

  const data = useMemo(() => {
    if (props.sectionData.length>6){
      setContentOverflow(true);
    }
    let filteredArr = props.sectionData.slice(
        currentPage * 3,
        6 * (currentPage + 1)
      );
    return filteredArr;
  }, [currentPage, props.sectionData]);

	const handleUcClick = ((id, play) => {
		if(play == true)
		{
			props.handlePlayStory();
			setGlobalState("IsBackgroundBlur", false);
			return;
		}
		if(selectedCard == id) {
			setSelectedCard(null);
		}
		else {
			setSelectedCard(id);
		}
	});
  useEffect(()=>{
    if (props.useCaseMapping) {
      setCurrentPage(0)
      setContentOverflow(false)
    }
  },[props.useCaseMapping])
  return (
    <div style={{ display: "flex", width: "100%", justifyContent: "center" ,zIndex:3}}>
			{/* <MyFirstLib /> */}
      <div>
			{props.useCaseMapping ?
        <div className="row">
          {data?.slice(0, 3).map((element, index) => (
            <CardMapped
              key={element.seq}
							id={element.seq}
              heading={element.short_label}
              content={element.long_desc}
              index={index}
							selectedCard={selectedCard}
							handleUcClick={handleUcClick}
							alignItems={props.alignItems}
            />
          ))}
        </div>
				:
				<div className="row">
          {data?.slice(0, 3).map((element, index) => (
            <Card
              key={element.seq}
              heading={element.short_label}
              content={element.long_desc}
              index={index}
							alignItems={props.alignItems}

            />
          ))}
        </div>
			}
			{props.useCaseMapping ?
        <div className="row" style={{ marginTop: "0.5%" }}>
          {data?.slice(3).map((element, index) => (
            <CardMapped
              key={element.seq}
							id={element.seq}
              heading={element.short_label}
              content={element.long_desc}
              index={index}
							selectedCard={selectedCard}
							alignItems={props.alignItems}
							handleUcClick={handleUcClick}
							handlePlayStory={props.handlePlayStory}
            />
          ))}
        </div>
				:
				<div className="row" style={{ marginTop: "0.5%" }}>
          {data?.slice(3).map((element, index) => (
            <Card
              key={element.seq}
              heading={element.short_label}
              content={element.long_desc}
              index={index}
							alignItems={props.alignItems}

            />
          ))}
        </div>
			}
      </div>

      <div className="pagination-button">
        {currentPage >= 1 && (
          <div
            className="page-up blink"
            onClick={() => {
              setCurrentPage((index) => index - 1);
              setIsHoverUp(false);
            }}
          >
                        <svg className={isHoverUp ? "nex-prev-hover" : "nex-prev"} onMouseEnter={() => setIsHoverUp(true)} onMouseLeave={() => setIsHoverUp(false)}  width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="37.9999" y="38" width="36" height="36" rx="18" transform="rotate(-180 37.9999 38)" />
<rect x="38.8999" y="38.9" width="37.8" height="37.8" rx="18.9" transform="rotate(-180 38.8999 38.9)" stroke="#0B37A4" stroke-opacity="0.6" stroke-width="1.8"/>
<path d="M15.885 22.0569L19.9993 17.9426L24.1136 22.0569" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_488_1431" x1="40.8284" y1="47.2571" x2="68.857" y2="51.3714" gradientUnits="userSpaceOnUse">
<stop stop-color="#040C32"/>
<stop offset="1" stop-color="#040C38" stop-opacity="0.82"/>
</linearGradient>
</defs>
</svg>
            {/* <img
              onMouseEnter={() => setIsHoverUp(true)}
              onMouseLeave={() => setIsHoverUp(false)}
              width="40px"
              height={"40px"}
              src={isHoverUp ? UpArrowHover : UpArrow}
            /> */}

          </div>
        )}
        {data?.length == 6 && contentOverflow && (
          <div
            className="page-down blink"
            onClick={() => {
              setCurrentPage((index) => index + 1);
              setIsHoverDown(false);
            }}
          >
                        <svg className={isHoverDown ? "nex-prev-hover" : "nex-prev"} onMouseEnter={() => setIsHoverDown(true)} onMouseLeave={() => setIsHoverDown(false)} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="36" height="36" rx="18" transform="matrix(-1 8.74228e-08 8.74228e-08 1 37.9999 2)" />
<rect x="0.9" y="-0.9" width="37.8" height="37.8" rx="18.9" transform="matrix(-1 8.74228e-08 8.74228e-08 1 39.7999 2)" stroke="#0B37A4" stroke-opacity="0.6" stroke-width="1.8"/>
<path d="M15.885 17.9431L19.9993 22.0574L24.1136 17.9431" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_488_1428" x1="2.82857" y1="9.25714" x2="30.8571" y2="13.3714" gradientUnits="userSpaceOnUse">
<stop stop-color="#040C32"/>
<stop offset="1" stop-color="#040C38" stop-opacity="0.82"/>
</linearGradient>
</defs>
</svg>
            {/* <img
              onMouseEnter={() => setIsHoverDown(true)}
              onMouseLeave={() => setIsHoverDown(false)}
              width="40px"
              height={"40px"}
              src={isHoverDown ? DownArrowHover : DownArrow}
            /> */}

          </div>
        )}
      </div>
    </div>
  );
}

export default CardContainer;
