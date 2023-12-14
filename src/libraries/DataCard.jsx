import React, { useEffect, useState } from "react";
import "../css/DataCard.css";
import ReactResponsiveCarousel from "./ReactResponsiveCarousel";
import LeftArrow from "../assets/Group 31.png";
import LeftArrowHover from "../assets/Group 108.png";
import RightArrowHover from "../assets/Group 117.png";
import RightArrow from "../assets/Group 107.png";
import { QRCodeCanvas } from "qrcode.react";
import { useGlobalState } from "../state";
import { BaseAPI, carouselType} from "../assets/assetsLocation";
import ReactAwesomeCarousel from "./ReactAwesomeCarousel";

const DataCard = ({ data, onClose, handlePreButton, handleNexButton }) => {
  const [solutionGraphicsData, setSolutionGraphicsData] = useState();
  const [isHoverRight, setIsHoverRight] = useState();
  const [isHoverLeft, setIsHoverLeft] = useState();
  const [applicationDB, setApplicationDB] = useGlobalState("ApplicationDB");
  const [numGraphics, setNumGraphics] = useState(0);
  // console.log("data",data);
  useEffect(() => {
    setSolutionGraphicsData();
    fatchSolutionGraphicsData();
  }, [data.id]);
  const fatchSolutionGraphicsData = async () => {
    try {
      
      const baseAPIUrl = `${BaseAPI}solution_graphics?id=${data.id}&db=${applicationDB}`;
      const address = baseAPIUrl; //address for fetching sectiondata
      const response = await fetch(address); //fetch section data files for specific config id
      const responseData = await response.json();
      let SolutionGraphics = responseData.SolutionGraphics.filter((item) => {
        if (item.solution_id == data.id) {
          return item;
        }
      });
			// console.log(SolutionGraphics);
			setNumGraphics(SolutionGraphics.length);
      setSolutionGraphicsData(SolutionGraphics);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const DynamicCarousel=()=>{
    switch(carouselType) {
      case "1":
        return <ReactResponsiveCarousel
        solutionGraphicsData={solutionGraphicsData}
        />
        case "2":
          return <ReactAwesomeCarousel
          solutionGraphicsData={solutionGraphicsData}
          />
        }
  }
  return (
    <div className="rectangle">
      <div className="LeftArrow">
			{numGraphics > 1 && carouselType == "1" ?
            <svg className={isHoverLeft ? "nex-prev-hover" : "nex-prev"} onClick={() => handlePreButton()} onMouseEnter={() => setIsHoverLeft(true)} onMouseLeave={() => setIsHoverLeft(false)} width="6.6vh" height="6.6vh" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="56" height="56" rx="28" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 59 59)" />
            <rect x="1.5" y="1.5" width="59" height="59" rx="29.5" transform="matrix(4.37114e-08 -1 -1 -4.37114e-08 62 62)" stroke="#0B37A4" stroke-opacity="0.6" stroke-width="3"/>
            <path d="M34.2 24.6001L27.8 31.0001L34.2 37.4001" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
            <linearGradient id="paint0_linear_35_413" x1="4.4" y1="14.4" x2="48" y2="20.8" gradientUnits="userSpaceOnUse">
            <stop stop-color="#040C32"/>
            <stop offset="1" stop-color="#040C38" stop-opacity="0.82"/>
            </linearGradient>
            </defs>
            </svg>
        // <img
        //   onMouseEnter={() => setIsHoverLeft(true)}
        //   onMouseLeave={() => setIsHoverLeft(false)}
        //   width="56px"
        //   height={"56px"}
        //   src={isHoverLeft ? LeftArrowHover : LeftArrow}
        //   onClick={() => handlePreButton()}
        // />
				: ""}
      </div>
      <div className="left-section">
        <h2 className="heading">{data.short_label}</h2>
        <hr className="divider" style={{marginTop:'6%'}}/>
        {/* <hr class="card-divider"></hr> */}
        <p className="content">{data?.long_desc}</p>
        <div className="left-image-container">
          <QRCodeCanvas
            className="left-image"
            id="qrCode"
            value={data.details_url}
            bgColor={"#fff"}
            level={"H"}
            style={{width:'1vw',height:'auto'}}
          />
          <p className="scan-content"><a href={data.details_url} target="_blank"> Scan or click for more details</a></p>
        </div>
      </div>
      <div className="right-section">
        <div className="image-container">
          {solutionGraphicsData && solutionGraphicsData.length > 0 ?
            DynamicCarousel()
          //  <ReactResponsiveCarousel
          //   solutionGraphicsData={solutionGraphicsData}
          // />
          //  <ReactAwesomeCarousel
          //   solutionGraphicsData={solutionGraphicsData}
          // />
           : ''}
        </div>
      </div>
      <div className="RightArrow" style={{marginRight:'10%'}}>
				{numGraphics > 1 && carouselType == "1" ?
                <svg className={isHoverRight ? "nex-prev-hover" : "nex-prev"} onMouseEnter={() => setIsHoverRight(true)} onMouseLeave={() => setIsHoverRight(false)} onClick={() => handleNexButton()} width="6.6vh" height="6.6vh" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="61" width="56" height="56" rx="28" transform="rotate(-90 5 61)" />
                <rect x="2.5" y="63.5" width="61" height="61" rx="30.5" transform="rotate(-90 2.5 63.5)" stroke="#0B37A4" stroke-opacity="0.4" stroke-width="5"/>
                <path d="M29.8 26.6001L36.2 33.0001L29.8 39.4001" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                <linearGradient id="paint0_linear_35_410" x1="9.4" y1="75.4" x2="53" y2="81.8" gradientUnits="userSpaceOnUse">
                <stop stop-color="#0B37A4"/>
                <stop offset="1" stop-color="#0B37A4"/>
                </linearGradient>
                </defs>
                </svg>
        // <img
        //   onMouseEnter={() => setIsHoverRight(true)}
        //   onMouseLeave={() => setIsHoverRight(false)}
        //   width="56px"
        //   height={"56px"}
        //   src={isHoverRight ? RightArrowHover : RightArrow}
        //   onClick={() => handleNexButton()}
        // />
				: ""}
      </div>
    </div>
  );
};

export default DataCard;
