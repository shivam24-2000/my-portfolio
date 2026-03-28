/**
 * three-scene.js  — Shivam Singhal Portfolio (Ultra-Creative Edition)
 *
 * This version features:
 * 1. A Neural Architect Hero with interactive holographic scanning.
 * 2. A Knowledge Matrix About section with gravitationally active orbiting tech-planets.
 * 3. A Project Nexus gallery with holographic project cards and laser connectivity.
 * 4. A Distributed Architecture Contact section with nodes and dynamic links.
 */

import * as THREE from 'three';

// ── SHARED UTILS ──────────────────�// ── THEME UTILS ─────────────────────────────────────────────────────────────
function getThemeState() {
    return document.documentElement.getAttribute('data-theme') === 'light';
}

function createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    return renderer;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HERO: THE NEURAL ARCHITECT
// ─────────────────────────────────────────────────────────────────────────────
export function initHeroGlobe(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 7);
    const renderer = createRenderer(container);

    const group = new THREE.Group();
    scene.add(group);

    // ── Central "Neural Engine" (Morphing Core) ──
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0x8a2be2,
        emissive: 0x4a0099,
        emissiveIntensity: 1.2,
        flatShading: true,
        transparent: true,
        opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const coreWire = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true, transparent: true, opacity: 0.2 }));
    group.add(coreWire);

    // ── Holographic Shell ──
    const shellGeo = new THREE.IcosahedronGeometry(1.8, 2);
    const shellWire = new THREE.Mesh(shellGeo, new THREE.MeshBasicMaterial({ color: 0x00f5d4, wireframe: true, transparent: true, opacity: 0.1 }));
    group.add(shellWire);

    // ── Scanner Ring ──
    const scannerGeo = new THREE.TorusGeometry(2, 0.03, 8, 100);
    const scannerMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4, transparent: true, opacity: 0.5 });
    const scanner = new THREE.Mesh(scannerGeo, scannerMat);
    scanner.rotation.x = Math.PI / 2;
    group.add(scanner);

    // ── Floating Code Nodes ──
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 15;
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const partMat = new THREE.PointsMaterial({ size: 0.04, color: 0x00f5d4, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.6 });
    const partPoints = new THREE.Points(partGeo, partMat);
    scene.add(partPoints);

    // ── Lighting ──
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f5d4, 10, 20);
    scene.add(pointLight);

    let raf, t = 0;
    const mouse = { x: 0, y: 0 };
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    function animate() {
        raf = requestAnimationFrame(animate);
        t += 0.01;

        // Dynamic theme adjustment
        const isLight = getThemeState();
        const colors = {
            purple: isLight ? 0x6d28d9 : 0x8a2be2,
            cyan: isLight ? 0x0ea5e9 : 0x00f5d4,
            emissive: isLight ? 0x4c1d95 : 0x4a0099,
            bgAmbient: isLight ? 0xffffff : 0x404040
        };

        coreMat.color.lerp(new THREE.Color(colors.purple), 0.05);
        coreMat.emissive.lerp(new THREE.Color(colors.emissive), 0.05);
        coreWire.material.color.lerp(new THREE.Color(colors.cyan), 0.05);
        shellWire.material.color.lerp(new THREE.Color(colors.cyan), 0.05);
        scannerMat.color.lerp(new THREE.Color(colors.cyan), 0.05);
        partMat.color.lerp(new THREE.Color(colors.cyan), 0.05);
        pointLight.color.lerp(new THREE.Color(colors.cyan), 0.05);
        ambientLight.color.lerp(new THREE.Color(colors.bgAmbient), 0.05);

        group.rotation.y += 0.005;
        group.rotation.x += (mouse.y * 0.15 - group.rotation.x) * 0.05;

        core.rotation.y -= 0.01;
        core.scale.setScalar(1 + Math.sin(t * 3) * 0.05);

        scanner.position.y = Math.sin(t) * 2;
        scanner.material.opacity = 0.4 + Math.sin(t * 2) * 0.2;

        pointLight.position.set(mouse.x * 5, mouse.y * 5, 2);

        // Particle drift
        const pos = partGeo.getAttribute('position').array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            pos[i3 + 1] += Math.sin(t + pos[i3] * 0.1) * 0.01;
        }
        partGeo.getAttribute('position').needsUpdate = true;

        renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); renderer.dispose(); };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONTACT: THE FLOATING ARCHITECTURE
// ─────────────────────────────────────────────────────────────────────────────
export function initFloatingArchitecture(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);
    const renderer = createRenderer(container);

    const nodes = [];
    const nodeGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const darkColors = [0x8a2be2, 0x00f5d4, 0x00bbf9];
    const lightColors = [0x6d28d9, 0x0ea5e9, 0x0284c7];

    for (let i = 0; i < 12; i++) {
        const mat = new THREE.MeshPhongMaterial({ 
            color: darkColors[i % 3], 
            emissive: darkColors[i % 3], 
            emissiveIntensity: 0.2 
        });
        const node = new THREE.Mesh(nodeGeo, mat);
        node.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 6);
        scene.add(node);
        nodes.push({ mesh: node, rotSpeed: Math.random() * 0.02, offset: Math.random() * 10, colorIdx: i % 3 });
    }

    const linesGeo = new THREE.BufferGeometry();
    const linesMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });
    const lines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(lines);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1, 20);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    let raf, t = 0;
    function animate() {
        raf = requestAnimationFrame(animate);
        t += 0.01;

        const isLight = getThemeState();
        const lineTargetColor = isLight ? 0x64748b : 0xffffff;
        linesMat.color.lerp(new THREE.Color(lineTargetColor), 0.05);
        ambientLight.intensity = isLight ? 1.0 : 0.4;
        pointLight.intensity = isLight ? 0.5 : 1.0;

        const linePos = [];
        nodes.forEach(n => {
            const targetColor = isLight ? lightColors[n.colorIdx] : darkColors[n.colorIdx];
            n.mesh.material.color.lerp(new THREE.Color(targetColor), 0.05);
            n.mesh.material.emissive.lerp(new THREE.Color(targetColor), 0.05);

            n.mesh.position.y += Math.sin(t + n.offset) * 0.005;
            n.mesh.rotation.x += n.rotSpeed;
            n.mesh.rotation.y += n.rotSpeed;
        });
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (nodes[i].mesh.position.distanceTo(nodes[j].mesh.position) < 5) {
                    linePos.push(nodes[i].mesh.position.x, nodes[i].mesh.position.y, nodes[i].mesh.position.z);
                    linePos.push(nodes[j].mesh.position.x, nodes[j].mesh.position.y, nodes[j].mesh.position.z);
                }
            }
        }
        linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); renderer.dispose(); };
}

