import * as THREE from "three";
import { createScene, handleResize } from "../Components/sceneSetup";
import { setupControls } from "../Components/controls";
import { loadAvatar } from "../Components/avatarLoader";
import { updatePhysics, updateIdleDrift } from "../Components/physics";
import { FaceController } from "../Components/facialAnimation";
import { createBoneProxy, runASLSign } from "../Components/aslProxy";
import { CAMERA_POSITIONS } from "./config";
import { wordMap } from "../Components/wordMap";


export function initAvatar(mountEl, onLoaded) {
  let stop = false;
  let isWordPlaying = false;

  const { scene, camera, renderer } = createScene(mountEl);
  const controls = setupControls(camera, renderer.domElement);

  let realBones = {};
  let boneStates = {};
  let boneProxy = null;
  let faceController = null;

  let mixer = null;
  const clips = {};

  let activeSide = "RIGHT";
  let activeSign = null;
  let signStartTime = 0;

  const restPose = {};


  loadAvatar(scene, "/test1.glb", (loaderData) => {
    const {
      gltf,
      avatarScene,
      realBones: rb,
      boneStates: bs,
      morphDict,
    } = loaderData;

    realBones = rb;
    boneStates = bs;

    boneProxy = createBoneProxy(realBones, boneStates);
    faceController = new FaceController(morphDict);

    // Capture rest pose
    for (const name in realBones) {
      restPose[name] = realBones[name].quaternion.clone();
    }

    applyArmPose();

    mixer = new THREE.AnimationMixer(avatarScene);

    if (gltf.animations && gltf.animations.length) {
      gltf.animations.forEach((clip) => {
        clips[clip.name.toLowerCase()] = clip;
      });

    } else {
      console.error("NO ANIMATIONS FOUND IN GLB");
    }

    if (onLoaded) onLoaded();
  });


  function resetAll() {
    for (const name in restPose) {
      const bone = realBones[name];
      const state = boneStates[name];
      if (!bone || !state) continue;

      bone.quaternion.copy(restPose[name]);
      state.currentQ.copy(restPose[name]);
      state.targetQ.copy(restPose[name]);
      state.velocity.set(0, 0, 0, 0);
    }
  }

  function setBoneEuler(name, x, y, z) {
    const bone = realBones[name];
    const state = boneStates[name];
    if (!bone || !state) return;

    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        THREE.MathUtils.degToRad(x),
        THREE.MathUtils.degToRad(y),
        THREE.MathUtils.degToRad(z)
      )
    );

    bone.quaternion.copy(q);
    state.currentQ.copy(q);
    state.targetQ.copy(q);
    state.velocity.set(0, 0, 0, 0);
  }

  function applyArmPose() {
    if (activeSide === "RIGHT") {
      setBoneEuler("mixamorig9RightArm", 50, -10, 10);
      setBoneEuler("mixamorig9RightForeArm", 20, 40, -140);
      setBoneEuler("mixamorig9RightHand", -40, -15, -20);
    } else {
      setBoneEuler("mixamorig9LeftArm", 50, -10, 10);
      setBoneEuler("mixamorig9LeftForeArm", 0, -40, 120);
      setBoneEuler("mixamorig9LeftHand", -20, 10, 0);
    }
  }


  const clock = new THREE.Clock();

  function animate() {
    if (stop) return;
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.05);
    const now = clock.elapsedTime;

    // ✅ ALWAYS update mixer
    if (mixer) mixer.update(dt);

    // Physics only for letters
    if (!isWordPlaying) {
      updatePhysics(dt, boneStates, realBones);
      updateIdleDrift(now, realBones);
    }

    // Face controller unchanged
    if (faceController) faceController.update(now);

    // Letter ASL only when active
    if (boneProxy && !isWordPlaying && activeSign) {
      runASLSign(activeSign, boneProxy, now - signStartTime, activeSide);
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  const onResize = () => handleResize(mountEl, camera, renderer);
  window.addEventListener("resize", onResize);

  // =========================
  // PUBLIC API
  // =========================
  return {
    playSign: (char) => {
      if (isWordPlaying) return;
      activeSign = char.toLowerCase();
      signStartTime = clock.elapsedTime;
      faceController?.triggerViseme(activeSign, signStartTime);
    },


    playWord: (input) => {
      if (!mixer) return false;

      const normalized = input.toLowerCase().trim();

      // Resolve alias (handles 2+ words)
      const mapped = wordMap[normalized] || normalized;

      const clip = clips[mapped];
      if (!clip) return false;

      isWordPlaying = true;
      activeSign = null;

      mixer.stopAllAction();
      resetAll();
      applyArmPose();

      const action = mixer.clipAction(clip);
      action.reset();
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();

      const onFinished = (e) => {
        if (e.action !== action) return;
        mixer.removeEventListener("finished", onFinished);

        isWordPlaying = false;

        if (clips["idle"]) {
          const idle = mixer.clipAction(clips["idle"]);
          idle.reset();
          idle.setLoop(THREE.LoopRepeat);
          idle.play();
        }
      };

      mixer.addEventListener("finished", onFinished);

      return true;
    },

    toggleCameraPosition: () => {
      activeSide = activeSide === "RIGHT" ? "LEFT" : "RIGHT";
      resetAll();
      applyArmPose();

      const cfg = CAMERA_POSITIONS[activeSide];
      controls.target.set(cfg.target.x, cfg.target.y, cfg.target.z);
      camera.position.set(cfg.camera.x, cfg.camera.y, cfg.camera.z);
      controls.update();

      return activeSide;
    },

    dispose: () => {
      stop = true;
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
    },
  };
}