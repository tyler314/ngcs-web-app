import { motion, AnimatePresence } from "motion/react";
import { ClassCard } from "./ClassCard";
import "./Schedule.css";

export function ScheduleGridView({
  scheduleGrid,
  DAYS,
  TIME_SLOTS,
  expandedClass,
  handleClassClick,
  addToPersonalSchedule,
  removeFromPersonalSchedule,
  isInPersonalSchedule,
}) {
  return (
    <motion.div
      className="schedule-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      role="table"
      aria-label="All available classes"
    >
      <div className="grid-header" role="rowgroup">
        <div className="time-column-header" role="columnheader">
          Time
        </div>
        {DAYS.map((day) => (
          <div key={day} className="day-header" role="columnheader">
            {day}
          </div>
        ))}
      </div>

      {TIME_SLOTS.map((time, timeIndex) => (
        <motion.div
          key={time}
          className="grid-row"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: timeIndex * 0.05 }}
          role="row"
        >
          <div className="time-cell" role="rowheader">
            {time}
          </div>
          {DAYS.map((day) => (
            <div
              key={`${day}-${time}`}
              className="schedule-cell"
              role="gridcell"
              aria-label={`${day} at ${time}`}
            >
              <AnimatePresence mode="popLayout">
                {scheduleGrid[day][time].map((classItem, index) => {
                  const classKey = `${day}-${time}-${classItem.programId}-${classItem.type}-${classItem.level}-${index}`;
                  return (
                    <ClassCard
                      key={classKey}
                      classItem={classItem}
                      isExpanded={expandedClass === classKey}
                      onClick={() => handleClassClick(classKey)}
                      onAddToPersonal={addToPersonalSchedule}
                      onRemoveFromPersonal={removeFromPersonalSchedule}
                      isPersonal={isInPersonalSchedule(classItem)}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}
