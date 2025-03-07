import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CalculatorTab from './CalculatorTab';
import ShaderTab from './ShaderTab';

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div style={{ display: "flex", flexDirection: "column" ,boxSizing: "border-box",padding: '20px', backgroundColor: "transparent", width: "100%" , height: "100vh", overflow: "hidden"}}>
      <Tabs style={{position: "relative", top: "10%", paddingLeft: "7%"}} value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)}>
        <Tab style={{fontWeight:600, fontSize: "20px"}} label="Rust Calculator" />
        <Tab style={{fontWeight:600, fontSize: "20px"}} label="Text-to-Shader" />
      </Tabs>

      <Box style={{width:600, position: "relative", top: "30%", left:"8%"}} sx={{ marginTop: 2 }}>
        {tabIndex === 0 && <CalculatorTab />}
        {tabIndex === 1 && <ShaderTab />}
      </Box>
      <div style={{position:"absolute", width:"90%", height:"70%", top:"50%",left:"50%", transform:"translate(-50%,-40%)", borderRadius: 25, background:'url("/bg_final.jpg")', backgroundSize:"cover", opacity:"100%", zIndex:-1}}>
      <img src="/i_phone.png" alt="" style={{position:"absolute", bottom:"-57.5%", right:"-15%", scale:"0.5"}}/>
      </div>
    </div>
  );
}