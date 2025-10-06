import React from "react";
import { Card } from "react-bootstrap";
import "./ContactCard.css";

function ContactCard({ icon, title, children, link, linkText }) {
  function renderContent() {
    // If link is provided, render content as a link
    if (link) {
      return (
        <a href={link} className="contact-card-link">
          {linkText || children}
        </a>
      );
    }
    // Otherwise, just render the children
    return children;
  }

  return (
    <Card className="contact-card h-100">
      <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
        <div className="contact-icon-container">
          <div className="contact-icon-wrapper">
            {icon}
          </div>
        </div>
        <Card.Title className="contact-card-title text-center">{title}</Card.Title>
        <div className="mt-2 contact-card-content">
          {renderContent()}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ContactCard;