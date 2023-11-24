import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../css/ReactResponsiveCarousel.css";
import { useGlobalState } from "../state";
import { SourceDb, assetsLocation } from "../assets/assetsLocation";
import FullScreenIcon from "../assets/full-screen-icon-11806.png"
import Tree from "../assets/tree-736885_1920.jpg"
const Card = ({ item, index }) => {
  const [applicationDB, setApplicationDB] = useGlobalState("ApplicationDB");

  function isImage(url) {
    return /\.(jpg|JPG|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }
  return (
    <div data-interval={2000} className="CardContainer">
      {isImage(item.graphic) ? (
        <div >
          <img
            alt="test"
            src={`${assetsLocation}${applicationDB}/graphics/${item.graphic}`}
          />
        </div>
      ) : (
        <div>
          <video
           autoPlay={isImage(item.graphic) ? false : true}
           preload="auto" 
           id="mf-video"
           muted
           controls
            style={{ width: "100%", verticalAlign: "bottom" }}
          >
            <source
              src={`${assetsLocation}${applicationDB}/graphics/${item.graphic}`}
              type="video/mp4"
            />
          </video>
        </div>
      )}
    </div>
  );
};

const ReactResponsiveCarousel = ({ solutionGraphicsData }) => {
  const [isAutoPlay, setIsAutoPlay] = useGlobalState("IsAutoPlay");
  const [applicationDB, setApplicationDB] = useGlobalState("ApplicationDB");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imagePosition, setImagePosition] = useState(0);
  const handleFullScreen=()=>{
    console.log("callllllllllll");
  }
  document.onkeydown = function(evt) {
    console.log();
    if(evt.keyCode == 27){
      setIsFullScreen(false)
    }
}
// console.log("solutionGraphicsData",solutionGraphicsData);
  return (
    <>
      {/* {isFullScreen && <img className="full-screen-img" src={Tree}/>} */}
      {isFullScreen && <img className="full-screen-img" src={`${assetsLocation}${applicationDB}/graphics/${solutionGraphicsData[imagePosition].graphic}`}/>}
    <div className="CarouselContainer">
      <div className="full-screen" onClick={()=>setIsFullScreen(true)}><img width={"20px"} height={"20px"} src={FullScreenIcon}/></div>
      <Carousel
        width="auto"
        dynamicHeight={false}
        autoPlay={isAutoPlay}
        stopOnHover
        swipeable
        infiniteLoop
        showIndicators={false}
        emulateTouch
        showArrows={false}
        showThumbs={false}
        showStatus={false}
        selectedItem={0}
        onChange={(e)=>setImagePosition(e)}
      >
        {solutionGraphicsData &&
          solutionGraphicsData.map((item, index) => {
            return(
              <Card key={item.order_seq} item={item} index={index} />
              )
})}
      </Carousel>
    </div>
    </>
  );
};
export default ReactResponsiveCarousel;
