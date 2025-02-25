import React, { useState, useEffect } from 'react';
import init, { calculate } from '../wasm.js'; // Import the WASM module

export default function CalculatorTab() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  // Initialize the WASM module
  useEffect(() => {
    init('../wasm_bg.wasm')
      .then(() => console.log('WASM initialized'))
      .catch((err) => console.error('WASM initialization failed:', err));
  }, []);

  const handleCalculate = async () => {
    try {
      const res = calculate(input); // Call the WASM function
      setResult(`Result: ${res}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter expression"
      />
      <button onClick={handleCalculate}>Calculate</button>
      <div>{result}</div>
    </div>
  );
}