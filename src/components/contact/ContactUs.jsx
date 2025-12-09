import { Container, Row, Col } from "react-bootstrap";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useContactInfo } from "../../common/useContactInfo";
import "./ContactUs.css";

function ContactUs() {
  const { contactInfo, loading } = useContactInfo();

  // Show loading state if needed
  if (loading || !contactInfo) {
    return (
      <div className="contact-page-wrapper">
        <Header />
        <div className="contact-content">
          <Container className="contact-container py-5">
            <p className="text-center">Loading contact information...</p>
          </Container>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="contact-page-wrapper">
      <Header />

      <div className="contact-content">
        <Container className="contact-container py-5">
          <Row className="justify-content-center mb-5">
            <Col md={8} lg={6}>
              <h1 className="text-center mb-4 contact-title">Contact Us</h1>
              <p className="text-center lead mb-5 contact-subtitle">
                {contactInfo.intro ? (
                  contactInfo.intro
                ) : (
                  <>
                    Have questions? We'd love to hear from you. Reach out to us
                    using any of the methods below. Or stop by at the beginning
                    of any class. See you on the mats!
                  </>
                )}
              </p>
            </Col>
          </Row>

          <Row className="justify-content-center mb-5">
            <Col xs={12}>
              <div className="contact-info-container">
                <a
                  href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}
                  className="contact-info-link"
                >
                  <PhoneIcon className="contact-info-icon" />
                  <span className="contact-info-text">{contactInfo.phone}</span>
                </a>

                <a
                  href={`mailto:${contactInfo.email}`}
                  className="contact-info-link"
                >
                  <EmailIcon className="contact-info-icon" />
                  <span className="contact-info-text">{contactInfo.email}</span>
                </a>

                <a
                  href={contactInfo.address.googleMapsLink}
                  className="contact-info-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PlaceIcon className="contact-info-icon" />
                  <span className="contact-info-text">
                    {contactInfo.address.street}
                    <br />
                    {contactInfo.address.city}, {contactInfo.address.state}{" "}
                    {contactInfo.address.zip}
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
                  href={contactInfo.social.facebook}
                  className="social-media-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookOutlinedIcon className="social-media-icon" />
                  <span className="social-media-text">Facebook</span>
                </a>
                <a
                  href={contactInfo.social.instagram}
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
        <div className="map-container">
          <iframe
            src={contactInfo.address.googleEmbedLink}
            width="100%"
            height="450"
            style={{ border: 0, display: "block", marginBottom: 0 }}
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
