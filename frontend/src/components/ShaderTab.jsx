import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ShaderTab() {
  const [prompt, setPrompt] = useState('');
  const [shaderCode, setShaderCode] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const animationRef = useRef(null);

  const generateShader = async () => {
    try {
      const response = await fetch('https://invideo-ai.onrender.com/generate-shader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();
      if (!data.code) {
        setError('No shader code received from backend');
        return;
      }
      setShaderCode(data.code);
      setError('');
      compileAndRenderShader(data.code);
    } catch (err) {
      setError('Failed to generate shader: ' + err.message);
    }
  };

  const compileAndRenderShader = (rawShaderCode) => {
    // Extract the fragment shader code from the generated response.
    // It should appear after the marker: "// ---FRAGMENT SHADER---"
    const fragmentShaderMatch = rawShaderCode.match(/\/\/ ---FRAGMENT SHADER---([\s\S]*)/i);
    if (!fragmentShaderMatch || fragmentShaderMatch.length < 2) {
      setError('Fragment shader not found in generated code');
      return;
    }
    const fragmentShaderSource = fragmentShaderMatch[1].trim();

    // If this is the first time, set up the Three.js scene.
    if (!rendererRef.current) {
      const width = 400;
      const height = 400;

      // Create renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      containerRef.current.innerHTML = ''; // Clear any previous content.
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Create scene and orthographic camera (for a full-screen quad)
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      cameraRef.current = camera;

      // Hardcoded vertex shader for a full-screen quad
      const vertexShaderSource = `
        varying vec3 v_position;
        void main() {
          v_position = position;
          gl_Position = vec4(position, 1.0);
        }
      `;

      // Create shader material with the provided fragment shader
      const material = new THREE.ShaderMaterial({
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        uniforms: {
          u_time: { value: 0.0 }
        }
      });
      materialRef.current = material;

      // Create a full-screen quad geometry (a plane covering [-1,1] in both axes)
      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Animation loop: update the u_time uniform and render the scene.
      const startTime = Date.now();
      const animate = () => {
        material.uniforms.u_time.value = (Date.now() - startTime) / 1000;
        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    } else {
      // If the scene already exists, update the fragment shader.
      try {
        materialRef.current.fragmentShader = fragmentShaderSource;
        materialRef.current.needsUpdate = true;
      } catch (err) {
        setError('Shader compile error: ' + err.message);
      }
    }
  };

  // Clean up the animation loop and renderer on unmount.
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  return (
    <div>
      <input
        type="text"
        value={prompt}
        style={{ width: "100%", height: "50px", paddingLeft: 20, borderRadius: 10, boxShadow: "8px 8px 0px black", border:"2px solid black", fontSize: 24}}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'draw a white triangle in the center'"
      />
      <button style={{ marginTop:"40px", marginLeft:"33%", color:"white", width: "30%", height: "50px", borderRadius: 10, border:0, backgroundColor: "black", fontSize: 16}} onClick={generateShader}>Generate Shader</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div ref={containerRef} style={{display: 'flex', justifyContent:"center", alignItems: "center", boxSizing:"border-box",position: 'relative', padding: 16, textAlign: 'center', left:"700px", bottom:"248px", width:'480px', height:'490px', backgroundColor:'black', color:"white"}} />
      {/* <pre >{shaderCode}</pre> */}
      <h1 style={{position:'absolute', top:"-18%", right:"-40%", zIndex: 2, color:"white", fontSize:"24px"}}>Output:</h1>
    </div>
  );
}