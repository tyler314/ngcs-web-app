import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/landingPage/LandingPage";
import Instructors from './components/instructors/Instructors';
import Schedule from "./components/schedule/Schedule";
import ContactUs from "./components/contact/ContactUs";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </div>
  );
}

export default App;