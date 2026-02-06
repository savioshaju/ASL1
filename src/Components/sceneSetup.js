import * as THREE from "three";

export function createScene(mountEl) {
    // Scene
    const scene = new THREE.Scene();
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(
        35,
        mountEl.clientWidth / mountEl.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 1.45, 1.65);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
    renderer.setClearColor(0x000000, 0);

    mountEl.innerHTML = "";
    mountEl.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(2, 4, 3);
    key.castShadow = true;
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xeef2ff, 1.0);
    fill.position.set(-2, 1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 1.5);
    rim.position.set(0, 4, -4);
    scene.add(rim);

    return { scene, camera, renderer };
}

export function handleResize(mountEl, camera, renderer) {
    if (!mountEl) return;
    camera.aspect = mountEl.clientWidth / mountEl.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
}
