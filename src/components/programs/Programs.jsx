import React, { useState } from "react";
import "./Programs.css";
import ProgramCard from "./ProgramCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { usePrograms} from "../../common/commonUtils";

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