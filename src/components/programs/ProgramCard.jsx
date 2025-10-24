import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionSchedule from "../schedule/AccordionSchedule";
import PillSchedule from "../schedule/PillSchedule";
import { PROGRAMS_BUCKET } from "../../common/constants";
import "./ProgramCard.css";

/**
 * ProgramCard component with bounce expand, pulse indicator animations.
 * Supports horizontal (default), vertical, or background picture positioning.
 */
export default function ProgramCard({ program, index, isExpanded, onToggle }) {
  const { name, description, skillLevel, picture, picturePosition, schedule } =
    program;
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const [expandedType, setExpandedType] = useState(null);

  // Construct full picture URL
  const pictureUrl = picture ? `${PROGRAMS_BUCKET}${picture}` : null;

  const isColored = index % 2 === 0;

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Normalize picture position: default to horizontal
  // Keep vertical layout but change display when screen width < 1200px
  let normalizedPosition = "horizontal";
  let isVerticalSmallScreen = false;

  if (picturePosition === "b" || picturePosition === "background") {
    normalizedPosition = "background";
  } else if (picturePosition === "v" || picturePosition === "vertical") {
    if (windowWidth >= 1200) {
      normalizedPosition = "vertical";
    } else {
      // On small screens, use vertical aspect ratio but horizontal layout
      normalizedPosition = "horizontal";
      isVerticalSmallScreen = true;
    }
  }

  // Determine design style based on schedule structure
  const getDesignStyle = () => {
    // If no schedule, fallback to simple
    if (!schedule) return "simple";
    // Count for each section (gi, nogi, etc) how many fields are array-type (not 'description')
    let anySectionMultiArray = false;
    for (const section of Object.values(schedule)) {
      if (section && typeof section === "object" && !Array.isArray(section)) {
        let arrayFieldCount = 0;
        for (const [key, val] of Object.entries(section)) {
          if (key === "description") continue;
          if (Array.isArray(val)) arrayFieldCount++;
          // Also check for {sessions: []} structure
          if (val && typeof val === "object" && Array.isArray(val.sessions)) {
            arrayFieldCount++;
          }
        }
        if (arrayFieldCount > 1) {
          anySectionMultiArray = true;
          break;
        }
      }
    }
    if (anySectionMultiArray) return "accordion";
    return "pills";
  };

  // Render schedule based on design type
  const renderSchedule = () => {
    if (!schedule) return <p>Schedule coming soon</p>;

    const designStyle = getDesignStyle();
    const scheduleEntries = Object.entries(schedule);

    switch (designStyle) {
      case "accordion":
        return (
          <AccordionSchedule
            scheduleEntries={scheduleEntries}
            expandedType={expandedType}
            setExpandedType={setExpandedType}
          />
        );
      case "pills":
        return <PillSchedule scheduleEntries={scheduleEntries} />;
      default:
        return <p>No schedule available</p>;
    }
  };

  return (
    <motion.div
      className={`program-card ${isColored ? "program-card-colored" : "program-card-light"} ${normalizedPosition === "background" && isExpanded ? "has-background" : ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background image for background style */}
      {normalizedPosition === "background" && pictureUrl && isExpanded && (
        <motion.div
          className="background-image-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ backgroundImage: `url(${pictureUrl})` }}
        />
      )}
      {/* Main card content */}
      <div
        className="program-card-content"
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <h2 className="program-name">{name}</h2>

        <p className="program-description">{description}</p>
        <div className="program-skill-level">
          <span className="skill-level-label">Skill Level:</span>
          <span className="skill-level-value">{skillLevel}</span>
        </div>

        <motion.div
          className="expand-indicator"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ExpandMoreIcon fontSize="medium" />
        </motion.div>
      </div>

      {/* Expandable section with bounce animation */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="program-card-expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                },
                opacity: {
                  duration: 0.3,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                },
                opacity: {
                  duration: 0.2,
                },
              },
            }}
            style={{ overflow: "hidden" }}
          >
            <div
              className={`program-card-expanded-content ${normalizedPosition === "vertical" ? "layout-vertical" : normalizedPosition === "background" ? "layout-background" : "layout-horizontal"}`}
            >
              {normalizedPosition === "vertical" ? (
                <>
                  {/* Row: Text and Picture side by side */}
                  <div className="vertical-row">
                    {/* Text content */}
                    <div className="expanded-text-content">
                      <div className="expanded-section">
                        <h3>What You'll Learn</h3>
                        {Array.isArray(program.whatYouLearn) &&
                        program.whatYouLearn.length === 1 ? (
                          <p style={{ marginLeft: "1rem" }}>
                            {program.whatYouLearn[0]}
                          </p>
                        ) : Array.isArray(program.whatYouLearn) &&
                          program.whatYouLearn.length > 1 ? (
                          <ul>
                            {program.whatYouLearn.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div className="expanded-section">
                        <h3>Class Schedule</h3>
                        {renderSchedule()}
                      </div>

                      <div className="expanded-section">
                        <h3>What to Bring</h3>
                        <p>
                          {program.whatToBring
                            ? program.whatToBring
                            : "Comfortable athletic wear, water bottle, and a positive attitude!"}
                        </p>
                      </div>
                    </div>

                    {/* Picture */}
                    {pictureUrl && (
                      <motion.div
                        className="hero-image-container hero-vertical"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <img
                          src={pictureUrl}
                          alt={`${name} training`}
                          className="hero-image"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* CTA Button - full width below the row */}
                  <button className="cta-button">Sign Up Now</button>
                </>
              ) : (
                <>
                  {/* Picture - only show if not background mode */}
                  {pictureUrl && normalizedPosition !== "background" && (
                    <motion.div
                      className={`hero-image-container ${isVerticalSmallScreen ? "hero-vertical-small-screen" : "hero-horizontal"}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <img
                        src={pictureUrl}
                        alt={`${name} training`}
                        className="hero-image"
                      />
                    </motion.div>
                  )}

                  {/* Text content */}
                  <div className="expanded-text-content">
                    <div className="expanded-section">
                      <h3>What You'll Learn</h3>
                      {Array.isArray(program.whatYouLearn) &&
                      program.whatYouLearn.length === 1 ? (
                        <p style={{ marginLeft: "1rem" }}>
                          {program.whatYouLearn[0]}
                        </p>
                      ) : Array.isArray(program.whatYouLearn) &&
                        program.whatYouLearn.length > 1 ? (
                        <ul>
                          {program.whatYouLearn.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    <div className="expanded-section">
                      <h3>Class Schedule</h3>
                      {renderSchedule()}
                    </div>

                    <div className="expanded-section">
                      <h3>What to Bring</h3>
                      <p>
                        {program.whatToBring
                          ? program.whatToBring
                          : "Comfortable athletic wear, water bottle, and a positive attitude!"}
                      </p>
                    </div>

                    <button className="cta-button">Sign Up Now</button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
