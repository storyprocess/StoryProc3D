import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Vector3,
	MeshBuilder,
	Color3,
	SceneLoader,
	StandardMaterial,
	ArcRotateCamera,
	Vector4,
	TransformNode,
	Axis,
	Space,
	DracoCompression,
	Matrix,
	Viewport
} from '@babylonjs/core';

import SceneComponent from '../component/SceneComponents';
import Spinner from '../component/Spinner';
import styles from '../styles/Home.module.css';
import hotspots from '../data/hotspots.json';
import sections from '../data/sections.json';
import { gsap } from 'gsap';
import usecases from '../data/usecases.json';
import WelcomeImg from '../assets/Rectangle 3463321.png'
// Adds the default support for glTF file format
import '@babylonjs/loaders';
import '@babylonjs/core/Debug/debugLayer'; // Augments the scene with the debug methods
import '@babylonjs/inspector'; // Injects a local ES6 version of the inspector to prevent automatically loading the inspector from Babylon's servers.
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control } from '@babylonjs/gui';
import { startAnimations, moveCameraOnClose, handleSectionData } from '../hooks/animations';
import { setGlobalState, useGlobalState } from '../state';
import { Howl, Howler } from 'howler';
import { BaseAPI, ApplicationDB, assetsLocation } from '../assets/assetsLocation';
import {
	// ClientOfficeAnimation,
	// OwnOfficeAnimation2,
	// TradeshowAnimationTest,
	Clientofficefinal,
	Marker
} from '../models';

var loader = new SceneLoader();

// Set the decoding configuration
var dracoLoader = new DracoCompression();
dracoLoader.decoder = {
	wasmUrl: './draco_wasm_wrapper_gltf.js',
	wasmBinaryUrl: './draco_decoder.wasm',
	jsUrl: './draco_decoder.js',
};

export const CAMERA_INITIAL_POSITION = new Vector3(-61, 72, 105);
const Home = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isTitle, setIsTitle] = useState(false);
	const [scene, setScene] = useState(null);
	const buttonRef = useRef(null);
	const closeButtonRef = useRef(null);
	const [isTourOpen, setIsTourOpen] = useGlobalState('IsTourOpen');
	const [uCTourId, setUCTourId] = useGlobalState('UCTourId');
	const [isSectionSelected, setIsSectionSelected] = useState(false);
	const [sectionData, setSectionData] = useState();
	const [counter, setCounter] = useState(0);
	const [count, setCount] = useState(0);
	const [isWelcome, setIsWelcome] = useState(true);
	const [currentZoomedSection, setCurrentZoomedSection] = useGlobalState("currentZoomedSection");
	const [HoverLabel, setHoverLabel] = useGlobalState("HoverLabel");
	const [applicationDB, setApplicationDB] =
	useGlobalState("ApplicationDB");
	/*const [titleOne, setTitleOne] = useState([
		"Dell Edge Virtual Experience Center for Manufacturing",
		"Dell Edge Virtual Experience Center for Manufacturing",
		"Dell Edge Virtual Experience Center for Manufacturing",
		"Dell Edge Virtual Experience Center for Manufacturing",
		"Digitally transforming the factory with smart edge solutions",
		"Digitally transforming the factory with smart edge solutions",
		"Digitally transforming the factory with smart edge solutions",
	  ]);
	  const [titleTwo, setTitleTwo] = useState([
		"Welcome",
        "Setting up the experience…",
        "Assembly line workers are getting on the job...",
        "Technical workers are coming in...",
        "Starting 5G-enabled automated vehicles...",
        "Establishing seamless IT-OT connection...",
        "Enabling computer vision quality inspection...",
	  ]);
	  */
	  const [titleOne, setTitleOne] = useState([
		"Dell Edge Virtual Experience Center for Manufacturing",
		"Dell Edge Virtual Experience Center for Manufacturing",
		"Digitally transforming the factory with smart edge solutions",
		"Digitally transforming the factory with smart edge solutions",
		"Digitally transforming the factory with smart edge solutions",
		"Getting ready for manufacturing operations",
		"Getting ready for manufacturing operations",
		"Getting ready for manufacturing operations",
		"Getting ready for manufacturing operations",
		"Getting ready for manufacturing operations",
		"Ready to start"
	  ]);
	  const [titleTwo, setTitleTwo] = useState([
		"Welcome",
		"Loading the factory model",
		"Starting 5G-enabled automated vehicles...",
		"Enabling computer vision quality inspection...",
        "Assembly line workers are getting on the job...",
        "Finishing...",
	  ]);
	  let WelcomeData = [
		"Do you sell enterprise solutions to cross-functional teams?",
		"Explore this experience center as per your needs and interest",
		"All information and stories are available via this menu. ",
		"Hit Reset anytime to stop any running story and come back to the top level view",
		"Select any Use case to get a complete overview of the use case",
		"Let’s start with an overview",
		"Remember, you can interrupt by pressing Reset anytime",
	  ];
	  let WelcomeData1 = [
		"Do you sell enterprise solutions to cross-functional teams?",
		"Explore this experience center as per your needs and interest",
		"All information and stories are available via this menu. ",
		"Hit Reset anytime to stop any running story and come back to the top level view",
		"Select any Use case to get a complete overview of the use case",
		"Let’s start with an overview",
		"Remember, you can interrupt by pressing Reset anytime",
	  ];
	const handleTourStart = () => {
		showHotspots(scene,false);
		hideSectionUIs(scene);
		hideInfoUIs(scene);
		startAnimations(scene);
	};

	useEffect(() => {
		if (isTourOpen) {
			handleTourStart();
		}
	}, [isTourOpen]);

	const loadModels = async (scene) => {
		setIsLoading(true);
		setGlobalState('IsLoading', true);
		// Load meshes

		// 1 - load factory model first
		setCounter(1)
		setIsTitle(true) 
		const factoryModel = await SceneLoader.ImportMeshAsync('', Clientofficefinal, '', scene);
		factoryModel.meshes[0].name = 'factory-model';
		
		// setGlobalState('IsLoading', false);
		// setIsTitle(true)
		// setGlobalState("IsModelLoaded",false)
	
		// 2 - load guided vehicles
		setCounter(2)
		// const guidedVehiclesModel = await SceneLoader.ImportMeshAsync('', OwnOfficeAnimation2); // moved up
		// guidedVehiclesModel.meshes[0].name = 'guided-vehicles';

		// 3 - load packing robots
		setCounter(3)
		// const packingRobotsModel = await SceneLoader.ImportMeshAsync('', TradeshowAnimationTest);
		// packingRobotsModel.meshes[0].name = 'packing-robots';

		// 4 - load workers
		setCounter(4)
		// const workersIT = await Promise.all([
		// 	SceneLoader.ImportMeshAsync('', people),
		// ]);
		// const seatedWorker = workersIT[0].meshes[0];

		// setGlobalState('IsLoading', false);
		const hotspotGlb = await SceneLoader.ImportMeshAsync('', Marker);
		const hotspotMesh = hotspotGlb.meshes[0]
		hotspotMesh.name = 'hotspotMesh';
		hotspotMesh.isVisible = false;
		hotspotMesh.billboardMode = 7;
		setIsLoading(false);

		showSectionUIs(scene);
		createUCGUI(scene);
		setIsTitle(false);
	};

	const createUCGUI = (scene) => {

		const advancedTexture = scene.getTextureByName('myUI');
		usecases.forEach((usecase) => {
			createUC(usecase, scene, advancedTexture);
		});
		scene.getMeshByName(`hotspotMesh`).setEnabled(false);
	};
	let hotspotInitialScaling

	let clientXPosition=0;

	const createUC = (usecase, scene, texture) => {
		// const fakeMesh = MeshBuilder.CreateSphere(
		// 	`usecase-${usecase.id}-fake-mesh`,
		// 	{ diameter: 1 },
		// 	scene
		// );

		const fakeMesh = scene.getMeshByName('hotspotMesh').clone(`usecase-${usecase.id}-fake-mesh`);
		 hotspotInitialScaling = scene.getMeshByName('hotspotMesh').scaling.clone();

		 scene.onBeforeRenderObservable.add(() => {
			// adjustHotspotScale(scene);
		});
		fakeMesh.position = new Vector3(usecase.position.x, usecase.position.y, usecase.position.z);
		// fakeMesh.material = new StandardMaterial('hotspot-material', scene);
		// fakeMesh.isVisible = false;
		fakeMesh.billboardMode = 7;
		const hotspotLabelIndex = props.extraData.findIndex((element) => element.use_case_id == usecase.id);

		const container = new Rectangle(`usecase-${usecase.id}-container`);

		container.width = '20px';
		container.height = '20px';
		container.cornerRadius = 20;
		container.thickness = 0;

		container.background = 'rgba(7,17,34,0)';

		// const sectionNameUI = new TextBlock();
		// sectionNameUI.text = usecase.name;
		// sectionNameUI.color = 'rgba(255, 255, 255, 0)';
		// sectionNameUI.fontSize = 12;
		// sectionNameUI.fontFamily = 'Helvetica';
		// sectionNameUI.fontWeight = 'bold';
		// sectionNameUI.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
		// sectionNameUI.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
		// sectionNameUI.paddingTop = '1px';
		// sectionNameUI.paddingBottom = '1px';

		// container.addControl(sectionNameUI);

		texture.addControl(container);
		container.linkWithMesh(fakeMesh);

		container.isVisible = true;

		// let RefreshMousePosition = true;
		// useEffect(() => {
		//   if (clientXPosition1 <= 0) {
		// 	RefreshMousePosition = true;
		//   } else {
		// 	RefreshMousePosition = false;
		//   }
		// }, []);
		
			let MouseXPosition=0
			let MouseYPosition=0

			document.addEventListener("mousemove", function (event) {
				MouseXPosition = event.clientX;
				MouseYPosition = event.clientY;
				if(MouseXPosition > clientXPosition+20 || MouseXPosition < clientXPosition-20){
					clientXPosition = -20
				}
			});

		container.onPointerEnterObservable.add(() => {
			if (clientXPosition <= 0) {
				setGlobalState("HoverLabel", props.extraData[hotspotLabelIndex].short_label);
				setGlobalState("HoverUseCaseId", usecase.id);
				const canvas = document.getElementsByClassName("main-canvas")[0];
				var pos = Vector3.Project(
					fakeMesh.position,
					Matrix.Identity(), //world matrix
					scene.getTransformMatrix(), //transform matrix
					new Viewport(0, 0, canvas.width, canvas.height)
				);
				clientXPosition = MouseXPosition;
				setGlobalState("clientXPosition1", pos.x);
				setGlobalState("clientYPosition1", pos.y);
			}
		});

		container.onPointerOutObservable.add(() => {
			setGlobalState("HoverLabel", "");
			setGlobalState("HoverUseCaseId",0);
			setGlobalState("clientXPosition1", -20);
			setGlobalState("clientYPosition1", -20);
			clientXPosition = -20
		});

	};

	const createSectionsGUI = (scene) => {
		const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('myUI');

		sections.forEach((section) => {
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
		securityCamera.lowerRadiusLimit = 0;
		securityCamera.upperRadiusLimit = 0;

		securityCamera.lowerBetaLimit = 1.2;
		securityCamera.upperBetaLimit = 1.2;

		securityCamera.lowerAlphaLimit = securityCamera.alpha - 0.75;
		securityCamera.upperAlphaLimit = securityCamera.alpha + 0.75;

		const fakeCameraMesh = MeshBuilder.CreateSphere(
			`section-${section.id}-fake-mesh`,
			{ diameter: 1 },
			scene
		);

		fakeCameraMesh.position = new Vector3(
			section.cameraPosition.x,
			section.cameraPosition.y,
			section.cameraPosition.z
		);

		fakeCameraMesh.parent = model;
		fakeCameraMesh.isVisible = false;
		fakeCameraMesh.material = new StandardMaterial('hotspot-material', scene);

		securityCamera.parent = fakeCameraMesh;

		// disable camera up and down movements
		securityCamera.beta = 1.2;
	};

	useEffect(()=>{
		clientXPosition = -20
		if(currentZoomedSection > 0){
			zoomInToSection(currentZoomedSection)
		}
	},[currentZoomedSection])

 	const zoomInToSection =(i)=>{
		// let section = sections[i]
		let id = -1;
		usecases.forEach((useCase) => {
			if(useCase.id == i) id = useCase.section;
		});
		let section = null;
		sections.forEach((sect) => {
			if(sect.id == id) section = sect;
		});

		hideSectionUIs(scene);
		hideInfoUIs(scene);
		const canvas = document.getElementsByClassName("main-canvas")[0];
		const arcRotateCamera = scene.getCameraByName('camera-2');
		const movingCamera = scene.getCameraByName('camera-3');
		movingCamera.position.copyFrom(arcRotateCamera.position);
		movingCamera.setTarget(arcRotateCamera.target.clone());

		const securityCamera = scene.getCameraByName(`security-camera-${id}`);
		scene.activeCamera = movingCamera;
		console.log(securityCamera.target);
		let direction = new Vector3(securityCamera.target.x - securityCamera.position.x, securityCamera.target.y - securityCamera.position.y, securityCamera.target.z - securityCamera.position.z);
		console.log(direction);
		
		let alpha = Math.atan2(direction.x, direction.z);
		let distance = Math.sqrt(direction.x * direction.x + direction.z * direction.z);

		const timeline = gsap.timeline();
		timeline.to(movingCamera.position, {
			x: section.cameraPosition.x,
			y: section.cameraPosition.y,
			z: section.cameraPosition.z,
			duration: 2,
		});
		timeline.to(movingCamera.rotation, {
			x: Math.PI/2 - 1.2,
			y: alpha,
			duration: 2,
			onComplete: () => {
				scene.activeCamera = securityCamera;
				securityCamera.attachControl(canvas, true);

				// RESET THE MOVING CAMERA
				movingCamera.position.copyFrom(arcRotateCamera.position);
				movingCamera.setTarget(arcRotateCamera.target.clone());
			}
		});
		timeline.play();
	}


	// Function to adjust the ball's scale inversely to the camera's scaling
    function adjustHotspotScale(scene) {
		if (scene.activeCamera.globalScale == undefined) {
			return
		}
        // Get the current scaling of the camera (assuming it's uniform scaling)
		console.log("scene",scene.activeCamera.globalScale.x);
        const cameraScaling = scene.activeCamera.globalScale.x;

        // Calculate the inverse scaling factor for the ball
        const inverseScalingFactor = 1 / cameraScaling;

        // Apply the inverse scaling to each hotspot
        if(!scene) return;
        const texture = scene.getTextureByName('myUI');
        for(var i = 0; i <= 30; i++) {
            const currMesh = scene.getMeshByName(`usecase-${i}-fake-mesh`);
            const currContainer = texture.getControlByName(`usecase-${i}-container`);
            if(!currMesh || !currContainer) continue;
            currMesh.scaling = hotspotInitialScaling.scale(inverseScalingFactor);
        }
    }

    // Event listener for scene render loop or when the camera zoom changes



	const showHotspots = (scene,show) => {
		if(!scene) return;
		const texture = scene.getTextureByName('myUI');
		for(var i = 0; i <= 30; i++) {
			const currMesh = scene.getMeshByName(`usecase-${i}-fake-mesh`);
			const currContainer = texture.getControlByName(`usecase-${i}-container`);
			if(!currMesh || !currContainer) continue;
			currMesh.setEnabled(show);
			currContainer.isVisible = show;
		}
	}

	const hideSectionUIs = (scene) => {
		const advancedTexture = scene.getTextureByName('myUI');

		sections.forEach((section) => {
			const container = advancedTexture.getControlByName(`section-${section.id}-container`);
			// container.isVisible = false;
		});
	};

	const hideInfoUIs = (scene) => {
		const advancedTexture = scene.getTextureByName('myUI');

		usecases.forEach((usecase) => {
			const container = advancedTexture.getControlByName(`usecase-${usecase.id}-container`);

			// container.isVisible = false;
		});
	};

	const showSectionUIs = (scene) => {
		const advancedTexture = scene.getTextureByName('myUI');

		sections.forEach((section) => {
			const container = advancedTexture.getControlByName(`section-${section.id}-container`);
			// container.isVisible = false;
			// container.isVisible = true;
		});

		usecases.forEach((usecase) => {
			const container = advancedTexture.getControlByName(`usecase-${usecase.id}-container`);
			// container.isVisible = true;
		});
	};

	const onSceneReady = useCallback(async (s) => {
		loadModels(s);
		createSectionsGUI(s);
		hideSectionUIs(s);
		hideInfoUIs(s);

		setGlobalState("scene",s);
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
		sections.forEach((section) => {
			const securityCamera = scene.getCameraByName(`security-camera-${section.id}`);
			securityCamera.detachControl();

		section.infos.forEach((usecaseId) => {
			const cnt = advancedTexture.getControlByName(`usecase-${usecaseId}-container`);
			cnt.width = '30px';
			cnt.height = '30px';
			cnt.cornerRadius = 30;

			if(cnt.children.length > 0)
				cnt.children[0].fontSize = 12;
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
		const address = `${baseAPIUrl + 8}?db=${ApplicationDB}`; //address for fetching sectiondata
		const response = await fetch(address); //fetch section data files for specific config id
		const data = await response.json();
		setSectionData(data?.SectionData);
	};

	/**
	 * Will run on every frame render.  We are spinning the box on y-axis.
	 */
	useEffect(()=>{
if (!isLoading && !isWelcome) {
			// setIsLoading(false);
		setGlobalState('IsLoading', false);
}
	},[isLoading,isWelcome])
	const onRender = (scene) => {};
	const handleNext = () => {
		if(count == 5){
			setIsWelcome(false)
			setIsLoading(false);
			setGlobalState('IsLoading', false);
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
        <div className="Welcome-card-container" style={{ zIndex: 99999999999 }}>
          {isVideo(`welcome${count+1}.mp4`) ? <div>
              <video
				autoPlay
				muted
				loop
				controls
                style={{ width: "100%", verticalAlign: "bottom" }}
              >
                <source
                //   src={'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  src={`${assetsLocation}${applicationDB}/graphics/${`welcome${count+1}.mp4`}`}
                  type="video/mp4"
                />
              </video>
            </div> :  isImage(`welcome${count+1}.png`) ? (
            <div>
              <img
                alt="test"
				width={"100%"}
                src={`${assetsLocation}${applicationDB}/graphics/${`welcome${count+1}.png`}`}
              />
            </div>
          ) : (
           <img width={"100%"} src={WelcomeImg} />
          )}
          <div className="Welcome-Tour-box-title">
            <div className="wel-title"> {WelcomeData[count]}</div>
            <div className="wel-description">{WelcomeData1[count]}</div>
          </div>
          <div style={{ padding: "3%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              {/* <div className='welcome-page'>{count+1}/6</div> */}
              <div className="welcome-page">
                {[0, 1, 2, 3, 4, 5].map((item) => {
                  return (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="5"
                        cy="5"
                        r="4.5"
                        fill={item == count ? "#1033A4" : "white"}
                        stroke="#80C8FA"
                      />
                    </svg>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  width: "100%",
                  gap: "5%",
                }}
              >
                <div
                  className="welcome-btn"
                  style={{ color: "#0C2055" }}
                  onClick={() => handleSkip()}
                >
                  Skip
                </div>
                <div className="welcome-next-btn" onClick={() => handleNext()}>
                  {count == 5 ? "Start tour" : "Next"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {(isLoading || isWelcome) && <Spinner isWelcome={isWelcome} isLoading={isLoading}/>}
      {/* {isTitle &&
        <div className={styles.hover_des_container}>
          <div className={styles.hover_des}>
            <div className={styles.Title_One}>{titleOne[counter]}</div>
            <div className={styles.Title_Two}>{titleTwo[counter]}</div>
          </div>
        </div>
      } */}

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
      <SceneComponent antialias onSceneReady={onSceneReady} />
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
