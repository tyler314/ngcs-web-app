import "./commonUtils.css";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { IMAGE_API } from "./constants";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Stack from "@mui/material/Stack";

function Socials(props) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      className={props.className}
    >
      <NavLink
        to="https://www.facebook.com/profile.php?id=100057586954258"
        exact
        className="social-nav-link"
      >
        <FacebookOutlinedIcon />
      </NavLink>
      <NavLink
        to="https://www.instagram.com/neutralgroundcombatsports/"
        exact
        className="social-nav-link"
      >
        <InstagramIcon />
      </NavLink>
      <a href={"mailto:info@westbendbjj.com"} className="social-nav-link">
        <EmailOutlinedIcon />
      </a>
    </Stack>
  );
}

function PhoneContact({ displayPhoneNumber = true, className }) {
  return (
    <div className={className}>
      <a href={`tel:2623358020`}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          className="social-nav-link"
        >
          <PhoneOutlinedIcon />
          <div
            className="header-phone-number"
            style={{ display: displayPhoneNumber ? "block" : "none" }}
          >
            262-335-8020
          </div>
        </Stack>
      </a>
    </div>
  );
}

function InfiniteCarousel() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(IMAGE_API)
      .then((res) => res.json())
      .then((data) => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        setImages(parsed);
      })
      .catch((err) => console.error("Failed to load images:", err));
  }, []);

  return (
    <div className="carousel-container">
      <motion.div
        className="carousel-track"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 50,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {images.map((src, idx) => (
          <img src={src} alt={`carousel-${idx}`} className="carousel-image" />
        ))}
      </motion.div>
    </div>
  );
}

function PhotoGrid() {
  const [images, setImages] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { isMobile } = useIsMobile();
  const MAX_VISIBLE_IMAGES = isMobile ? 6 : 9; // Show fewer images on mobile

  useEffect(() => {
    fetch(IMAGE_API)
      .then((res) => res.json())
      .then((data) => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data;
        const shuffled = parsed
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        setImages(shuffled);
      })
      .catch((err) => console.error("Failed to load images:", err));
  }, []);

  const displayedImages = showAll
    ? images
    : images.slice(0, MAX_VISIBLE_IMAGES);

  return (
    <div className="photo-grid-container">
      <div className={`photo-grid ${isMobile ? "mobile" : "desktop"}`}>
        {displayedImages.map((src, index) => (
          <motion.div
            className="photo-item"
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: isMobile ? index * 0.05 : index * 0.1,
            }}
          >
            <img src={src} alt={`photo-${index}`} />
          </motion.div>
        ))}
      </div>
      {images.length > MAX_VISIBLE_IMAGES && (
        <button
          className="photo-grid-toggle-button"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkDeviceType();

    // Add event listener
    window.addEventListener("resize", checkDeviceType);

    // Cleanup
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return { isMobile };
};

export { Socials, PhoneContact, InfiniteCarousel, PhotoGrid, useIsMobile };
