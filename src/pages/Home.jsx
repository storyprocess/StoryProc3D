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
} from '@babylonjs/core';

import SceneComponent from '../component/SceneComponents';
import Spinner from '../component/Spinner';
import styles from '../styles/Home.module.css';
import hotspots from '../data/hotspots.json';
import sections from '../data/sections.json';
import { gsap } from 'gsap';
import usecases from '../data/usecases.json';
// Adds the default support for glTF file format
import '@babylonjs/loaders';
import '@babylonjs/core/Debug/debugLayer'; // Augments the scene with the debug methods
import '@babylonjs/inspector'; // Injects a local ES6 version of the inspector to prevent automatically loading the inspector from Babylon's servers.
import { AdvancedDynamicTexture, Rectangle, TextBlock, Control } from '@babylonjs/gui';
import { startAnimations, moveCameraOnClose, handleSectionData } from '../hooks/animations';
import { setGlobalState, useGlobalState } from '../state';
import { Howl, Howler } from 'howler';
import { BaseAPI, ApplicationDB } from '../assets/assetsLocation';
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
	console.log("props",props);
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
		setIsTitle(false);
	};

	const createUCGUI = (scene) => {

		const advancedTexture = scene.getTextureByName('myUI');
		usecases.forEach((usecase) => {
			createUC(usecase, scene, advancedTexture);
		});
	};

	let clientXPosition=0;

	const createUC = (usecase, scene, texture) => {
		const fakeMesh = MeshBuilder.CreateSphere(
			`usecase-${usecase.id}-fake-mesh`,
			{ diameter: 1 },
			scene
		);
		 

		fakeMesh.position = new Vector3(usecase.position.x, usecase.position.y, usecase.position.z);
		fakeMesh.billboardMode = 7;

		// fakeMesh.material = new StandardMaterial('hotspot-material', scene);
		// fakeMesh.isVisible = false;

		const hotspotLabelIndex = props.extraData.findIndex((element) => element.use_case_id == usecase.id);

		const container = new Rectangle(`usecase-${usecase.id}-container`);

		container.width = '30px';
		container.height = '30px';
		container.cornerRadius = 30;
		container.thickness = 0;

		container.background = '#071122';

		// const sectionNameUI = new TextBlock();
		// sectionNameUI.text = usecase.name;
		// sectionNameUI.color = 'rgba(255, 255, 255, 1)';
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
			console.log("calllllllllllllllllll",props);
			if (clientXPosition <= 0) {
				setGlobalState("HoverLabel", props.extraData[hotspotLabelIndex].short_label);
				setGlobalState("HoverUseCaseId", usecase.id);
				clientXPosition = MouseXPosition;
				setGlobalState("clientXPosition1", MouseXPosition);
				setGlobalState("clientYPosition1", MouseYPosition);
			}
			// container.width = `${usecase.length * 54}px`;
			// container.height = '35px';
			// container.cornerRadius = 20;
			// sectionNameUI.fontSize = 12;
			// container.background = '#071122CC';
			// if(hotspotLabelIndex == -1) {
			// 	sectionNameUI.text = props.extraData[hotspotLabelIndex].short_label;
			// }
			// // sectionNameUI.text = usecase.textData;
			// sectionNameUI.color = '#FFFFFF';
		});

		container.onPointerOutObservable.add(() => {
			setGlobalState("HoverLabel", "");
			setGlobalState("HoverUseCaseId",0);
			setGlobalState("clientXPosition1", -20);
			setGlobalState("clientYPosition1", -20);
			clientXPosition = -20
			// if (scene.activeCamera.name.includes('security-camera')) {
			// 	container.width = '90px';
			// 	container.height = '90px';
			// 	container.cornerRadius = 50;
			// 	container.children[0].fontSize = 18;
			// } else {
			// 	container.width = '30px';
			// 	container.height = '30px';
			// 	container.cornerRadius = 30;
			// }
			// // sectionNameUI.color = 'rgba(255, 255, 255, 1)';
			// container.background = '#071122CC';
			// sectionNameUI.text = usecase.name;
			//sectionNameUI.color = 'rgba(127, 201, 250, 1)';
		});
	// 	container.onPointerClickObservable.add(() => {
    //   setGlobalState("HoverUseCaseId", usecase.id);
	// 		if (scene.activeCamera.name.includes('security-camera')) {
	// 			container.width = '90px';
	// 			container.height = '90px';
	// 			container.cornerRadius = 50;
	// 			container.children[0].fontSize = 18;
	// 		} else {
	// 			container.width = '30px';
	// 			container.height = '30px';
	// 			container.cornerRadius = 30;
	// 		}
	// 		// sectionNameUI.color = 'rgba(255, 255, 255, 1)';
	// 		container.background = '#071122CC';
	// 		sectionNameUI.text = usecase.name;
    // });
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

		// const container = new Rectangle(`section-${section.id}-container`);

		// container.width = '130px';
		// container.height = '65px';
		// container.cornerRadius = 20;
		// container.background = 'rgba(11, 55, 164, 0.7)';
		// container.thickness = 0;

		// // if section name contain 2 or more words, make it two line and make first line two words

		// // if section name IT room make it one line

		// const sectionName = section.name.split(' ');
		// const firstLine =
		// 	sectionName.length > 2 ? sectionName[0] + ' ' + sectionName[1] : sectionName[0];

		// const secondLine = sectionName.length > 2 ? sectionName[2] : sectionName[1];

		// const text1 = new TextBlock(`section-${section.id}-text-1`, firstLine);
		// text1.fontSize = 16;
		// text1.color = 'rgba(127, 201, 250, 1)';
		// text1.fontSize = 16;
		// text1.fontFamily = 'Helvetica';
		// text1.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
		// text1.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
		// text1.top = '-8px';
		// container.addControl(text1);

		// const text2 = new TextBlock(`section-${section.id}-text-2`, secondLine);
		// text2.color = 'white';
		// text2.fontSize = 16;
		// text2.color = 'rgba(127, 201, 250, 1)';
		// text2.fontFamily = 'Helvetica';
		// text2.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
		// text2.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
		// text2.top = '11px';

		// if (section.name === 'IT Room') {
		// 	text1.text = section.name;
		// 	text1.top = '0px';
		// } else {
		// 	container.addControl(text2);
		// }

		// texture.addControl(container);
		// container.linkWithMesh(fakeMesh);

		// // hide containers by default
		// container.isVisible = true;

		// add click event listener to contianer
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

		// if (section.name === 'IT Room') {
		// 	securityCamera.alpha = 0.98;
		// 	securityCamera.lowerAlphaLimit = securityCamera.alpha - 0.25;
		// 	securityCamera.upperAlphaLimit = securityCamera.alpha + 0.75;
		// }

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

		const canvas = document.getElementById('renderCanvas');

		// disable camera up and down movements
		securityCamera.beta = 1.2;

		// container.onPointerClickObservable.add(() => {
		// 	hideSectionUIs(scene);
		// 	hideInfoUIs(scene);

		// 	scene.activeCamera = securityCamera;
		// 	securityCamera.attachControl(canvas, true);

		// 	// make visibile to UC's
		// 	const advancedTexture = scene.getTextureByName('myUI');

		// 	section.infos.forEach((usecaseId) => {
		// 		const cnt = advancedTexture.getControlByName(`usecase-${usecaseId}-container`);
		// 		cnt.width = '90px';
		// 		cnt.height = '90px';
		// 		cnt.cornerRadius = 50;
		// 		// make cnt first children fontsize 18
		// 		cnt.children[0].fontSize = 18;
		// 		cnt.isVisible = true;
		// 	});

		// 	// enable start tour and close button
		// });
	};

	useEffect(()=>{
		clientXPosition = -20
		if(currentZoomedSection > 0){
			zoomInToSection(currentZoomedSection)
		}
	},[currentZoomedSection])

 	const zoomInToSection =(i)=>{
		// let section = sections[i]
		let section = sections[usecases[i].section]
		console.log("section",section);
		console.log("i",i);
		hideSectionUIs(scene);
		hideInfoUIs(scene);
		const canvas = document.getElementById('renderCanvas');
		const securityCamera = scene.getCameraByName(`security-camera-${section.id}`);
		scene.activeCamera = securityCamera;
		securityCamera.attachControl(canvas, true);
		
		// make visibile to UC's
		const advancedTexture = scene.getTextureByName('myUI');
		section.infos.forEach((usecaseId) => {
			const currMesh = scene.getMeshByName(`usecase-${usecaseId }-fake-mesh`);
			const currContainer = advancedTexture.getControlByName(`usecase-${ usecaseId}-container`);
			if(!currMesh || !currContainer){
				currMesh.scale(.2);
				currContainer.scale(.2);
			}
			});
	}

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

		// sections.forEach((section) => {
		// 	const container = advancedTexture.getControlByName(`section-${section.id}-container`);
		// 	container.isVisible = true;
		// });

		// usecases.forEach((usecase) => {
		// 	const container = advancedTexture.getControlByName(`usecase-${usecase.id}-container`);
		// 	container.isVisible = true;
		// });
	};

	const onSceneReady = useCallback(async (s) => {
		createSectionsGUI(s);
		createUCGUI(s);
		hideSectionUIs(s);
		hideInfoUIs(s);

		loadModels(s);

		setScene(() => s);
	}, [props.extraData]);

	const handleMoveCameraOnClose = () => {
		Howler.stop();

		if (scene.activeCamera.name === 'camera-2') {
			return;
		}

		const model = scene.getMeshByName('factory-model');
		model.position = new Vector3(0, 0, 0);

		const arcRotateCamera = scene.getCameraByName('camera-2');
		arcRotateCamera.restoreState();
		const advancedTexture = scene.getTextureByName('myUI');
		sections.forEach((section) => {
			const securityCamera = scene.getCameraByName(`security-camera-${section.id}`);
			securityCamera.detachControl();

		section.infos.forEach((usecaseId) => {
			const cnt = advancedTexture.getControlByName(`usecase-${usecaseId}-container`);
			cnt.width = '30px';
			cnt.height = '30px';
			cnt.cornerRadius = 30;

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

	const changeName = (scene) => {
		for(var i = 0; i < props.extraData.length; i++) {
			const advancedTexture = scene.getTextureByName('myUI');
			const cnt = advancedTexture.getControlByName(`usecase-${props.extraData[i].use_case_id}-container`);
			cnt.onPointerEnterObservable.add(() => {
				// sectionNameUI.text = props.extraData[i].short_label;
				// sectionNameUI.text = usecase.textData;
			});
		}
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
	return (
    <div className={styles.app__container}>
{count >= 0 && isWelcome && (
				<div className='Welcome-card-container' style={{zIndex: 99999999999}}>
				 <div className="Welcome-Tour-box-title">
                   <div className='wel-title'> {WelcomeData[count]}</div>
                   <div className='wel-description'>{WelcomeData1[count]}</div>
                 </div>
                 <div>
                   <div
                     style={{ display: "flex", justifyContent: "space-between",cursor:'pointer' }}
                   >
					<div className='welcome-page'>{count+1}/6</div>
					<div style={{display:'flex',justifyContent:'end',alignItems:'center',width:'100%',gap:'5%'}}>
                     <div
                       className="welcome-btn"
					   style={{color:'#0C2055'}}
                       onClick={() => handleSkip()}
					   >
                       Skip
                     </div>
                     <div
                       className="welcome-next-btn"
                       onClick={() => handleNext()}
					   >
                       {count == 5 ? "Start tour" : "Next"}
						 </div>
                     </div>
                   </div>
                 </div>
				</div>

            			)}
      {(isLoading || isWelcome) && <Spinner isWelcome={isWelcome} isLoading={isLoading}/>}

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
