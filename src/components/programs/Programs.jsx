import React, { useState } from "react";
import "./Programs.css";
import ProgramCard from "./ProgramCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SEO from "../../common/SEO";
import { usePrograms } from "../../common/commonUtils";

export default function Programs() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const { programs, loading, error } = usePrograms();

  // 🔹 Early returns for clarity
  if (loading) {
    return <div className="programs-loading">Loading programs…</div>;
  }

  if (error) {
    return (
      <div className="programs-error">Failed to load programs: {error}</div>
    );
  }

  if (programs.length === 0) {
    return <div className="programs-loading">No programs available.</div>;
  }

  return (
    <div className="programs-page-wrapper">
      <Header />
      <SEO
        title="Programs | Neutral Ground Combat Sports"
        description="Explore our martial arts programs including Brazilian Jiu-Jitsu, MMA, Kickboxing, Boxing, and Kids classes. Training for all ages and skill levels."
        canonical="https://www.westbendbjj.com/programs"
      />
      <section className="programs-container">
        <div className="programs-header">
          <h1>Our Programs</h1>
          <p>Explore our diverse range of educational programs</p>
        </div>

        <div className="programs-list">
          {programs.map((program, index) => (
            <ProgramCard
              key={program.id || index}
              program={program}
              index={index}
              isExpanded={expandedProgram === index}
              onToggle={() =>
                setExpandedProgram(expandedProgram === index ? null : index)
              }
            />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
