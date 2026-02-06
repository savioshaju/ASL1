import * as THREE from "three";

const SPRING_STIFFNESS = 60;
const SPRING_DAMPING = 20;

export function updatePhysics(dt, boneStates, realBones) {
    Object.keys(boneStates).forEach((name) => {
        const state = boneStates[name];
        const bone = realBones[name];
        if (!bone) return;

        if (
            state.currentQ.x * state.targetQ.x +
            state.currentQ.y * state.targetQ.y +
            state.currentQ.z * state.targetQ.z +
            state.currentQ.w * state.targetQ.w < 0
        ) {
            state.targetQ.x *= -1;
            state.targetQ.y *= -1;
            state.targetQ.z *= -1;
            state.targetQ.w *= -1;
        }


        const deltaQ = {
            x: state.targetQ.x - state.currentQ.x,
            y: state.targetQ.y - state.currentQ.y,
            z: state.targetQ.z - state.currentQ.z,
            w: state.targetQ.w - state.currentQ.w,
        };

        // Spring acceleration
        const ax = deltaQ.x * SPRING_STIFFNESS - state.velocity.x * SPRING_DAMPING;
        const ay = deltaQ.y * SPRING_STIFFNESS - state.velocity.y * SPRING_DAMPING;
        const az = deltaQ.z * SPRING_STIFFNESS - state.velocity.z * SPRING_DAMPING;
        const aw = deltaQ.w * SPRING_STIFFNESS - state.velocity.w * SPRING_DAMPING;

        // Update Velocity
        state.velocity.x += ax * dt;
        state.velocity.y += ay * dt;
        state.velocity.z += az * dt;
        state.velocity.w += aw * dt;

        // Update Position
        state.currentQ.x += state.velocity.x * dt;
        state.currentQ.y += state.velocity.y * dt;
        state.currentQ.z += state.velocity.z * dt;
        state.currentQ.w += state.velocity.w * dt;

        state.currentQ.normalize();

        // Safety Check & Apply
        if (!isNaN(state.currentQ.x)) {
            bone.quaternion.copy(state.currentQ);
        } else {
            state.currentQ.copy(state.targetQ);
            state.velocity.set(0, 0, 0, 0);
            bone.quaternion.copy(state.targetQ);
        }
    });
}

export function updateIdleDrift(now, realBones) {
    const headBone = realBones["mixamorig9Head"] || realBones["Head"];
    if (headBone) {
        const swayY = Math.sin(now * 0.4) * 0.05 + Math.sin(now * 1.5) * 0.01;
        const swayX = Math.cos(now * 0.3) * 0.03 + Math.cos(now * 1.2) * 0.01;
        const noiseQ = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(swayX, swayY, 0)
        );
        headBone.quaternion.multiply(noiseQ);
    }
}
