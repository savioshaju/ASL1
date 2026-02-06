const fs = require('fs');
const path = require('path');

// Base Arm Poses
const BASE_RIGHT = `
      // RIGHT ARM (Active)
      r("mixamorig9RightArm", 50, -10, 10);
      r("mixamorig9RightForeArm", 20, 40, -140);
      r("mixamorig9RightHand", -40, -15, -20);
`;
const BASE_LEFT = `
      // LEFT ARM (Active)
      r("mixamorig9LeftArm", 50, -10, 10);
      r("mixamorig9LeftForeArm", 0, -40, 120);
      r("mixamorig9LeftHand", -20, 10, 0);
`;

// Standard Finger Curls (Degrees)
// Index, Middle, Ring, Pinky: (1, 2, 3)
// Open: 0, 0, 0
// Closed: 90, 100, 80 (approx)

const CLOSED = [
    { p: '1', v: 90 }, { p: '2', v: 100 }, { p: '3', v: 80 }
];
const OPEN = [
    { p: '1', v: 0 }, { p: '2', v: 0 }, { p: '3', v: 0 }
];
const CURVED = [
    { p: '1', v: 45 }, { p: '2', v: 45 }, { p: '3', v: 30 }
];

// Helper to generate finger lines
function fingers(idx, mid, rng, pnk, thm) {
    const list = [];

    // Helper for one finger
    const add = (name, val) => {
        val.forEach(d => {
            // Right Hand standard
            list.push({ part: name + d.p, x: d.v, y: 0, z: 0 });
        });
    };

    add('Index', idx);
    add('Middle', mid);
    add('Ring', rng);
    add('Pinky', pnk);

    // Thumb: Special handling. 
    // Open: 0, 0, 0
    // Tucked: 0, -50, 0
    // Across: 25, 35, 15 (A)
    if (thm === 'tucked') {
        list.push({ part: 'Thumb1', x: 0, y: -50, z: 0 });
        list.push({ part: 'Thumb2', x: 0, y: -30, z: 0 });
    } else if (thm === 'open') {
        // 0
    } else if (thm === 'side') { // A
        list.push({ part: 'Thumb1', x: 25, y: 35, z: 15 });
    } else if (thm === 'in') { // M, N, T
        // under fingers
    }

    return list;
}

// Data Table
const DB = {
    // A: All closed, Thumb side
    signA: fingers(CLOSED, CLOSED, CLOSED, CLOSED, 'side'),
    // B: All open, Thumb tucked
    signB: fingers(OPEN, OPEN, OPEN, OPEN, 'tucked'),
    // C: All curved, Thumb curved (custom)
    signC: [
        ...fingers(CURVED, CURVED, CURVED, CURVED, 'open'),
        { part: 'Thumb1', x: 20, y: 10, z: 0 },
        { part: 'Thumb2', x: 15, y: 0, z: 0 }
    ],
    // D: Index up, others closedToThumb
    signD: fingers(OPEN, CLOSED, CLOSED, CLOSED, 'tucked'), // Approx
    // E: All curled down (more closed than 'CLOSED')
    signE: fingers(CLOSED, CLOSED, CLOSED, CLOSED, 'tucked'),
    // F: Index+Thumb touch, others open
    signF: fingers(CURVED, OPEN, OPEN, OPEN, 'open'), // Approx circle
    // G: Index side, Thumb side
    signG: fingers(CLOSED, CLOSED, CLOSED, CLOSED, 'side'), // Modification needed for pointing
    // H: Index+Mid side
    signH: fingers(OPEN, OPEN, CLOSED, CLOSED, 'tucked'),
    // I: Pinky up
    signI: fingers(CLOSED, CLOSED, CLOSED, OPEN, 'tucked'),
    // J: Pinky up (Simulated static I)
    signJ: fingers(CLOSED, CLOSED, CLOSED, OPEN, 'tucked'),
    // K: V shape (Index/Mid) with Thumb between
    signK: fingers(OPEN, OPEN, CLOSED, CLOSED, 'tucked'),
    // L: Index/Thumb L
    signL: [
        ...fingers(OPEN, CLOSED, CLOSED, CLOSED, 'open'),
        { part: 'Thumb1', x: 0, y: 90, z: 0 } // Extended out?
    ],
    // M: 3 fingers over thumb
    signM: fingers(CLOSED, CLOSED, CLOSED, CLOSED, 'open'),
    // N: 2 fingers over thumb
    signN: fingers(CLOSED, CLOSED, CLOSED, CLOSED, 'open'),
    // O: All curved touching thumb
    signO: fingers(CURVED, CURVED, CURVED, CURVED, 'open'),
    // P: K down
    signP: fingers(OPEN, OPEN, CLOSED, CLOSED, 'tucked'),
    // Q: G down
    signQ: fingers(CLOSED, CLOSED, CLOSED, CLOSED, 'side'),
    // R: Crossed fingers (Index/Mid)
    signR: fingers(OPEN, OPEN, CLOSED, CLOSED, 'tucked'),
    // S: Fist (Thumb over)
    signS: fingers(CLOSED, CLOSED, CLOSED, CLOSED, 'tucked'),
    // T: Thumb between Index/Mid
    signT: fingers(CLOSED, CLOSED, CLOSED, CLOSED, 'open'),
    // U: Index/Mid together up
    signU: fingers(OPEN, OPEN, CLOSED, CLOSED, 'tucked'),
    // V: Index/Mid V up
    signV: fingers(OPEN, OPEN, CLOSED, CLOSED, 'tucked'),
    // W: 3 fingers up
    signW: fingers(OPEN, OPEN, OPEN, CLOSED, 'tucked'),
    // X: Index hook
    signX: fingers(CURVED, CLOSED, CLOSED, CLOSED, 'tucked'),
    // Y: Thumb/Pinky up
    signY: fingers(CLOSED, CLOSED, CLOSED, OPEN, 'open'), // Thumb out
    // Z: Index point
    signZ: fingers(OPEN, CLOSED, CLOSED, CLOSED, 'tucked'),

    // Numbers
    sign0: fingers(CURVED, CURVED, CURVED, CURVED, 'open'), // O
    sign1: fingers(OPEN, CLOSED, CLOSED, CLOSED, 'tucked'), // D
    sign2: fingers(OPEN, OPEN, CLOSED, CLOSED, 'tucked'), // V
    sign3: [...fingers(OPEN, OPEN, CLOSED, CLOSED, 'open'), { part: 'Thumb1', x: 0, y: 50, z: 0 }], // Thumb out
    sign4: fingers(OPEN, OPEN, OPEN, OPEN, 'tucked'), // B
    sign5: fingers(OPEN, OPEN, OPEN, OPEN, 'open'), // Open
    sign6: fingers(OPEN, OPEN, OPEN, CURVED, 'open'), // W + thumb/pinky touch
    sign7: fingers(OPEN, OPEN, CURVED, OPEN, 'open'), // W + thumb/ring 
    sign8: fingers(OPEN, CURVED, OPEN, OPEN, 'open'), // W + thumb/mid
    sign9: fingers(CURVED, OPEN, OPEN, OPEN, 'open'), // F
};

function processFile(fname) {
    const key = fname.replace('.js', '');
    const data = DB[key];
    if (!data) return; // Skip if definition missing

    const rFingers = data.map(d => `      r("mixamorig9RightHand${d.part}", ${d.x}, ${d.y}, ${d.z});`).join('\n');
    const lFingers = data.map(d => `      r("mixamorig9LeftHand${d.part}", ${d.x}, ${-d.y}, ${-d.z});`).join('\n');

    const content = `import * as THREE from "three";

export function ${key}(bones, t = 0, side = "RIGHT") {
  const r = (name, x = 0, y = 0, z = 0) => {
    if (!bones[name]) return;
    bones[name].rotation.set(
      THREE.MathUtils.degToRad(x),
      THREE.MathUtils.degToRad(y),
      THREE.MathUtils.degToRad(z)
    );
  };

  if (side === "RIGHT") {
${BASE_RIGHT}
${rFingers}
  } else {
${BASE_LEFT}
${lFingers}
  }
}
`;
    // Decide path
    let p = '';
    if (key.startsWith('sign') && !isNaN(key[4])) {
        // Number
        p = `src/three/asl/numbers/${fname}`;
    } else {
        // Letter
        p = `src/three/asl/letters/${fname}`;
    }

    fs.writeFileSync(path.join(process.cwd(), p), content);
    console.log(`Fixed ${fname}`);
}

Object.keys(DB).forEach(k => processFile(k + '.js'));
