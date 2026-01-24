# Free Chloride Concentration Calculator (Web App)
This is a web-based application to calculate free chloride concentration in concrete. 
It was converted from a Python desktop GUI to a web app for easier use and visualization.

## Features
- Enter domain and chloride parameters
- Calculate free chloride concentration
- View interactive graphs of results
- Export results as PDF
- Supports batch input from .txt or .csv files

## Installation

1. Clone the repository:  git clone https://github.com/your-username/chloride-calculator-web.git
2. cd chloride-calculator-web
3. npm install
4. npm run dev

## Usage

1. Enter parameters (L1, L2, L3, x, y, z, Cs, Cs0, Da, t, Tolerance)
2. Click "Calculate"
3. View the results and the graph
4. Click "Export PDF" to download results
5. Optionally, load inputs from .txt or .csv for batch calculations

## Screenshots

**Input Page**  
![Input Page](./assets/screenshots/Input.png)

**Results Page**  
![Results Page](./assets/screenshots/Output_Graph.png)

## Technologies Used
- React with Vite
- Tailwind CSS
- Recharts (for charts)
- jsPDF and html2canvas (for PDF export)

## Authors
- T.Sanojan - Convert in to Web UI & frontend
- U. Sanathanan –  GUI development, implementation, coding
     Git Repo - https://github.com/epidsc/Free-Chloride-Concentration-Calculator.git

## Acknowledgments
- Original Python GUI project under Dr. D.A.S. Amarasinghe
- Mathematical derivation based on X. Qiu et al. (2024)





