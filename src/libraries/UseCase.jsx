import React, { useState, useEffect } from "react";
import "../css/UseCase.css";
import right from "../assets/rightArrow.png";
import left from "../assets/leftArrow.png";
import { Howl, Howler } from "howler";
import close from "../assets/closeIcon.png";
import { setGlobalState, useGlobalState } from "../state";
import Carousel from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactResponsiveCarousel from "./ReactResponsiveCarousel";
import ucData from "./ucData";
import Close from "../assets/Group 101.png";
import Button from "./Button";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { BaseAPI, ApplicationDB, assetsLocation, carouselType } from "../assets/assetsLocation";
import ReactAwesomeCarousel from "./ReactAwesomeCarousel";

function UseCase(props) {
  const nodeRef = React.useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCTA, setShowCTA] = useState(false);
  const [isCTA, setIsCTA] = useState(true);
  const [ucid, setUcid] = useState(null);
  const [stepData, setStepData] = useState();
  const [ctaData, setCtaData] = useState();
  const [playAndPause, setPlayAndPause] = useGlobalState("playAndPause");
  const [isMuted, setIsMuted] = useGlobalState("IsMuted");
  const [currentSound, setCurrentSound] = useState();
  const [audioClipList, setAudioClipList] = useState();
  const [audioPaths, setAudioPaths] = useState();
  const [solutionGraphicsData, setSolutionGraphicsData] = useState();
	const [audioVO1, setAudioVO1] = useGlobalState("audioVO1");
  const [audioPathVO1, setAudioPathVO1] = useGlobalState("audioPathVO1");
  const [firstVOPlayed, setFirstVOPlayed] = useState(false);

  // EXAMPLE LINKS

  // VO

  // Graphics

  // Handle Value Pillars/Value for manufacturers

  const fetchStepData = async (ucid) => {
    // fetch config files
    const apiurl = `${BaseAPI}use_case_stories/${String(ucid)}?db=${ApplicationDB}`;
    const response = await fetch(apiurl);
    if (!response.ok) {
      throw new Error("Data could not be fetched.");
    } else {
      return response.json();
    }
  };

	// MERGED THIS USE EFFECT BELOW
  // useEffect(() => {
  //   setCurrentStep(1);
	// 	// setAudioClipList(audioClipList[props.useCaseID-1]);
	// 	// console.log(audioClipList);
  // }, [props.useCaseID]);

  useEffect(() => {
		setCurrentStep(1);

    fetchStepData(props.useCaseID).then((res) => {
      const key = "uc" + String(props.useCaseID);
      ucData[key] = res;
			// console.log(res);
      setStepData(ucData[key]);
    });
  }, [props.useCaseID]);

  // Handle CTA
  useEffect(() => {
    if (stepData && stepData[String(currentStep)][0].step_type == "PS") {
      let catArray = [];
      stepData &&
        Object.keys(stepData).length &&
        stepData[String(currentStep)]?.map((obj, index) => {
          if (index > 0) {
            let catObj = {
              id: "",
            };
            catObj.id = obj.short_label.split("-")[0];
            catArray.push(catObj);
          }
        });

      setCtaData(catArray);
    }
  }, [currentStep]);

  useEffect(()=>{
    let graphicData = [];
      stepData &&
      Object.keys(stepData).length &&
      stepData[String(currentStep)]?.map((obj, index) => {
        if (
          stepData &&
          (stepData[String(currentStep)][0].step_type ==
            "DS" ||
            stepData[String(currentStep)][0].step_type ==
              "PS" ||
              stepData[String(currentStep)][0].step_type ==
              "IM")
          ) {
          let graphicObj = {
            graphic: "",
          };
          if (index > 0) {
              graphicObj.graphic =
                obj.short_label.split("-")[1];
              graphicData.push(graphicObj);
          }
        }
      })
      setSolutionGraphicsData(graphicData)
    },[currentStep])

  var cta = 0;
  if (stepData) {
    for (let i = 1; i < Object.keys(stepData).length + 1; i++) {
      if (stepData[String(i)][0].step_type == "PS") {
        cta += 1;
        break;
      }
    }
  }

  // Handle VOs
  let Vosound;

  useEffect(() => {
    const src_url =
      `${assetsLocation}${ApplicationDB}/audio/uc` +
      String(props.useCaseID) +
      "/";
      if (stepData) {
        const audioClips = [];
        const audio_Paths = [];
				audioClips.push(audioVO1[props.useCaseID-1]);
				audio_Paths.push(audioPathVO1[props.useCaseID-1]);

				for (let i = 11; i <= Object.keys(stepData).length * 10; i++) {
					const path = src_url + String(i) + ".mp3";
					try{
							Vosound = new Howl({
									src: path,
									html5: true,
									onpause: false,
									preload:true
							});
							audioClips.push(Vosound);
							audio_Paths.push(path);
					}catch{
							audioClips.push("");
					}
				}
				setAudioClipList(audioClips);
				setAudioPaths(audio_Paths);
    }
    // Howler.stop();
  }, [stepData]);

	const  playFirstVo = () => {
		let idx = 10 * (currentStep - 1);
		if(currentStep == 1 && firstVOPlayed == false && audioVO1 && audioVO1.length > 0 && audioVO1[props.useCaseID-1]) {
			setCurrentSound(audioVO1[props.useCaseID-1]);
			const audioSrc = audioVO1[props.useCaseID-1];
			audioVO1[props.useCaseID-1].load();
			audioVO1[props.useCaseID-1].on("end", function (index) {
				setFirstVOPlayed(true);
			});
			if(audioVO1[props.useCaseID-1]) audioVO1[props.useCaseID-1].play();
		}
	};
  useEffect(() => {
    // executes every time step is changed
    playFirstVo();
  }, [currentStep]);

	useEffect(() => {
    // executes every time step is changed
    let idx = 10 * (currentStep - 1);
		if ((firstVOPlayed === true || currentStep > 1) && audioClipList && audioClipList.length > 0) {
			if(currentStep == 1) idx++;
      playClip(idx);
    }
  }, [currentStep, audioClipList, firstVOPlayed]);

  useEffect(() => {
    if (audioClipList && audioClipList.length > 0) {
        if (
            (stepData && stepData[String(currentStep)][0]?.step_type == "IM") ||
            (stepData && stepData[String(currentStep)][0]?.step_type == "DS") ||
            (stepData && stepData[String(currentStep)][0]?.step_type == "PS")
          ) {
            console.log("setSolutionGraphicsData",solutionGraphicsData);
            // if(solutionGraphicsData){
            //   switch(carouselType) {
            //     case "1":
            //       document.getElementsByClassName("control-prev")[0].click();
            //       case "2":
            //         document.getElementsByClassName("awssld__controls__arrow-left")[0].click();
            //       }
            // }
          }
    }
  }, [currentStep,audioClipList, solutionGraphicsData]);

  function playClip(idx) {
    if (idx >= currentStep * 10) {
      return;
    }
		if(audioClipList == null) return;
		audioClipList[idx].load();
    audioClipList[idx].on("loaderror", function (index) {
    setGlobalState("IsAutoPlay", true);
    });

    audioClipList[idx].on("end", function (index) {
      if (
        (stepData && stepData[String(currentStep)][0]?.step_type == "DS") ||
        (stepData && stepData[String(currentStep)][0]?.step_type == "PS") ||
        (stepData && stepData[String(currentStep)][0]?.step_type == "IM")
      ) {
        let splitString = audioClipList[idx].load()._src.split(
          `uc${String(props.useCaseID)}/`
        );
    
        let splitUid = splitString[1].split(".mp3")[0];
        let voiceID = splitUid.toString().split("");
        if (
          voiceID[1] == (stepData && stepData[String(currentStep)].length - 1)
        ) {
          setGlobalState("IsAutoPlay", true);
        }
        // switch(carouselType) {
        //   case "1":
        //     document.getElementsByClassName("control-next")[0].click();
        //     case "2":
        //       document.getElementsByClassName("awssld__controls__arrow-right")[0].click();
        //     }
      }
      idx++;
      playClip(idx);
    });

    try {
        if (isMuted) {
          setGlobalState("IsAutoPlay", true);
        }else{
					// CURRENT SOUND ONLY USED FOR PLAY PAUSE
            // if(currentSound == audioClipList[idx]){
            // }else if(currentSound){
            //     currentSound.stop();
            //     setCurrentSound();
            // }
            // if(!currentSound){
                if (audioClipList[idx]) {
                    audioClipList[idx].play();
                    setCurrentSound(audioClipList[idx]);
                }
            }
        // }
        
    } catch (error) {
    }
  }

  useEffect(() => {
    if (currentSound) {
      if (playAndPause) {
        currentSound.play();
      } else {
        currentSound.pause();
      }
    }
  }, [playAndPause]);

  useEffect(() => {
    if (showCTA) {
      Howler.stop();
    }
  }, [showCTA]);

  // Handle next/prev buttons (arrows)

  const goToPrevious = () => {
    setSolutionGraphicsData()
    if (!playAndPause) {
        setGlobalState("playAndPause",true)
        }
    Howler.stop();
    let updatedAudios=[...audioClipList];
		if(currentStep == 1) {
			setFirstVOPlayed(false);
			playFirstVo();
			return;
		}
    for (let i = 10 * (currentStep - 1); i < 10 * currentStep; i++) {
			try{
					audioClipList[i].unload();
					updatedAudios[i] = new Howl({
							src: audioPaths[i],
							html5: true,
							onpause: false,
							preload:true
					});
			}catch{
			}
		}
    
		setAudioClipList(updatedAudios);
    setCurrentSound();
    setGlobalState("IsAutoPlay", false);
    const isFirstStep = currentStep === 1;
    // const newStep = isFirstStep ? 1 : currentStep - 1;
    let newStep;
    if (
      !isFirstStep &&
      stepData[String(currentStep - 1)][0]?.step_type == "VP"
    ) {
      newStep = isFirstStep ? 1 : currentStep - 2;
    } else {
      newStep = isFirstStep ? 1 : currentStep - 1;
    }
    if (newStep !== currentStep) {
      // if (sound.playing()){
      //     sound.stop()
      // }
      setCurrentStep(newStep);
    }
  };

  const goToNext = () => {
    setSolutionGraphicsData()
    if (!playAndPause) {
    setGlobalState("playAndPause",true)
    }
    Howler.stop();
    let updatedAudios=[...audioClipList];
    for (let i = 10 * (currentStep - 1); i < 10 * currentStep; i++) {
        try{
            audioClipList[i].unload();
            updatedAudios[i] = new Howl({
                src: audioPaths[i],
                html5: true,
                onpause: false,
                preload:true
            });
        }catch{
        }
      }
			
		if(currentStep == 1) {
			const src_url = `${assetsLocation}${ApplicationDB}/audio/uc`+String(props.useCaseID) +"/10.mp3";
			let updatedAudioVO1=[...audioVO1];
			try{
				audioVO1[props.useCaseID-1].unload();
				updatedAudioVO1[props.useCaseID-1] = new Howl({
						src: audioPathVO1[props.useCaseID-1],
						html5: true,
						onpause: false,
						preload:true
				});
			} catch{
			}
			setAudioVO1(updatedAudioVO1);
			setGlobalState("audioVO1", updatedAudioVO1);
			setFirstVOPlayed(false);
		}
    setAudioClipList(updatedAudios);

    setCurrentSound();
    if (stepData) {
      setGlobalState("IsAutoPlay", false);
      const isLastStep = currentStep === Object.keys(stepData).length;
      let newStep;
      if (
        !isLastStep &&
        stepData[String(currentStep + 1)][0]?.step_type == "VP"
      ) {
        newStep = isLastStep ? Object.keys(stepData).length : currentStep + 2;
      } else {
        newStep = isLastStep ? Object.keys(stepData).length : currentStep + 1;
      }
      if (newStep !== currentStep) {
        // if (sound.playing()){
        //     sound.stop()
        // }
        setCurrentStep(newStep);
      } else if (cta > 0) {
        setShowCTA(true);
      } else {
				onClose();
        stopTour();
      }
    }
  };

  // Function to end tour

  const stopTour = () => {
    for (let i = 0; i < audioClipList.length; i++) {
        try{
            audioClipList[i].unload();
        }catch{
        }
      }
    Howler.stop();
    setGlobalState("showUC", false);
    setGlobalState("selectedButton", null);
   // setGlobalState("dimBg", false);
    setGlobalState("playBgMusic", true);
    props.setStartUC(false);
    setGlobalState("useCase", 0);
    setGlobalState("HoverUseCaseId", 0);
  };
  const onClose = () => {
    props.setStartUC(false);
    setIsCTA(false);
    setShowCTA(false);
    setGlobalState("IsHomeButtonClick",true);
    setGlobalState("useCase", 0);
    setGlobalState("HoverUseCaseId", 0);
    // stopTour()
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
    <>
      {isCTA ? (
        <>
          {!showCTA && (
            <div className="cat-app">
              {stepData && <div className="box-wrap">
                <div className="box-buttons-group">
                  {/* <svg
                    onClick={goToPrevious}
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="leftSvg"
                  >
                    <rect
                      width="30"
                      height="30"
                      rx="8"
                      transform="matrix(-1 0 0 1 30 0)"
                      fill="#192B4E"
                    />
                    <path
                      d="M13.5999 11.8L10.3999 15L13.5999 18.2"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5999 11.8L15.3999 15L18.5999 18.2"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg> */}
                  <svg onClick={goToPrevious} className="leftSvg" width="30" height="30" viewBox="0 0 30 30" fill="#1033A4" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" rx="15" transform="matrix(-1 0 0 1 30 0)" fill="#1033A4" fill-opacity="0.4"/>
<rect x="-0.5" y="0.5" width="29" height="29" rx="14.5" transform="matrix(-1 0 0 1 29 0)" stroke="#FFFFFF" stroke-opacity="0.4"/>
<path d="M13.6004 11.8L10.4004 15L13.6004 18.2" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.6004 11.8L15.4004 15L18.6004 18.2" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                  {currentStep == (stepData && Object.keys(stepData).length) ? <svg onClick={goToNext} className="rightCloseSvg" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" rx="15" fill="#1033A4" fill-opacity="0.4"/>
<rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="white" stroke-opacity="0.4"/>
<path d="M21.5075 8.37791C21.415 8.28521 21.3051 8.21166 21.1841 8.16148C21.0631 8.1113 20.9335 8.08547 20.8025 8.08547C20.6715 8.08547 20.5418 8.1113 20.4209 8.16148C20.2999 8.21166 20.19 8.28521 20.0975 8.37791L15.2075 13.2579L10.3175 8.36791C10.2249 8.27533 10.115 8.20189 9.99404 8.15179C9.87308 8.10168 9.74343 8.07589 9.6125 8.07589C9.48157 8.07589 9.35192 8.10168 9.23095 8.15179C9.10999 8.20189 9.00008 8.27533 8.9075 8.36791C8.81492 8.4605 8.74148 8.57041 8.69137 8.69137C8.64127 8.81233 8.61548 8.94198 8.61548 9.07291C8.61548 9.20384 8.64127 9.33349 8.69137 9.45446C8.74148 9.57542 8.81492 9.68533 8.9075 9.77791L13.7975 14.6679L8.9075 19.5579C8.81492 19.6505 8.74148 19.7604 8.69137 19.8814C8.64127 20.0023 8.61548 20.132 8.61548 20.2629C8.61548 20.3938 8.64127 20.5235 8.69137 20.6445C8.74148 20.7654 8.81492 20.8753 8.9075 20.9679C9.00008 21.0605 9.10999 21.1339 9.23095 21.184C9.35192 21.2341 9.48157 21.2599 9.6125 21.2599C9.74343 21.2599 9.87308 21.2341 9.99404 21.184C10.115 21.1339 10.2249 21.0605 10.3175 20.9679L15.2075 16.0779L20.0975 20.9679C20.1901 21.0605 20.3 21.1339 20.421 21.184C20.5419 21.2341 20.6716 21.2599 20.8025 21.2599C20.9334 21.2599 21.0631 21.2341 21.184 21.184C21.305 21.1339 21.4149 21.0605 21.5075 20.9679C21.6001 20.8753 21.6735 20.7654 21.7236 20.6445C21.7737 20.5235 21.7995 20.3938 21.7995 20.2629C21.7995 20.132 21.7737 20.0023 21.7236 19.8814C21.6735 19.7604 21.6001 19.6505 21.5075 19.5579L16.6175 14.6679L21.5075 9.77791C21.8875 9.39791 21.8875 8.75791 21.5075 8.37791Z" fill="white" fill-opacity="0.8"/>
</svg>:<svg onClick={goToNext} className="blink rightSvg" width="30" height="30" viewBox="0 0 30 30" fill="#1033A4" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" rx="15" fill="#1033A4" fill-opacity="0.4"/>
<rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="#FFFFFF" stroke-opacity="0.4"/>
<path d="M16.3996 11.8L19.5996 15L16.3996 18.2" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.3996 11.8L14.5996 15L11.3996 18.2" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


}
                  {/* <svg
                    
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    
                  >
                    <rect width="30" height="30" rx="8" fill="#192B4E" />
                    <path
                      d="M16.4001 11.8L19.6001 15L16.4001 18.2"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.4001 11.8L14.6001 15L11.4001 18.2"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg> */}
                </div>
                <SwitchTransition mode={"out-in"}>
                  <CSSTransition
                    key={true}
                    nodeRef={nodeRef}
                    addEndListener={(done) => {
                      nodeRef.current.addEventListener(
                        "transitionend",
                        done,
                        false
                      );
                    }}
                    classNames="fade"
                  >
                    <div style={{maxHeight:'500px',overflowY:'auto'}}  ref={nodeRef}>
                      <div className="box-title">
                        {stepData &&
                          stepData[String(currentStep)]?.[0]?.short_label}
                      </div>

                      {/* <div style={{maxHeight:stepData && stepData[String(currentStep + 1)] && stepData[String(currentStep + 1)][0]?.step_type == "VP" ? '300px' : "500px",overflowY:'auto',height:"100%"}} className="box-content"> */}
                      <div style={{height:"100%"}} className="box-content">
                        {stepData &&
                          Object.keys(stepData).length &&
                          stepData[String(currentStep)]?.map((obj, index) => {
                            // if (
                            //   stepData &&
                            //   (stepData[String(currentStep)][0].step_type ==
                            //     "DS" ||
                            //     stepData[String(currentStep)][0].step_type ==
                            //       "PS")
                            // ) {
                            //   let graphicObj = {
                            //     graphic: "",
                            //   };
                            //   if (index > 0) {
                            //       graphicObj.graphic =
                            //         obj.short_label.split("-")[1];
                            //       graphicData.push(graphicObj);
                            //   }
                            // }
                            return (
                                index > 0 ? (
                                  <div key={index}>
                                    <div className="content-title">
                                      {stepData &&
                                      (stepData[String(currentStep)][0]
                                        .step_type == "DS" ||
                                        stepData[String(currentStep)][0]
                                          .step_type == "PS" ||
                                          stepData[String(currentStep)][0]
                                            .step_type == "IM")
                                        ? obj.short_label.split("-")[2]
                                        : obj.short_label}
                                    </div>
                                    {obj.long_desc && obj.long_desc.length > 0 && <div className="content-description">
                                      {obj.long_desc}
                                    </div>}
                                  </div>
                                ) : (
                                  ""
                                )
                            );
                          })}
                      </div>
                      {stepData &&
                        stepData[String(currentStep)][0].step_type == "DS" && (
                          <>
                            {" "}
                            <hr className="value-line"></hr>
                            <div className="value-box-title">
                              {stepData &&
                                stepData[String(currentStep + 1)]?.[0]
                                  ?.short_label}
                            </div>
                            <div className="box-content-vp">
                            <div className="content-description-vp" style={{marginTop:'0px', marginBottom:'0px'}}>
                              {stepData &&
                                stepData[String(currentStep + 1)]?.map(
                                  (obj, index) => {
                                    return (
                                        index > 0 ? (
                                          <div key={index} style={{paddingBottom: '.8vh'}}>
                                            
                                              {obj.short_label}
                                            
                                          </div>
                                          
                                        ) : (
                                          ""
                                        )
                                    );
                                  }
                                )}
                            </div>
                            </div>                          </>
                        )}
                    </div>
                  </CSSTransition>
                </SwitchTransition>
              </div>}
            </div>
          )}
          {showCTA && (
            <div className="CTA-Container">
              <div className="CTA-Card-Container">
                <div className="CTA-Title">Learn More</div>
                <div className="CTA-ButtonContainer">
                  {ctaData &&
                    ctaData.length > 0 &&
                    ctaData.map((item, index) => (
                      <div key={index} style={{ width: "50%" }}>
                        <Button id={item.id} />
                      </div>
                    ))}
                </div>
                <img style={{position:'absolute',top:'10%',right:'5%'}} src={Close} onClick={() => onClose()} />
              </div>
              <div className="CTA-cross-btn">
              </div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
      {stepData &&
        (stepData[String(currentStep)][0].step_type == "DS" ||
          stepData[String(currentStep)][0].step_type == "PS" ||
          stepData[String(currentStep)][0].step_type == "IM") && (
          <div className="left-container">
            {solutionGraphicsData && solutionGraphicsData.length > 0 ?
            DynamicCarousel()
            //  <ReactResponsiveCarousel solutionGraphicsData={solutionGraphicsData} />
            //  <ReactAwesomeCarousel solutionGraphicsData={solutionGraphicsData} />
              : ''}
          </div>
        )}
    </>

    // {showVP && <ValuePillars />}
  );
}

export default UseCase;
