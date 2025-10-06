import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import { GYM_EMAIL} from "../../common/constants";
import "./ContactUs.css";

function ContactUs() {
  const mailToLink = `mailto:${GYM_EMAIL}`;
  return (
    <div className="contact-page-wrapper">
      <Header />
      
      <div className="contact-content">
        <Container className="contact-container py-5">
          <Row className="justify-content-center mb-5">
            <Col md={8} lg={6}>
              <h1 className="text-center mb-4 contact-title">Contact Us</h1>
              <p className="text-center lead mb-5 contact-subtitle">
                Have questions? We'd love to hear from you. Reach out to us using any of the methods below.
              </p>
            </Col>
          </Row>

          <Row className="justify-content-center mb-5">
            <Col xs={12}>
              <div className="contact-info-container">
                {/*<h2 className="mb-4 contact-section-title">Follow Us</h2>*/}
                <a 
                  href="tel:2623358020"
                  className="contact-info-link"
                >
                  <PhoneIcon className="contact-info-icon" />
                  <span className="contact-info-text">262-335-8020</span>
                </a>

                <a 
                  href={mailToLink}
                  className="contact-info-link"
                >
                  <EmailIcon className="contact-info-icon" />
                  <span className="contact-info-text">{ GYM_EMAIL }</span>
                </a>

                <a 
                  href="https://maps.google.com/?q=Neutral+Ground+West+Bend"
                  className="contact-info-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlaceIcon className="contact-info-icon" />
                  <span className="contact-info-text">
                    7003 State Hwy 144<br />
                    West Bend, WI 53090
                  </span>
                </a>
              </div>
            </Col>
          </Row>
          
          <Row className="justify-content-center mt-5">
            <Col md={8} lg={6} className="text-center">
              <h2 className="mb-4 contact-section-title">Follow Us</h2>
              <div className="social-media-container">
                <a 
                  href="https://www.facebook.com/profile.php?id=100057586954258"
                  className="social-media-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookOutlinedIcon className="social-media-icon" />
                  <span className="social-media-text">Facebook</span>
                </a>
                <a 
                  href="https://www.instagram.com/neutralgroundcombatsports/"
                  className="social-media-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon className="social-media-icon" />
                  <span className="social-media-text">Instagram</span>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      <div className="footer-section">
        {/* Google Maps embed right above the footer */}
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2912.7376514440213!2d-88.23043378451046!3d43.12882497914369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8804e8be5fdf0acf%3A0x9a758de8fe6f05ca!2s7003%20WI-144%2C%20West%20Bend%2C%20WI%2053090!5e0!3m2!1sen!2sus!4v1633553394067!5m2!1sen!2sus" 
            width="100%" 
            height="450"
            style={{ border: 0, display: 'block', marginBottom: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="Neutral Ground West Bend Location"
          ></iframe>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default ContactUs;