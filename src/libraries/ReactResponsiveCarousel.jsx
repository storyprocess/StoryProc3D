import React, { useEffect, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../css/ReactResponsiveCarousel.css";
import { useGlobalState } from "../state";
import { StoryProc3D, assetsLocation } from "../assets/assetsLocation";

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
// console.log("solutionGraphicsData",solutionGraphicsData);
  return (
    <div className="CarouselContainer">
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
      >
        {solutionGraphicsData &&
          solutionGraphicsData.map((item, index) => {
            return(
              <Card key={item.order_seq} item={item} index={index} />
              )
})}
      </Carousel>
    </div>
  );
};
export default ReactResponsiveCarousel;
