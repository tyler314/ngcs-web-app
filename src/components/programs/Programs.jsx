import React, { useState, useEffect } from "react";
import "./Programs.css";
import ProgramCard from "./ProgramCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { PROGRAMS_API } from "../../common/constants";

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedProgram, setExpandedProgram] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch(PROGRAMS_API);
        if (!response.ok) throw new Error("Failed to fetch programs");

        const data = await response.json();
        setPrograms(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching programs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

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
