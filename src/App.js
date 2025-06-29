import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/landingPage/LandingPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
