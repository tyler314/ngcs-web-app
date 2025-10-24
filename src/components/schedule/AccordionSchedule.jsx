import React from "react";
import { motion, AnimatePresence } from "motion/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AccordionSchedule({
  scheduleEntries,
  expandedType,
  setExpandedType,
}) {
  const renderDescription = (desc) =>
    desc ? <p className="schedule-description">{desc}</p> : null;

  const getActualSessions = (sessions) =>
    Array.isArray(sessions)
      ? sessions
      : sessions?.sessions && Array.isArray(sessions.sessions)
        ? sessions.sessions
        : [];

  return (
    <div className="schedule-accordion-container">
      {scheduleEntries.map(([type, levels]) => {
        const isTypeExpanded = expandedType === type;
        const { description: desc, ...restLevels } = levels || {};
        return (
          <div key={type} className="schedule-accordion-item">
            <motion.div
              className="schedule-accordion-header"
              onClick={() => setExpandedType(isTypeExpanded ? null : type)}
            >
              <h4>{type.toUpperCase()}</h4>
              <motion.div
                animate={{ rotate: isTypeExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExpandMoreIcon />
              </motion.div>
            </motion.div>

            <AnimatePresence>
              {isTypeExpanded && (
                <motion.div
                  className="schedule-accordion-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderDescription(desc)}
                  {Object.entries(restLevels).map(([level, sessions]) => {
                    const actualSessions = getActualSessions(sessions);
                    return (
                      <div key={level} className="schedule-level-section">
                        <div className="schedule-level-title">{level}</div>
                        {actualSessions.map((session, sIdx) => (
                          <div key={sIdx} className="schedule-session-row">
                            <span className="session-day">{session.day}</span>
                            <span className="session-divider">•</span>
                            <span className="session-time">
                              {Array.isArray(session.times)
                                ? session.times.join(", ")
                                : session.times}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
