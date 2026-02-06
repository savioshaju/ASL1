import * as THREE from "three";

export function sign4(bones, t = 0, side = "RIGHT") {
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
      
     
      

      r("mixamorig9RightHandIndex1", 0, 0, 0);
      r("mixamorig9RightHandIndex2", 0, 0, 0);
      r("mixamorig9RightHandIndex3", 0, 0, 0);
      r("mixamorig9RightHandMiddle1", 0, 0, 0);
      r("mixamorig9RightHandMiddle2", 0, 0, 0);
      r("mixamorig9RightHandMiddle3", 0, 0, 0);
      r("mixamorig9RightHandRing1", 0, 0, 0);
      r("mixamorig9RightHandRing2", 0, 0, 0);
      r("mixamorig9RightHandRing3", 0, 0, 0);
      r("mixamorig9RightHandPinky1", 0, 0, 0);
      r("mixamorig9RightHandPinky2", 0, 0, 0);
      r("mixamorig9RightHandPinky3", 0, 0, 0);
      r("mixamorig9RightHandThumb1", 0, -50, 0);
      r("mixamorig9RightHandThumb2", 0, -30, 0);
  } else {

      // LEFT ARM (Active)
      

      r("mixamorig9LeftHandIndex1", 0, 0, 0);
      r("mixamorig9LeftHandIndex2", 0, 0, 0);
      r("mixamorig9LeftHandIndex3", 0, 0, 0);
      r("mixamorig9LeftHandMiddle1", 0, 0, 0);
      r("mixamorig9LeftHandMiddle2", 0, 0, 0);
      r("mixamorig9LeftHandMiddle3", 0, 0, 0);
      r("mixamorig9LeftHandRing1", 0, 0, 0);
      r("mixamorig9LeftHandRing2", 0, 0, 0);
      r("mixamorig9LeftHandRing3", 0, 0, 0);
      r("mixamorig9LeftHandPinky1", 0, 0, 0);
      r("mixamorig9LeftHandPinky2", 0, 0, 0);
      r("mixamorig9LeftHandPinky3", 0, 0, 0);
      r("mixamorig9LeftHandThumb1", 0, 50, 0);
      r("mixamorig9LeftHandThumb2", 0, 30, 0);
  }
}
