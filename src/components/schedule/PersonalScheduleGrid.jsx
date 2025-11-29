import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClassCard } from "./ClassCard";
import "./Schedule.css";

export function PersonalScheduleGrid({
  personalSchedule,
  DAYS,
  TIME_SLOTS,
  daysWithClasses,
  expandedClass,
  handleClassClick,
  addToPersonalSchedule,
  removeFromPersonalSchedule,
  onResetSchedule,
  onShowToast,
}) {
  const [showAllTimeSlots, setShowAllTimeSlots] = useState(false);

  const personalGrid = useMemo(() => {
    if (DAYS.length === 0 || TIME_SLOTS.length === 0) return {};

    const grid = {};
    DAYS.forEach((day) => {
      grid[day] = {};
      TIME_SLOTS.forEach((time) => {
        grid[day][time] = [];
      });
    });

    personalSchedule.forEach((classItem) => {
      if (grid[classItem.day] && grid[classItem.day][classItem.time]) {
        grid[classItem.day][classItem.time].push(classItem);
      }
    });

    return grid;
  }, [personalSchedule, DAYS, TIME_SLOTS]);

  const handleReset = () => {
    if (personalSchedule.length > 0) {
      onResetSchedule();
      if (onShowToast) {
        onShowToast("Your schedule has been reset");
      }
    }
  };

  const getVisibleTimeSlots = () => {
    if (showAllTimeSlots) return TIME_SLOTS;

    const timesWithClasses = new Set();
    DAYS.forEach((day) => {
      TIME_SLOTS.forEach((time) => {
        if (personalGrid[day][time].length > 0) {
          timesWithClasses.add(time);
        }
      });
    });
    return Array.from(timesWithClasses);
  };

  const visibleTimeSlots = getVisibleTimeSlots();

  return (
    <>
      {personalSchedule.length === 0 ? (
        <motion.div
          className="empty-schedule"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>
            No classes added yet. Click "Add to My Schedule" on any class above
            to get started!
          </p>
        </motion.div>
      ) : (
        <>
          <div className="personal-schedule-header">
            <div className="personal-schedule-controls">
              <motion.button
                className="reset-btn"
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Clear all classes from your personal schedule"
              >
                Reset Schedule
              </motion.button>
              <motion.button
                className={`view-all-toggle ${showAllTimeSlots ? "active" : ""}`}
                onClick={() => setShowAllTimeSlots(!showAllTimeSlots)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={
                  showAllTimeSlots
                    ? "Show only times with classes"
                    : "Show all time slots"
                }
              >
                {showAllTimeSlots
                  ? "Hide Empty Slots"
                  : "View All Time Slots"}
              </motion.button>
            </div>
            <div className="schedule-info">
              <span className="class-count">{personalSchedule.length} class{personalSchedule.length !== 1 ? "es" : ""} selected</span>
            </div>
          </div>

          <motion.div className="personal-schedule-grid" layout>
            <div className="personal-grid-header">
              <div className="time-column-header">Time</div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className={`day-header ${daysWithClasses.has(day) ? "has-classes" : "no-classes"}`}
                  role="columnheader"
                  aria-label={`${day}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {visibleTimeSlots.map((time, timeIndex) => {
              const hasClassesInRow = DAYS.some(
                (day) => personalGrid[day][time].length > 0,
              );

              return (
                <motion.div
                  key={time}
                  className="grid-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: timeIndex * 0.05 }}
                  layout
                  role="row"
                >
                  <div className="time-cell" role="rowheader">{time}</div>
                  {DAYS.map((day) => (
                    <div
                      key={`personal-${day}-${time}`}
                      className={`schedule-cell ${daysWithClasses.has(day) ? "has-classes" : "no-classes"} ${hasClassesInRow ? "row-has-content" : ""}`}
                      role="gridcell"
                      aria-label={`${day} at ${time}`}
                    >
                      <AnimatePresence mode="popLayout">
                        {personalGrid[day][time].map((classItem, index) => {
                          const classKey = `personal-${day}-${time}-${classItem.programId}-${classItem.type}-${classItem.level}-${index}`;
                          return (
                            <ClassCard
                              key={classKey}
                              classItem={classItem}
                              isExpanded={expandedClass === classKey}
                              onClick={() => handleClassClick(classKey)}
                              onAddToPersonal={addToPersonalSchedule}
                              onRemoveFromPersonal={removeFromPersonalSchedule}
                              isPersonal={true}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </>
  );
}