import { motion } from "motion/react";
import { BANNER_IMAGE_URI, GYM_SCHEDULE } from "../../common/constants";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { PhotoGrid } from "../../common/commonUtils";
import "./LandingPage.css";

function Title() {
  return (
    <div className="neutral-ground-banner">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Neutral Ground
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
      >
        Combat Sports
      </motion.div>
    </div>
  );
}

function GoogleEmbedMap() {
  return (
    <div className="map-container">
      <iframe
        title="Neutral Ground Combat Sports Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2896.5466451799502!2d-88.17599072383396!3d43.44918357111269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88045f02ad43be17%3A0xa058ab57f7fbb294!2sNeutral%20Ground%20West%20Bend!5e0!3m2!1sen!2sus!4v1751224984721!5m2!1sen!2sus"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page-wrapper">
      <Header />
      <Title />
      <img className="read-more-artist-image" src={BANNER_IMAGE_URI} alt="" />
      <section className="mission-statement">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p>
            Neutral Ground Combat Sports is a community-first martial arts
            academy offering Brazilian Jiu Jitsu, MMA, Kickboxing, and
            Performance Fitness for all experience levels. We offer structured
            programs for complete beginners, seasoned hobbyists, and serious
            competitors alike. Whether you're chasing your first submission or
            pushing for your next title, our training environment is built to
            support your progress.
          </p>
          <motion.button
            className="primary-cta"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: { duration: 0.2 },
              scale: { type: "spring", stiffness: 400, damping: 17 },
            }}
            onClick={() => window.open(GYM_SCHEDULE)}
          >
            Download Our Schedule
          </motion.button>
        </motion.div>
      </section>
      <PhotoGrid />
      <GoogleEmbedMap />
      <Footer />
    </div>
  );
}
