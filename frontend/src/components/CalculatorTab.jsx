import React, { useState, useEffect } from 'react';
import init, { evaluate_expression } from '../wasm/pkg/wasm'; // Import the WASM module

export default function CalculatorTab() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  // Initialize the WASM module
  // useEffect(() => {
  //   init('../wasm_bg.wasm')
  //     .then(() => console.log('WASM initialized'))
  //     .catch((err) => console.error('WASM initialization failed:', err));
  // }, []);

  const calculate = async () => {
    await init(); // Initialize WebAssembly
    setResult(evaluate_expression(input));
  };

  return (
    <div  style={{width: "90%"}}>
      <input
        value={input}
        style={{ width: "100%", height: "50px", paddingLeft: 20, borderRadius: 10, boxShadow: "8px 8px 0px black", border:"2px solid black", fontSize: 24}}
        onChange={(e) => setInput(e.target.value)}
        placeholder="enter an expression"
      />
      <button style={{ marginTop:"40px", marginLeft:"33%", color:"white", width: "30%", height: "50px", borderRadius: 10, border:0, backgroundColor: "black", fontSize: 16}} onClick={calculate}>EVALUATE</button>
      <div style={{boxSizing:"border-box",position: 'relative', padding: 16, left:"740px", bottom:"250px", width:'480px', height:'490px', backgroundColor:'black', color:"white"}}>
        <h1 style={{color:"white", fontSize:"24px"}}>Result:</h1>
        <p style={{fontSize:"50px"}}>{result}</p>
        </div>
    </div>
  );
}