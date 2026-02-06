import * as THREE from "three";
import { applySign } from "../three/asl/index.js"

export function createBoneProxy(realBones, boneStates) {

    function updateBoneTarget(name, x, y, z) {
        const state = boneStates[name];
        if (!state) return;

        const euler = new THREE.Euler().setFromQuaternion(state.targetQ);

        if (x != null) euler.x = x;
        if (y != null) euler.y = y;
        if (z != null) euler.z = z;

        state.targetQ.setFromEuler(euler);
    }

    function getBoneRotation(name, axis) {
        const state = boneStates[name];
        if (!state) return 0;
        const euler = new THREE.Euler().setFromQuaternion(state.targetQ);
        return axis ? euler[axis] : euler;
    }

    return new Proxy({}, {
        get: (_, boneName) => ({
            rotation: {
                set: (x, y, z) => updateBoneTarget(boneName, x, y, z),
                set x(v) { updateBoneTarget(boneName, v, null, null); },
                set y(v) { updateBoneTarget(boneName, null, v, null); },
                set z(v) { updateBoneTarget(boneName, null, null, v); },
                get x() { return getBoneRotation(boneName, "x"); },
                get y() { return getBoneRotation(boneName, "y"); },
                get z() { return getBoneRotation(boneName, "z"); },
            }
        })
    });
}

export function runASLSign(char, boneProxy, t, side = "RIGHT") {
    if (!char) return;
    applySign(char, boneProxy, t, side);
}
