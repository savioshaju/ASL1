import * as THREE from "three";
import { createScene, handleResize } from "../Components/sceneSetup";
import { setupControls } from "../Components/controls";
import { loadAvatar } from "../Components/avatarLoader";
import { updatePhysics, updateIdleDrift } from "../Components/physics";
import { FaceController } from "../Components/facialAnimation";
import { createBoneProxy, runASLSign } from "../Components/aslProxy";
import { CAMERA_POSITIONS } from "./config";

export function initAvatar(mountEl, onLoaded) {
  let stop = false;

  // =============================
  // Scene / Camera / Renderer
  // =============================
  const { scene, camera, renderer } = createScene(mountEl);
  const controls = setupControls(camera, renderer.domElement);

  // =============================
  // State
  // =============================
  let realBones = {};
  let boneStates = {};
  let faceController = null;
  let boneProxy = null;

  let activeSide = "LEFT";
  let activeSign = "";
  let signStartTime = 0;

  const restPose = {};

  // =============================
  // Load Avatar
  // =============================
  const loaderData = loadAvatar(scene, "/rest.glb", () => {
    realBones = loaderData.realBones;
    boneStates = loaderData.boneStates;

    faceController = new FaceController(loaderData.morphDict);
    boneProxy = createBoneProxy(realBones, boneStates);

    captureRestPose();
    applyArmPose(); // initial arm pose

    if (onLoaded) onLoaded();
  });

  // =============================
  // Rest Pose Helpers
  // =============================
  function captureRestPose() {
    for (const name in realBones) {
      restPose[name] = realBones[name].quaternion.clone();
    }
  }

  function resetBone(name) {
    const bone = realBones[name];
    const state = boneStates[name];
    if (!bone || !state) return;

    const q = restPose[name];
    bone.quaternion.copy(q);
    state.currentQ.copy(q);
    state.targetQ.copy(q);
    state.velocity.set(0, 0, 0, 0);
  }

  function resetAll() {
    for (const name in restPose) resetBone(name);
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

  // =============================
  // Animation Loop
  // =============================
  const clock = new THREE.Clock();

  function animate() {
    if (stop) return;
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.05);
    const now = clock.elapsedTime;

    updatePhysics(dt, boneStates, realBones);
    updateIdleDrift(now, realBones);

    if (faceController) faceController.update(now);

    if (boneProxy) {
      runASLSign(activeSign, boneProxy, now - signStartTime, activeSide);
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // =============================
  // Resize
  // =============================
  const onResize = () => handleResize(mountEl, camera, renderer);
  window.addEventListener("resize", onResize);

  // =============================
  // Public API
  // =============================
  return {
    playSign: (char) => {
      const c = char.toLowerCase();
      if (activeSign !== c) {
        activeSign = c;
        signStartTime = clock.elapsedTime;
        faceController?.triggerViseme(c, signStartTime);
      }
    },

    toggleCameraPosition: () => {
      activeSide = activeSide === "RIGHT" ? "LEFT" : "RIGHT";
      resetAll();                       // 🔑 full reset
      applyArmPose();                   // re-apply arm pose
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
