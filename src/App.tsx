import { Header } from "./components/Header";
import { Canvas } from "./components/Canvas";
import { Footer } from "./components/Footer";
import { ServiceDefinitionsProvider } from "./context/ServiceDefinitionsContext";

// Main App component
function App() {
  return (
    <ServiceDefinitionsProvider>
      <div className="App"  style={{overflow:"hidden", height:"100vh"}}>
        <Header />
        <Canvas />
        <Footer />
      </div>
    </ServiceDefinitionsProvider>
  );
}

export default App;