import logo from "../assets/logo.png"; 

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <div className="header-center">
        <h1>Chloride Diffusion Analyzer</h1>
        <p>3D Cubic Diffusion Mathematical Model</p>
      </div>
    </header>
  );
}
