import React from "react";
import "./ProgramCard.css";

/**
 * ProgramCard component displays information about a single program.
 * Alternates styling based on index for visual variety.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.program - Program data object
 * @param {number} props.index - Index in the list (for alternating styles)
 */
export default function ProgramCard({ program, index }) {
  const { name, description, skillLevel } = program;

  // Determine if this card should have the colored background
  const isColored = index % 2 === 0;

  return (
    <div
      className={`program-card ${isColored ? "program-card-colored" : "program-card-light"}`}
    >
      <div className="program-card-content">
        <h2 className="program-name">{name}</h2>
        <p className="program-description">{description}</p>
        <div className="program-skill-level">
          <span className="skill-level-label">Skill Level:</span>
          <span className="skill-level-value">{skillLevel}</span>
        </div>
      </div>
    </div>
  );
}
