import { useState } from 'react';
import { calculateChloride, getConvergenceData, parseInputFile } from './Logic/calculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [inputs, setInputs] = useState({
    L1: 30, L2: 30, L3: 30,
    x: 15, y: 15, z: 15,
    Cs: 0.5, Cs0: 0, Da: 0.5, t: 10,
    tol: 0.000001
  });
  
  const [plotData, setPlotData] = useState([]);
  const [finalResult, setFinalResult] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleCalculate = () => {
    const params = {};
    for (let key in inputs) { params[key] = parseFloat(inputs[key]); }
    
    // Get the array of results for the plot
    const data = getConvergenceData(params);
    setPlotData(data);
    setFinalResult(data[data.length - 1].concentration);
  };

  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target.result;
    console.log("File Content Raw:", text); // DEBUG 1

    const newValues = parseInputFile(text);
    console.log("Parsed Object:", newValues); // DEBUG 2
    
    setInputs(prev => {
      const updated = { ...prev, ...newValues };
      console.log("New State will be:", updated); // DEBUG 3
      return updated;
    });
  };
  reader.readAsText(file);
};

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "auto" }}>
      <h1>Chloride Convergence Explorer</h1>
      
      <div style={{ display: "flex", gap: "40px" }}>
        {/* Left: Inputs */}
        <div style={{ flex: 1 }}>
          <h3>Parameters</h3>
          <div style={{ marginBottom: "20px", padding: "10px", border: "1px dashed #ccc" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
              Import from .txt file:
            </label>
            <input type="file" accept=".txt" onChange={handleFileUpload} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {Object.keys(inputs).map(key => (
              <div key={key}>
                <label style={{ fontSize: "12px" }}>{key}</label><br/>
                <input name={key} type="number" value={inputs[key]} onChange={handleInputChange} style={{ width: "80%" }} />
              </div>
            ))}
          </div>
          <button onClick={handleCalculate} style={{ width: "100%", marginTop: "20px", padding: "10px", cursor: "pointer" }}>
            Run Calculation
          </button>
          
          <div style={{ marginTop: "20px", padding: "15px", background: "#f0f0f0" }}>
            <strong>Result: {finalResult.toFixed(6)}%</strong>
          </div>
        </div>

        {/* Right: The Chart */}
        <div style={{ flex: 2, height: "400px", background: "#fff", border: "1px solid #ddd", padding: "10px" }}>
          <h3>Convergence Plot</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="terms" label={{ value: 'Number of Terms', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="concentration" stroke="#8884d8" dot={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;