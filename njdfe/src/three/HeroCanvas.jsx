import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Particles (stars/sparks)
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      // Gold particles
      colors[i * 3]     = 0.95;
      colors[i * 3 + 1] = 0.72 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.02;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const particleMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Rotating rings (stadium lights effect)
    const rings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(2.5 + i * 0.8, 0.008, 8, 120);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xf2b705 : i === 1 ? 0xffd447 : 0xd9a204,
        transparent: true, opacity: 0.15 - i * 0.03
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (i * 0.3);
      ring.rotation.y = i * 0.5;
      scene.add(ring);
      rings.push(ring);
    }

    // Central sphere (club crest glow)
    const sphereGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xf2b705, wireframe: true, transparent: true, opacity: 0.12
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    // Floating hexagons
    const hexagons = [];
    for (let i = 0; i < 8; i++) {
      const hexGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.02, 6);
      const hexMat = new THREE.MeshBasicMaterial({
        color: 0xf2b705, transparent: true, opacity: 0.06 + Math.random() * 0.08
      });
      const hex = new THREE.Mesh(hexGeo, hexMat);
      hex.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      );
      hex.rotation.x = Math.PI / 2;
      scene.add(hex);
      hexagons.push({ mesh: hex, speed: 0.003 + Math.random() * 0.005, offset: Math.random() * Math.PI * 2 });
    }

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Rotate particles slowly
      particles.rotation.y = t * 0.03;
      particles.rotation.x = t * 0.01;

      // Rings rotate at different speeds
      rings[0].rotation.z = t * 0.2;
      rings[1].rotation.z = -t * 0.15;
      rings[2].rotation.z = t * 0.1;
      rings[0].rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.2;

      // Sphere pulse + rotate
      sphere.rotation.y = t * 0.4;
      sphere.rotation.x = t * 0.2;
      const pulse = 1 + Math.sin(t * 1.5) * 0.05;
      sphere.scale.setScalar(pulse);

      // Hexagon float
      hexagons.forEach(({ mesh, speed, offset }) => {
        mesh.rotation.z += speed;
        mesh.position.y += Math.sin(t + offset) * 0.002;
      });

      // Camera parallax follows mouse
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" />;
}
