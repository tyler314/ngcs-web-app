import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./common/ScrollToTop";
import "./App.css";
import LandingPage from "./components/landingPage/LandingPage";
import Instructors from "./components/instructors/Instructors";
import Schedule from "./components/schedule/Schedule";
import ContactUs from "./components/contact/ContactUs";
import Programs from "./components/programs/Programs";
import Gallery from "./components/gallery/Gallery";

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </div>
  );
}

export default App;