import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SEO from "../../common/SEO";
import { useImages, useIsMobile } from "../../common/commonUtils";
import "./Gallery.css";

export default function Gallery() {
  const { images, loading, error } = useImages();
  const { isMobile } = useIsMobile();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right

  // Shuffle images once when they load
  const shuffledImages = useMemo(() => {
    if (images.length === 0) return [];
    return images
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }, [images]);

  // Load natural aspect ratios for each image
  const [imageDims, setImageDims] = useState({});
  useEffect(() => {
    if (shuffledImages.length === 0) return;
    const dims = {};
    let remaining = shuffledImages.length;
    shuffledImages.forEach((src) => {
      const img = new window.Image();
      const finish = () => {
        if (--remaining === 0) setImageDims({ ...dims });
      };
      img.onload = () => {
        dims[src] = img.naturalWidth / img.naturalHeight;
        finish();
      };
      img.onerror = () => {
        dims[src] = 1;
        finish();
      };
      img.src = src;
    });
  }, [shuffledImages]);

  // Interleave landscape (≥1.2) and portrait (<1.2) once all dims are known
  const displayImages = useMemo(() => {
    const allLoaded =
      shuffledImages.length > 0 &&
      Object.keys(imageDims).length >= shuffledImages.length;
    if (!allLoaded) return shuffledImages;

    const landscape = shuffledImages.filter((src) => (imageDims[src] || 1) >= 1.2);
    const portrait = shuffledImages.filter((src) => (imageDims[src] || 1) < 1.2);
    const result = [];
    const maxLen = Math.max(landscape.length, portrait.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < landscape.length) result.push(landscape[i]);
      if (i < portrait.length) result.push(portrait[i]);
    }
    return result;
  }, [shuffledImages, imageDims]);

  const dismiss = useCallback(() => {
    setSelectedIndex(null);
    setDirection(0);
  }, []);

  const goNext = useCallback(() => {
    if (selectedIndex === null) return;
    setDirection(1);
    setSelectedIndex((i) => (i + 1) % displayImages.length);
  }, [selectedIndex, displayImages.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setDirection(-1);
    setSelectedIndex((i) => (i - 1 + displayImages.length) % displayImages.length);
  }, [selectedIndex, displayImages.length]);

  // Keyboard: Escape to close, arrow keys to navigate
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") dismiss();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, dismiss, goNext, goPrev]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  if (loading) {
    return <div className="gallery-loading">Loading gallery…</div>;
  }

  if (error) {
    return <div className="gallery-error">Failed to load gallery: {error}</div>;
  }

  // Swipe threshold for mobile drag-to-navigate
  const swipeThreshold = 50;

  return (
    <div className="gallery-page-wrapper">
      <Header />
      <SEO title="Gallery | Neutral Ground Combat Sports" />
      <section className="gallery-container">
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1>Gallery</h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            A look inside Neutral Ground Combat Sports
          </motion.p>
        </motion.div>
        <div className={`photo-grid ${isMobile ? "mobile" : "desktop"}`}>
          {displayImages.map((src, index) => (
            <motion.div
              className="photo-item"
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: isMobile ? index * 0.04 : (index % 6) * 0.08,
                ease: "easeOut",
              }}
              whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
              onClick={() => {
                setDirection(0);
                setSelectedIndex(index);
              }}
              style={{ cursor: "pointer" }}
            >
              <img src={src} alt={`gallery-${index}`} />
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />

      {/* Lightbox overlay */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="gallery-lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={dismiss}
          >
            {/* Previous arrow */}
            {!isMobile && (
              <button
                className="gallery-lightbox-arrow gallery-lightbox-arrow-left"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous photo"
              >
                ‹
              </button>
            )}

            {/* Image with swipe support on mobile */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={selectedIndex}
                className="gallery-lightbox-image"
                src={displayImages[selectedIndex]}
                alt="Enlarged gallery photo"
                custom={direction}
                variants={{
                  enter: (d) => ({
                    x: d === 0 ? 0 : d > 0 ? 200 : -200,
                    scale: d === 0 ? 0.6 : 1,
                    opacity: 0,
                  }),
                  center: {
                    x: 0,
                    scale: 1,
                    opacity: 1,
                  },
                  exit: (d) => ({
                    x: d === 0 ? 0 : d > 0 ? -200 : 200,
                    scale: d === 0 ? 0.6 : 1,
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={(e) => e.stopPropagation()}
                drag={isMobile ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -swipeThreshold) {
                    goNext();
                  } else if (info.offset.x > swipeThreshold) {
                    goPrev();
                  }
                }}
              />
            </AnimatePresence>

            {/* Next arrow */}
            {!isMobile && (
              <button
                className="gallery-lightbox-arrow gallery-lightbox-arrow-right"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next photo"
              >
                ›
              </button>
            )}

            {/* Image counter */}
            <div
              className="gallery-lightbox-counter"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedIndex + 1} / {displayImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
