import * as THREE from "three";

const visemeMap = {
    a: ["viseme_aa", "mouthOpen"],
    b: ["viseme_PP", "mouthClosed"],
    c: ["viseme_kk", "mouthSmile"],
    d: ["viseme_DD", "mouthSmile"],
    e: ["viseme_E", "mouthSmile"],
    f: ["viseme_FF", "mouthFunnel"],
    g: ["viseme_kk"],
    h: ["viseme_ch"],
    i: ["viseme_I"],
    j: ["viseme_I", "viseme_O"],
    k: ["viseme_kk"],
    l: ["viseme_nn"],
    m: ["viseme_PP"],
    n: ["viseme_nn"],
    o: ["viseme_O"],
    p: ["viseme_PP"],
    q: ["viseme_kk", "viseme_U"],
    r: ["viseme_RR"],
    s: ["viseme_SS"],
    t: ["viseme_DD"],
    u: ["viseme_U"],
    v: ["viseme_FF"],
    w: ["viseme_U"],
    x: ["viseme_SS"],
    y: ["viseme_I"],
    z: ["viseme_SS"],
};

export class FaceController {
    constructor(morphDict) {
        this.morphDict = morphDict;
        this.blinkState = { isBlinking: false, startTime: 0, duration: 0.12 };
        this.nextBlinkTime = 0;

        this.currentViseme = null;
        this.visemeStartTime = 0;
    }

    updateBlink(now) {
        if (now > this.nextBlinkTime) {
            this.blinkState.isBlinking = true;
            this.blinkState.startTime = now;
            this.nextBlinkTime = now + 1.5 + Math.random() * 4;
        }

        if (this.blinkState.isBlinking) {
            const p = (now - this.blinkState.startTime) / this.blinkState.duration;
            let val = 0;
            if (p < 0.5) val = THREE.MathUtils.smoothstep(p, 0, 0.5);
            else val = THREE.MathUtils.smoothstep(1 - p, 0, 0.5);

            if (p >= 1) this.blinkState.isBlinking = false;

            Object.keys(this.morphDict).forEach((k) => {
                if (k.toLowerCase().includes("blink") || k.toLowerCase().includes("eye_close")) {
                    this.morphDict[k].mesh.morphTargetInfluences[this.morphDict[k].index] = val;
                }
            });
        }
    }

    triggerViseme(char, now) {
        const lower = char.toLowerCase();
        const shapes = visemeMap[lower];
        if (shapes) {
            this.currentViseme = shapes;
            this.visemeStartTime = now;
        }
    }

    updateVisemes(now) {
        if (!this.currentViseme) return;

        const elapsed = now - this.visemeStartTime;
        const attack = 0.1;
        const decay = 0.3;

        let intensity = 0;
        if (elapsed < attack) {
            intensity = elapsed / attack;
        } else if (elapsed < attack + decay) {
            intensity = 1.0 - (elapsed - attack) / decay;
        } else {
            this.currentViseme = null;
            intensity = 0;
        }

        this.currentViseme.forEach((shapeName) => {
            let target = this.morphDict[shapeName];
            if (!target) {
                const guess = Object.keys(this.morphDict).find((k) =>
                    k.toLowerCase().includes(shapeName.toLowerCase())
                );
                if (guess) target = this.morphDict[guess];
            }

            if (target) {
                target.mesh.morphTargetInfluences[target.index] = intensity;
            }
        });
    }

    update(now) {
        this.updateBlink(now);
        this.updateVisemes(now);
    }
}
