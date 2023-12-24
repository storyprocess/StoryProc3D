import React, { useEffect, useRef, useState } from 'react';
import {
	CubeTexture,
	Engine,
	Scene,
	Layer,
	Color4,
	HemisphericLight,
	ArcRotateCamera,
	Vector3,
	SceneLoaderFlags,
	FreeCamera,
	Matrix,
} from '@babylonjs/core';

import styles from '../styles/SceneComponent.module.css';

SceneLoaderFlags.ShowLoadingScreen = false;

const SceneComponent = ({
	antialias,
	engineOptions,
	adaptToDeviceRatio,
	sceneOptions,
	onRender,
	onSceneReady,
	isLoading,
	...rest
}) => {
	const reactCanvas = useRef(null);

	const createCameras = (scene) => {
		const { current: canvas } = reactCanvas;

		// This creates and positions a free camera (non-mesh)
		const camera = new FreeCamera('camera-1', new Vector3(-4, 0, 0), scene);
		const arcRotateCamera = new ArcRotateCamera(
			'camera-2',
			0,
			1,
			10,
			new Vector3(-4, 0, 0),
			scene
		);
		arcRotateCamera.minZ = 0;
		arcRotateCamera.alpha = 1.57;
		arcRotateCamera.beta = 1.1; //1.15
		arcRotateCamera.radius = 26;

		// set limnitations for camera
		arcRotateCamera.lowerBetaLimit = 0.5;
		arcRotateCamera.upperBetaLimit = 1.5;
		arcRotateCamera.lowerRadiusLimit = 10;
		arcRotateCamera.upperRadiusLimit = 70;
		// arcRotateCamera.lowerAlphaLimit = arcRotateCamera.alpha;
		// arcRotateCamera.upperAlphaLimit = arcRotateCamera.alpha;

		// set panning
		// Enable panning
		// make panning axis to model axis (x,z)

		arcRotateCamera.inputs.addMouseWheel();
		arcRotateCamera.inputs.addPointers();
		arcRotateCamera.wheelPrecision = 20;
		// arcRotateCamera.inputs.addKeyboard();
		arcRotateCamera.inputs.attached.pointers.attachControl(canvas, false);
		// Set panning axis

		// Set panning options
		arcRotateCamera.panningSensibility = 170; // Adjust the panning speed as needed
		// set limits for panning
		arcRotateCamera.panningDistanceLimit = 80;
		arcRotateCamera.allowUpsideDown = false;
		arcRotateCamera.panningAxis = new Vector3(1, 1, 0);
		// arcRotateCamera._panningMouseButton = 0;

		// Disable pinch zoom
		arcRotateCamera.pinchDeltaPercentage = 0;

		// Disable double-click zoom
		arcRotateCamera.useInputToRestoreState = false;

		camera.position = new Vector3(13.892347024014637, 4.3472194044273555, 4.757436822500906);

		// set initial camera rotation
		camera.rotation = new Vector3(0.2797833944525906, -1.729744737715753, 0);

		// This attaches the camera to the canvas
		
		scene.clearColor = new Color4(0, 0, 0, 0);
		
		// camera.attachControl(canvas, true);
		arcRotateCamera.storeState() 
		arcRotateCamera.attachControl(canvas, true);
		
		const movingCamera = new FreeCamera('camera-3', new Vector3(-4,0,0), scene);
		movingCamera.position.copyFrom(new Vector3(30,30,50));
		movingCamera.setTarget(arcRotateCamera.target.clone());
		scene.activeCamera = movingCamera;
	};

	const createLights = (scene) => {

		var reflectionTexture = CubeTexture.CreateFromPrefilteredData(
			'https://holonext.blob.core.windows.net/holonext-public-container/public_assets/beko-assets/suburb.env',
			scene
		);
		scene.environmentTexture = reflectionTexture;

		// var layer = new Layer('', backgroundImage, scene, true);

		// layer.isBackground = true;

		// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
		const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

		// Default intensity is 1. Let's dim the light a small amount
		light.intensity = 1;
	};

	// set up basic engine and scene
	useEffect(() => {
		const { current: canvas } = reactCanvas;

		if (!canvas) return;
		// const worker = new Worker("Worker.js");
		// console.log("Non-Null canvas is caught");
		// var offscreen = canvas.transferControlToOffscreen();
		// worker.postMessage({ canvas: offscreen }, [offscreen]);

		const engine = new Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
		const scene = new Scene(engine, sceneOptions);
		if (scene.isReady()) {
			createCameras(scene);
			createLights(scene);

			onSceneReady(scene);
		} else {
			scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
		}

		// scene.registerBeforeRender(function() {
		// 	let mesh = scene.getMeshByName('factory-model');
		// 	if (mesh){
		// 		mesh.addRotation(0, 0.05, 0);
		// 	}
		// })

		engine.runRenderLoop(() => {
			if (typeof onRender === 'function') onRender(scene);

			for(var id = 0; id < 30; id++) {
				if(scene.getMeshByName(`usecase-${id}-fake-mesh`) != null && scene.activeCamera != null) {
					var coordinates = scene.activeCamera.position;
					if(scene.activeCamera.id.includes("security-camera")) {
						coordinates = scene.activeCamera.parent.position;
					}
					var distance = Vector3.Distance(scene.getMeshByName(`usecase-${id}-fake-mesh`).position, coordinates);
					var scalingFactor = 0.015 * distance;
					scene.getMeshByName(`usecase-${id}-fake-mesh`).scaling = new Vector3(scalingFactor, scalingFactor, scalingFactor);
				}
				if(scene.getMeshByName(`usecase-${id}-container`) != null && scene.activeCamera != null) {
					var coordinates = scene.activeCamera.position;
					if(scene.activeCamera.id.includes("security-camera")) {
						coordinates = scene.activeCamera.parent.position;
					}
					var distance = Vector3.Distance(scene.getMeshByName(`usecase-${id}-container`).position, coordinates);
					var scalingFactor = 0.015 * distance;
					scene.getMeshByName(`usecase-${id}-container`).scaling = new Vector3(scalingFactor, scalingFactor, scalingFactor);
				}
			}
			scene.render();
		});

		const resize = () => {
			scene.getEngine().resize();
		};

		if (window) {
			window.addEventListener('resize', resize);
		}

		return () => {
			scene.getEngine().dispose();

			if (window) {
				window.removeEventListener('resize', resize);
			}
		};
	}, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onRender, onSceneReady]);

// 	let zoomCounter = 0;

// 	function handleMouseWheel(event) {
//     if (event.deltaY > 0) {
//         zoomCounter++;
//         if (zoomCounter === 3) {
//               const arc = scene.getCameraByName('camera-2');
// 							arc.position.z +=1 ;
//         }
//     } else {
// 			const arc = scene.getCameraByName('camera-2');
// 			arc.position.z +=1 ;
//     }
// 	}
// // Add an event listener to listen for mouse wheel events
// document.addEventListener('wheel', handleMouseWheel);


	return <canvas ref={reactCanvas} {...rest} id={styles.renderCanvas} className='main-canvas' style={{visibility: isLoading ?'hidden': 'visible'}} />;
};

export default SceneComponent;
