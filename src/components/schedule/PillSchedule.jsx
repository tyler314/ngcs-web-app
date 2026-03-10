export default function PillSchedule({ scheduleEntries }) {
  const renderDescription = (desc) =>
    desc ? <p className="schedule-description">{desc}</p> : null;

  const getActualSessions = (sessions) =>
    Array.isArray(sessions)
      ? sessions
      : sessions?.sessions && Array.isArray(sessions.sessions)
        ? sessions.sessions
        : [];

  return (
    <div className="schedule-pills-container">
      {scheduleEntries.map(([type, group]) => {
        const desc = group?.description;
        const sessionsArr = Object.entries(group || {})
          .filter(([k]) => k !== "description")
          .flatMap(([, v]) => getActualSessions(v));

        return (
          <div key={type} className="schedule-pill-section">
            <div className="schedule-pill-header">
              <span className="pill-badge">{type}</span>
            </div>
            {renderDescription(desc)}
            <div className="schedule-pill-times">
              {(sessionsArr || []).map(
                (session, sIdx) =>
                  session &&
                  session.day &&
                  session.time && (
                    <div key={sIdx} className="time-pill">
                      <div className="time-pill-day">{session.day}</div>
                      <div className="time-pill-time">{session.time}</div>
                      {session.coach && (
                        <div className="time-pill-coach">{session.coach}</div>
                      )}
                    </div>
                  ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}