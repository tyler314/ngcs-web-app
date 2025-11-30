import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClassCard } from "./ClassCard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./Schedule.css";
import { parseTime, useCurrentDayIndex } from "../../common/commonUtils";

export function PersonalScheduleMobileDay({
  personalSchedule,
  DAYS,
  expandedClass,
  handleClassClick,
  removeFromPersonalSchedule,
  onResetSchedule,
  onShowToast,
}) {
  const [currentDayIndex, setCurrentDayIndex] = useCurrentDayIndex(DAYS);
  const currentDay = DAYS[currentDayIndex] || DAYS[0];


  const dayClasses = useMemo(() => {
    if (!currentDay) return [];

    const classes = personalSchedule.filter(
      (classItem) => classItem.day === currentDay,
    );

    return classes.sort((a, b) => {
      return parseTime(a.time) - parseTime(b.time);
    });
  }, [currentDay, personalSchedule]);

  const goToPreviousDay = () => {
    setCurrentDayIndex((prev) => (prev === 0 ? DAYS.length - 1 : prev - 1));
  };

  const goToNextDay = () => {
    setCurrentDayIndex((prev) => (prev === DAYS.length - 1 ? 0 : prev + 1));
  };

  const handleReset = () => {
    if (personalSchedule.length > 0) {
      onResetSchedule();
      if (onShowToast) {
        onShowToast("Your schedule has been reset");
      }
    }
  };

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
            </div>
            <div className="schedule-info">
              <span className="class-count">
                {personalSchedule.length} class
                {personalSchedule.length !== 1 ? "es" : ""} selected
              </span>
            </div>
          </div>

          <motion.div
            className="personal-day-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
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
                  <motion.h3
                    key={currentDay}
                    className="current-day"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentDay}
                  </motion.h3>
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
                    <p>No classes scheduled for {currentDay}</p>
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
                      const classKey = `personal-day-${currentDay}-${classItem.time}-${classItem.programId}-${classItem.type}-${classItem.level}-${index}`;
                      return (
                        <motion.div
                          key={classKey}
                          className="day-class-card"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="class-time-badge">
                            {classItem.time}
                          </div>
                          <ClassCard
                            classItem={classItem}
                            isExpanded={expandedClass === classKey}
                            onClick={() => handleClassClick(classKey)}
                            onAddToPersonal={() => { }}
                            onRemoveFromPersonal={removeFromPersonalSchedule}
                            isPersonal={true}
                          />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
}