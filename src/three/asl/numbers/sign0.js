import * as THREE from "three";

export function sign0(bones, t = 0, side = "RIGHT") {
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
      
     
      

      r("mixamorig9RightHandIndex1", 45, 0, 0);
      r("mixamorig9RightHandIndex2", 45, 0, 0);
      r("mixamorig9RightHandIndex3", 30, 0, 0);
      r("mixamorig9RightHandMiddle1", 45, 0, 0);
      r("mixamorig9RightHandMiddle2", 45, 0, 0);
      r("mixamorig9RightHandMiddle3", 30, 0, 0);
      r("mixamorig9RightHandRing1", 45, 0, 0);
      r("mixamorig9RightHandRing2", 45, 0, 0);
      r("mixamorig9RightHandRing3", 30, 0, 0);
      r("mixamorig9RightHandPinky1", 45, 0, 0);
      r("mixamorig9RightHandPinky2", 45, 0, 0);
      r("mixamorig9RightHandPinky3", 30, 0, 0);
  } else {

      // LEFT ARM (Active)
      

      r("mixamorig9LeftHandIndex1", 45, 0, 0);
      r("mixamorig9LeftHandIndex2", 45, 0, 0);
      r("mixamorig9LeftHandIndex3", 30, 0, 0);
      r("mixamorig9LeftHandMiddle1", 45, 0, 0);
      r("mixamorig9LeftHandMiddle2", 45, 0, 0);
      r("mixamorig9LeftHandMiddle3", 30, 0, 0);
      r("mixamorig9LeftHandRing1", 45, 0, 0);
      r("mixamorig9LeftHandRing2", 45, 0, 0);
      r("mixamorig9LeftHandRing3", 30, 0, 0);
      r("mixamorig9LeftHandPinky1", 45, 0, 0);
      r("mixamorig9LeftHandPinky2", 45, 0, 0);
      r("mixamorig9LeftHandPinky3", 30, 0, 0);
  }
}
