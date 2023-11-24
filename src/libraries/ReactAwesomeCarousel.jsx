import React from "react";
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import "react-awesome-slider/dist/styles.css";
import "../css/ReactResponsiveCarousel.css";
import { useGlobalState } from "../state";
import { SourceDb, assetsLocation } from "../assets/assetsLocation";


const ReactAwesomeCarousel = ({ solutionGraphicsData }) => {
  const [isAutoPlay, setIsAutoPlay] = useGlobalState("IsAutoPlay");
  const [applicationDB, setApplicationDB] = useGlobalState("ApplicationDB");
  const AutoplaySlider = withAutoplay(AwesomeSlider);
  // console.log("solutionGraphicsData",solutionGraphicsData);
  return (
    <div className="CarouselContainer" style={{ width: "100%" }}>
      <AutoplaySlider  play={isAutoPlay} interval={2000} animation="foldOutAnimation" >
        {solutionGraphicsData &&
          solutionGraphicsData.map((item, index) => {
            return (
            //   <div data-src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" />
              <div data-src={`${assetsLocation}${applicationDB}/graphics/${item.graphic}`} />
            );
          })}
      </AutoplaySlider>
    </div>
  );
};
export default ReactAwesomeCarousel;
