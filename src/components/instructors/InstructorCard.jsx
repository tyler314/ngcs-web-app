import React from "react";
import "./Instructors.css";

/**
 * InstructorCard component displays information about a single instructor.
 * @param {Object} props - Component properties
 * @param {Object} props.instructor - Instructor data object
 */
export default function InstructorCard({ instructor }) {
  const { name, role, disciplines, bio, imgSrc } = instructor;

  // Convert comma-separated disciplines into an array
  // Make sure to handle both single and multiple values
  const disciplinesList = disciplines ? disciplines.split(',').filter(item => item.trim() !== '') : [];

  return (
    <div className="instructor-card">
      <div className="instructor-image-container">
        <img 
          src={imgSrc} 
          alt={`${name}, ${role}`} 
          className="instructor-image"
          onError={(e) => {
            e.target.src = "/path/to/default-instructor.jpg"; // Fallback image
          }}
        />
      </div>

      <div className="instructor-simple-info">
        <h3>{name}</h3>
        <p className="instructor-role">{role}</p>
        
        {disciplinesList.length > 0 ? (
          <div className="disciplines-container">
            <p className="disciplines-title">Disciplines:</p>
            <ul className="disciplines-list">
              {disciplinesList.map((discipline, index) => (
                <li key={index}>{discipline.trim()}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No disciplines listed</p>
        )}
        
        {bio && <p className="instructor-bio">{bio}</p>}
      </div>
    </div>
  );
}