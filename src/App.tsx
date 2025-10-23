import { Header } from "./components/Header";
import { Canvas } from "./components/Canvas";
import { Footer } from "./components/Footer";

// Main App component
function App() {
  return (
    <div className="App"  style={{overflow:"hidden", height:"100vh"}}>
      <Header />
      <Canvas />
      <Footer />
    </div>
  );
}

export default App;