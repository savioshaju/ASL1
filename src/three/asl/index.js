import * as THREE from "three";

import {
    signA, signB, signC, signD, signE, signF, signG, signH, signI, signJ, signK, signL, signM,
    signN, signO, signP, signQ, signR, signS, signT, signU, signV, signW, signX, signY, signZ
} from "./letters/letters.js";
import {
    sign0, sign1, sign2, sign3, sign4, sign5, sign6, sign7, sign8, sign9
} from "./numbers/numbers.js";

const r = (bones, name, x, y, z) => {
    const b = bones[name];
    if (b) {
        b.rotation.set(
            THREE.MathUtils.degToRad(x || 0),
            THREE.MathUtils.degToRad(y || 0),
            THREE.MathUtils.degToRad(z || 0)
        );
    }
};

// netral by default
export function resetHand(bones) {
    const fingers = [
        "Index1", "Index2", "Index3",
        "Middle1", "Middle2", "Middle3",
        "Ring1", "Ring2", "Ring3",
        "Pinky1", "Pinky2", "Pinky3",
        "Thumb1", "Thumb2", "Thumb3"
    ];

    fingers.forEach(f => {
        r(bones, `mixamorig9LeftHand${f}`, 0, 0, 0);
        r(bones, `mixamorig9RightHand${f}`, 0, 0, 0);
    });
}

const signs = {
    // Letters
    a: signA,
    b: signB, c: signC, d: signD, e: signE, f: signF, g: signG, h: signH, i: signI,
    j: signJ, k: signK, l: signL, m: signM, n: signN, o: signO, p: signP, q: signQ,
    r: signR, s: signS, t: signT, u: signU, v: signV, w: signW, x: signX, y: signY, z: signZ,

    // Numbers
    "0": sign0, "1": sign1, "2": sign2, "3": sign3, "4": sign4,
    "5": sign5, "6": sign6, "7": sign7, "8": sign8, "9": sign9
};

/**
 * Apply a sign by key (case insensitive)
 */
export function applySign(key, bones, t = 0, side = "RIGHT") {
    if (!key) return;
    const k = key.toLowerCase();

    const fn = signs[k];
    if (fn) {
        // Transition Duration (Seconds)
        const DURATION = 0.4;
        const p = THREE.MathUtils.clamp(t / DURATION, 0, 1);
        const smooth = THREE.MathUtils.smoothstep(p, 0, 1); // Optional easing

        // Wrap bones to interpolate from Rest (0) to Target
        const transitionBones = new Proxy(bones, {
            get(target, prop) {
                const original = target[prop];
                if (!original) return original;

                return {
                    rotation: {
                        // Forward getters
                        get x() { return original.rotation.x; },
                        get y() { return original.rotation.y; },
                        get z() { return original.rotation.z; },

                        // Intercept setters to scale by progress
                        set: (x, y, z) => {
                            original.rotation.set(x * smooth, y * smooth, z * smooth);
                        },
                        set x(v) { original.rotation.x = v * smooth; },
                        set y(v) { original.rotation.y = v * smooth; },
                        set z(v) { original.rotation.z = v * smooth; }
                    }
                };
            }
        });


        fn(transitionBones, t, side);
    } else {
        console.warn(`Sign '${key}' not found.`);
    }
}
