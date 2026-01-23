// force redeploy
import { useState } from "react";
import {
  calculateChloride,
  getConvergenceData,
  parseInputFile,
} from "./Logic/calculator";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const [inputs, setInputs] = useState({
    L1: 30,
    L2: 30,
    L3: 30,
    x: 15,
    y: 15,
    z: 15,
    Cs: 0.5,
    Cs0: 0,
    Da: 0.5,
    t: 10,
    tol: 0.000001,
  });

  const [plotData, setPlotData] = useState([]);
  const [finalResult, setFinalResult] = useState(0);

  /* ---------------- INPUT HANDLERS ---------------- */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleCalculate = () => {
    const params = {};
    for (let key in inputs) {
      params[key] = parseFloat(inputs[key]);
    }

    const data = getConvergenceData(params);
    setPlotData(data);
    setFinalResult(data[data.length - 1].concentration);
  };

  const handleReset = () => {
    setInputs({
      L1: 30,
      L2: 30,
      L3: 30,
      x: 15,
      y: 15,
      z: 15,
      Cs: 0.5,
      Cs0: 0,
      Da: 0.5,
      t: 10,
      tol: 0.000001,
    });
    setPlotData([]);
    setFinalResult(0);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const newValues = parseInputFile(text);
      setInputs((prev) => ({ ...prev, ...newValues }));
    };
    reader.readAsText(file);
  };

  /* ---------------- PDF DOWNLOAD ---------------- */

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10;

    pdf.setFontSize(20);
    pdf.text("Chloride Diffusion Analysis Report", margin, 20);

    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, 28);
    pdf.text(
      `Final Concentration (Cf): ${finalResult.toFixed(6)}%`,
      margin,
      34
    );

    pdf.setFontSize(12);
    pdf.text("Input Parameters", margin, 45);

    let yPos = 52;
    pdf.setFontSize(10);
    Object.entries(inputs).forEach(([key, value]) => {
      pdf.text(`${key}: ${value}`, margin + 5, yPos);
      yPos += 7;
    });

    const chartElement = document.getElementById("chart-to-export");
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");

      pdf.addPage();
      pdf.text("Convergence Plot Visualization", margin, 20);
      pdf.addImage(imgData, "PNG", margin, 30, 180, 150);
    }

    pdf.save("Chloride_Analysis_Report.pdf");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1 className="title">Chloride Diffusion Analyzer</h1>
          <p className="subtitle">
            3D Cubic Diffusion Mathematical Model
          </p>
        </header>

        <div className="main-grid">
          {/* LEFT */}
          <div className="card">
            <h3 className="card-title">Input Parameters</h3>

            <div className="upload-box">
              <label>Import Configuration</label>
              <input type="file" accept=".txt" onChange={handleFileUpload} />
            </div>

            <div className="input-grid">
              {Object.keys(inputs).map((key) => (
                <div key={key} className="input-group">
                  <label>{key}</label>
                  <input
                    name={key}
                    type="number"
                    value={inputs[key]}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
            </div>

            <button className="primary-btn" onClick={handleCalculate}>
              Calculate
            </button>

            <div className="button-row">
              <button className="reset-btn" onClick={handleReset}>
                Reset
              </button>
              <button
                className="download-btn"
                onClick={handleDownloadPDF}
              >
                Download Report
              </button>
            </div>

            <div className="result-box">
              <span>Final Concentration (Cf):</span>
              <strong>{finalResult.toFixed(6)}%</strong>
            </div>
          </div>

          {/* RIGHT */}
          <div id="chart-to-export" className="card">
            <h3 className="card-title">Convergence Progress</h3>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={plotData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="terms" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="concentration"
                    stroke="#3182ce"
                    strokeWidth={3}
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
