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
import Close from "../assets/Close.png";
import Button from "./Button";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { BaseAPI, SourceDb, assetsLocation } from "../assets/assetsLocation";
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
  let carousel = "1"

  // EXAMPLE LINKS

  // VO

  // Graphics

  // Handle Value Pillars/Value for manufacturers

  const fetchStepData = async (ucid) => {
    // fetch config files
    const apiurl = `${BaseAPI}use_case_stories/${String(ucid)}?db=${SourceDb}`;
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
              "PS")
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
      `${assetsLocation}${SourceDb}/audio/uc` +
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
            (stepData && stepData[String(currentStep)][0]?.step_type == "DS") ||
            (stepData && stepData[String(currentStep)][0]?.step_type == "PS")
          ) {
            console.log("setSolutionGraphicsData",solutionGraphicsData);
            console.log("carousel",carousel);
            // if(solutionGraphicsData){
            //   switch(carousel) {
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
        (stepData && stepData[String(currentStep)][0]?.step_type == "PS")
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
        // switch(carousel) {
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
			const src_url = `${assetsLocation}${SourceDb}/audio/uc`+String(props.useCaseID) +"/10.mp3";
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
    setGlobalState("dimBg", false);
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
    switch(carousel) {
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
                  <svg onClick={goToPrevious} className="leftSvg" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" rx="15" transform="matrix(-1 0 0 1 30 0)" fill="#1033A4" fill-opacity="0.4"/>
<rect x="-0.5" y="0.5" width="29" height="29" rx="14.5" transform="matrix(-1 0 0 1 29 0)" stroke="white" stroke-opacity="0.4"/>
<path d="M13.6004 11.8L10.4004 15L13.6004 18.2" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.6004 11.8L15.4004 15L18.6004 18.2" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                  <svg onClick={goToNext} className="blink" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="30" height="30" rx="15" fill="#1033A4" fill-opacity="0.4"/>
<rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="white" stroke-opacity="0.4"/>
<path d="M16.3996 11.8L19.5996 15L16.3996 18.2" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.3996 11.8L14.5996 15L11.3996 18.2" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

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
                    <div style={{height:"80%"}}  ref={nodeRef}>
                      <div className="box-title">
                        {stepData &&
                          stepData[String(currentStep)]?.[0]?.short_label}
                      </div>

                      <div style={{maxHeight:stepData && stepData[String(currentStep + 1)] && stepData[String(currentStep + 1)][0]?.step_type == "VP" ? '300px' : "500px",overflowY:'auto',height:"100%"}} className="box-content">
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
                                          .step_type == "PS")
                                        ? obj.short_label.split("-")[2]
                                        : obj.short_label}
                                    </div>
                                    <div className="content-description">
                                      {obj.long_desc}
                                    </div>
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
                            <div className="box-content">
                              {stepData &&
                                stepData[String(currentStep + 1)]?.map(
                                  (obj, index) => {
                                    return (
                                        index > 0 ? (
                                          <div key={index}>
                                            <div className="content-title">
                                              {obj.short_label}
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )
                                    );
                                  }
                                )}
                            </div>
                          </>
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
              </div>
              <div className="CTA-cross-btn">
                <img src={Close} onClick={() => onClose()} />
              </div>
            </div>
          )}
        </>
      ) : (
        ""
      )}
      {stepData &&
        (stepData[String(currentStep)][0].step_type == "DS" ||
          stepData[String(currentStep)][0].step_type == "PS") && (
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
