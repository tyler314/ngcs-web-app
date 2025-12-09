import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PersonalScheduleGrid } from "./PersonalScheduleGrid";
import { PersonalScheduleAccordionView } from "./PersonalScheduleAccordionView";
import { ScheduleGridView } from "./ScheduleGridView";
import { ScheduleAccordionView } from "./ScheduleAccordionView";
import { PROGRAMS_API } from "../../common/constants";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import ViewAgendaIcon from "@mui/icons-material/ViewAgenda";
import "./Schedule.css";
import { parseTime, generateClassId } from "../../common/commonUtils";

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
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem("scheduleViewMode");
    return saved || "grid";
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    localStorage.setItem("personalSchedule", JSON.stringify(personalSchedule));
  }, [personalSchedule]);

  useEffect(() => {
    localStorage.setItem("scheduleViewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && viewMode === "grid") {
        setViewMode("day");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

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

    return Array.from(allTimes).sort((a, b) => {
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
    const classKey = generateClassId(classItem);
    if (!personalSchedule.find((item) => generateClassId(item) === classKey)) {
      setPersonalSchedule([...personalSchedule, classItem]);
      showToast(`${classItem.program} added to your schedule`);
      scrollToPersonalSchedule();
    }
  };

  const removeFromPersonalSchedule = (classItem) => {
    const classKey = generateClassId(classItem);
    setPersonalSchedule(
      personalSchedule.filter((item) => generateClassId(item) !== classKey),
    );
    showToast(`${classItem.program} removed from your schedule`);
  };

  const isInPersonalSchedule = (classItem) => {
    const classKey = generateClassId(classItem);
    return personalSchedule.some((item) => generateClassId(item) === classKey);
  };

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
        <div className="filters-header">
          <h1>Gym Schedule</h1>
          {!isMobile && (
            <div className="view-mode-toggle">
              <motion.button
                className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Grid view"
              >
                <ViewWeekIcon />
              </motion.button>
              <motion.button
                className={`view-mode-btn ${viewMode === "day" ? "active" : ""}`}
                onClick={() => setViewMode("day")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Day view"
              >
                <ViewAgendaIcon />
              </motion.button>
            </div>
          )}
        </div>

        <h3>Filter Programs</h3>
        <div className="filter-buttons">
          <motion.button
            className={`filter-btn ${allSelected ? "active" : ""}`}
            onClick={toggleAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={
              allSelected ? "Deselect all programs" : "Select all programs"
            }
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

      {/* Schedule Views */}
      {viewMode === "grid" ? (
        <ScheduleGridView
          scheduleGrid={scheduleGrid}
          DAYS={DAYS}
          TIME_SLOTS={TIME_SLOTS}
          expandedClass={expandedClass}
          handleClassClick={handleClassClick}
          addToPersonalSchedule={addToPersonalSchedule}
          removeFromPersonalSchedule={removeFromPersonalSchedule}
          isInPersonalSchedule={isInPersonalSchedule}
        />
      ) : (
        <ScheduleAccordionView
          scheduleGrid={scheduleGrid}
          DAYS={DAYS}
          TIME_SLOTS={TIME_SLOTS}
          expandedClass={expandedClass}
          handleClassClick={handleClassClick}
          addToPersonalSchedule={addToPersonalSchedule}
          removeFromPersonalSchedule={removeFromPersonalSchedule}
          isInPersonalSchedule={isInPersonalSchedule}
        />
      )}

      {/* Personal Schedule */}
      <motion.div
        className="personal-schedule-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="personal-schedule-title">My Schedule</h2>
        {isMobile || viewMode === "day" ? (
          <PersonalScheduleAccordionView
            personalSchedule={personalSchedule}
            DAYS={DAYS}
            expandedClass={expandedClass}
            handleClassClick={handleClassClick}
            removeFromPersonalSchedule={removeFromPersonalSchedule}
            onResetSchedule={resetPersonalSchedule}
            onShowToast={showToast}
          />
        ) : (
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
        )}
      </motion.div>
    </div>
  );
}

export default ScheduleCalendar;
