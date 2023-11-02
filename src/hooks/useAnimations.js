import React, { useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { FreeCameraKeyboardMoveInput } from "@babylonjs/core";
import sections from "../data/sections.json";

const useAnimations = (scene) => {

    const [freeCamera, setFreeCamera] = useState(null);
    const [orthgraphicCamera, setOrthographicCamera] = useState(null);



    useEffect(() => {
        if (scene) {
            const fCam = scene.getCameraByName("FreeCamera");
            const oCam = scene.getCameraByName("OrthographicCamera");

            setFreeCamera(() => fCam);
            setOrthographicCamera(() => oCam);
        }


    }, [scene]);



    const toggleSectionUIs = useCallback(() => {



        const advancedTexture = scene.getTextureByName("myUI");

        if (!advancedTexture) return;



        sections.forEach((section) => {
            const container = advancedTexture.getControlByName(`section-${section.id}-container`);

            container.alpha = 0;
            container.isVisible = !container.isVisible;

            gsap.to(container, {
                alpha: container.isVisible ? 1 : 0,
                duration: 0.5,
                ease: "power1.out",
                duration: 2,
            });

        });
    }, [scene]);

    const disableCameraMovementOnTour = () => {

        freeCamera.inputs.remove(freeCamera.inputs.attached.mouse);
        freeCamera.inputs.remove(freeCamera.inputs.attached.keyboard);
    }

    const enableCameraMovement = () => {

        const canvas = scene.getEngine().getRenderingCanvas();
        freeCamera.attachControl(canvas, true);

        freeCamera.inputs.addKeyboard();
        freeCamera.inputs.addMouse();
    }

    const handleNextTarget = useCallback((camera, next) => {
        setTimeout(() => {
            next(camera);
        }, 4500);
    }, []);


    const moveToFirstTarget = useCallback((camera) => {
        const timeline = gsap.timeline();
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
                    handleNextTarget(camera, moveToSecondTarget);
                }
            });


    }, [handleNextTarget]);

    const moveToSecondTarget = useCallback((camera) => {
        const timeline = gsap.timeline();



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
                handleNextTarget(camera, moveToThirdTarget)
            }
        });

    }, [handleNextTarget]);



    const moveToThirdTarget = useCallback((camera) => {
        const timeline = gsap.timeline();
        gsap.to(camera.position, {
            x: -37,
            y: 2.5,
            z: 4.8,
            duration: 3
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
                handleNextTarget(camera, moveToFourthTarget)
            }
        })


    }, [handleNextTarget]);

    const moveToFourthTarget = useCallback((camera) => {
        const timeline = gsap.timeline();

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
                handleNextTarget(camera, moveToFifthTarget)
            }

        })


    }, [handleNextTarget]);


    const moveToFifthTarget = useCallback((camera) => {
        const timeline = gsap.timeline();

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
        })

        gsap.to(camera.rotation, {
            x: 0.126,
            y: -3,
            duration: 2,
            delay: 2.5,
            onComplete: () => {
                handleNextTarget(camera, moveToSixthTarget)
            }
        })
    }, [handleNextTarget]);

    const moveToSixthTarget = useCallback((camera) => {

        const timeline = gsap.timeline();

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
                handleNextTarget(camera, moveToSeventhTarget)
            }
        });
    }, [handleNextTarget]);

    const moveToSeventhTarget = useCallback((camera) => {
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
                handleNextTarget(camera, moveToEighthTarget)
            }
        })

    }, [handleNextTarget]);

    const moveToEighthTarget = useCallback((camera) => {
        const timeline = gsap.timeline();
        timeline.to(camera.rotation, {
            x: 0,
            y: 3,
            z: 0,
            duration: 1.5,
        }).to(camera.position, {
            x: - 76,
            y: 2,
            z: 4.8,
            duration: 3,
        })

        gsap.to(camera.rotation, {
            x: 0.05,
            y: 4.487835249499371,
            duration: 2.5,
            delay: 3
        })

        gsap.to(camera.position, {
            x: -83,
            y: 2,
            z: 4.8,
            duration: 2.5,
            delay: 4.5
        })
        gsap.to(
            camera.rotation, {
            x: 0.01001562499999997,
            y: 3.6572926585271874,
            duration: 2,
            delay: 5,
            onComplete: () => {
                handleNextTarget(camera, moveToNinthTarget)
            }
        });

    }, [handleNextTarget]);


    const moveToNinthTarget = useCallback((camera) => {
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
                handleNextTarget(camera, moveToTenthTarget)
            }
        })

    }, [handleNextTarget]);


    const moveToOuterCamera = useCallback((camera) => {

        const timeline = gsap.timeline();

        timeline
            .to(camera.position, {
                x: -120,
                duration: 3
            }).to(camera.position, {
                y: 9,
                z: 25,
                duration: 3,
            })


        gsap.to(camera.rotation, {
            x: 0.1,
            y: -3,
            duration: 3,
            delay: 3,
        })

        gsap
            .to(camera.position, {
                x: -16,
                y: 33,
                z: 58,
                duration: 6,
                delay: 6,
                ease: "none"
            })


        // how to convert negative rotation y axis  to positive 

        gsap
            .to(camera.rotation, {
                x: 0.27,
                y: - 2.8,
                z: 0,
                duration: 10,
                delay: 6,
                onComplete: () => {
                    const scene = camera.getScene();
                    toggleSectionUIs(scene);

                    scene.activeCamera = scene.getCameraByName("OrthographicCamera")
                    enableCameraMovement(camera);

                    const closeBtn = document.querySelector("#close-btn");
                    closeBtn.removeAttribute("disabled");
                }

            })


    }, [toggleSectionUIs, handleNextTarget]);

    const moveToTenthTarget = useCallback((camera) => {
        const timeline = gsap.timeline();

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
                moveToOuterCamera(camera);
            }

        })

    }, [moveToOuterCamera]);




    const moveCameraOnClose = useCallback((camera) => {
        gsap
            .to(camera.position, {
                x: -16,
                y: 33,
                z: 58,
                duration: 5,
                ease: "none"
            })


        gsap
            .to(camera.rotation, {
                x: 0.27,
                y: - 2.8,
                z: 0,
                duration: 5,
                onComplete: () => {

                    const scene = camera.getScene();
                    toggleSectionUIs(scene);


                    scene.activeCamera = scene.getCameraByName("OrthographicCamera")
                    enableCameraMovement(camera);

                    const closeBtn = document.querySelector("#close-btn");
                    closeBtn.removeAttribute("disabled");
                }

            })


    }, [enableCameraMovement, toggleSectionUIs]);



    const moveCameraToITSection = useCallback((camera) => {
        gsap.to(camera.position, {
            x: -67,
            y: 4.63,
            z: 24.4,
            duration: 3,
            ease: "none"
        })

        gsap.to(camera.rotation, {
            x: 0.13,
            y: -2.8,
            z: 0,
            duration: 3,
        })
    }, []);






    const startAnimation = useCallback(() => {
        const camera = scene.activeCamera;

        disableCameraMovementOnTour();

        setTimeout(() => {
            handleNextTarget(camera, moveToTenthTarget);
        }, 2000);

    }, [scene, moveToFirstTarget, handleNextTarget, disableCameraMovementOnTour]);


    useEffect(() => {
        if (freeCamera && orthgraphicCamera && scene.activeCamera) {
            startAnimation();
        }
    }, [freeCamera, startAnimation]);




    return {
        moveToFirstTarget,
        moveToSecondTarget,
        moveToThirdTarget,
        moveToFourthTarget,
        moveToFifthTarget,
        moveToSixthTarget,
        moveToSeventhTarget,
        moveToEighthTarget,
        moveToNinthTarget,
        moveToTenthTarget,
        moveCameraToITSection,
        moveCameraOnClose
    }

}

export default useAnimations;