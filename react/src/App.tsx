import "./App.css";
import { useEffect } from "react";
import { handleButtonClick } from "./analytics";
import ReactGA from "react-ga4";

const TRACKING_ID = "G-42SMWF6LRM";

function App() {
  ReactGA.initialize(TRACKING_ID);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Play-Along</h1>
      </header>
      <p>Play along YouTube videos.</p>
      <h2>Work in progress, updates will follow...</h2>
      <button onClick={() => handleButtonClick("click", "button")}>
        Button
      </button>
    </div>
  );
}

export default App;
