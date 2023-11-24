import React, { useEffect, useState } from "react";
import styles from "../styles/Spinner.module.css";
import dellLogo from "../assets/DellTech_Logo_Prm_Wht_rgb.png";
// import BGLogo from "../assets/background.png";
import BGLogo from "../assets/Screenshot_34.png";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useGlobalState } from "../state";

const Spinner = ({isWelcome}) => {
  const [titleOne, setTitleOne] = useState([
    "Dell Edge Virtual Experience Center for Manufacturing",
    "Dell Edge Virtual Experience Center for Manufacturing",
    "Dell Edge Virtual Experience Center for Manufacturing",
    "Dell Edge Virtual Experience Center for Manufacturing",
    "If you’re new here, we recommend you start with a guided tour of the virtual facility",
    "Dell Edge Virtual Experience Center for Manufacturing",
    "Explore how Dell’s portfolio of edge offerings helps manufacturers",
    "Explore how Dell’s portfolio of edge offerings helps manufacturers",
    "Explore how Dell’s portfolio of edge offerings helps manufacturers",
    "Explore how Dell’s portfolio of edge offerings helps manufacturers",
    "If you’re new here, we recommend you start with a guided tour of the virtual facility",
    "Dell Edge Virtual Experience Center for Manufacturing",
    "Explore how Dell’s portfolio of edge offerings helps manufacturers",
    "If you’re new here, we recommend you start with a guided tour of the virtual facility",
    "If you’re new here, we recommend you start with a guided tour of the virtual facility",
    "Dell Edge Virtual Experience Center for Manufacturing",
    "If you’re new here, we recommend you start with a guided tour of the virtual facility",
    "Dell Edge Virtual Experience Center for Manufacturing",
    "If you’re new here, we recommend you start with a guided tour of the virtual facility",
    "Explore How Dell’s portfolio of edge offerings helps manufacturers",
    "If you’re new here, we recommend you start with a guided tour of the virtual facility",
    "Explore How Dell’s portfolio of edge offerings helps manufacturers",
    "If you’re new here, we recommend you start with a guided tour of the virtual facility",
    "Explore How Dell’s portfolio of edge offerings helps manufacturers",
  ]);
  const [titleTwo, setTitleTwo] = useState([
    "Welcome",
    "Setting up the experience…",
    "Setting up the cameras…",
    "Loading animations…",
    "Setting up the immersive experience…",
    "Preparing the guided tour…",
    "Loading animations…",
    "Setting up the immersive experience…",
    "Preparing the guided tour…",
    "Firing up the servers and devices…",
    "Preparing edge use case hotspots…",
    "Reading solution data…",
    "Reading partner solutions data…",
    "Loading the guided tour…",
    "Loading the guided tour…",
    "Setting up the experience…",
    "",
    "The robots are taking time…",
    "",
    "Loading animations…",
    "",
    "Setting up the immersive experience…",
    "",
    "Preparing the guided tour…",
  ]);
  const [progressbar, setProgressbar] = useState(10);
  const [count, setCount] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useGlobalState("IsModelLoaded");

  useEffect(() => {
    if(progressbar < 94){
      const interval = setInterval(() => {
        setProgressbar(progressbar + 10);
        setCount(count + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [progressbar]);

  return (
    <div className={styles.wrapper}>
    {isModelLoaded ? <img src={BGLogo} style={{ objectFit: "contain",width:'100%',position:"absolute",bottom:'4%' }}  /> : ''}
    {/* filter: isModelLoaded ? "blur(5px)" : "blur(0px)",  */}
    <div className={styles.loaderContainer}>
      {/* <div className={styles.loadingTitle}>
        <div>{titleOne[count]}</div>
        <div className={styles.titleTwo}>{titleTwo[count]}</div>
      </div> */}
     {/* {isModelLoaded ? <img className={styles.welcome_dell_logo} width={"45%"} src={dellLogo} /> : ''} */}
    {isWelcome == false ?   <div
        className={styles.progressbar}
        style={{ width: "4%", height: "4%" }}
      >
        <CircularProgressbar value={progressbar}  />
      </div> : ""}
    </div>
  </div>
  );
};

export default Spinner;
