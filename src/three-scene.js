/**
 * three-scene.js — Shivam Singhal Portfolio
 * Premium, Human-Designed Minimalist WebGL Elements
 */

import * as THREE from 'three';

// ── THEME & UTILS ────────────────────────────────────────────────────────────
function getThemeState() {
    return document.documentElement.getAttribute('data-theme') === 'light';
}

// Custom renderer initialization
function createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    return renderer;
}

// ── HERO: THE DATA GLOBE ──────────────────────────────────────────────────────
export function initHeroGlobe(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6.5);
    const renderer = createRenderer(container);

    const group = new THREE.Group();
    scene.add(group);

    // Minimalist Data Globe: A delicate, dotted sphere
    const globeRadius = 1.8;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 28, 28);
    
    // Create points on the sphere surface for an elegant, dotted look
    const pointsGeo = new THREE.BufferGeometry();
    const positions = globeGeo.attributes.position.clone();
    pointsGeo.setAttribute('position', positions);
    
    const pointsMat = new THREE.PointsMaterial({
        size: 0.035,
        color: 0xd4c5b9, // Premium Champagne Gold
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const globePoints = new THREE.Points(pointsGeo, pointsMat);
    group.add(globePoints);

    // Inner wireframe sphere for subtle structure
    const innerWireGeo = new THREE.SphereGeometry(globeRadius - 0.02, 14, 14);
    const innerWireMat = new THREE.MeshBasicMaterial({
        color: 0x475569, // Slate
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const innerWire = new THREE.Mesh(innerWireGeo, innerWireMat);
    group.add(innerWire);

    // Surrounding data particle field
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        // Orbit positions slightly larger than globe
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const distance = globeRadius + 0.1 + Math.random() * 0.5;
        
        posArray[i * 3] = distance * Math.sin(phi) * Math.cos(theta);
        posArray[i * 3 + 1] = distance * Math.sin(phi) * Math.sin(theta);
        posArray[i * 3 + 2] = distance * Math.cos(phi);
    }
    
    const fieldGeo = new THREE.BufferGeometry();
    fieldGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const fieldMat = new THREE.PointsMaterial({
        size: 0.025,
        color: 0x94a3b8, // Light Slate
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });
    
    const fieldPoints = new THREE.Points(fieldGeo, fieldMat);
    group.add(fieldPoints);

    // Ambient Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    let raf, t = 0;
    const mouse = { x: 0, y: 0 };
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    function animate() {
        raf = requestAnimationFrame(animate);
        t += 0.002;

        const isLight = getThemeState();
        
        // Color adjustments based on theme
        if (isLight) {
            pointsMat.color.setHex(0x1c1917); // Stone off-black for light mode
            innerWireMat.color.setHex(0xa8a29e);
            fieldMat.color.setHex(0x78716c);
        } else {
            pointsMat.color.setHex(0xd4c5b9); // Champagne Gold for dark mode
            innerWireMat.color.setHex(0x27272a);
            fieldMat.color.setHex(0xa89a8c);
        }

        // Extremely smooth, slow rotations
        group.rotation.y = t * 2;
        group.rotation.x = t;

        // Gentle interactive parallax
        group.position.x += (mouse.x * 0.4 - group.position.x) * 0.05;
        group.position.y += (mouse.y * 0.4 - group.position.y) * 0.05;

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

// ── CONTACT: FLOATING NETWORK ARCHITECTURE ───────────────────────────────────
export function initFloatingArchitecture(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 0, 0);
    const renderer = createRenderer(container);

    const nodes = [];
    const nodeCount = 14;
    const nodeGeo = new THREE.SphereGeometry(0.1, 8, 8);

    for (let i = 0; i < nodeCount; i++) {
        const mat = new THREE.MeshBasicMaterial({
            color: 0xd4c5b9,
            transparent: true,
            opacity: 0.7
        });
        const node = new THREE.Mesh(nodeGeo, mat);
        node.position.set(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
        );
        scene.add(node);
        nodes.push({
            mesh: node,
            rotSpeed: Math.random() * 0.01,
            offset: Math.random() * 10
        });
    }

    const linesGeo = new THREE.BufferGeometry();
    const linesMat = new THREE.LineBasicMaterial({
        color: 0xd4c5b9,
        transparent: true,
        opacity: 0.15
    });
    const lines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(lines);

    let raf, t = 0;
    function animate() {
        raf = requestAnimationFrame(animate);
        t += 0.005;

        const isLight = getThemeState();
        const mainColor = isLight ? 0x1c1917 : 0xd4c5b9;
        linesMat.color.setHex(mainColor);

        // Drift nodes slowly
        nodes.forEach((n, idx) => {
            n.mesh.material.color.setHex(mainColor);
            n.mesh.position.y += Math.sin(t + n.offset) * 0.002;
            n.mesh.position.x += Math.cos(t + n.offset) * 0.001;
        });

        // Compute connecting network lines based on proximity
        const linePos = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = nodes[i].mesh.position.distanceTo(nodes[j].mesh.position);
                if (distance < 3.2) {
                    linePos.push(nodes[i].mesh.position.x, nodes[i].mesh.position.y, nodes[i].mesh.position.z);
                    linePos.push(nodes[j].mesh.position.x, nodes[j].mesh.position.y, nodes[j].mesh.position.z);
                }
            }
        }
        linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        linesGeo.computeBoundingBox();
        linesGeo.computeBoundingSphere();

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
