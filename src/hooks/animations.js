import { gsap } from "gsap";
import { Scene, Vector3 } from "@babylonjs/core";
import { Howl } from "howler";
import { setGlobalState, useGlobalState } from "../utils/state";
import { ApplicationDB, assetsLocation, packageApp } from "../assets/assetsLocation";
import { rotateToTarget, spiralAnimation } from "../utils/libraries/CameraUtils";
import { ArcRotateCamera } from "@babylonjs/core";
import { InitializeGoogleAnalytics, TrackGoogleAnalyticsTiming } from "../utils/libraries/googleanalytics.tsx";
import usecases from '../data/usecases.json';
import styles from '../utils/styles/Home.module.css';

let startTime;

let IsTourOpen = true
const setTourState = (onOff) => {
	IsTourOpen = onOff
}
const toggleSectionUIs = (scene) => {
	if (!scene) return;
	const advancedTexture = scene.getTextureByName("myUI");

	if (!advancedTexture) return;

	// sections.forEach((section) => {
	//     const container = advancedTexture.getControlByName(`section-${section.id}-container`);

	//     container.alpha = 0;

	//     gsap.to(container, {
	//         alpha: container.isVisible ? 1 : 0,
	//         duration: 0.5,
	//         ease: "power1.out",
	//         duration: 2,
	//     });

	// });

	// usecases.forEach((usecase) => {
	//     const container = scene.getMeshByName(`usecase-${usecase.id}-fake-mesh`);

	//     container.alpha = 0;
	//     container.isVisible = true;


	//     gsap.to(container, {
	//         alpha: container.isVisible ? 1 : 0,
	//         duration: 0.5,
	//         ease: "power1.out",
	//         duration: 2,
	//     });

	// });
};


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

const moveFirstTarget = (camera) => {
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)
	const sound = new Howl({
		src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/intros/1.mp3` : `../../${ApplicationDB}/audio/intros/1.mp3`,
		html5: true,
		preload: true
	})
	timeline
		.to(camera.position, {
			x: 6.85724,
			y: 2,
			z: -0.614593,
			duration: 1
		})
		.to(camera.rotation, {
			x: 0,
			y: lookAt(6.9717, 2, -8.29712, 6.85724, 2, -0.614593).alpha - 2 * Math.PI,
			duration: 0.4,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play();
					setGlobalState("UCTourId", 1);
					callNextTarget(camera, moveSecondTarget, sound);
				}
			}
		});
	// sound.on("end", function () {
	//     callNextTarget(camera, moveSecondTarget);
	//   });

};

const moveSecondTarget = (camera) => {
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)
	const sound = new Howl({
		src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/intros/2.mp3` : `../../${ApplicationDB}/audio/intros/2.mp3`,
		html5: true,
		preload: true

	})


	timeline
		.to(camera.position, {
			x: -3.42844,
			y: 2,
			z: 4.21576,
			duration: 1,
		})
		.to(camera.rotation, {
			x: 0,
			y: lookAt(-1.59544, 2, -3.14136, -3.42844, 2, 4.21576).alpha - 2 * Math.PI,
			duration: 0.4,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play();
					setGlobalState("UCTourId", 2);
					callNextTarget(camera, moveThirdTarget, sound)
				}
			}
		});

	// sound.play();
	// sound.on("end", function () {
	//     callNextTarget(camera, moveThirdTarget);
	//   });


};

const moveThirdTarget = (camera) => {
	const sound = new Howl({
		src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/intros/3.mp3` : `../../${ApplicationDB}/audio/intros/3.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)

	// rotate camera in y axis
	timeline.to(
		camera.rotation, {
		x: 0,
		y: lookAt(-4.18857, 2, -3.21763, -3.42844, 2, 4.21576).alpha - 2 * Math.PI,
		duration: 0.4,
		onComplete: () => {
			if (IsTourOpen) {
				sound.play();
				setGlobalState("UCTourId", 3);
				callNextTarget(camera, moveFourthTarget, sound)
			}
		}
	})
	// sound.play();
	// sound.on("end", function () {
	//     callNextTarget(camera, moveFourthTarget);
	//   });

};

const moveFourthTarget = (camera) => {
	const sound = new Howl({
		src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/intros/4.mp3` : `../../${ApplicationDB}/audio/intros/4.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)

	timeline.to(camera.rotation, {
		x: 0,
		y: lookAt(-6.39782, 2, -1.28294, -3.42844, 2, 4.21576).alpha - 2 * Math.PI,
		duration: 0.8,
		onComplete: () => {
			if (IsTourOpen) {
				camera.lockedTarget = new Vector3(-6.39782, 2, -1.28294);
			}
		}
	}).to(camera.position, {
		x: -8.37532,
		y: 2,
		z: 3.91916,
		duration: 1,
		onComplete: () => {
			if (IsTourOpen) {
				camera.lockedTarget = null;
				sound.play();
				setGlobalState("UCTourId", 4);
				callNextTarget(camera, moveFifthTarget, sound)
			}
		}
	});
	// sound.play();
	// sound.on("end", function () {
	//     callNextTarget(camera, moveFifthTarget);
	//   });

};

const moveFifthTarget = (camera) => {
	const sound = new Howl({
		src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/intros/5.mp3` : `../../${ApplicationDB}/audio/intros/5.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)

	timeline
		.to(camera.rotation, {
			x: 0,
			y: lookAt(-10.529, 2, -1.33379, -8.37532, 2, 3.91916).alpha,
			duration: 2,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play();
					setGlobalState("UCTourId", 5);
					callNextTarget(camera, moveSixthTarget, sound)
				}
			}
		});


};

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

const moveSixthTarget = (camera) => {
	const sound = new Howl({
		src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/intros/6.mp3` : `../../${ApplicationDB}/audio/intros/6.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline);

	const scene = camera.getScene();

	timeline.to(camera.rotation, {
		x: 0,
		y: lookAt(-2.98, 1, 5.35, -3.18, 1, 5.35).alpha - 2 * Math.PI,
		duration: 0.4,
		onComplete: async () => {
			const crCamera = new ArcRotateCamera(
				`cr-camera`,
				1.57,
				1.2,
				300,
				new Vector3(-2.98, 1, 5.35),
				scene
			);
			scene.activeCamera = crCamera;
			scene.getMeshByName('factory-model').setEnabled(false);
			while (!scene.getMeshByName('tradeshow')) {

			}
			showHotspots(scene, "");
			await scene.getMeshByName('tradeshow').setEnabled(true);

			const timeline = gsap.timeline();
			timeline.to(crCamera, {
				radius: 300,
				duration: 1,
				ease: "power1.out",
				onComplete: () => {
					// setSubModelsLoading(false);
				}
			}).to(crCamera, {
				radius: 28,
				duration: 0.5,
				ease: "power1.out",
			}).to(crCamera, {
				alpha: -3.85 + Math.PI,
				duration: 3,
				ease: "power1.out",
				onComplete: () => {
					showHotspots(scene, "tradeShows");
					if (IsTourOpen) {
						sound.play()
						setGlobalState("UCTourId", 6);
						callNextTarget(camera, moveToOuterCamera, sound)
					}
				}
			});
			timeline.play();
		}
	});
};

const moveToOuterCamera = async (camera) => {
	setGlobalState("UCTourId", 0);
	const scene = camera.getScene();
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline);

	const crCamera = new ArcRotateCamera(
		`cr-camera`,
		1.57,
		1.2,
		300,
		new Vector3(-2.98, 1, 5.35),
		scene
	);
	scene.activeCamera = crCamera;
	scene.getMeshByName('tradeshow').setEnabled(false);
	while (!scene.getMeshByName('factory-model')) {
	}
	await scene.getMeshByName('factory-model').setEnabled(true);
	const arcRotateCamera = scene.getCameraByName('camera-2');
	const cam3 = scene.getCameraByName('camera-3');
	const canvas = document.getElementsByClassName("main-canvas")[0];
	await showHotspots(scene, "usecase");
	Howler.stop()
	scene.activeCamera.computeWorldMatrix();
	cam3.position.copyFrom(scene.activeCamera.position);
	cam3.setTarget(scene.activeCamera.target.clone());
	arcRotateCamera.restoreState();
	arcRotateCamera.computeWorldMatrix();
	rotateToTarget(scene, arcRotateCamera.target, cam3, 0.4, spiralAnimation, scene, arcRotateCamera.target, cam3.position, arcRotateCamera.position, 1000, 1, (arcRotateCamera, canvas) => { scene.activeCamera = arcRotateCamera; arcRotateCamera.attachControl(canvas, true); enableCameraMovement(camera); setGlobalState("IsTourOpen", false); }, arcRotateCamera, canvas);

	const endTime = performance.now();
	// useEffect(() => {
	InitializeGoogleAnalytics();
	TrackGoogleAnalyticsTiming("Immersive Tour", "Tour Track", endTime - startTime, "Story Process 3D");
	// }, []);
}


const moveCameraOnClose = (camera) => {

	const closeBtn = document.querySelector("#close-btn");
	// closeBtn.setAttribute("disabled", true);
	const timeline = gsap.timeline();

	const scene = camera.getScene();

	const camera2 = scene.getCameraByName("camera-2")
	camera2.restoreState();
	scene.activeCamera = camera2;
	toggleSectionUIs(scene);

	timeline
		.to(camera.position, {
			x: -16,
			y: 33,
			z: 58,
			duration: 3,
			ease: "power1.out"
		})


	timeline
		.to(camera.rotation, {
			x: 0.27,
			y: - 2.8,
			z: 0,
			duration: 3.5,
			ease: "power1.out",
			onComplete: () => {






				// here
				// const advancedTexture = scene.getTextureByName("myUI");

				// if (!advancedTexture) return;


				// const container = advancedTexture.getControlByName(`section-1-container`);

				// if (!container.isVisible){enableCameraMovement(camera);}
				enableCameraMovement(camera);

				const closeBtn = document.querySelector("#close-btn");
				closeBtn.removeAttribute("disabled");

				const startBtn = document.querySelector("#tour");
				startBtn.removeAttribute("disabled");


			}

		})
};

// const moveCameraToIT = (camera) => {

//     gsap.to(camera.position, {
//         x: -67,
//         y: 4.63,
//         z: 24.4,
//         duration: 3,
//         ease: "power1.out"
//     })

//     gsap.to(camera.rotation, {
//         x: 0.13,
//         y: -2.8,
//         z: 0,
//         duration: 3,
//     })


// };



const disableCameraMovementOnTour = (camera) => {
	camera.inputs.attached.mouse.detachControl();
};


const enableCameraMovement = (camera) => {

	// check if camera is attached to mouse input 
	if (!camera || !camera.inputs || camera.inputs.attached.mouse) return;

	// camera.inputs.attachInput(camera.inputs.attached.mouse);
	camera.inputs.addMouseWheel();
	camera.inputs.addPointers();
};
const startAnimations = (scene) => {
	const freeCam = scene.getCameraByName("camera-1");
	startTime = performance.now();

	freeCam.position = new Vector3(1.04175, 2, 5.73054);
	// freeCam.setTarget(new Vector3(-80.13,2,-19.147));
	freeCam.setTarget(new Vector3(-0.832747, 2, -0.832747));
	scene.activeCamera = freeCam;

	const startBtn = document.querySelector("#tour");
	// startBtn.setAttribute("disabled", true);

	disableCameraMovementOnTour(freeCam);
	gsap.globalTimeline.getChildren().forEach(child => child.kill());
	const bgMusic = new Howl({
		src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/uc_music/immersive.mp3` : `../../${ApplicationDB}/audio/uc_music/immersive.mp3`,
		loop: true,
		volume: 0.15,
		html5: true
	});
	const sound = new Howl({
		src: !packageApp ? `${assetsLocation}${ApplicationDB}/audio/intros/0.mp3` : `../../${ApplicationDB}/audio/intros/0.mp3`,
		html5: true
	});
	bgMusic.play();
	sound.play();
	sound.on("end", function () {
		moveFirstTarget(freeCam);
	});
	// setTimeout(() => {
	// }, 1500);

};



const callNextTarget = (camera, fn, sound) => {

	sound.on("end", function () {
		setGlobalState("UCTourId", 0);
		fn(camera);
	});

}

export { startAnimations, moveCameraOnClose, toggleSectionUIs, enableCameraMovement, disableCameraMovementOnTour, setTourState };