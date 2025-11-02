import { AnimatePresence, motion } from "motion/react";
import InfoIcon from "@mui/icons-material/Info";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export function ClassCard({
  classItem,
  isExpanded,
  onClick,
  onAddToPersonal,
  onRemoveFromPersonal,
  isPersonal,
}) {
  return (
    <motion.div
      className={`class-item ${isExpanded ? "expanded" : ""}`}
      style={{
        backgroundColor: classItem.color.bg,
        borderColor: classItem.color.light,
      }}
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        zIndex: isExpanded ? 100 : 1,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        layout: { type: "spring", damping: 25, stiffness: 300 },
        scale: { type: "spring", stiffness: 500, damping: 30 },
      }}
      whileHover={
        !isExpanded
          ? {
              scale: 1.05,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }
          : {}
      }
      onClick={onClick}
    >
      <motion.div layout="position" className="class-program">
        {classItem.program}
      </motion.div>

      <motion.div layout="position" className="class-details">
        {classItem.type} • {classItem.level}
      </motion.div>

      {classItem.note && !isExpanded && (
        <motion.div layout="position" className="class-note-indicator">
          <InfoIcon sx={{ fontSize: 14 }} />
        </motion.div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="class-expanded-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="expanded-divider"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="expanded-info"
            >
              <div className="expanded-row">
                <span className="expanded-label">Day:</span>
                <span>{classItem.day}</span>
              </div>

              <div className="expanded-row">
                <span className="expanded-label">Time:</span>
                <span>{classItem.time}</span>
              </div>

              {classItem.note && (
                <motion.div
                  className="expanded-note"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <InfoIcon sx={{ fontSize: 18 }} className="note-icon" />
                  <span>{classItem.note}</span>
                </motion.div>
              )}

              <motion.button
                className={`personal-calendar-btn ${isPersonal ? "remove" : "add"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPersonal) {
                    onRemoveFromPersonal(classItem);
                  } else {
                    onAddToPersonal(classItem);
                  }
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPersonal ? (
                  <>
                    <RemoveIcon sx={{ fontSize: 16 }} />
                    Remove from My Schedule
                  </>
                ) : (
                  <>
                    <AddIcon sx={{ fontSize: 16 }} />
                    Add to My Schedule
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
