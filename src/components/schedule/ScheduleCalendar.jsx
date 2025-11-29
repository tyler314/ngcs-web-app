import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PersonalScheduleGrid } from "./PersonalScheduleGrid";
import { ClassCard } from "./ClassCard";
import { PROGRAMS_API } from "../../common/constants";
import "./Schedule.css";

const PROGRAM_COLORS = {
  bjj: { bg: "#3b82f6", light: "#60a5fa" },
  striking: { bg: "#ef4444", light: "#f87171" },
  "kids-bjj": { bg: "#10b981", light: "#34d399" },
  mma: { bg: "#8b5cf6", light: "#a78bfa" },
};

function ScheduleCalendar() {
  const [programs, setPrograms] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedClass, setExpandedClass] = useState(null);
  const [personalSchedule, setPersonalSchedule] = useState(() => {
    const saved = localStorage.getItem("personalSchedule");
    return saved ? JSON.parse(saved) : [];
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Save personal schedule to localStorage whenever it changes
    localStorage.setItem("personalSchedule", JSON.stringify(personalSchedule));
  }, [personalSchedule]);

  // Scroll to personal schedule when a class is added
  const scrollToPersonalSchedule = () => {
    const element = document.querySelector(".personal-schedule-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const TIME_SLOTS = useMemo(() => {
    const allTimes = new Set();

    programs.forEach((program) => {
      Object.values(program.schedule || {}).forEach((scheduleGroup) => {
        Object.entries(scheduleGroup).forEach(([key, sessions]) => {
          if (key === "description") return;
          sessions.forEach((session) => {
            session.times.forEach((time) => allTimes.add(time));
          });
        });
      });
    });

    // Sort times chronologically
    return Array.from(allTimes).sort((a, b) => {
      const parseTime = (t) => {
        const [time, period] = t.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };
      return parseTime(a) - parseTime(b);
    });
  }, [programs]);

  const DAYS = useMemo(() => {
    const allDays = new Set();

    programs.forEach((program) => {
      Object.values(program.schedule || {}).forEach((scheduleGroup) => {
        Object.entries(scheduleGroup).forEach(([key, sessions]) => {
          if (key === "description") return;
          sessions.forEach((session) => {
            if (session.day) allDays.add(session.day);
          });
        });
      });
    });

    // Sort in standard week order
    const dayOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return dayOrder.filter((day) => allDays.has(day));
  }, [programs]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(PROGRAMS_API);
        const data = await response.json();
        setPrograms(data);
        setSelectedPrograms(new Set(data.map((p) => p.id)));
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const toggleProgram = (programId) => {
    const newSelected = new Set(selectedPrograms);
    if (newSelected.has(programId)) {
      newSelected.delete(programId);
    } else {
      newSelected.add(programId);
    }
    setSelectedPrograms(newSelected);
  };

  const allSelected = selectedPrograms.size === programs.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedPrograms(new Set());
    } else {
      setSelectedPrograms(new Set(programs.map((p) => p.id)));
    }
  };

  const handleClassClick = (classKey) => {
    if (expandedClass === classKey) {
      setExpandedClass(null);
    } else {
      setExpandedClass(classKey);
    }
  };

  const addToPersonalSchedule = (classItem) => {
    const classKey = `${classItem.day}-${classItem.time}-${classItem.programId}-${classItem.type}-${classItem.level}`;
    if (
      !personalSchedule.find(
        (item) =>
          `${item.day}-${item.time}-${item.programId}-${item.type}-${item.level}` ===
          classKey,
      )
    ) {
      setPersonalSchedule([...personalSchedule, classItem]);
      showToast(`${classItem.program} added to your schedule`);
      scrollToPersonalSchedule();
    }
  };

  const removeFromPersonalSchedule = (classItem) => {
    const classKey = `${classItem.day}-${classItem.time}-${classItem.programId}-${classItem.type}-${classItem.level}`;
    setPersonalSchedule(
      personalSchedule.filter(
        (item) =>
          `${item.day}-${item.time}-${item.programId}-${item.type}-${item.level}` !==
          classKey,
      ),
    );
    showToast(`${classItem.program} removed from your schedule`);
  };

  const isInPersonalSchedule = (classItem) => {
    const classKey = `${classItem.day}-${classItem.time}-${classItem.programId}-${classItem.type}-${classItem.level}`;
    return personalSchedule.some(
      (item) =>
        `${item.day}-${item.time}-${item.programId}-${item.type}-${item.level}` ===
        classKey,
    );
  };

  // Build the schedule grid
  const scheduleGrid = useMemo(() => {
    const grid = {};
    DAYS.forEach((day) => {
      grid[day] = {};
      TIME_SLOTS.forEach((time) => {
        grid[day][time] = [];
      });
    });

    programs.forEach((program) => {
      if (!selectedPrograms.has(program.id)) return;

      Object.entries(program.schedule).forEach(
        ([scheduleType, scheduleData]) => {
          Object.entries(scheduleData).forEach(([levelKey, levelData]) => {
            if (levelKey === "description") return;

            const sessions = levelData;
            sessions.forEach((session) => {
              session.times.forEach((time) => {
                if (grid[session.day] && grid[session.day][time]) {
                  grid[session.day][time].push({
                    program: program.name,
                    programId: program.id,
                    type: scheduleType,
                    level: levelKey,
                    color: PROGRAM_COLORS[program.id],
                    day: session.day,
                    time: time,
                    note: session.note || null,
                  });
                }
              });
            });
          });
        },
      );
    });

    return grid;
  }, [DAYS, TIME_SLOTS, programs, selectedPrograms]);

  // Determine which days have classes in personal schedule
  const daysWithClasses = useMemo(() => {
    const days = new Set();
    personalSchedule.forEach((classItem) => {
      days.add(classItem.day);
    });
    return days;
  }, [personalSchedule]);

  const resetPersonalSchedule = () => {
    setPersonalSchedule([]);
  };

  if (loading) {
    return <div className="schedule-loading">Loading schedule...</div>;
  }

  return (
    <div className="schedule-calendar-container">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast-notification"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="schedule-filters"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Gym Schedule</h1>
        <h3>Filter Programs</h3>
        <div className="filter-buttons">
          <motion.button
            className={`filter-btn ${allSelected ? "active" : ""}`}
            onClick={toggleAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={allSelected ? "Deselect all programs" : "Select all programs"}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </motion.button>
          {programs.map((program) => (
            <motion.button
              key={program.id}
              className={`filter-btn ${selectedPrograms.has(program.id) ? "active" : ""}`}
              onClick={() => toggleProgram(program.id)}
              style={{
                backgroundColor: selectedPrograms.has(program.id)
                  ? PROGRAM_COLORS[program.id].bg
                  : "transparent",
                borderColor: PROGRAM_COLORS[program.id].bg,
                color: selectedPrograms.has(program.id)
                  ? "white"
                  : PROGRAM_COLORS[program.id].bg,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Toggle ${program.name} filter`}
              aria-pressed={selectedPrograms.has(program.id)}
            >
              {program.name}
            </motion.button>
          ))}
        </div>
      </motion.div>

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

      {/* Personal Schedule */}
      <motion.div
        className="personal-schedule-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="personal-schedule-title">My Schedule</h2>
        <PersonalScheduleGrid
          personalSchedule={personalSchedule}
          DAYS={DAYS}
          TIME_SLOTS={TIME_SLOTS}
          daysWithClasses={daysWithClasses}
          expandedClass={expandedClass}
          handleClassClick={handleClassClick}
          addToPersonalSchedule={addToPersonalSchedule}
          removeFromPersonalSchedule={removeFromPersonalSchedule}
          onResetSchedule={resetPersonalSchedule}
          onShowToast={showToast}
        />
      </motion.div>
    </div>
  );
}

export default ScheduleCalendar;