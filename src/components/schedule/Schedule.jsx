import React from "react";
import "./Schedule.css";
import SchedulePage from "./SchedulePage";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default function Schedule() {
  return (
    <div className="schedule-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: '1 0 auto', paddingBottom: '0' }}>
        <SchedulePage />
      </div>
      <Footer />
    </div>
  );
}