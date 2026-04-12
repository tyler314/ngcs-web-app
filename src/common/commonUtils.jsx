import "./commonUtils.css";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  IMAGE_API,
  PROGRAMS_API,
  INSTRUCTORS_API,
  CONTACT_INFO_API,
  S3_INSTRUCTORS_BUCKET_URL,
  DEFAULT_INSTRUCTOR_IMAGE,
} from "./constants";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Stack from "@mui/material/Stack";

// ==================== CACHE MANAGEMENT ====================

/**
 * Simple cache management system with optional TTL (Time To Live)
 * Set CACHE_TTL to null to disable expiration
 */
const CACHE_CONFIG = {
  // Programs change maybe once a season or year
  PROGRAMS: { ttl: 1000 * 60 * 60 * 24 },    // 24 hours

  // Images/Instructors rarely change. Use a long TTL (1 week).
  IMAGES: { ttl: 1000 * 60 * 60 * 24 * 7 }, // 7 days
  INSTRUCTORS: { ttl: 1000 * 60 * 60 * 24 * 7 }, // 7 days

  // Contact info is the most static thing on the site
  CONTACT_INFO: { ttl: 1000 * 60 * 60 * 24 * 30 }, // 30 days
};

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttl = null) {
    const expiresAt = ttl ? Date.now() + ttl : null;
    this.cache.set(key, { value, expiresAt });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if cache has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear(key) {
    this.cache.delete(key);
  }

  clearAll() {
    this.cache.clear();
  }
}

const cacheManager = new CacheManager();

// ==================== CACHED HOOKS ====================

/**
 * Custom hook to fetch and cache programs data
 */
function usePrograms() {
  const [programs, setPrograms] = useState(() =>
    cacheManager.get("programs") || []
  );
  const [loading, setLoading] = useState(!cacheManager.has("programs"));
  const [error, setError] = useState(null);

  useEffect(() => {
    // State already initialized from cache in useState — no need to set again
    if (cacheManager.has("programs")) return;

    let isMounted = true;

    async function loadPrograms() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(PROGRAMS_API);
        if (!res.ok) throw new Error(`Failed to fetch programs: ${res.status}`);

        const data = await res.json();

        if (isMounted) {
          // Cache the data
          cacheManager.set("programs", data, CACHE_CONFIG.PROGRAMS.ttl);
          setPrograms(data);
        }
      } catch (e) {
        console.error("Failed to load programs:", e);
        if (isMounted) {
          setError(e.message);
          setPrograms([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  return { programs, loading, error };
}

/**
 * Custom hook to fetch and cache instructors data
 */
function useInstructors() {
  const [instructors, setInstructors] = useState(() =>
    cacheManager.get("instructors") || []
  );
  const [loading, setLoading] = useState(!cacheManager.has("instructors"));
  const [error, setError] = useState(null);

  useEffect(() => {
    // State already initialized from cache in useState — no need to set again
    if (cacheManager.has("instructors")) return;

    let isMounted = true;

    async function loadInstructors() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(INSTRUCTORS_API);
        if (!res.ok)
          throw new Error(`Failed to fetch instructors: ${res.status}`);

        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.instructors || [];

        // Normalize instructors
        const normalized = list.map(normalizeInstructor).filter(Boolean);

        if (isMounted) {
          // Cache the normalized data
          cacheManager.set(
            "instructors",
            normalized,
            CACHE_CONFIG.INSTRUCTORS.ttl
          );
          setInstructors(normalized);
        }
      } catch (e) {
        console.error("Failed to load instructors:", e);
        if (isMounted) {
          setError(e.message);
          setInstructors([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInstructors();

    return () => {
      isMounted = false;
    };
  }, []);

  return { instructors, loading, error };
}

/**
 * Custom hook to fetch and cache images
 */
function useImages() {
  const [images, setImages] = useState(() =>
    cacheManager.get("images") || []
  );
  const [loading, setLoading] = useState(!cacheManager.has("images"));
  const [error, setError] = useState(null);

  useEffect(() => {
    // State already initialized from cache in useState — no need to set again
    if (cacheManager.has("images")) return;

    let isMounted = true;

    async function loadImages() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(IMAGE_API);
        if (!res.ok) throw new Error(`Failed to fetch images: ${res.status}`);

        const data = await res.json();
        const parsed = typeof data === "string" ? JSON.parse(data) : data;

        if (isMounted) {
          // Cache the parsed data
          cacheManager.set("images", parsed, CACHE_CONFIG.IMAGES.ttl);
          setImages(parsed);
        }
      } catch (e) {
        console.error("Failed to load images:", e);
        if (isMounted) {
          setError(e.message);
          setImages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      isMounted = false;
    };
  }, []);

  return { images, loading, error };
}

/**
 * Custom hook to fetch and cache contact info
 */
function useContactInfo() {
  const [contactInfo, setContactInfo] = useState(() =>
    cacheManager.get("contactInfo") || null
  );
  const [loading, setLoading] = useState(!cacheManager.has("contactInfo"));
  const [error, setError] = useState(null);

  useEffect(() => {
    // Return cached data if available
    if (cacheManager.has("contactInfo")) {
      setContactInfo(cacheManager.get("contactInfo"));
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadContactInfo() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(CONTACT_INFO_API);
        if (!res.ok)
          throw new Error(`Failed to fetch contact info: ${res.status}`);

        const data = await res.json();

        if (isMounted) {
          // Cache the data
          cacheManager.set(
            "contactInfo",
            data,
            CACHE_CONFIG.CONTACT_INFO.ttl
          );
          setContactInfo(data);
        }
      } catch (e) {
        console.error("Failed to load contact info:", e);
        if (isMounted) {
          setError(e.message);
          setContactInfo(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadContactInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  return { contactInfo, loading, error };
}

// Helper function to normalize instructor data
function normalizeInstructor(item) {
  if (!item || typeof item !== "object") return null;

  const id = item.id || Math.random().toString(36).substr(2, 9);
  const name = item.name ?? "Unnamed";
  const role = item.role ?? "Coach";
  const bio = item.bio ?? "";
  const imgSrc = item.imgSrc
    ? `${S3_INSTRUCTORS_BUCKET_URL}${item.imgSrc}`
    : `${S3_INSTRUCTORS_BUCKET_URL}${DEFAULT_INSTRUCTOR_IMAGE}`;

  let disciplines = item.disciplines ?? "";
  if (Array.isArray(disciplines)) {
    disciplines = disciplines.join(",");
  }

  return { id, name, role, bio, imgSrc, disciplines };
}

// ==================== COMPONENTS ====================

function Socials(props) {
  const { contactInfo } = useContactInfo();

  if (!contactInfo) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="flex-start"
      className={props.className}
    >
      <NavLink
        to={contactInfo.social.facebook}
        exact
        className="social-nav-link"
      >
        <FacebookOutlinedIcon />
      </NavLink>
      <NavLink
        to={contactInfo.social.instagram}
        exact
        className="social-nav-link"
      >
        <InstagramIcon />
      </NavLink>
      <a href={`mailto:${contactInfo.email}`} className="social-nav-link">
        <EmailOutlinedIcon />
      </a>
    </Stack>
  );
}

function PhoneContact({ displayPhoneNumber = true, className }) {
  const { contactInfo } = useContactInfo();

  if (!contactInfo) return null;

  return (
    <div className={className}>
      <a href={`tel:${contactInfo.phone.replace(/[^0-9]/g, "")}`}>
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
            {contactInfo.phone}
          </div>
        </Stack>
      </a>
    </div>
  );
}

function InfiniteCarousel() {
  const { images } = useImages();

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
          <img
            src={src}
            alt={`carousel-${idx}`}
            className="carousel-image"
            key={idx}
          />
        ))}
      </motion.div>
    </div>
  );
}

function PhotoGrid() {
  const { images } = useImages();
  const [shuffledImages, setShuffledImages] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { isMobile } = useIsMobile();
  const navigate = useNavigate();
  const MAX_VISIBLE_IMAGES = isMobile ? 6 : 9;
  const MAX_EXPANDED_IMAGES = isMobile ? 12 : 18;

  // Shuffle images once when they load
  useEffect(() => {
    if (images.length > 0) {
      const shuffled = images
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      setShuffledImages(shuffled);
    }
  }, [images]);

  const displayedImages = showAll
    ? shuffledImages.slice(0, MAX_EXPANDED_IMAGES)
    : shuffledImages.slice(0, MAX_VISIBLE_IMAGES);

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
      {shuffledImages.length > MAX_VISIBLE_IMAGES && (
        <button
          className="photo-grid-toggle-button"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
      {showAll && (
        <button
          className="photo-grid-toggle-button"
          onClick={() => navigate("/gallery")}
        >
          Gallery
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

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return { isMobile };
};

const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      setIsTablet(window.innerWidth < 1000);
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);

    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return { isTablet };
};

// ==================== SCHEDULE UTILS ====================

const parseTime = (t) => {
  const [time, period] = t.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const generateClassId = (classItem) => {
  return `${classItem.day}-${classItem.time}-${classItem.programId}-${classItem.type}-${classItem.level}`;
};

const useCurrentDayIndex = (DAYS) => {
  return useState(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const index = DAYS.indexOf(today);
    return index >= 0 ? index : 0;
  });
};

export {
  Socials,
  PhoneContact,
  InfiniteCarousel,
  PhotoGrid,
  useIsMobile,
  useIsTablet,
  useContactInfo,
  usePrograms,
  useImages,
  useInstructors,
  parseTime,
  generateClassId,
  useCurrentDayIndex,
  cacheManager, // Export cache manager for manual cache clearing if needed
};