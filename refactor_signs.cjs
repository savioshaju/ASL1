const fs = require('fs');
const path = require('path');

const DIRS = [
    'src/three/asl/letters',
    'src/three/asl/numbers'
];

// Base Poses mandated by User
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

function processFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const funcName = fileName.replace('.js', '');

    // Skip index/export files
    if (fileName === 'letters.js' || fileName === 'numbers.js') return;

    // Parse existing Finger rotations
    // Look for r("mixamorig9RightHand...", x, y, z)
    // Note: Some files might use single quotes or different spacing

    const fingerLines = [];
    const regex = /r\s*\(\s*["']mixamorig9RightHand(Index|Middle|Ring|Pinky|Thumb)(\d)["']\s*,\s*(-?[\d.]+)(?:\s*,\s*(-?[\d.]+))?(?:\s*,\s*(-?[\d.]+))?\s*\)/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
        const fingerPart = match[1] + match[2]; // e.g. Index1
        const x = parseFloat(match[3] || 0);
        const y = parseFloat(match[4] || 0);
        const z = parseFloat(match[5] || 0);
        fingerLines.push({ part: fingerPart, x, y, z });
    }

    // Generate New Content
    const rightFingers = fingerLines.map(f =>
        `      r("mixamorig9RightHand${f.part}", ${f.x}, ${f.y}, ${f.z});`
    ).join('\n');

    const leftFingers = fingerLines.map(f =>
        `      r("mixamorig9LeftHand${f.part}", ${f.x}, ${-f.y}, ${-f.z});`
    ).join('\n');

    const newContent = `import * as THREE from "three";

export function ${funcName}(bones, t = 0, side = "RIGHT") {
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
      // FINGERS
${rightFingers}
  } else {
${BASE_LEFT}
      // FINGERS (Mirrored)
${leftFingers}
  }
}
`;

    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${fileName}`);
}

DIRS.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    if (fs.existsSync(fullDir)) {
        fs.readdirSync(fullDir).forEach(file => {
            if (file.endsWith('.js')) {
                processFile(path.join(fullDir, file));
            }
        });
    } else {
        console.error(`Dir not found: ${fullDir}`);
    }
});
