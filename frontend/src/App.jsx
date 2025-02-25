import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CalculatorTab from './components/CalculatorTab';
import ShaderTab from './components/ShaderTab';

export default function App() {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)}>
        <Tab label="Rust Calculator" />
        <Tab label="Text-to-Shader" />
      </Tabs>

      <Box sx={{ marginTop: 2 }}>
        {tabIndex === 0 && <CalculatorTab />}
        {tabIndex === 1 && <ShaderTab />}
      </Box>
    </div>
  );
}