import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClassCard } from "./ClassCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./Schedule.css";
import { parseTime } from "../../common/commonUtils";

export function PersonalScheduleAccordionView({
    personalSchedule,
    DAYS,
    expandedClass,
    handleClassClick,
    removeFromPersonalSchedule,
    onResetSchedule,
    onShowToast,
}) {
    // Determine default open day (same logic as main schedule)
    const [expandedDay, setExpandedDay] = useState(() => {
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        if (DAYS.includes(today)) {
            return today;
        }
        return DAYS[0];
    });

    const handleDayClick = (day) => {
        if (expandedDay === day) {
            setExpandedDay(null);
            // Close any expanded class when collapsing the day
            handleClassClick(null);
        } else {
            setExpandedDay(day);
        }
    };

    const handleReset = () => {
        if (personalSchedule.length > 0) {
            onResetSchedule();
            if (onShowToast) {
                onShowToast("Your schedule has been reset");
            }
        }
    };

    // Group personal schedule by day
    const scheduleByDay = useMemo(() => {
        const grouped = {};
        DAYS.forEach(day => grouped[day] = []);

        personalSchedule.forEach(classItem => {
            if (grouped[classItem.day]) {
                grouped[classItem.day].push(classItem);
            }
        });

        // Sort classes by time within each day
        Object.keys(grouped).forEach(day => {
            grouped[day].sort((a, b) => parseTime(a.time) - parseTime(b.time));
        });

        return grouped;
    }, [personalSchedule, DAYS]);

    if (personalSchedule.length === 0) {
        return (
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
        );
    }

    return (
        <div className="personal-schedule-accordion-container">
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

            <div className="schedule-accordion-view">
                {DAYS.map((day) => {
                    const isExpanded = expandedDay === day;
                    const dayClasses = scheduleByDay[day] || [];
                    const dotColors = [...new Set(dayClasses.map(c => c.color.bg))];
                    const hasClasses = dayClasses.length > 0;

                    return (
                        <motion.div
                            key={day}
                            className={`accordion-item ${isExpanded ? "expanded" : ""} ${!hasClasses ? "no-classes" : ""}`}
                            initial={false}
                        >
                            <motion.button
                                className="accordion-header"
                                onClick={() => handleDayClick(day)}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="accordion-header-content">
                                    <span className="accordion-day-name">{day}</span>

                                    {!isExpanded && hasClasses && (
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
                                            collapsed: { opacity: 0, height: 0 }
                                        }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="accordion-content"
                                    >
                                        <div className="accordion-content-inner">
                                            {!hasClasses ? (
                                                <div className="no-classes-message">No classes selected for {day}</div>
                                            ) : (
                                                dayClasses.map((classItem, index) => {
                                                    const classKey = `personal-accordion-${day}-${classItem.time}-${classItem.programId}-${classItem.type}-${classItem.level}-${index}`;
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
                                                                    onAddToPersonal={() => { }}
                                                                    onRemoveFromPersonal={removeFromPersonalSchedule}
                                                                    isPersonal={true}
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
        </div>
    );
}
