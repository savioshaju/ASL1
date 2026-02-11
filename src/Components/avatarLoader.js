import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export function loadAvatar(scene, modelUrl, onLoaded) {
  const loader = new GLTFLoader();

  const realBones = {};
  const boneStates = {};
  const morphTargets = [];
  const morphDict = {};

  loader.load(
    modelUrl,
    (gltf) => {
      console.log("Avatar GLB Loaded Successfully");

      const avatar = gltf.scene;
      scene.add(avatar);

      avatar.traverse((obj) => {
        if (obj.isMesh) {
          if (obj.material) {
            obj.material.metalness = 0.1;
            obj.material.roughness = 0.6;
          }

          if (obj.morphTargetDictionary) {
            Object.keys(obj.morphTargetDictionary).forEach((key) => {
              const idx = obj.morphTargetDictionary[key];
              morphTargets.push({ mesh: obj, name: key, index: idx });
              morphDict[key] = { mesh: obj, index: idx };
            });
          }
        }

        if (obj.isBone) {
          realBones[obj.name] = obj;
          boneStates[obj.name] = {
            targetQ: obj.quaternion.clone(),
            currentQ: obj.quaternion.clone(),
            velocity: new THREE.Quaternion(0, 0, 0, 0),
            restQ: obj.quaternion.clone(),
          };
        }
      });

      // ✅ PASS EVERYTHING THROUGH THE CALLBACK (THIS IS THE FIX)
      if (onLoaded) {
        onLoaded({
          gltf,
          avatarScene: avatar,
          realBones,
          boneStates,
          morphTargets,
          morphDict,
        });
      }
    },
    undefined,
    (err) => console.error("Error loading GLB:", err)
  );
}