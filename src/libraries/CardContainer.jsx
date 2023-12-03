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
            <img
              onMouseEnter={() => setIsHoverUp(true)}
              onMouseLeave={() => setIsHoverUp(false)}
              width="40px"
              height={"40px"}
              src={isHoverUp ? UpArrowHover : UpArrow}
            />

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
            <img
              onMouseEnter={() => setIsHoverDown(true)}
              onMouseLeave={() => setIsHoverDown(false)}
              width="40px"
              height={"40px"}
              src={isHoverDown ? DownArrowHover : DownArrow}
            />

          </div>
        )}
      </div>
    </div>
  );
}

export default CardContainer;
