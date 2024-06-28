import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ToolbarButton from "../utils/libraries/ToolbarButton";
import MenuDispensor from "../utils/libraries/MenuDispensor";
import { spiralAnimation, rotateToTarget, linearAnimation } from '../utils/libraries/CameraUtils';
import { useParams, useNavigate } from "react-router-dom";
import { setGlobalState, useGlobalState } from "../utils/state";
import usecases from '../data/usecases.json';
import uctradeshow from '../data/tradeshow.json';
import { InitializeGoogleAnalytics, TrackGoogleAnalyticsTiming } from '../utils/libraries/googleanalytics.tsx';
import {
  Vector3,
  SceneLoader,
  Viewport,
  ArcRotateCamera,
  Texture,
  Matrix
} from '@babylonjs/core';
import {
  mainModel,
  Marker,
  tradeshow
} from '../models';
import { gsap } from 'gsap';
import { Howler, Howl } from "howler";
import "../utils/css/mainPage.css";
import {
  BaseAPI,
  MainMenuIsButtons,
  ApplicationDB,
  assetsLocation,
  packageApp
} from "../assets/assetsLocation";
import { setTourState } from "../hooks/animations";
import { startTransition } from "react";
import { CSSTransition } from "react-transition-group";
import { resetLights } from "../utils/libraries/LightUtils";

const MainPage = (props) => {
  const location = useLocation();
  const buttonRef = useRef(null);
  const { toPress, loadID } = useParams();
  const [extraData, setExtraData] = useState(props.extraData);
  const [selectedButton, setSelectedButton] = useGlobalState("selectedButton");
  const [showCardContainer, setShowCardContainer] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [currentZoomedSection, setCurrentZoomedSection] = useGlobalState("currentZoomedSection");
  const [ui_Element, setUI_Element] = useState(null);
  var guidedTourOpen = false;
  const [IsGuidedTourOpen, setGuidedTourOpen] = useState(false);
  const [uCTourId, setUCTourId] = useGlobalState('UCTourId');
  const [UcGuidedTour, setUcGuidedTour] = useGlobalState("UcGuidedTour");
  const [currentSound, setCurrentSound] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  var company = queryParams.get('company');
  var client = queryParams.get('client');
  var presenter = queryParams.get('presenter');
  const [buttonType, setButtonType] = useState("");
  const [showUC, setShowUC] = useGlobalState("showUC");
  const [useCase, setUseCase] = useGlobalState("useCase");

  const [isResetClick, setIsResetClick] = useState(false);
  const [useCaseMapping, setUseCaseMapping] = useState(false);
  const [HoverId, setHoverId] = useGlobalState("HoverId");
  const [HoverLabel, setHoverLabel] = useGlobalState("HoverLabel");
  const [clientXPosition1, setClientXPosition1] = useGlobalState("clientXPosition1");
  const [clientYPosition1, setClientYPosition1] = useGlobalState("clientYPosition1");
  const [isTourOpen, setIsTourOpen] = useGlobalState("IsTourOpen");
  const [isHomeButtonClick, setIsHomeButtonClick] =
    useGlobalState("IsHomeButtonClick");
  const [playAndPause, setPlayAndPause] = useGlobalState("playAndPause");
  const [anchorEl, setAnchorEl] = useState(null);
  const [linkType, setLinkType] = useState(null);
  const [scene, setScene] = useGlobalState("scene");
  const [count, setCount] = useState(0);

  let alignItems = false;

  const open = anchorEl;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedButton("selectedButton")
  };
  const handleMenuItemClick = () => {
    setAnchorEl(null);
  };
  const links = new Map([
    ["needs", "btnBusinessNeeds"],
    ["principles", "btnGuidingPrinciples"],
    ["challenges", "btnSalesChallenges"],
    ["solutions", "btnStoryProcSolutions"],
    ["use_case_stories", "btnUseCasesEnabled"]
  ]);

  // Set screen to initial state
  const resetScreen = () => {
    resetLights(scene);
    if (ui_Element == "welcome") {
      setUI_Element("");
    }
    setGlobalState("IsBackgroundBlur", false);
    setTourState(false);
    setSelectedButton(null);
    setShowCardContainer(false);
    setGlobalState("useCase", 0);
    setGlobalState("solutionsId", -1);
    setGlobalState("HoverUseCaseId", 0);
    setShowUC(false);
    setGlobalState("showDC", false);
    setGlobalState("showUC", false);
    Howler.stop();
  };
  const handleNext = () => {
    startTransition(() => {
      if (count == 5) {
        handleSkip();
        handleTourButtonClick("tour");
      }
      setCount(count + 1);
    });
  };
  const handleSkip = () => {
    setCount(0);
    resetScreen();
  };
  let WelcomeData = [
    'Even great products need great storytelling',
    'Tell your story with a CUSTOM 3D experience like this one',
    'Experience it for yourself',
    'Explore use cases in context, such as your client office above',
    'Use "Reset" to go to the default view',
    'Let’s see your sales storytelling in action in a client’s office'
  ];

  let WelcomeData1 = [
    'Our clients see higher sales, larger deals – even higher prices!',
    'Create meaningful connections with clients. Engage, simplify, and grow sales.',
    'All of the information and stories are organized and accessible from the menu.',
    'Select any use case to get a complete overview of the use case, its significance, and the solutions available to you.',
    'Hit "Reset" anytime to stop any running story and come back to the top level view.',
    'You can stop the tour anytime you like using the "stop tour" button on the bottom right.'
  ];

  useEffect(() => {
    if (selectedButton == "tour" && isTourOpen == false) {
      setSelectedButton(null);
    }
  }, [isTourOpen]);

  const handleTourButtonClick = (buttonId) => {
    if (!playAndPause) {
      setGlobalState("playAndPause", true)
    }
    setGlobalState("IsBackgroundBlur", false);
    if (selectedButton === buttonId) {
      if (isTourOpen) {
        setTourState(false);
        Howler.stop();
        setGlobalState("UCTourId", 0);
        setGlobalState("IsTourOpen", false);
        // document.getElementById("close-btn").click();
        props.resetCamera();
      } // if same button clicked again, reset screen
      resetScreen();
      return;
    } else {
      setTourState(true);
      setSelectedButton(buttonId);
      setUI_Element("");
      setShowCardContainer(false);
      setGlobalState("IsTourOpen", true);
      setGlobalState("useCase", 0);
      Howler.stop();
    }
  };

  useEffect(() => {
    if (currentSound == null) return;
    if (!playAndPause) {
      currentSound.pause();
    } else {
      currentSound.play();
    }
  }, [playAndPause]);

  useEffect(() => {
    if (toPress != null) {
      if (toPress === "tour") {
        handleTourButtonClick(toPress);
      } else {
        handleButtonClick(links.get(toPress));
      }
    }
  }, [toPress]);

  const handlePlayStory = () => {
    // ga
    if (HoverId > 0) {
      setGlobalState("HoverUseCaseId", HoverId);
    }
    handleUseCaseButtonClick("btnUseCasesEnabled");
    setGlobalState("IsButtonContainer", false);
  }
  useEffect(() => {
    if (isHomeButtonClick) {
      setGlobalState("useCase", 0);
      setGlobalState("HoverUseCaseId", 0);
      setSelectedButton(null);
    }
  }, [isHomeButtonClick]);

  const handleUseCaseButtonClick = async (buttonId) => {
    setGlobalState("IsHomeButtonClick", false);
    setGlobalState("ApplicationDB", ApplicationDB);
    if (isTourOpen) {
      props.resetCamera();
    }
    Howler.stop();
    setUI_Element("");
    if (selectedButton === buttonId) {
      // if same button clicked again, reset screen
      resetScreen();
      return;
    }
    setSelectedButton(buttonId);
    try {
      const baseAPIUrl = !packageApp ? `${BaseAPI}use_case_list_segment?db=${ApplicationDB}&startID=0` : `../../${ApplicationDB}/use_case_list.json`;
      const id = buttonId.at(-1);
      const address = baseAPIUrl; //address for fetching sectiondata
      const response = await fetch(address); //fetch section data files for specific config id
      const data = await response.json();

      if (buttonId === "btnUseCasesEnabled") {
        setButtonType("Use_case");
        setGlobalState("IsButtonContainer", true);
        setUI_Element("popuptoolbar");
      } else {
        setUI_Element("cards");
      }
      setSectionData(data.use_case_list);

      setShowCardContainer(true);
      if (buttonId === "btnUseCasesEnabled") {
        setShowUC(true);
        setGlobalState("showUC", true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return;
  };

  async function fetchAudio() {
    const baseAPIUrl = `${BaseAPI}use_case_list/`;
    const address = !packageApp ? `${baseAPIUrl}?db=${ApplicationDB}` : `../../${ApplicationDB}/use_case_list.json`;
    const response = await fetch(address);
    const data = await response.json();

    let Vosound;
    const audioClips = new Map();
    const audio_Paths = new Map();

    data.use_case_list.forEach((uc) => {
      const id = uc.use_case_id;
      const src_url = !packageApp ?
        `${assetsLocation}${ApplicationDB}/audio/uc` + String(id) + "/" : `../../${ApplicationDB}/audio/uc${id}/`;
      const path = src_url + "10.mp3";
      // console.log(src_url);
      try {
        Vosound = new Howl({
          src: path,
          html5: true,
          onpause: false,
          preload: true,
        });
        audioClips.set(id, Vosound);
        audio_Paths.set(id, path);
      } catch (error) {
        console.log(error);
      }
    });
    setGlobalState("audioVO1", audioClips);
    setGlobalState("audioPathVO1", audio_Paths);

    const audioClips2 = new Map();
    const audio_Paths2 = new Map();
    data.use_case_list.forEach((uc) => {
      const id = uc.use_case_id;
      const src_url = !packageApp ?
        `${assetsLocation}${ApplicationDB}/audio/uc` + String(id) + "/" : `../../${ApplicationDB}/audio/uc${id}/`;
      const path = src_url + "11.mp3";
      try {
        Vosound = new Howl({
          src: path,
          html5: true,
          onpause: false,
          preload: true,
        });
        audioClips2.set(id, Vosound);
        audio_Paths2.set(id, path);
      } catch {
      }
    });
    setGlobalState("audioVO2", audioClips2);
    setGlobalState("audioPathVO2", audio_Paths2);
  }


  useEffect(() => {
    fetchAudio();
  }, []);
  const lookAt = (xCoordinate, yCoordinate, zCoordinate, cameraX, cameraY, cameraZ) => {
    // Calculate the vector from the camera position to the target point
    let direction = new Vector3(xCoordinate - cameraX, yCoordinate - cameraY, zCoordinate - cameraZ);
  
    // Calculate the alpha angle (rotation around the vertical axis)
    let alpha = Math.atan2(direction.x, direction.z);
    let rotation = alpha - cameraY;
    if (Math.abs(rotation) > Math.abs(rotation - 2 * Math.PI)) rotation = rotation - 2 * Math.PI;
    if (Math.abs(rotation) > Math.abs(rotation + 2 * Math.PI)) rotation = rotation + 2 * Math.PI;
    alpha = rotation + cameraY;
  
    // Calculate the beta angle (elevation from the horizontal plane)
    let distance = Math.sqrt(direction.x * direction.x + direction.z * direction.z);
    let beta = Math.atan2(direction.y, distance);
  
    if (Math.abs(beta) > Math.abs(beta + 2 * Math.PI))
      beta = beta + 2 * Math.PI;
    // // Convert angles to the range expected by ArcRotateCamera
    // alpha = alpha < 0 ? alpha : alpha;
    // beta = beta < 0 ? beta + 2 * Math.PI : beta;
    return { alpha, beta }
  }
  
  const handleButtonClick = async (buttonId) => {

    setSelectedButton(buttonId);
    setTourState(false);
    if (!playAndPause) {
      setGlobalState("playAndPause", true);
    }
    setGlobalState("IsAutoPlay", false);
    setGlobalState("IsHomeButtonClick", false);
    setGlobalState("ApplicationDB", ApplicationDB);
    if (isTourOpen) {
      setGlobalState("UCTourId", 0);
      props.resetCamera();
    }
    Howler.stop();
    setUI_Element("");

    setShowCardContainer(true);

    return;
  };

  const handleResetButtonClick = () => {
    setGlobalState("IsBackgroundBlur", false);
    if (MainMenuIsButtons) {
      setIsResetClick(true)
    }
    setTimeout(() => {
      setIsResetClick(false)
    }, 1000);
    setTourState(false);
    setSelectedButton(null);
    setShowCardContainer(false);
    setGlobalState("solutionsId", -1);
    setGlobalState("showDC", false);
    setGlobalState("showUC", false);
    setGlobalState("IsTourOpen", false);
    setGlobalState("UCTourId", 0);
    setGlobalState("IsHomeButtonClick", true);
    setGlobalState("HoverId", 0);
    setGlobalState("HoverUseCaseId", 0);
    Howler.stop();
    props.resetCamera();
    resetScreen();
  };
  
  const numToButtonId = new Map([
    ["1", "GuidedTourIntro"],
    ["2", "btnSalesChallenges"],
    ["3", "btnGuidingPrinciples"],
    ["4", "btnStoryProcSolutions"],
    ["5", "btnUseCasesEnabled0"],
    ["6", "btnUseCasesEnabled1"],
    ["7", "btnUseCasesEnabled2"],
    ["8", "btnUseCasesEnabled3"],
    ["9", "btnUseCasesEnabled4"],
    ["10", "btnUseCasesEnabled5"],
    ["11", "btnUseCasesEnabled6"],
    ["12", "btnStoryPlots0"],
    ["13", "btnStoryPlots7"],
    ["14", "btnStoryPlots1"],
    ["15", "Outro"]
  ]);

  var step = 0;


  useEffect(() => {
    console.log(UcGuidedTour, guidedTourOpen, IsGuidedTourOpen);
    if (UcGuidedTour > 6 && IsGuidedTourOpen == true) {
      setTimeout(() => {
        step = UcGuidedTour;
        console.log("useEffect", step, UcGuidedTour);
        playGuidedTour();
      }, 300);
    }
  }, [UcGuidedTour, guidedTourOpen]);

  const loadTradeshowModel = async () => {
    if (!scene.getMeshByName('tradeshow')) {
      const t_startTime = performance.now();
      const Tradeshow = await SceneLoader.ImportMeshAsync('', tradeshow, '', scene);
      Tradeshow.meshes[0].name = 'tradeshow';
      scene.getMeshByName('tradeshow').setEnabled(false);
  
      const address = `${assetsLocation}${ApplicationDB}/graphics/custom/`;
      let companyName = company ? company.charAt(0).toUpperCase() + company.slice(1).toLowerCase() : "Company";
  
      const loadImageTexture = async (logoNumber) => {
        const textLogo = await fetch(`${address}${companyName}${logoNumber}.png`);
        const imageURL = URL.createObjectURL(await textLogo.blob());
        const imageTexture = new Texture(imageURL, scene);
        imageTexture.vScale = -1;
        const tvScreenMaterial = scene.getMaterialByName(`Company Logo ${logoNumber}`);
        tvScreenMaterial.albedoTexture = imageTexture;
        tvScreenMaterial.opacityTexture = imageTexture;
      };
  
      await loadImageTexture(1);
      await loadImageTexture(2);
  
      const t_endTime = performance.now();
      InitializeGoogleAnalytics();
      TrackGoogleAnalyticsTiming("Model Loading", "Tradeshow Model", t_endTime - t_startTime, "Story Process 3D");
    }
  };

  const playGuidedTour = async () => {
    console.log(guidedTourOpen, step, IsGuidedTourOpen);
    loadTradeshowModel();
    if (step == 15){
      setGlobalState("IsBackgroundBlur", false);
    }
    if (step == 16) {
      setSelectedButton(null);
      setGlobalState("showDC", false);
      setGlobalState("IsBackgroundBlur", false);
      return;
    }
    if (step == 2 || step == 3 || step == 4) {
      setGlobalState("IsBackgroundBlur", false);
      props.resetCamera();
      setSelectedButton(numToButtonId.get(`${step}`));
      document.getElementById(numToButtonId.get(`${step}`)).click();
    }
    if (numToButtonId.get(`${step}`) && numToButtonId.get(`${step}`).includes("btnStoryPlots")) {
      await props.resetCamera();
      
      const button = numToButtonId.get(`${step}`);
      const id = button.charAt(button.length - 1);
      console.log(step, id);
      document.getElementById("btnStoryPlots").click();
      if (id != "0") {
          const idd = Number(id);
          // document.getElementById("btnStoryPlots").click();
          setTimeout(() => {
              try {
                  document.getElementsByClassName("MuiButtonBase-root")[idd - 1].click();
                  setGlobalState("IsBackgroundBlur", true);
              } catch (error) {
                  document.getElementById("btnStoryPlots").click();
                  console.log(step, idd);
                  setTimeout(() => {
                      document.getElementsByClassName("MuiButtonBase-root")[idd - 1].click();
                      setGlobalState("IsBackgroundBlur", true);
                  }, 400);
              }
          }, 1000);
          // if(id == "3") props.resetCamera();
          return;
      }
  }
    if (numToButtonId.get(`${step}`) && numToButtonId.get(`${step}`).includes("btnUseCasesEnabled")) {
      const button = numToButtonId.get(`${step}`);
      const prefix = "btnUseCasesEnabled";
      var id = button.substring(prefix.length);
      if (!isNaN(id) && !isNaN(parseFloat(id))) {
        id = Number(id); // Convert to number if it's purely numerical
      }
      var num_id = id;
      if (id != 0 && id != 6) {

        let useCase = null;
        usecases.forEach((uc) => {
          if ((uc.id) == id) {
            useCase = uc;
          }
        });
        // setIsBoxVisible(true);
        const canvas = document.getElementsByClassName("main-canvas")[0];
        const movingCamera = scene.getCameraByName('camera-3');
        const securityCamera = scene.getCameraByName(`security-camera-${id}`);

        const finalTarget = new Vector3(useCase.position.x, useCase.position.y, useCase.position.z);
        const finalPosition = new Vector3(useCase.cameraPosition.x, useCase.cameraPosition.y, useCase.cameraPosition.z);
        movingCamera.position.copyFrom(scene.activeCamera.position);
        movingCamera.setTarget(scene.activeCamera.target.clone());
        scene.activeCamera = movingCamera;

        const func = async (movingCamera, securityCamera, canvas) => {
          movingCamera.lockedTarget = null;
          securityCamera.setTarget(finalTarget);
          securityCamera.setPosition(finalPosition);
          // securityCamera.lowerRadiusLimit = 40;
          // securityCamera.upperRadiusLimit = 70;
          scene.activeCamera = securityCamera;
          securityCamera.detachControl(canvas);
          // securityCamera.attachControl(canvas, true);

          // setCurrentZoomedSection(0);

          const pos = Vector3.Project(
            new Vector3(useCase.position.x, useCase.position.y, useCase.position.z),
            Matrix.Identity(), // world matrix
            scene.getTransformMatrix(), // transform matrix
            new Viewport(0, 0, canvas.width, canvas.height)
          );

          var baseAPIUrl;
          var address;
          baseAPIUrl = `${BaseAPI}use_case_list/`;
          address = !packageApp ? `${baseAPIUrl}?db=${ApplicationDB}` : `../../${ApplicationDB}/use_case_list.json`;

          const response = await fetch(address); //fetch section data files for specific config id
          const data = await response.json();
          var short_label;
          console.log(id, num_id);
          data.use_case_list.forEach((uc) => {
            if ((id) == uc.use_case_id) {
              short_label = uc.short_label;
            }
          });
          setUCTourId(num_id);
          setHoverId(id);
          setHoverLabel(short_label);
          setGlobalState("clientXPosition1", pos.x);
          setGlobalState("clientYPosition1", pos.y);
          setGlobalState("UCTourId", num_id);
          console.log(uCTourId, HoverId);
        };

        await rotateToTarget(scene, finalTarget, movingCamera, 1.2, linearAnimation, scene, finalTarget, movingCamera.position, finalPosition, 1, func, movingCamera, securityCamera, canvas);
      }
      else if (id == 6){
        setCurrentZoomedSection(id);

        await new Promise(resolve => setTimeout(resolve, 3500));
        let useCase = null;
        uctradeshow.forEach((uc) => {
          if ((uc.id) == id) {
            useCase = uc;
          }
        });
        console.log(useCase);
        const canvas = document.getElementsByClassName("main-canvas")[0];
        console.log(useCase.position.x, useCase.position.y, useCase.position.z);
        const pos = Vector3.Project(
          new Vector3(useCase.position.x, useCase.position.y, useCase.position.z),
          Matrix.Identity(), // world matrix
          scene.getTransformMatrix(), // transform matrix
          new Viewport(0, 0, canvas.width, canvas.height)
        );

        var baseAPIUrl;
        var address;
        baseAPIUrl = `${BaseAPI}use_case_list/`;
        address = !packageApp ? `${baseAPIUrl}?db=${ApplicationDB}` : `../../${ApplicationDB}/use_case_list.json`;

        const response = await fetch(address); //fetch section data files for specific config id
        const data = await response.json();
        var short_label;
        console.log(id, num_id);
        data.use_case_list.forEach((uc) => {
          if ((id) == uc.use_case_id) {
            short_label = uc.short_label;
          }
        });
        setUCTourId(num_id);
        setHoverId(id);
        setHoverLabel(short_label);
        setGlobalState("clientXPosition1", pos.x);
        setGlobalState("clientYPosition1", pos.y);
        setGlobalState("UCTourId", num_id);
        console.log(uCTourId, HoverId);
      }
  }
  const sound = new Howl({
    src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/gt/${step}.mp3` : `../../${ApplicationDB}/audio/gt/${step}.mp3`,
    html5: true,
    loop: false,
    onload: () => {
      console.log("Sound has been loaded successfully.");
    },
    onloaderror: (id, error) => {
      console.error("Failed to load the sound:", id, error);
    },
    onplayerror: (id, error) => {
      console.error("Failed to play the sound:", id, error);
    },
    onplay: () => {
      console.log(step, "Sound is playing");
    },
    onend: () => {
      console.log("Sound has stopped");
    },
    onpause: () => {
      console.log("Sound is paused");
    }
  });
  
    console.log(sound);
    setCurrentSound(sound);
    await sound.play();

    // if (step == 12){
    //   console.log("step" , step);
    // }
    console.log(uCTourId, HoverId);
    sound.on("end", async function () {
      // if (step == 12){
      //   console.log("step" , step);
      // }
      setCurrentSound(null);

      if (step == 16) {
        // await document.getElementById("btnPartnerSolutions").click();
        // resetScreen();
        // handleClose();
        setGlobalState("showDC", false);
        setSelectedButton("btnGuidedTour");
        // step = 0;
        // playGuidedTour();
        return;
      }
      else if (step == 4){
        document.getElementById("btnStoryProcSolutions").click();
        ++step;
      playGuidedTour();
      }
      else if (step == 15){
        ++step;
      playGuidedTour();
      }
      else if (numToButtonId.get(`${step}`) && numToButtonId.get(`${step}`).includes("btnUseCasesEnabled")) {
        // console.log(uCTourId, HoverId, HoverLabel);
        setGlobalState("HoverId", 0);
        setHoverLabel("");
        setGlobalState("UCTourId", 0);
        ++step;
        playGuidedTour();
      }
      else if (numToButtonId.get(`${step + 1}`).includes("btnStoryPlots")) {
        const button = numToButtonId.get(`${step + 1}`);
        const id = button.charAt(button.length - 1);
        console.log(step, id);
        if (id == "0") {
            document.getElementById("btnStoryPlots").click();
            ++step;
            playGuidedTour();
        }
        else if (id != "0") {
            const idd = Number(id);
            document.getElementsByClassName("MuiButtonBase-root")[0].click();
            // setTimeout(() => {
            // 		try {
            // 				document.getElementsByClassName("MuiButtonBase-root")[idd - 1].click();
            // 		} catch (error) {
            // 				document.getElementById("btnUseCasesEnabled").click();

            // 				setTimeout(() => {
            // 						document.getElementsByClassName("MuiButtonBase-root")[idd - 1].click();
            // 				}, 400);
            // 		}
            // }, 1000);x
            console.log("SET");
            setGlobalState("UcGuidedTour", 13);
            console.log(UcGuidedTour);
        }
    }
    else
    {
      // setAnchorEl(null);  
      ++step;
      playGuidedTour();
    }
    });
  };

  return (
    <div>
      <CSSTransition
        in={HoverId > 0}
        timeout={300} // Duration of the animation in milliseconds
        classNames="animationHover" // Your CSS class for animations
        unmountOnExit
        mountOnEnter
      >
        <div style={{ top: clientYPosition1, left: clientXPosition1 }} className="hot-spot-subMenu">
          <div>
            <div className="hover-label-text">{HoverLabel}</div>
            <hr style={{ marginTop: "5%" }} className="card-divider"></hr>
          </div>
          <div className="button-group" >
            {/* {(isTourOpen || useCase !== 0) ? "" :
              (scene && scene.activeCamera.name.includes("security") == false && scene.activeCamera.name.includes("cr-camera") == false) ?
                <div className="zoom-in" onClick={() => setGlobalState("currentZoomedSection", HoverId)}>Zoom-in</div>
                :
                <div className="zoom-in" onClick={() => props.resetCamera()}>Zoom-out</div>
            } */}
            <div className="learn-more" onClick={() => handlePlayStory()}>{useCase !== 0 ? "End Story" : "Learn More"}</div>
          </div>
        </div>
      </CSSTransition>

      <div style={{ display: 'flex' }}>

        <div className={`${MainMenuIsButtons ? "toolbar reset-toolbar" : "plain-reset-toolbar"} `} >
          <ToolbarButton
            forwardRef={buttonRef}
            id="reset"
            reset = {true}
            buttonId="reset"
            selectedButton={selectedButton}
            active={"reset" === selectedButton}
            buttonName="Reset the Experience"
            handleButtonClick={handleResetButtonClick}
            handleMenuClick={() => { }}
            MainMenuIsButtons={MainMenuIsButtons}
          >

            <svg width="4vh" height="4vh" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_bd_38_67)">
                <rect x="6" y="3" width="52" height="52" rx="26" fill="#D8D8D8" />
              </g>
              <path d="M31.6279 40C28.3821 40 25.6323 38.8867 23.3787 36.6601C21.1262 34.4324 20 31.714 20 28.5049C20 25.2959 21.1262 22.5764 23.3787 20.3465C25.6323 18.1155 28.3821 17 31.6279 17C33.6024 17 35.4507 17.4638 37.1728 18.3915C38.8959 19.3192 40.2846 20.6143 41.3389 22.2769V17H43V25.5921H34.3123V23.9493H40.4585C39.5936 22.3119 38.3765 21.0179 36.8073 20.0672C35.2403 19.1176 33.5138 18.6429 31.6279 18.6429C28.8594 18.6429 26.5061 19.6012 24.5681 21.5179C22.6301 23.4345 21.6611 25.7619 21.6611 28.5C21.6611 31.2381 22.6301 33.5655 24.5681 35.4821C26.5061 37.3988 28.8594 38.3571 31.6279 38.3571C33.7597 38.3571 35.6838 37.7548 37.4003 36.55C39.1168 35.3452 40.3211 33.7571 41.0133 31.7857H42.7757C42.0437 34.2456 40.6523 36.2296 38.6013 37.7378C36.5504 39.2459 34.2259 40 31.6279 40Z" fill="black" />
              <defs>
                <filter id="filter0_bd_38_67" x="0" y="-3" width="64" height="67" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feGaussianBlur in="BackgroundImageFix" stdDeviation="3" />
                  <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_38_67" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feOffset dy="3" />
                  <feGaussianBlur stdDeviation="3" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                  <feBlend mode="normal" in2="effect1_backgroundBlur_38_67" result="effect2_dropShadow_38_67" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_38_67" result="shape" />
                </filter>
              </defs>
            </svg>

            Reset
          </ToolbarButton>



          {MainMenuIsButtons ? "" : <div className='plain-reset-divider'></div>}
          <ToolbarButton
            buttonId="btnWelcomeCards"
            selectedButton={selectedButton}
            active={"btnWelcomeCards" === selectedButton}
            buttonName="Welcome Screen"
            reset = {true}
            handleButtonClick={async (buttonId, buttonName) => {
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                return;
              }
              setCount(0);
              setUseCaseMapping(false);
              handleButtonClick(buttonId);
              // setGlobalState("useCase", 1);
              setGlobalState("IsTourOpen", false);
              // handleUseCaseButtonClick("btnMyHostelStory");
              setGlobalState("IsButtonContainer", false);
              setGlobalState("IsHomeButtonClick", false);
              setGlobalState("ApplicationDB", ApplicationDB);
              setGlobalState("playUCDirectly", true);
              setGlobalState("IsBackgroundBlur", true);
              if (isTourOpen) {
                props.resetCamera();
              }
              Howler.stop();
              setSelectedButton(buttonId);
              setGlobalState("IsButtonContainer", false);
              setUI_Element("welcome");
              setShowCardContainer(true);
              return;
            }}
            handleMenuClick={() => { }}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            How to Use
          </ToolbarButton>
        </div>


        <div
          className={`${MainMenuIsButtons ? "toolbar" : "plain-toolbar"} `}
        >

          <ToolbarButton
            buttonId="btnIntroduction"
            selectedButton={selectedButton}
            active={"btnIntroduction" === selectedButton}
            buttonName="Introduction"
            reset = {false}
            handleButtonClick={async (buttonId, buttonName) => {
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                setUI_Element(null);
                return;
              }
              setUseCaseMapping(false);
              handleButtonClick(buttonId);
              // setGlobalState("useCase", 1);
              setGlobalState("IsTourOpen", false);
              // handleUseCaseButtonClick("btnMyHostelStory");
              setGlobalState("IsButtonContainer", false);
              setGlobalState("IsHomeButtonClick", false);
              setGlobalState("ApplicationDB", ApplicationDB);
              setGlobalState("playUCDirectly", true);
              if (isTourOpen) {
                props.resetCamera();
              }
              Howler.stop();
              setSelectedButton(buttonId);
              try {
                const apiurl = !packageApp ? `${BaseAPI}use_case_stories_emotion/901?db=${ApplicationDB}` : `../../${ApplicationDB}/use_case_stories_emotion/901.json`;
                if (extraData[9].length == 0) {
                  const response = await fetch(apiurl);
                  const data = await response.json();
                  extraData[9][0] = data;
                }
              } catch (error) {
                console.error("Error fetching data:", error);
              }
              setSectionData(extraData[9][0]);
              setButtonType("Use_case");
              setGlobalState("IsButtonContainer", false);
              setUI_Element("popuptoolbar");
              setShowCardContainer(true);
              setGlobalState("HoverUseCaseId", 901);
              return;
            }}
            handleMenuClick={() => { }}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            Introduction
          </ToolbarButton>



          {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
          <ToolbarButton // Guided Tour button
            buttonId="btnBusinessNeeds" //1
            selectedButton={selectedButton}
            reset = {false}
            active={"btnBusinessNeeds" === selectedButton}
            buttonName="Business Needs"
            handleButtonClick={async (buttonId, buttonName) => {
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                return;
              }
              setUseCaseMapping(true);
              setLinkType("OU");
              handleButtonClick(buttonId);
              setGlobalState("IsBackgroundBlur", true);
              setGlobalState("useCase", 0);
              setGlobalState("HoverUseCaseId", 0);
              setGlobalState("IsTourOpen", false);

              if (extraData[0][0] == null) {
                const baseAPIUrl = `${BaseAPI}section/`;
                const address = !packageApp ? `${baseAPIUrl + "1"}?db=${ApplicationDB}` : `../../${ApplicationDB}/section/1.json`;
                try {
                  const response = await fetch(address);
                  const data = await response.json();
                  extraData[0].push(data);
                } catch (error) {
                  console.log("Error fetching data:", error);
                }
              }

              setSectionData(extraData[0][0].SectionData);

              setUI_Element("cards");
            }}
            handleMenuClick={() => { }}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            Sales Goals
          </ToolbarButton>
          {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
          <ToolbarButton // Use Case Story Button
            buttonId="btnUseCasesEnabled" //8
            selectedButton={selectedButton}
            reset = {false}
            active={"btnUseCasesEnabled" === selectedButton}
            buttonName="Use Cases Enabled"
            handleButtonClick={async (buttonId, buttonName) => {
              console.log("usecases clcked");
              fetchAudio();
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                // return;
              }
              setShowCardContainer(true);
              setUseCaseMapping(false);
              handleButtonClick(buttonId);
              setGlobalState("IsTourOpen", false);
              setGlobalState("IsBackgroundBlur", false);

              if (extraData[7][0] == null) {
                const baseAPIUrl = `${BaseAPI}use_case_list_segment`;
                const address = !packageApp ? `${baseAPIUrl}?db=${ApplicationDB}&startID=0` : `../../${ApplicationDB}/use_case_list_segment.json`;
                try {
                  const response = await fetch(address);
                  const data = await response.json();
                  extraData[7].push(data);
                  // console.log(extraData[7]);
                } catch (error) {
                  // console.error("Error fetching data:", error);
                }
              }
              setSectionData(extraData[7][0].use_case_list);

              setUI_Element("popuptoolbar");
              setButtonType("Use_case");
              setGlobalState("HoverUseCaseId", 0);
              setGlobalState("IsButtonContainer", true);
              setGlobalState("playUCDirectly", false);
            }}
            handleMenuClick={handleClick}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            Use Cases
          </ToolbarButton>
          {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
          <ToolbarButton
            buttonId="btnSalesChallenges"
            active={"btnSalesChallenges" === selectedButton}
            selectedButton={selectedButton}
            reset = {false}
            buttonName="Sales Challenges"
            handleButtonClick={async (buttonId, buttonName) => {
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                return;
              }
              setUseCaseMapping(true);
              setLinkType("CU");
              handleButtonClick(buttonId);
              setGlobalState("IsBackgroundBlur", true);
              setGlobalState("useCase", 0);
              setGlobalState("HoverUseCaseId", 0);
              setGlobalState("IsTourOpen", false);

              if (extraData[1][0] == null) {
                const baseAPIUrl = `${BaseAPI}section/`;
                const address = !packageApp ? `${baseAPIUrl + "2"}?db=${ApplicationDB}` : `../../${ApplicationDB}/section/2.json`; //address for fetching sectiondata
                // CHANGES HERE
                try {
                  const response = await fetch(address); //fetch section data files for specific config id
                  const data = await response.json();
                  extraData[1].push(data);
                } catch (error) {
                  // console.error("Error fetching data:", error);
                }
              }

              setSectionData(extraData[1][0].SectionData);

              setUI_Element("cards");
            }}
            handleMenuClick={() => { }}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            Challenges
          </ToolbarButton>

          {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}

          <ToolbarButton // DVS button
            buttonId="btnGuidingPrinciples" //4
            reset = {false}
            active={"btnGuidingPrinciples" === selectedButton}
            selectedButton={selectedButton}
            buttonName="Guiding Principles"
            handleButtonClick={async (buttonId, buttonName) => {
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                return;
              }
              setUseCaseMapping(false);
              handleButtonClick(buttonId);
              setGlobalState("IsBackgroundBlur", true);
              setGlobalState("useCase", 0);
              setGlobalState("HoverUseCaseId", 0);
              setGlobalState("IsTourOpen", false);

              if (extraData[3][0] == null) {
                const baseAPIUrl = `${BaseAPI}section/`;
                const address = !packageApp ? `${baseAPIUrl + "4"}?db=${ApplicationDB}` : `../../${ApplicationDB}/section/4.json`; //address for fetching sectiondata
                // CHANGES HERE
                try {
                  const response = await fetch(address); //fetch section data files for specific config id
                  const data = await response.json();
                  extraData[3].push(data);
                } catch (error) {
                  // console.error("Error fetching data:", error);
                }
              }

              setSectionData(extraData[3][0].SectionData);

              setUI_Element("");
              setUI_Element("cards");
            }}
            handleMenuClick={() => { }}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            Guiding Principles
          </ToolbarButton>


          {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
          <ToolbarButton
            buttonId="btnStoryProcSolutions"
            active={"btnStoryProcSolutions" === selectedButton}
            selectedButton={selectedButton}
            reset = {false}
            buttonName="StoryProc Solutions"
            handleButtonClick={async (buttonId, buttonName) => {
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                return;
              }
              setShowCardContainer(true);
              setUseCaseMapping(false);
              setGlobalState("useCase", 0);
              setGlobalState("HoverUseCaseId", 0);
              setGlobalState("IsTourOpen", false);
              setGlobalState("solutionsId", "1");
              setSelectedButton("btnStoryProcSolutions");
              if (extraData[6][0] == null) {
                const baseAPIUrl = `${BaseAPI}solutions`;
                const address = !packageApp ? `${baseAPIUrl}?db=${ApplicationDB}` : `../../${ApplicationDB}/solutions.json`; //address for fetching sectiondata
                // CHANGES HERE
                try {
                  const response = await fetch(address); //fetch section data files for specific config id
                  const data = await response.json();
                  extraData[6].push(data);
                } catch (error) {
                  // console.error("Error fetching data:", error);
                }
              }

              setSectionData(extraData[6][0].Solutions);
              setButtonType("D");
              setGlobalState("showUC", false);
              setUI_Element("popuptoolbar");
              setGlobalState("IsButtonContainer", false);
            }}
            handleMenuClick={handleClick}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            StoryStudio3D
          </ToolbarButton>
          {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
          <ToolbarButton // Use Case Story Button
            buttonId="btnStoryPlots" //8
            reset = {false}
            selectedButton={selectedButton}
            active={"btnStoryPlots" === selectedButton}
            buttonName="Story Plots"
            handleButtonClick={async (buttonId, buttonName) => {
              // console.log("usecases clcked");
              fetchAudio();
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                // return;
              }
              setShowCardContainer(true);
              setUseCaseMapping(false);
              handleButtonClick(buttonId);
              setGlobalState("IsTourOpen", false);
              setGlobalState("IsBackgroundBlur", false);

              if (extraData[4][0] == null) {
                const baseAPIUrl = `${BaseAPI}use_case_list_segment`;
                const address = !packageApp ? `${baseAPIUrl}?db=${ApplicationDB}&startID=800` : `../../${ApplicationDB}/use_case_list_segment.json`;
                try {
                  const response = await fetch(address);
                  const data = await response.json();
                  extraData[4].push(data);
                  // console.log(extraData[7]);
                } catch (error) {
                  // console.error("Error fetching data:", error);
                }
              }
              setSectionData(extraData[4][0].use_case_list);

              setUI_Element("popuptoolbar");
              setButtonType("Use_case");
              setGlobalState("HoverUseCaseId", 0);
              setGlobalState("IsButtonContainer", true);
              setGlobalState("playUCDirectly", false);
            }}
            handleMenuClick={handleClick}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            Story Plots
          </ToolbarButton>
          {MainMenuIsButtons ? "" : <div className='plain-divider'></div>}
          <ToolbarButton  // Guided Tour button
            buttonId="btnGuidedTour"
            id="btnGuidedTour"
            reset = {false}
            selectedButton={selectedButton}
            active={"btnGuidedTour" === selectedButton}
            buttonName="Guided Tour"
            handleButtonClick={async (buttonId, buttonName) => {
              if (selectedButton === buttonId) {
                // if same button clicked again, reset screen
                resetScreen();
                return;
              }
              guidedTourOpen = true;
              console.log(guidedTourOpen);
              await setGuidedTourOpen(true);
              handleButtonClick(buttonId);
              startTransition(async () => {
                await setGlobalState("IsGuidedTourOpen", true);
              });
              console.log("IsGuidedTourOpen", IsGuidedTourOpen, "guidedTourOpen", guidedTourOpen);
              setGlobalState("IsBackgroundBlur", false);
              setGlobalState("useCase", 0);
              setGlobalState("HoverUseCaseId", 0);
              step = 1;
              playGuidedTour();
            }}
            handleMenuClick={() => { }}
            MainMenuIsButtons={MainMenuIsButtons}
          >
            Guided Tour
          </ToolbarButton>
        </div>
      </div>

      <MenuDispensor
        buttonType={buttonType}
        sectionData={sectionData}
        ui_element={ui_Element}
        buttonId={selectedButton}
        useCaseMapping={useCaseMapping}
        handleMenuItemClick={handleMenuItemClick}
        anchorEl={anchorEl}
        handleClose={handleClose}
        open={open}
        alignItems={alignItems}
        showCardContainer={showCardContainer}
        WelcomeData={WelcomeData}
        WelcomeData1={WelcomeData1}
        count={count}
        handleNext={handleNext}
        handleSkip={handleSkip}
        handlePlayStory={handlePlayStory}
        link_type={linkType}
        IsGuidedTourOpen={IsGuidedTourOpen}
      />

    </div>
  );
};

export default MainPage;