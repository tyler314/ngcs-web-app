import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/landingPage/LandingPage";
import Instructors from './components/instructors/Instructors';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/instructors" element={<Instructors />} />
      </Routes>
    </div>
  );
}

export default App;