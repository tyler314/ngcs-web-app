import "./Instructors.css";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  S3_INSTRUCTORS_BUCKET_URL,
  DEFAULT_INSTRUCTOR_IMAGE,
} from "../../common/constants";

// Variants for the list container — drives stagger timing for children
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1, // reverse stagger on collapse
    },
  },
};

// Each achievement item slides + fades in
const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.15 },
  },
};

/**
 * InstructorCard component displays information about a single instructor.
 * @param {Object} props - Component properties
 * @param {Object} props.instructor - Instructor data object
 */
export default function InstructorCard({ instructor }) {
  const { name, role, disciplines, bio, imgSrc } = instructor;
  const [expandAchievements, setExpandAchievements] = useState(false);

  // Convert comma-separated disciplines into an array
  const disciplinesList = disciplines
    ? disciplines.split(",").filter((item) => item.trim() !== "")
    : [];

  // Check if bio is an object or string
  const isBioObject = bio && typeof bio === "object";
  const bioSummary = isBioObject ? bio.summary : bio;
  const bioAchievements = isBioObject ? bio.achievements || [] : [];

  // Show only the first 2 achievements by default, or all if expanded
  const MAX_VISIBLE_ACHIEVEMENTS = 2;
  const hiddenCount = bioAchievements.length - MAX_VISIBLE_ACHIEVEMENTS;

  // Extra achievements that only appear when expanded
  const extraAchievements = bioAchievements.slice(MAX_VISIBLE_ACHIEVEMENTS);

  return (
    <div className="instructor-card">
      <div className="instructor-image-container">
        <img
          src={imgSrc}
          alt={`${name}, ${role}`}
          className="instructor-image"
          onError={(e) => {
            e.target.src = `${S3_INSTRUCTORS_BUCKET_URL}${DEFAULT_INSTRUCTOR_IMAGE}`;
          }}
        />
      </div>

      <div className="instructor-simple-info">
        <h3>{name}</h3>
        <p className="instructor-role">{role}</p>

        {bioSummary && (
          <p className="instructor-bio">{bioSummary}</p>
        )}

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

        {bioAchievements.length > 0 && (
          <div className="achievements-container">
            <p className="achievements-title">Achievements:</p>

            <ul className="achievements-list">
              {/* Always-visible first two */}
              {bioAchievements.slice(0, MAX_VISIBLE_ACHIEVEMENTS).map((achievement, index) => (
                <li key={index} className="achievement-item">
                  <span className="achievement-event">{achievement.event}</span>
                  {achievement.division && (
                    <span className="achievement-division">
                      {achievement.division}
                    </span>
                  )}
                  {achievement.result && (
                    <span className="achievement-result">
                      {achievement.result}
                    </span>
                  )}
                </li>
              ))}

              {/* Stagger-animated extra achievements */}
              <AnimatePresence initial={false}>
                {expandAchievements && (
                  <motion.div
                    key="extra-achievements"
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ overflow: "hidden" }}
                  >
                    {extraAchievements.map((achievement, index) => (
                      <motion.li
                        key={MAX_VISIBLE_ACHIEVEMENTS + index}
                        className="achievement-item"
                        variants={itemVariants}
                      >
                        <span className="achievement-event">{achievement.event}</span>
                        {achievement.division && (
                          <span className="achievement-division">
                            {achievement.division}
                          </span>
                        )}
                        {achievement.result && (
                          <span className="achievement-result">
                            {achievement.result}
                          </span>
                        )}
                      </motion.li>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </ul>

            {bioAchievements.length > MAX_VISIBLE_ACHIEVEMENTS && (
              <motion.button
                className="achievements-expand-button"
                onClick={() => setExpandAchievements(!expandAchievements)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={expandAchievements ? "less" : "more"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {expandAchievements
                      ? "Show Less"
                      : `Show More (${hiddenCount} more)`}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}