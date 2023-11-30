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
        <img
          onMouseEnter={() => setIsHoverLeft(true)}
          onMouseLeave={() => setIsHoverLeft(false)}
          width="56px"
          height={"56px"}
          src={isHoverLeft ? LeftArrowHover : LeftArrow}
          onClick={() => handlePreButton()}
        />
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
            style={{width:'30%',height:'auto'}}
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
        <img
          onMouseEnter={() => setIsHoverRight(true)}
          onMouseLeave={() => setIsHoverRight(false)}
          width="56px"
          height={"56px"}
          src={isHoverRight ? RightArrowHover : RightArrow}
          onClick={() => handleNexButton()}
        />
				: ""}
      </div>
    </div>
  );
};

export default DataCard;
