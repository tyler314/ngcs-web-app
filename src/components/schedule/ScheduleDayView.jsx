import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClassCard } from "./ClassCard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./Schedule.css";
import { useCurrentDayIndex } from "../../common/commonUtils";

export function ScheduleDayView({
  scheduleGrid,
  DAYS,
  TIME_SLOTS,
  expandedClass,
  handleClassClick,
  addToPersonalSchedule,
  removeFromPersonalSchedule,
  isInPersonalSchedule,
}) {
  const [currentDayIndex, setCurrentDayIndex] = useCurrentDayIndex(DAYS);
  const currentDay = DAYS[currentDayIndex] || DAYS[0];

  const dayClasses = useMemo(() => {
    if (!currentDay || !scheduleGrid[currentDay]) return [];

    const classes = [];
    TIME_SLOTS.forEach((time) => {
      scheduleGrid[currentDay][time].forEach((classItem) => {
        classes.push({
          ...classItem,
          time,
        });
      });
    });

    return classes;
  }, [currentDay, scheduleGrid, TIME_SLOTS]);

  const goToPreviousDay = () => {
    setCurrentDayIndex((prev) => (prev === 0 ? DAYS.length - 1 : prev - 1));
  };

  const goToNextDay = () => {
    setCurrentDayIndex((prev) => (prev === DAYS.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      className="schedule-day-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="day-view-header">
        <motion.button
          className="day-nav-btn"
          onClick={goToPreviousDay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous day"
        >
          <ChevronLeftIcon />
        </motion.button>

        <div className="day-display">
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentDay}
              className="current-day"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentDay}
            </motion.h2>
          </AnimatePresence>
          <div className="day-indicator">
            {DAYS.map((day, index) => (
              <motion.div
                key={day}
                className={`day-dot ${index === currentDayIndex ? "active" : ""}`}
                onClick={() => setCurrentDayIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        <motion.button
          className="day-nav-btn"
          onClick={goToNextDay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next day"
        >
          <ChevronRightIcon />
        </motion.button>
      </div>

      <motion.div className="day-classes-container" layout>
        <AnimatePresence mode="wait">
          {dayClasses.length === 0 ? (
            <motion.div
              key="empty"
              className="no-classes-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p>No classes on {currentDay}</p>
            </motion.div>
          ) : (
            <motion.div
              key={currentDay}
              className="classes-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {dayClasses.map((classItem, index) => {
                const classKey = `day-view-${currentDay}-${classItem.time}-${classItem.programId}-${classItem.type}-${classItem.level}-${index}`;
                return (
                  <motion.div
                    key={classKey}
                    className="day-class-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="class-time-badge">{classItem.time}</div>
                    <ClassCard
                      classItem={classItem}
                      isExpanded={expandedClass === classKey}
                      onClick={() => handleClassClick(classKey)}
                      onAddToPersonal={addToPersonalSchedule}
                      onRemoveFromPersonal={removeFromPersonalSchedule}
                      isPersonal={isInPersonalSchedule(classItem)}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}