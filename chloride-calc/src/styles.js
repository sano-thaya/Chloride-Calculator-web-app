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
    backgroundColor: "#0787ffd0",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  resetButton: {
    width: "50%",
    marginTop: "15px",
    padding: "15px",
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
    marginTop: "15px",
    padding: "15px",
    backgroundColor: "#2d3f5fff", // Dark gray/black
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
    marginTop: "45px",
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

export default styles;