import { gsap } from "gsap";
import { Vector3 } from "@babylonjs/core";
import { Howl } from "howler";
import { setGlobalState, useGlobalState } from "../utils/state";
import { ApplicationDB, assetsLocation } from "../assets/assetsLocation";

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

	// Calculate the beta angle (elevation from the horizontal plane)
	let distance = Math.sqrt(direction.x * direction.x + direction.z * direction.z);
	let beta = Math.atan2(direction.y, distance);

	console.log(alpha, beta);
	if (Math.abs(alpha) > Math.abs(alpha + 2 * Math.PI))
		alpha = alpha + 2 * Math.PI;
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
		src: `${assetsLocation}${ApplicationDB}/audio/intros/1.mp3`,
		html5: true,
		preload: true
	})
	timeline
		.to(camera.position, {
			x: -54.126,
			y: 2,
			z: -19.147,
			duration: 3
		})
		.to(camera.rotation, {
			x: 0,
			y: lookAt(-58.141, 2, -16.087, -54.126, 2, -19.147).alpha,
			duration: 2,
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
		src: `${assetsLocation}${ApplicationDB}/audio/intros/11.mp3`,
		html5: true,
		preload: true

	})


	timeline
		.to(camera.rotation, {
			x: 0.2797833944525906,
			y: -1.729744737715753,
			duration: 2,
		})
		.to(camera.position, {
			x: -57.508,
			y: 2,
			z: -19.147,
			duration: 2,
		})
		.to(camera.rotation, {
			y: 0,
			duration: 2,
		})
		.to(camera.position, {
			x: -57.508,
			y: 2,
			z: 4.6328,
			duration: 2,
		})
		.to(camera.rotation, {
			x: 0,
			y: lookAt(-47, 2, 7, -57.508, 2, 4.6328).alpha,
			duration: 3,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play();
					setGlobalState("UCTourId", 11);
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
		src: `${assetsLocation}${ApplicationDB}/audio/intros/13.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)

	// rotate camera in y axis
	timeline.to(
		camera.rotation, {
		x: 0,
		y: lookAt(-52, 2, -1.3, -57.508, 2, 4.6328).alpha,
		duration: 2,
		onComplete: () => {
			if (IsTourOpen) {
				sound.play();
				setGlobalState("UCTourId", 13);
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
		src: `${assetsLocation}${ApplicationDB}/audio/intros/2.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)

	timeline.to(camera.rotation, {
		x: 0.2797833944525906,
		y: -1.729744737715753,
		z: 0,
		duration: 1.5,
	}).to(camera.position, {
		x: -68.739,
		y: 2,
		z: 4.6328,
		duration: 3,

	})
		.to(camera.rotation, {
			x: 0,
			y: lookAt(-68.8572, 2, 8.13481, -68.739, 2, 4.6328).alpha,
			duration: 2,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play();
					setGlobalState("UCTourId", 2);
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
		src: `${assetsLocation}${ApplicationDB}/audio/intros/8.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)

	timeline
		.to(camera.rotation, {
			x: 0,
			y: lookAt(-70, 2, -0.5, -68.739, 2, 4.6328).alpha,
			duration: 2,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play();
					setGlobalState("UCTourId", 8);
					callNextTarget(camera, moveSixthTarget, sound)
				}
			}
		});


};

const moveSixthTarget = (camera) => {
	const sound = new Howl({
		src: `${assetsLocation}${ApplicationDB}/audio/intros/6.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)

	timeline.to(camera.rotation, {
		x: 0.2797833944525906,
		y: -1.729744737715753,
		z: 0,
		duration: 1.5,
	}).to(camera.position, {
		x: -87.06,
		y: 2,
		z: 4.6328,
		duration: 3,
	})
		.to(camera.rotation, {
			x: 0,
			y: lookAt(-90, 2, -1.5, -87.06, 2, 4.6328).alpha,
			duration: 2,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play()
					setGlobalState("UCTourId", 6);
					callNextTarget(camera, moveSixthTarget2, sound)
				}
			}
		});



};


const moveSixthTarget2 = (camera) => {
	const sound = new Howl({
		src: `${assetsLocation}${ApplicationDB}/audio/intros/4.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline);
	timeline.to(camera.rotation, {
		x: 0,
		y: lookAt(-91.6166, 2, 9.8, -87.06, 2, 4.6328).alpha,
		duration: 3,
		onComplete: () => {
			if (IsTourOpen) {
				sound.play()
				setGlobalState("UCTourId", 4);
				callNextTarget(camera, moveSeventhTarget, sound)
			}
		}
	})


};

const moveSeventhTarget = (camera) => {
	const sound = new Howl({
		src: `${assetsLocation}${ApplicationDB}/audio/intros/14.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)
	timeline.to(camera.rotation, {
		x: 0.2797833944525906,
		y: -1.729744737715753,
		duration: 1.5,
	}).to(camera.position, {
		x: -94.672,
		y: 2,
		z: 4.6328,
		duration: 2,
	}).to(camera.rotation, {
		y: -Math.PI,
		duration: 2,
	})
		.to(camera.position, {
			x: -94.672,
			y: 2,
			z: -8.8227,
			duration: 2,
		})
		.to(camera.rotation, {
			x: 0,
			// y: lookAt(-94, 2, -16, -94.672, 2, -8.8227).alpha,
			duration: 2,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play()
					setGlobalState("UCTourId", 14);
					callNextTarget(camera, moveEighthTarget, sound)
				}
			}
		});
};



const moveEighthTarget = (camera) => {
	const sound = new Howl({
		src: `${assetsLocation}${ApplicationDB}/audio/intros/12.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)
	timeline.to(camera.rotation, {
		x: 0.2797833944525906,
		duration: 1.5,
	}).to(camera.position, {
		x: -94.672,
		y: 2,
		z: -19.036,
		duration: 2,
	}).to(camera.rotation, {
		y: - 2 * Math.PI + 1.729744737715753,
		duration: 2,
	})
		.to(camera.position, {
			x: -75.539,
			y: 2,
			z: -19.036,
			duration: 3,
		})
		.to(camera.rotation, {
			x: 0,
			y: lookAt(-75, 2, -24, -75.539, 2, -19.036).alpha - 2 * Math.PI,
			duration: 2,
			onComplete: () => {
				if (IsTourOpen) {
					sound.play()
					setGlobalState("UCTourId", 12);
					callNextTarget(camera, moveNinthTarget, sound);
				}
			}
		})
};

const moveNinthTarget = (camera) => {
	const sound = new Howl({
		src: `${assetsLocation}${ApplicationDB}/audio/intros/7.mp3`,
		html5: true,
		preload: true

	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline);

	timeline.to(camera.rotation, {
		x: 0,
		y: lookAt(-65, 2, -23, -75.539, 2, -19.036).alpha - 2 * Math.PI,
		duration: 2,
		onComplete: () => {
			if (IsTourOpen) {
				sound.play()
				setGlobalState("UCTourId", 7);
				callNextTarget(camera, moveTenthTarget, sound);
			}
		}
	})
};

const moveTenthTarget = (camera) => {
	const sound = new Howl({
		src: `${assetsLocation}${ApplicationDB}/audio/intros/5.mp3`,
		html5: true,
		preload: true
	})
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline);

	timeline.to(camera.rotation, {
		x: 0,
		y: lookAt(-70, 2, -12, -75.539, 2, -19.036).alpha - 2 * Math.PI,
		duration: 2,
		onComplete: () => {
			sound.play()
			setGlobalState("UCTourId", 5);
			callNextTarget(camera, moveEleventhTarget, sound);
		}
	})
};

const moveEleventhTarget = (camera) => {
	// const sound = new Howl ({
	//     src: `${assetsLocation}${ApplicationDB}/audio/intros/14.mp3`,
	//     html5: true
	// })
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)

	timeline.to(camera.rotation, {
		x: 0.2797833944525906,
		duration: 5,
		onComplete: () => {
			// sound.play()
			setGlobalState("UCTourId", 0);
			setGlobalState("IsTourOpen", false);
			moveToOuterCamera(camera);
		}

	})

};

const moveToOuterCamera = (camera) => {
	setGlobalState("UCTourId", 0);
	const timeline = gsap.timeline();
	gsap.globalTimeline.add(timeline)
	const scene = camera.getScene();
	// scene.activeCamera = scene.getCameraByName("camera-2")
	const camera2 = scene.getCameraByName("camera-2");
	scene.activeCamera = camera2;


	camera2.restoreState();
	toggleSectionUIs(scene);

	timeline
		.to(camera.position, {
			x: -120,
			duration: 3,
			ease: "power1.out",
			onComplete: () => {
				setGlobalState("IsTourOpen", true);


				enableCameraMovement(camera);

				const closeBtn = document.querySelector("#close-btn");
				closeBtn.removeAttribute("disabled");

				const startBtn = document.querySelector("#tour");
				startBtn.removeAttribute("disabled");
			}
		})


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


	freeCam.position = new Vector3(-40.13, 2, -19.147);
	// freeCam.setTarget(new Vector3(-80.13,2,-19.147));
	freeCam.rotation = new Vector3(0.2797833944525906, -1.729744737715753, 0);

	scene.activeCamera = freeCam;

	const startBtn = document.querySelector("#tour");
	// startBtn.setAttribute("disabled", true);

	disableCameraMovementOnTour(freeCam);
	gsap.globalTimeline.getChildren().forEach(child => child.kill());
	const sound = new Howl({
		src: `${assetsLocation}${ApplicationDB}/audio/intros/0.mp3`,
		html5: true
	})
	sound.play()
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