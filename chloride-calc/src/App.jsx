import { useState } from 'react';
import { calculateChloride, getConvergenceData, parseInputFile } from './Logic/calculator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const styles = {
  page: {
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    padding: "50px 250px",
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "50px",
    textAlign: "center", // Keeps Heading and Subtitle centered
  },
  title: {
    color: "#1a202c",
    fontSize: "2.8rem",
    fontWeight: "800",
    margin: "0",
  },
  subtitle: {
    color: "#4a5568",
    fontSize: "1.2rem",
    marginTop: "10px",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr", // Left side is 1 part, Right side is 1.5 parts wide
    gap: "40px",
    alignItems: "start",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "45px",
    borderRadius: "20px",
    boxShadow: "1 10px 25px rgba(0, 0, 0, 0.05)",
    textAlign: "left", // Ensures all content inside cards starts from the left
  },
  cardTitle: {
    fontSize: "1.4rem",
    color: "#2d3748",
    marginBottom: "20px",
    borderBottom: "2px solid #edf2f7",
    paddingBottom: "10px",
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // Two columns of inputs
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start", // Aligns labels and inputs to the left
  },
  fieldLabel: {
    fontSize: "13px",
    fontWeight: "",
    color: "#718096",
    marginBottom: "6px",
  },
  input: {
    width: "90%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    backgroundColor: "#f8fafc",
  },
  button: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    backgroundColor: "#3182ce",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  resetButton: {
    width: "100%",
    marginTop: "12px",
    padding: "12px",
    backgroundColor: "transparent",
    color: "#e53e3e",
    border: "2px solid #e53e3e",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
    downloadButton: {
    flex: 1,
    marginTop: "12px",
    padding: "12px",
    backgroundColor: "#2d3748", // Dark gray/black
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#ebf8ff",
    borderRadius: "15px",
    textAlign: "center",
    border: "1px solid #bee3f8",
  },
  resultValue: {
    display: "block",
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#2b6cb0",
  },
  chartContainer: {
    height: "450px", // Made the graph taller
    marginTop: "20px",
  },
  uploadBox: {
    marginBottom: "25px",
    padding: "20px",
    backgroundColor: "#f7fafc",
    borderRadius: "12px",
    border: "2px dashed #cbd5e0",
    textAlign: "left",
  }
};

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
          {/* ... rest of the chart code ... */}
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={plotData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="terms" stroke="#a0aec0" fontSize={12} tickLine={false} axisLine={false} label={{ value: "Number of Terms (n,m,p)", position: "insideBottom", offset: -5 }} />
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