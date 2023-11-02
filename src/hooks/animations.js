import { gsap } from "gsap";
import sections from "../data/sections.json";
import { Vector3 } from "@babylonjs/core";
import usecases from "../data/usecases.json";
import { Howl } from "howler";
import { setGlobalState, useGlobalState } from "../state";
import { StoryProc3D, assetsLocation } from "../assets/assetsLocation";

let IsTourOpen = true
const setTourState = (onOff)=>{
    IsTourOpen = onOff
}
const toggleSectionUIs = (scene) => {
    if (!scene) return;
    const advancedTexture = scene.getTextureByName("myUI");

    if (!advancedTexture) return;

    sections.forEach((section) => {
        const container = advancedTexture.getControlByName(`section-${section.id}-container`);

        container.alpha = 0;
        container.isVisible = !container.isVisible;;

        gsap.to(container, {
            alpha: container.isVisible ? 1 : 0,
            duration: 0.5,
            ease: "power1.out",
            duration: 2,
        });

    });

    usecases.forEach((usecase) => {
        const container = advancedTexture.getControlByName(`usecase-${usecase.id}-container`);

        container.alpha = 0;
        container.isVisible = true;


        gsap.to(container, {
            alpha: container.isVisible ? 1 : 0,
            duration: 0.5,
            ease: "power1.out",
            duration: 2,
        });

    });
};





const moveFirstTarget = (camera) => {

    const timeline = gsap.timeline();
    gsap.globalTimeline.add(timeline)
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/1.mp3`,
        html5: true,
        preload:true
    })
    timeline
        .to(camera.position, {
            x: -12,
            y: 2.5,
            z: 4.8,
            duration: 3
        })
        .to(camera.rotation, {
            x: 0.2797833944525906,
            y: -1.729744737715753,
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
        src: `${assetsLocation}${StoryProc3D}/audio/intros/11.mp3`,
        html5: true,
        preload:true

    })


    timeline.to(camera.position, {
        x: -30,
        y: 2.5,
        z: 4.5,
        duration: 3,

    });

    gsap.to(
        camera.rotation, {
        x: 0.25100995695259154,
        y: -1.0734955447982695,
        z: 0,
        duration: 1.5,
        delay: 1.5,
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
        src: `${assetsLocation}${StoryProc3D}/audio/intros/13.mp3`,
        html5: true,
        preload:true

    })
    const timeline = gsap.timeline();
    gsap.globalTimeline.add(timeline)
    gsap.to(camera.position, {
        x: -37,
        y: 2.5,
        z: 4.8,
        duration: 3,
        ease: "none"
    });


    // rotate camera in y axis
    timeline.to(
        camera.rotation, {
        y: -1.5,
        duration: 2,
    })

    gsap.to(
        camera.rotation, {
        y: -2.9,
        x: 0.009319252382391422,
        duration: 2,
        delay: 2,
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
        src: `${assetsLocation}${StoryProc3D}/audio/intros/2.mp3`,
        html5: true,
        preload:true

    })
    const timeline = gsap.timeline();
    gsap.globalTimeline.add(timeline)

    timeline.to(camera.rotation, {
        x: 0.2797833944525906,
        y: -1.729744737715753,
        z: 0,
        duration: 1.5,
    }).to(camera.position, {
        x: -61,
        y: 2,
        z: 4.8,
        duration: 3,

    })

    gsap.to(camera.rotation, {
        x: 0.14641971875000054,
        y: -0.9016915187780603,
        duration: 2,
        delay: 3.5,
        onComplete: () => {
            if (IsTourOpen) {
            sound.play();
            setGlobalState("UCTourId", 2);
            callNextTarget(camera, moveFifthTarget, sound)
        }
        }

    })
    // sound.play();
    // sound.on("end", function () {
    //     callNextTarget(camera, moveFifthTarget);
    //   });

};

const moveFifthTarget = (camera) => {
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/8.mp3`,
        html5: true,
        preload:true

    })
    const timeline = gsap.timeline();
    gsap.globalTimeline.add(timeline)

    timeline.to(camera.rotation, {
        x: 0.2797833944525906,
        y: -1.729744737715753,
        z: 0,
        duration: 2,

    }).to(camera.position, {
        x: -70,
        y: 1.956003718383328,
        z: 4.8,
        duration: 3,
        ease: "none"
    })

    gsap.to(camera.rotation, {
        x: 0.126,
        y: -3,
        duration: 2,
        delay: 2.5,
        onComplete: () => {
            if (IsTourOpen) {
            sound.play();
            setGlobalState("UCTourId", 8);
            callNextTarget(camera, moveSixthTarget, sound)
        }
        }
    })



};

const moveSixthTarget = (camera) => {
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/5.mp3`,
        html5: true,
        preload:true

    })
    const timeline = gsap.timeline();
    gsap.globalTimeline.add(timeline)

    timeline.to(camera.rotation, {
        x: 0.2797833944525906,
        y: -1.729744737715753,
        z: 0,
        duration: 1.5,
    }).to(camera.position, {
        x: -76,
        y: 1.75,
        duration: 3,
    })

    gsap.to(camera.rotation, {
        x: 0.126,
        y: -0.13,
        duration: 1.5,
        delay: 2.5
    })

    gsap.to(camera.position, {
        x: -76.5,
        y: 1.75,
        z: 15,
        duration: 3,
        delay: 6
    })

    gsap.to(camera.rotation, {
        x: 0.3,
        y: 1.12,
        duration: 2,
        delay: 8,
        onComplete: () => {
            if (IsTourOpen) {
            sound.play()
            setGlobalState("UCTourId", 5);
            callNextTarget(camera, moveSixthTarget2, sound)
        }
        }
    });



};


const moveSixthTarget2 = (camera) => {
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/12.mp3`,
        html5: true,
        preload:true

    })
    gsap.to(camera.position, {
        x: -75,
        y: 2.7,
        z: 27,
        duration: 3,
    })

    gsap.to(camera.rotation, {
        x: -0.05,
        y: 2.55,
        duration: 3,
        onComplete: () => {
            if (IsTourOpen) {
            sound.play()
            setGlobalState("UCTourId", 12);
            callNextTarget(camera, moveSixthTarget3, sound)
        }
        }
    })


};

const moveSixthTarget3 = (camera) => {
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/7.mp3`,
        html5: true,
        preload:true

    })
    gsap.to(camera.position, {
        x: -75,
        y: 2.7,
        z: 27,
        duration: 3,
    })

    gsap.to(camera.rotation, {
        x: -0.05,
        y: 2.55,
        duration: 3,
        onComplete: () => {
            if (IsTourOpen) {
            sound.play()
            setGlobalState("UCTourId", 7);
            callNextTarget(camera, moveSeventhTarget, sound)
        }
        }
    })


};

const moveSeventhTarget = (camera) => {
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/4.mp3`,
        html5: true,
        preload:true

    })
    const timeline = gsap.timeline();
    gsap.globalTimeline.add(timeline)
    timeline.to(camera.rotation, {
        x: 0,
        y: 3,
        z: 0,
        duration: 1.5,
    }).to(camera.position, {
        x: -76.5,
        y: 1.75,
        z: 15,
        duration: 3,
        ease: "none"
    }).to(camera.position, {
        y: 2,
        z: 4.8,
        duration: 2,
    })



    gsap.to(camera.rotation, {
        x: 0.05,
        y: 4.487835249499371,
        duration: 2.5,
        delay: 5
    })

    gsap.to(camera.position, {
        x: -83,
        y: 2,
        z: 4.8,
        duration: 2.5,
        delay: 6.5
    })
    gsap.to(
        camera.rotation, {
        x: 0.01001562499999997,
        y: 3.6572926585271874,
        duration: 2,
        delay: 7,
        onComplete: () => {
            if (IsTourOpen) {
            sound.play()
            setGlobalState("UCTourId", 4);
            callNextTarget(camera, moveEighthTarget, sound)
        }
        }
    });



};



const moveEighthTarget = (camera) => {
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/6.mp3`,
        html5: true,
        preload:true

    })
    gsap.to(camera.rotation, {
        x: 0.05,
        y: 4.487835249499371,
        duration: 3,
    })

    gsap.to(camera.position, {
        x: -84,
        y: 2,
        z: 4.8,
        duration: 3,
        delay: 4
    })

    gsap.to(camera.rotation, {
        x: 0.05687500000000002,
        y: 5.515267819819987,
        duration: 2,
        delay: 5,
        onComplete: () => {
            if (IsTourOpen) {
            sound.play()
            setGlobalState("UCTourId", 6);
            callNextTarget(camera, moveNinthTarget, sound)
        }
        }
    })


};

const moveNinthTarget = (camera) => {
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/14.mp3`,
        html5: true,
        preload:true

    })
    const timeline = gsap.timeline();
    gsap.globalTimeline.add(timeline)

    timeline.to(camera.rotation, {
        x: 0.05,
        y: 4.487835249499371,
        duration: 3,
    })

    timeline.to(camera.position, {
        x: -108,
        z: 4.8,
        duration: 5,
        delay: 3,
        onComplete: () => {
            if (IsTourOpen) {
            sound.play()
            setGlobalState("UCTourId", 14);
            moveTenthTarget(camera);
            // moveToOuterCamera(camera);
        }
        }

    })

};
const moveTenthTarget = (camera) => {
    // const sound = new Howl ({
    //     src: `${assetsLocation}${StoryProc3D}/audio/intros/14.mp3`,
    //     html5: true
    // })
    const timeline = gsap.timeline();
    gsap.globalTimeline.add(timeline)

    timeline.to(camera.rotation, {
        x: 0.05,
        y: 4.487835249499371,
        duration: 3,
    })

    timeline.to(camera.position, {
        x: -125,
        z: 4.8,
        duration: 5,
        delay: 3,
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
            ease: "none",
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
            ease: "none"
        })


    timeline
        .to(camera.rotation, {
            x: 0.27,
            y: - 2.8,
            z: 0,
            duration: 3.5,
            ease: "none",
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
//         ease: "none"
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


    freeCam.position = new Vector3(13.892347024014637, 4.3472194044273555, 4.757436822500906);
    freeCam.rotation = new Vector3(0.2797833944525906, -1.729744737715753, 0);

    scene.activeCamera = freeCam;

    const startBtn = document.querySelector("#tour");
    // startBtn.setAttribute("disabled", true);

    disableCameraMovementOnTour(freeCam);
    gsap.globalTimeline.getChildren().forEach(child => child.kill());
    const sound = new Howl({
        src: `${assetsLocation}${StoryProc3D}/audio/intros/0.mp3`,
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

export { startAnimations, moveCameraOnClose, toggleSectionUIs, enableCameraMovement, disableCameraMovementOnTour,setTourState };