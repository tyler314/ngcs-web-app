import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClassCard } from "./ClassCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Schedule.css";

export function ScheduleAccordionView({
  scheduleGrid,
  DAYS,
  TIME_SLOTS,
  expandedClass,
  handleClassClick,
  addToPersonalSchedule,
  removeFromPersonalSchedule,
  isInPersonalSchedule,
}) {
  // Determine default open day
  const [expandedDay, setExpandedDay] = useState(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    // Check if today is in DAYS (meaning it has classes)
    if (DAYS.includes(today)) {
      return today;
    }
    // Default to the first available day if today has no classes
    return DAYS[0];
  });

  const handleDayClick = (day) => {
    if (expandedDay === day) {
      // Optional: Allow collapsing the currently open day?
      // The user said "I want you to open the day of the week it is by default",
      // usually accordions allow toggling. Let's allow toggling off or switching.
      // For a schedule, usually one day is always open is better, but let's allow toggle for now.
      setExpandedDay(null);
      // Close any expanded class when collapsing the day
      handleClassClick(null);
    } else {
      setExpandedDay(day);
    }
  };

  return (
    <div className="schedule-accordion-view">
      {DAYS.map((day) => {
        const isExpanded = expandedDay === day;

        // Get classes for this day to generate dots
        const dayClasses = [];
        if (scheduleGrid[day]) {
          TIME_SLOTS.forEach((time) => {
            if (scheduleGrid[day][time]) {
              scheduleGrid[day][time].forEach((c) => dayClasses.push(c));
            }
          });
        }

        // Unique colors for dots
        const dotColors = [...new Set(dayClasses.map((c) => c.color.bg))];

        return (
          <motion.div
            key={day}
            className={`accordion-item ${isExpanded ? "expanded" : ""}`}
            initial={false}
          >
            <motion.button
              className="accordion-header"
              onClick={() => handleDayClick(day)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="accordion-header-content">
                <span className="accordion-day-name">{day}</span>

                {!isExpanded && (
                  <div className="accordion-dots">
                    {dotColors.map((color, idx) => (
                      <span
                        key={idx}
                        className="accordion-dot"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExpandMoreIcon />
              </motion.div>
            </motion.button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { opacity: 1, height: "auto" },
                    collapsed: { opacity: 0, height: 0 },
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="accordion-content"
                >
                  <div className="accordion-content-inner">
                    {dayClasses.length === 0 ? (
                      <div className="no-classes-message">No classes</div>
                    ) : (
                      dayClasses.map((classItem, index) => {
                        const classKey = `accordion-${day}-${classItem.time}-${classItem.programId}-${classItem.type}-${classItem.level}-${index}`;
                        return (
                          <div key={classKey} className="accordion-class-row">
                            <div className="class-time-col">
                              {classItem.time}
                            </div>
                            <div className="class-card-col">
                              <ClassCard
                                classItem={classItem}
                                isExpanded={expandedClass === classKey}
                                onClick={() => handleClassClick(classKey)}
                                onAddToPersonal={addToPersonalSchedule}
                                onRemoveFromPersonal={
                                  removeFromPersonalSchedule
                                }
                                isPersonal={isInPersonalSchedule(classItem)}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
