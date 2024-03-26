/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Vector3,
  MeshBuilder,
  SceneLoader,
  StandardMaterial,
  ArcRotateCamera,
  DracoCompression,
  Matrix,
  Viewport,
  DynamicTexture,
  Texture,
  Color3,
  PBRMaterial
} from '@babylonjs/core';
import { InitializeGoogleAnalytics, TrackGoogleAnalyticsTiming } from '../utils/libraries/googleanalytics.tsx';
import useWindowDimensions from '../hooks/useWindowDimensions';
import SceneComponent from '../component/SceneComponents';
import Spinner from '../utils/libraries/Spinner';
import styles from '../utils/styles/Home.module.css';
import sections from '../data/sections.json';
import { gsap } from 'gsap';
import usecases from '../data/usecases.json';
import tradeHotspots from '../data/tradeshow.json';
// Adds the default support for glTF file format
import '@babylonjs/loaders';
import '@babylonjs/core/Debug/debugLayer'; // Augments the scene with the debug methods
import '@babylonjs/inspector'; // Injects a local ES6 version of the inspector to prevent automatically loading the inspector from Babylon's servers.
import { AdvancedDynamicTexture, Rectangle } from '@babylonjs/gui';
import { startAnimations, moveCameraOnClose } from '../hooks/animations';
import { setGlobalState, useGlobalState } from '../utils/state';
import { Howler } from 'howler';
import { BaseAPI, ApplicationDB, assetsLocation, packageApp } from '../assets/assetsLocation';
import { spiralAnimation, rotateToTarget, linearAnimation } from '../utils/libraries/CameraUtils';
import {
  mainModel,
  Marker,
  tradeshow
} from '../models';
import { set } from 'react-ga';
import Welcome from '../utils/libraries/Welcome';
import { useLocation } from "react-router-dom";
import signFont from '../assets/Red Hat Display_Bold.json';
import earcut from 'earcut';
import env from '../assets/renv.env';

// Set the decoding configuration
var dracoLoader = new DracoCompression();
dracoLoader.decoder = {
  wasmUrl: './draco_wasm_wrapper_gltf.js',
  wasmBinaryUrl: './draco_decoder.wasm',
  jsUrl: './draco_decoder.js',
};

export const CAMERA_INITIAL_POSITION = new Vector3(-61, 72, 105);
const Home = (props) => {
  const { height, width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [isTitle, setIsTitle] = useState(false);
  const [scene, setScene] = useState(null);
  const [isTourOpen, setIsTourOpen] = useGlobalState('IsTourOpen');
  const [uCTourId, setUCTourId] = useGlobalState('UCTourId');
  const [sectionData, setSectionData] = useState();
  const [count, setCount] = useState(0);
  const [isWelcome, setIsWelcome] = useState(true);
  const [currentZoomedSection, setCurrentZoomedSection] = useGlobalState("currentZoomedSection");
  const [applicationDB, setApplicationDB] = useGlobalState("ApplicationDB");
  const [useCaseNumber, setUseCaseNumber] = useGlobalState("useCase");
  const [subModelsLoading, setSubModelsLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  var company = queryParams.get('company');
  var client = queryParams.get('client');
  var presenter = queryParams.get('presenter');

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

  const handleTourStart = () => {
    showHotspots(scene, "usecase");
    spiralAnimation(scene, new Vector3(-0.762211, 2, 3.51571), scene.getCameraByName('camera-2').position, new Vector3(0.851, 2, 5.982), 1000, 1, (s) => { startAnimations(s) }, scene);
  };

  let startTime = 0, endTime = 0;
  useEffect(() => {
    if (isTourOpen) {
      startTime = performance.now();
      handleTourStart();
    }
    if (!isTourOpen) {
      endTime = performance.now();
      InitializeGoogleAnalytics();
      TrackGoogleAnalyticsTiming("Immersive Tour", "Tour track", endTime - startTime, "Story Process 3D");
    }

  }, [isTourOpen]);

  const loadModels = async (scene) => {
    setIsLoading(true);
    setGlobalState('IsLoading', true);
    // Load meshes

    // 1 - load factory model first
    setIsTitle(true)
    // model load started
    const startTime = performance.now(); // Record the start time

    const factoryModel = await SceneLoader.ImportMeshAsync('', mainModel, '', scene);
    factoryModel.meshes[0].name = 'factory-model';
    const endTime = performance.now(); // records end time
    // ga model load completed 

    // 


    // useEffect(() => {
    InitializeGoogleAnalytics();
    TrackGoogleAnalyticsTiming("Model Loading", "Main Model", endTime - startTime, "Story Process 3D");
    // }, []);
    createUCGUI(scene);

    setIsLoading(false);
    setIsTitle(false);

    // image
    if (!client || client == "") {
      client = "Your Client";
    }
    if (!company || company == "") {
      company = "Company";
    }
    const address = `${assetsLocation}${ApplicationDB}/graphics/custom/`;

    const clientText = MeshBuilder.CreateText(`clientText`, `${client}`, signFont, {
      size: 0.3,
      resolution: 80,
      depth: 0.3,
    },
      scene,
      earcut
    );
    clientText.position = new Vector3(-0.37, 3.05, -9.13);
    clientText.rotation = new Vector3(0, Math.PI, 0);

    var pbr = new PBRMaterial("pbr", scene);
    pbr.albedoColor = new Color3(1, 1, 1);
    pbr.metallic = 0;
    pbr.roughness = 1;
    pbr.metallicTexture = new Texture("/textures/mr.jpg", scene);
    pbr.useRoughnessFromMetallicTextureAlpha = false;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;

    company = company.charAt(0).toUpperCase() + company.slice(1).toLowerCase();
    const textLogo1 = await fetch(`${address}${company}1.png`)
    const imageURL1 = URL.createObjectURL(await textLogo1.blob());
    const imageTexture1 = new Texture(imageURL1, scene);
    imageTexture1.vScale = -1;
    imageTexture1.level = 1.2;
    const tvScreenMaterial1 = scene.getMaterialByName("Company Logo 1")
    tvScreenMaterial1.albedoTexture = imageTexture1; // Assign the dynamic texture
    tvScreenMaterial1.opacityTexture = imageTexture1; // Assign the dynamic texture

    // text
    if (presenter && presenter != "") {
      presenter = `Presented by ${presenter}`;
    }
    else {
      presenter = '   ';
    }

    const presenterText = MeshBuilder.CreateText(`presenterText`, `${presenter}`, signFont, {
      size: 0.13,
      resolution: 64,
      depth: 0.01,
    },
      scene,
      earcut
    );
    var pbr = new PBRMaterial("pbr", scene);
    if (presenterText) {
      presenterText.position = new Vector3(5.339, 1.372, -8.939);
      presenterText.rotation = new Vector3(0, Math.PI, 0);
      presenterText.material = pbr;
    }
    var pbr2 = new PBRMaterial("pbr2", scene);
    clientText.material = pbr2;

    pbr.albedoColor = new Color3(1, 1, 1);
    pbr.metallic = 0;
    pbr.roughness = 1;
    pbr.metallicTexture = new Texture("/textures/mr.jpg", scene);
    pbr.useRoughnessFromMetallicTextureAlpha = false;
    pbr.useRoughnessFromMetallicTextureGreen = true;
    pbr.useMetallnessFromMetallicTextureBlue = true;
  };


  const createUCGUI = (scene) => {

    const advancedTexture = scene.getTextureByName('myUI');
    usecases.forEach((usecase) => {
      createUC(usecase, scene, advancedTexture, 'usecase');
    });
    tradeHotspots.forEach((usecase) => {
      createUC(usecase, scene, advancedTexture, 'tradeShows');
    });


  };

  let clientXPosition = 0;
  let clientYPosition = 0;

  const createUC = async (usecase, scene, texture, name = "usecase") => {

    const hotspotGlb = await SceneLoader.ImportMeshAsync('', Marker);
    const fakeMesh = hotspotGlb.meshes[0];
    fakeMesh.name = `${name}-${usecase.id}-fake-mesh`;

    fakeMesh.position = new Vector3(usecase.position.x, usecase.position.y, usecase.position.z);
    fakeMesh.billboardMode = 7;
    fakeMesh.setEnabled(false);

    const hotspotLabelIndex = props.extraData.findIndex((element) => element.use_case_id === usecase.id);

    const container = new Rectangle(`${name}-${usecase.id}-container`);

    container.width = '30px';
    container.height = '30px';
    container.cornerRadius = 30;
    container.thickness = 0;

    container.background = 'rgba(7,17,34,0)';

    texture.addControl(container);
    container.linkWithMesh(fakeMesh);

    container.isVisible = false;

    let MouseXPosition = 0
    let MouseYPosition = 0

    document.addEventListener("mousemove", function (event) {
      MouseXPosition = event.clientX;
      MouseYPosition = event.clientY;
      if (MouseXPosition > clientXPosition + width * 0.17 || MouseXPosition < clientXPosition - width * 0.02 || MouseYPosition < clientYPosition - height * 0.17 || MouseYPosition > clientYPosition + height * 0.02) {
        clientXPosition = -20;
        clientYPosition = -20;
        setGlobalState("HoverId", 0);
      }
    });

    container.onPointerEnterObservable.add(() => {
      setGlobalState("HoverLabel", props.extraData[hotspotLabelIndex].short_label);
      setGlobalState("HoverId", usecase.id);
      const canvas = document.getElementsByClassName("main-canvas")[0];
      var pos = Vector3.Project(
        fakeMesh.position,
        Matrix.Identity(), //world matrix
        scene.getTransformMatrix(), //transform matrix
        new Viewport(0, 0, canvas.width, canvas.height)
      );
      clientXPosition = pos.x;
      clientYPosition = pos.y;
      setGlobalState("clientXPosition1", pos.x);
      setGlobalState("clientYPosition1", pos.y);
    });

    container.onPointerMoveObservable.add(() => {
      setGlobalState("HoverLabel", props.extraData[hotspotLabelIndex].short_label);
      setGlobalState("HoverId", usecase.id);
      const canvas = document.getElementsByClassName("main-canvas")[0];
      var pos = Vector3.Project(
        fakeMesh.position,
        Matrix.Identity(), //world matrix
        scene.getTransformMatrix(), //transform matrix
        new Viewport(0, 0, canvas.width, canvas.height)
      );
      clientXPosition = pos.x;
      clientYPosition = pos.y;
      setGlobalState("clientXPosition1", pos.x);
      setGlobalState("clientYPosition1", pos.y);
    });

    container.onPointerOutObservable.add(() => {
      // setGlobalState("HoverLabel", "");
      setGlobalState("HoverId", 0);
      // setGlobalState("clientXPosition1", -20);
      // setGlobalState("clientYPosition1", -20);
      // clientXPosition = -20
      // clientYPosition = -20
    });

  };

  const createSectionsGUI = (scene) => {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('myUI');

    usecases.forEach((section) => {
      createSection(section, scene, advancedTexture);
    });
  };

  const createSection = (section, scene, texture) => {
    const fakeMesh = MeshBuilder.CreateSphere(
      `section-${section.id}-fake-mesh`,
      { diameter: 1 },
      scene
    );

    fakeMesh.position = new Vector3(section.position.x, section.position.y, section.position.z);
    fakeMesh.material = new StandardMaterial('hotspot-material', scene);
    fakeMesh.isVisible = false;

    const model = scene.getMeshByName('factory-model');

    const securityCamera = new ArcRotateCamera(
      `security-camera-${section.id}`,
      0,
      1,
      0,
      new Vector3(0, 0, 0),
      scene
    );

    // disable panning for security camera

    securityCamera.panningSensibility = 0;
    securityCamera.setPosition(new Vector3(section.cameraPosition.x, section.cameraPosition.y, section.cameraPosition.z));
    // securityCamera.lowerBetaLimit = 1.2;
    // securityCamera.upperBetaLimit = 1.2;

    // securityCamera.lowerAlphaLimit = securityCamera.alpha - 0.75;
    // securityCamera.upperAlphaLimit = securityCamera.alpha + 0.75;

    // const fakeCameraMesh = MeshBuilder.CreateSphere(
    // 	`section-${section.id}-fake-mesh`,
    // 	{ diameter: 1 },
    // 	scene
    // );

    // fakeCameraMesh.position = new Vector3(
    // 	section.cameraPosition.x,
    // 	section.cameraPosition.y,
    // 	section.cameraPosition.z
    // );

    // fakeCameraMesh.parent = model;
    // fakeCameraMesh.isVisible = false;
    // fakeCameraMesh.material = new StandardMaterial('hotspot-material', scene);

    // securityCamera.parent = fakeCameraMesh;
    // // disable camera up and down movements
  };

  useEffect(() => {
    clientXPosition = -20
    clientYPosition = -20
    if (currentZoomedSection > 0) {
      zoomInToSection(currentZoomedSection, useCaseNumber !== 0 ? -2 : 0);
    }
  }, [currentZoomedSection])

  const zoomInToSection = async (i, offset = 0) => {
    // let section = sections[i]
    let id = -1;
    let useCase = null;
    usecases.forEach((uc) => {
      if (uc.id == i) {
        useCase = uc;
        id = uc.section;
      }
    });
    let section = null;
    usecases.forEach((sect) => {
      if (sect.id == id) section = sect;
    });

    if (id == -1 || section == null) {
      return;
    }

    const canvas = document.getElementsByClassName("main-canvas")[0];
    const movingCamera = scene.getCameraByName('camera-3');
    const securityCamera = scene.getCameraByName(`security-camera-${id}`);

    const finalTarget = new Vector3(useCase.position.x + offset, useCase.position.y, useCase.position.z);
    const finalPosition = new Vector3(section.cameraPosition.x, section.cameraPosition.y, section.cameraPosition.z);
    movingCamera.position.copyFrom(scene.activeCamera.position);
    movingCamera.setTarget(scene.activeCamera.target.clone());
    scene.activeCamera = movingCamera;

    if (i == 6) {
      setSubModelsLoading(true);
      if (!scene.getMeshByName('tradeshow')) {
        const t_startTime = performance.now();
        const Tradeshow = await SceneLoader.ImportMeshAsync('', tradeshow, '', scene);
        Tradeshow.meshes[0].name = 'tradeshow';
        scene.getMeshByName('tradeshow').setEnabled(false);

        const address = `${assetsLocation}${ApplicationDB}/graphics/custom/`;
        if (!company || company == "") {
          company = "Company";
        }
        company = company.charAt(0).toUpperCase() + company.slice(1).toLowerCase();
        const textLogo1 = await fetch(`${address}${company}1.png`)
        const imageURL1 = URL.createObjectURL(await textLogo1.blob());
        const imageTexture1 = new Texture(imageURL1, scene);
        imageTexture1.vScale = -1;
        // imageTexture1.level = 1.2;
        const tvScreenMaterial1 = scene.getMaterialByName("Company Logo 1")
        tvScreenMaterial1.albedoTexture = imageTexture1; // Assign the dynamic texture
        tvScreenMaterial1.opacityTexture = imageTexture1; // Assign the dynamic texture

        const textLogo2 = await fetch(`${address}${company}2.png`)
        const imageURL2 = URL.createObjectURL(await textLogo2.blob());
        const imageTexture2 = new Texture(imageURL2, scene);
        imageTexture2.vScale = -1;
        // imageTexture2.level = 1.2;
        const tvScreenMaterial2 = scene.getMaterialByName("Company Logo 2")
        tvScreenMaterial2.albedoTexture = imageTexture2; // Assign the dynamic texture
        tvScreenMaterial2.opacityTexture = imageTexture2; // Assign the dynamic texture

        const t_endTime = performance.now();
        // useEffect(() => {
        InitializeGoogleAnalytics();
        TrackGoogleAnalyticsTiming("Model Loading", "Tradeshow Model", t_endTime - t_startTime, "Story Process 3D");
      }
      const crCamera = new ArcRotateCamera(
        `cr-camera`,
        0,
        1.1,
        300,
        new Vector3(-2.98, -2.5, 5.35),
        scene
      );
      scene.activeCamera = crCamera;
      crCamera.detachControl(canvas);
      crCamera.attachControl(canvas, true);
      crCamera.lowerBetaLimit = 0;
      crCamera.upperBetaLimit = 1.57;
      crCamera.lowerRadiusLimit = 10;
      crCamera.inertia = 0.5;
      crCamera.angularSensibility = 1000;
      crCamera.panningSensibility = 142.7;
      crCamera.pinchDeltaPercentage = 0.01;
      crCamera.wheelDeltaPercentage = 0.01;
      crCamera.inputs.addMouseWheel();
      // arcRotateCamera.inputs.addPointers();
      crCamera.wheelPrecision = 20;

      scene.getMeshByName('factory-model').setEnabled(false);
      scene.getMeshByName('clientText').setEnabled(false);
      if (scene.getMeshByName('presenterText'))
        scene.getMeshByName('presenterText').setEnabled(false);
      while (!scene.getMeshByName('tradeshow')) {

      }
      showHotspots(scene, "");
      await scene.getMeshByName('tradeshow').setEnabled(true);
      setSubModelsLoading(false);
      const timeline = gsap.timeline();
      timeline.to(crCamera, {
        radius: 23,
        duration: 0.5,
        ease: "power1.out",
      }).to(crCamera, {
        alpha: Math.PI,
        duration: 3,
        ease: "power1.out",
        onComplete: () => {
          showHotspots(scene, "tradeShows");
        }
      });
      timeline.play();

      setCurrentZoomedSection(0);
      setGlobalState("HoverId", 0);
      return;
    }

    const func = async (movingCamera, securityCamera, canvas) => {
      movingCamera.lockedTarget = null;
      securityCamera.setTarget(finalTarget);
      securityCamera.setPosition(finalPosition);
      securityCamera.lowerRadiusLimit = 5;
      securityCamera.upperRadiusLimit = 15;
      scene.activeCamera = securityCamera;
      securityCamera.detachControl(canvas);
      securityCamera.attachControl(canvas, true);
      setCurrentZoomedSection(0);
    };


    rotateToTarget(scene, finalTarget, movingCamera, .4, linearAnimation, scene, finalTarget, movingCamera.position, finalPosition, 1, func, movingCamera, securityCamera, canvas);
    setGlobalState("HoverId", 0);
  }

  const showHotspots = (scene, name) => {
    if (!scene) return;
    const texture = scene.getTextureByName('myUI');
    // const names = ["usecase", "commonroom"];
    const names = ["usecase", "tradeShows"];

    names.forEach((curr) => {
      const enable = curr == name;
      for (var i = 0; i <= 30; i++) {
        const currMesh = scene.getMeshByName(`${curr}-${i}-fake-mesh`);
        const currContainer = texture.getControlByName(`${curr}-${i}-container`);
        if (!currMesh || !currContainer) continue;
        currMesh.setEnabled(enable);
        currContainer.isVisible = enable;
      }
    });
  }

  const onSceneReady = useCallback(async (s) => {
    loadModels(s);
    createSectionsGUI(s);

    setGlobalState("scene", s);
    setScene(() => s);
  }, [props.extraData]);

  const handleMoveCameraOnClose = () => {
    Howler.stop();



    const model = scene.getMeshByName('factory-model');
    model.position = new Vector3(0, 0, 0);

    const arcRotateCamera = scene.getCameraByName('camera-2');
    arcRotateCamera.restoreState();
    if (scene.activeCamera.name === 'camera-2') {
      return;
    }
    const advancedTexture = scene.getTextureByName('myUI');
    usecases.forEach((section) => {
      const securityCamera = scene.getCameraByName(`security-camera-${section.id}`);
      securityCamera.detachControl();

      section.infos.forEach((usecaseId) => {
        const cnt = advancedTexture.getControlByName(`usecase-${usecaseId}-container`);
        if (cnt != null) {
          cnt.width = '30px';
          cnt.height = '30px';
          cnt.cornerRadius = 30;

          if (cnt.children.length > 0)
            cnt.children[0].fontSize = 12;
        }
      });


    });
    window.dispatchEvent(new Event('onCloseTour'));
    moveCameraOnClose(arcRotateCamera);


  };

  useEffect(() => {
    handleFetchSectionData();
  }, []);

  const handleFetchSectionData = async () => {
    const baseAPIUrl = `${BaseAPI}section/`;
    // const id = buttonId.at(-1);
    const address = !packageApp ? `${baseAPIUrl + 10}?db=${ApplicationDB}` : `../../${ApplicationDB}/section/8.json`; //address for fetching sectiondata
    const response = await fetch(address); //fetch section data files for specific config id
    const data = await response.json();
    setSectionData(data?.SectionData);
  };

  const initialAnimation = () => {
    const cam2 = scene.getCameraByName('camera-2');
    const cam3 = scene.activeCamera;

    const target = cam2.target;
    const x = cam2.radius * Math.sin(cam2.beta) * Math.cos(cam2.alpha);
    const y = cam2.radius * Math.cos(cam2.beta);
    const z = cam2.radius * Math.sin(cam2.beta) * Math.sin(cam2.alpha);

    const cameraPosition = new Vector3(x, y, z).add(target);

    cam3.lockedTarget = target;
    const timeline = gsap.timeline();
    timeline.to(cam3.position, {
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,
      duration: 1.5,
      ease: "power.in",
      onComplete: () => {
        scene.activeCamera = cam2;
        cam3.position.copyFrom(cam2.position);
        cam3.lockedTarget = null;
        cam3.setTarget(target);
        showHotspots(scene, "usecase");
        console.log("HOTSPOTS ENABLED");
      }
    });
    timeline.play();

    return;
  };

  /**
   * Will run on every frame render.  We are spinning the box on y-axis.
   */
  useEffect(() => {
    if (!isLoading && !isWelcome) {
      // setIsLoading(false);
      setGlobalState('IsLoading', false);
      initialAnimation();
    }
  }, [isLoading, isWelcome])

  const handleNext = () => {
    if (count === 5) {
      setIsWelcome(false)
      setIsLoading(false);
      setGlobalState('IsLoading', false);
      initialAnimation();
      setTimeout(() => {
        document.getElementById("tour").click()
      }, 2000);
    }
    setCount(count + 1);
  };
  const handlePrev = () => {
    setCount(count - 1);
  };
  const handleSkip = () => {
    setIsWelcome(false)
    // setIsLoading(false);
    // setGlobalState('IsLoading', false);
  };
  function isImage(url) {
    return /\.(jpg|JPG|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }
  function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
  }
  function isVideo(filename) {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
      case 'mp4':
        // etc
        return true;
    }
    return false;
  }

  return (
    <div className={styles.app__container}>
      {count >= 0 && isWelcome && (
        <Welcome WelcomeData={WelcomeData} WelcomeData1={WelcomeData1} count={count} handleSkip={handleSkip} handleNext={handleNext} />
      )}
      {(isLoading || subModelsLoading || isWelcome) && <Spinner isWelcome={isWelcome} isLoading={isLoading} subModelsLoading={subModelsLoading} />}

      {uCTourId > 0 ? (
        <div className={styles.hover_des_container}>
          <div className={styles.hover_des}>
            {sectionData &&
              sectionData.map((item, index) => {
                return (
                  <>
                    {item.seq == uCTourId ? (
                      <div className="Tour-box-wrap" key={index}>
                        <div className="Tour-box-title">{item.short_label}</div>
                        <div className="Tour-box-content">
                          <div key={index}>
                            <div className="content-description">
                              {item.long_desc}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </>
                );
              })}
          </div>
        </div>
      ) : (
        ""
      )}
      <SceneComponent antialias onSceneReady={onSceneReady} isLoading={isLoading || subModelsLoading} />
      <div className={styles.close__button__container}>
        <button
          id="close-btn"
          className={`${styles.close__button}`}
          onClick={handleMoveCameraOnClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Home;
