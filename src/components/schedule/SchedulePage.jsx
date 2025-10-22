import React, { useState } from "react";
import { GYM_SCHEDULE } from "../../common/constants";
import { Container, Spinner } from "react-bootstrap"; // Removed Button import
import "./SchedulePage.css";

const SchedulePage = () => {
  const [loading, setLoading] = useState(true);
  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <Container className="schedule-page-container">
      {loading && (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading schedule...</p>
        </div>
      )}

      <div className="pdf-wrapper">
        <iframe
          src={`${GYM_SCHEDULE}#toolbar=0&navpanes=0&view=Fit&bgcolor=255,255,255`} // Added white background
          title="Gym Schedule"
          className="pdf-viewer"
          onLoad={handleIframeLoad}
        />
      </div>
    </Container>
  );
};

export default SchedulePage;
