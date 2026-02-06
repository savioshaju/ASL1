import * as THREE from "three";

export function signN(bones, t = 0, side = "RIGHT") {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  if (side === "RIGHT") {

      // RIGHT ARM (Active)
      
     
      

      r("mixamorig9RightHandIndex1", 90, 0, 0);
      r("mixamorig9RightHandIndex2", 100, 0, 0);
      r("mixamorig9RightHandIndex3", 80, 0, 0);
      r("mixamorig9RightHandMiddle1", 90, 0, 0);
      r("mixamorig9RightHandMiddle2", 100, 0, 0);
      r("mixamorig9RightHandMiddle3", 80, 0, 0);
      r("mixamorig9RightHandRing1", 90, 0, 0);
      r("mixamorig9RightHandRing2", 100, 0, 0);
      r("mixamorig9RightHandRing3", 80, 0, 0);
      r("mixamorig9RightHandPinky1", 90, 0, 0);
      r("mixamorig9RightHandPinky2", 100, 0, 0);
      r("mixamorig9RightHandPinky3", 80, 0, 0);
  } else {

      // LEFT ARM (Active)
      

      r("mixamorig9LeftHandIndex1", 90, 0, 0);
      r("mixamorig9LeftHandIndex2", 100, 0, 0);
      r("mixamorig9LeftHandIndex3", 80, 0, 0);
      r("mixamorig9LeftHandMiddle1", 90, 0, 0);
      r("mixamorig9LeftHandMiddle2", 100, 0, 0);
      r("mixamorig9LeftHandMiddle3", 80, 0, 0);
      r("mixamorig9LeftHandRing1", 90, 0, 0);
      r("mixamorig9LeftHandRing2", 100, 0, 0);
      r("mixamorig9LeftHandRing3", 80, 0, 0);
      r("mixamorig9LeftHandPinky1", 90, 0, 0);
      r("mixamorig9LeftHandPinky2", 100, 0, 0);
      r("mixamorig9LeftHandPinky3", 80, 0, 0);
  }
}
