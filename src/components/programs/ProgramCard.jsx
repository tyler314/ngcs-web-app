import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { IMAGE_API } from "../../common/constants";
import "./ProgramCard.css";

/**
 * ProgramCard component with multiple animation styles.
 * Each card demonstrates a different Framer Motion technique.
 */
export default function ProgramCard({ program, index }) {
  const { name, description, skillLevel, animationStyle } = program;
  const [isExpanded, setIsExpanded] = useState(false);
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);

  // Hover Tilt Effect setup
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const isColored = index % 2 === 0;

  // Fetch images
  useEffect(() => {
    if (isExpanded && images.length === 0) {
      setImageLoading(true);
      fetch(IMAGE_API)
          .then((res) => res.json())
          .then((data) => {
            const parsed = typeof data === "string" ? JSON.parse(data) : data;
            if (parsed && parsed.length > 0) {
              const shuffled = [...parsed].sort(() => Math.random() - 0.5);
              const selected = ["carouselSlide", "animatedDots"].includes(animationStyle)
                  ? shuffled.slice(0, 3)
                  : [shuffled[0]];
              setImages(selected);
            }
          })
          .catch((err) => console.error("Failed to load images:", err))
          .finally(() => setImageLoading(false));
    }
  }, [isExpanded, images.length, animationStyle]);

  // Carousel auto-advance
  useEffect(() => {
    if (["carouselSlide", "animatedDots"].includes(animationStyle) && isExpanded && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [animationStyle, isExpanded, images.length]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Stagger configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Determine which animations to apply
  const shouldApply = (style) => animationStyle === style || animationStyle === "all";

  return (
      <motion.div
          ref={cardRef}
          className={`program-card ${isColored ? "program-card-colored" : "program-card-light"} ${shouldApply("background") ? "has-background" : ""}`}
          style={shouldApply("hoverTilt") ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
          onMouseMove={shouldApply("hoverTilt") ? handleMouseMove : undefined}
          onMouseLeave={shouldApply("hoverTilt") ? handleMouseLeave : undefined}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
      >
        {/* Background image for background style */}
        {shouldApply("background") && isExpanded && images[0] && (
            <motion.div
                className="background-image-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ backgroundImage: `url(${images[0]})` }}
            />
        )}

        {/* Main card content */}
        <div
            className="program-card-content"
            onClick={toggleExpand}
            style={{ cursor: "pointer", position: "relative", zIndex: 1 }}
        >
          {/* Letter-by-letter reveal for title */}
          {shouldApply("letterReveal") ? (
              <motion.h2
                  className="program-name"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.03 } }
                  }}
              >
                {name.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        style={{ display: "inline-block" }}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
              </motion.h2>
          ) : (
              <h2 className="program-name">{name}</h2>
          )}

          <p className="program-description">{description}</p>
          <div className="program-skill-level">
            <span className="skill-level-label">Skill Level:</span>
            <span className="skill-level-value">{skillLevel}</span>
          </div>

          {/* Expand indicator with optional pulse */}
          <motion.div
              className="expand-indicator"
              animate={shouldApply("pulse") ? {
                rotate: isExpanded ? 180 : 0,
                scale: [1, 1.2, 1]
              } : {
                rotate: isExpanded ? 180 : 0
              }}
              transition={shouldApply("pulse") ? {
                rotate: { duration: 0.3 },
                scale: { repeat: Infinity, duration: 2 }
              } : {
                duration: 0.3
              }}
          >
            ▼
          </motion.div>
        </div>

        {/* Expandable section */}
        <AnimatePresence initial={false}>
          {isExpanded && (
              <motion.div
                  className="program-card-expanded"
                  initial={{ height: 0, opacity: 0 }}
                  animate={shouldApply("bounce") ? {
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: {
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      },
                      opacity: {
                        duration: 0.3,
                        delay: 0.1
                      }
                    }
                  } : {
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.4, ease: "easeOut" },
                      opacity: { duration: 0.3, delay: 0.1 }
                    }
                  }}
                  exit={shouldApply("bounce") ? {
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        duration: 0.3,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      },
                      opacity: {
                        duration: 0.2
                      }
                    }
                  } : {
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.3, ease: "easeIn" },
                      opacity: { duration: 0.2 }
                    }
                  }}
                  style={{ overflow: "hidden", position: "relative", zIndex: 1 }}
              >
                {shouldApply("stagger") ? (
                    <motion.div
                        className="program-card-expanded-content"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                      {renderExpandedContent()}
                    </motion.div>
                ) : (
                    <div className="program-card-expanded-content">
                      {renderExpandedContent()}
                    </div>
                )}
              </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
  );

  function renderExpandedContent() {
    const ContentWrapper = shouldApply("stagger") ? motion.div : "div";
    const wrapperProps = shouldApply("stagger") ? { variants: itemVariants } : {};

    return (
        <>
          {/* Hero image with optional scale/rotate */}
          {!shouldApply("background") && !shouldApply("carouselSlide") && !shouldApply("animatedDots") && (
              <>
                {imageLoading ? (
                    <div className="hero-image-loading">Loading image...</div>
                ) : images[0] ? (
                    <motion.div
                        className="hero-image-container"
                        initial={shouldApply("scaleRotate") ?
                            { opacity: 0, scale: 0.8, rotate: -5 } :
                            { opacity: 0, y: -20 }
                        }
                        animate={shouldApply("scaleRotate") ?
                            { opacity: 1, scale: 1, rotate: 0 } :
                            { opacity: 1, y: 0 }
                        }
                        transition={shouldApply("scaleRotate") ?
                            { duration: 0.6, delay: 0.2, type: "spring" } :
                            { duration: 0.5, delay: 0.2 }
                        }
                    >
                      <img
                          src={images[0]}
                          alt={`${name} training`}
                          className="hero-image"
                      />
                    </motion.div>
                ) : null}
              </>
          )}

          {/* Carousel with optional slide effect */}
          {(shouldApply("carouselSlide") || shouldApply("animatedDots")) && images.length > 0 && (
              <div className="carousel-container-expanded">
                <AnimatePresence mode="wait">
                  <motion.img
                      key={currentImageIndex}
                      src={images[currentImageIndex]}
                      alt={`${name} training ${currentImageIndex + 1}`}
                      className="carousel-image-expanded"
                      initial={shouldApply("carouselSlide") ?
                          { opacity: 0, x: 100 } :
                          { opacity: 0 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      exit={shouldApply("carouselSlide") ?
                          { opacity: 0, x: -100 } :
                          { opacity: 0 }
                      }
                      transition={{ duration: shouldApply("carouselSlide") ? 0.6 : 0.8 }}
                  />
                </AnimatePresence>
                <div className="carousel-dots">
                  {images.map((_, idx) => (
                      shouldApply("animatedDots") ? (
                          <motion.button
                              key={idx}
                              className={`carousel-dot ${idx === currentImageIndex ? "active" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(idx);
                              }}
                              animate={{ scale: idx === currentImageIndex ? 1.3 : 1 }}
                              whileHover={{ scale: 1.4 }}
                              whileTap={{ scale: 0.9 }}
                          />
                      ) : (
                          <button
                              key={idx}
                              className={`carousel-dot ${idx === currentImageIndex ? "active" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(idx);
                              }}
                          />
                      )
                  ))}
                </div>
              </div>
          )}

          {/* Text sections */}
          <ContentWrapper className="expanded-section" {...wrapperProps}>
            <h3>What You'll Learn</h3>
            <ul>
              <li>Fundamental techniques and principles</li>
              <li>Practical self-defense applications</li>
              <li>Physical conditioning and flexibility</li>
              <li>Mental discipline and focus</li>
            </ul>
          </ContentWrapper>

          <ContentWrapper className="expanded-section" {...wrapperProps}>
            <h3>Class Schedule</h3>
            <p>Monday, Wednesday, Friday: 6:00 PM - 7:30 PM</p>
            <p>Saturday: 10:00 AM - 11:30 AM</p>
          </ContentWrapper>

          <ContentWrapper className="expanded-section" {...wrapperProps}>
            <h3>What to Bring</h3>
            <p>Comfortable athletic wear, water bottle, and a positive attitude!</p>
          </ContentWrapper>

          {/* CTA Button with optional spring animation */}
          {shouldApply("buttonSpring") ? (
              <motion.button
                  className="cta-button"
                  whileHover={{ scale: 1.05, boxShadow: "0 8px 16px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Sign Up Now
              </motion.button>
          ) : (
              <button className="cta-button">Sign Up Now</button>
          )}
        </>
    );
  }
}