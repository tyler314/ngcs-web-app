import { useMemo } from "react";
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
}) {
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

  return (
    <>
      {personalSchedule.length === 0 ? (
        <motion.div
          className="empty-schedule"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>
            No classes added yet. Click "Add to My Schedule" on any class above
            to get started!
          </p>
        </motion.div>
      ) : (
        <motion.div className="personal-schedule-grid" layout>
          <div className="personal-grid-header">
            <div className="time-column-header">Time</div>
            {DAYS.map((day) => (
              <div
                key={day}
                className={`day-header ${daysWithClasses.has(day) ? "has-classes" : "no-classes"}`}
              >
                {day}
              </div>
            ))}
          </div>

          {TIME_SLOTS.map((time, timeIndex) => {
            const hasClassesInRow = DAYS.some(
              (day) => personalGrid[day][time].length > 0,
            );
            if (!hasClassesInRow) return null;

            return (
              <motion.div
                key={time}
                className="grid-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: timeIndex * 0.05 }}
                layout
              >
                <div className="time-cell">{time}</div>
                {DAYS.map((day) => (
                  <div
                    key={`personal-${day}-${time}`}
                    className={`schedule-cell ${daysWithClasses.has(day) ? "has-classes" : "no-classes"}`}
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
      )}
    </>
  );
}
