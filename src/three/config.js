export const CAMERA_POSITIONS = {
    RIGHT: {
        name: "Right",
        camera: { x: 0, y: 1.45, z: 1.6 },
        target: { x: 0, y: 1.4, z: 0 },
    },
    LEFT: {
        name: "Left",
        // Baseline derived from Right, to be fine-tuned
        camera: { x: 0.1, y: 1.45, z: 1.6 },
        target: { x: 0, y: 1.4, z: 0 },
    },
};
