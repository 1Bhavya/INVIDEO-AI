import { useState, useRef } from 'react';

export default function ShaderTab() {
  const [prompt, setPrompt] = useState('');
  const [shaderCode, setShaderCode] = useState('');
  const [error, setError] = useState('');
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const generateShader = async () => {
    try {
      const response = await fetch('http://localhost:4000/generate-shader', {
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
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl');
    if (!gl) {
      setError('WebGL not supported');
      return;
    }

    try {
      // Extract the fragment shader
      const fragmentPart = rawShaderCode.split(/\/\/ ---FRAGMENT SHADER---/i)[1]?.trim();
      if (!fragmentPart) {
        throw new Error('Fragment shader not found in generated code');
      }

      // Hardcoded vertex shader for a full-screen quad
      const vertexShaderSource = `
        attribute vec3 a_position;
        varying vec3 v_position;

        void main() {
          v_position = a_position;
          gl_Position = vec4(a_position, 1.0);
        }
      `;

      // Use the generated fragment shader
      const fragmentShaderSource = fragmentPart;

      // Compile shaders
      const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
      const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

      // Create and link program
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Program link error: ' + gl.getProgramInfoLog(program));
      }
      gl.useProgram(program);

      // Set up full-screen quad geometry
      const positions = new Float32Array([
        -1, -1, 0,  1, -1, 0,  -1, 1, 0,
        -1, 1, 0,   1, -1, 0,   1, 1, 0
      ]);
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const positionLoc = gl.getAttribLocation(program, 'a_position');
      const timeLoc = gl.getUniformLocation(program, 'u_time');

      // Render loop
      const startTime = Date.now();
      const render = () => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (timeLoc !== null) {
          gl.uniform1f(timeLoc, (Date.now() - startTime) / 1000);
        }

        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        animationRef.current = requestAnimationFrame(render);
      };
      render();
    } catch (err) {
      setError('Shader error: ' + err.message);
    }
  };

  const compileShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error('Shader compile error: ' + gl.getShaderInfoLog(shader));
    }
    return shader;
  };

  return (
    <div>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'draw a white triangle in the center' or 'horizontal rainbow gradient'"
      />
      <button onClick={generateShader}>Generate</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <canvas ref={canvasRef} width={400} height={400} />
      <pre>{shaderCode}</pre>
    </div>
  );
}