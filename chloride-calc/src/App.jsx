import { useState } from 'react';
import { calculateChloride, getConvergenceData, parseInputFile } from './Logic/calculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './styles';

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

    const handleReset = () => {
    // Reset all state to initial values
    setInputs(inputs);
    setPlotData([]);
    setFinalResult(0);
    
    // Reset file input by changing its key
    setFileKey(Date.now());
    
    // Optional: Show a confirmation message
    console.log("All values have been reset to default");
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

const handleDownloadPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4'); // Create A4 PDF
  const margin = 10;
  
  // 1. Add Title
  pdf.setFontSize(20);
  pdf.setTextColor(40);
  pdf.text("Chloride Diffusion Analysis Report", margin, 20);
  
  // 2. Add Date & Summary
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, 28);
  pdf.text(`Final Concentration (Cf): ${finalResult.toFixed(6)}%`, margin, 34);

  // 3. Add Input Table
  pdf.setFontSize(12);
  pdf.setTextColor(40);
  pdf.text("Input Parameters", margin, 45);
  
  let yPos = 52;
  pdf.setFontSize(10);
  Object.entries(inputs).forEach(([key, value]) => {
    pdf.text(`${key}: ${value}`, margin + 5, yPos);
    yPos += 7;
  });

  // 4. CAPTURE THE GRAPH (The "Screenshot" part)
  // We look for the chart container by its ID
  const chartElement = document.getElementById('chart-to-export');
  if (chartElement) {
    const canvas = await html2canvas(chartElement);
    const imgData = canvas.toDataURL('image/png');
    
    // Add the image to the PDF (x, y, width, height)
    // A4 is 210mm wide, so we use 180mm width for the image
    pdf.addPage();
    pdf.text("Convergence Plot Visualization", margin, 20);
    pdf.addImage(imgData, 'PNG', margin, 30, 180, 100);
  }

  // 5. Save the PDF
  pdf.save("Chloride_Analysis_Report.pdf");
};

  return (
  <div style={styles.page}>
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>Chloride Diffusion Analyzer</h1>
        <p style={styles.subtitle}>3D Cubic Diffusion Mathematical Model</p>
      </header>

      <div style={styles.mainGrid}>
        
        {/* LEFT COLUMN: Controls */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Input Parameters</h3>
          
          <div style={styles.uploadBox}>
            <label style={styles.label}>Import Configuration</label>
            <input type="file" accept=".txt" onChange={handleFileUpload} style={styles.fileInput} />
          </div>

          <div style={styles.inputGrid}>
            {Object.keys(inputs).map(key => (
              <div key={key} style={styles.inputGroup}>
                <label style={styles.fieldLabel}>{key}</label>
                <input 
                  name={key} 
                  type="number" 
                  value={inputs[key]} 
                  onChange={handleInputChange} 
                  style={styles.input}
                />
              </div>
            ))}
          </div>

          <button onClick={handleCalculate} style={styles.button}>
            Calculate
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleReset} style={styles.resetButton}>Reset</button>
            <button onClick={handleDownloadPDF} style={styles.downloadButton}>Download Report</button>
          </div>

          <div style={styles.resultBox}>
            <span style={styles.resultLabel}>Final Concentration (Cf):</span>
            <span style={styles.resultValue}>{finalResult.toFixed(6)}%</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Visualization */}
        <div id="chart-to-export" style={styles.card}>
          <h3 style={styles.cardTitle}>Convergence Progress</h3>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={plotData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="terms" stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} label={{ value: "Number of Terms (n,m,p)", position: "insideBottom", offset: -3 }} />
                <YAxis stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} label={{ value: "Concentration %", angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={styles.tooltip} />
                <Line 
                  type="monotone" 
                  dataKey="concentration" 
                  stroke="#3182ce" 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: "#3182ce", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
      </div>
    </div>
  </div>
);

}

export default App;