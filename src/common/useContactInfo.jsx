import { useState, useEffect } from "react";
import { CONTACT_INFO_API } from "./constants";

/**
 * Custom hook to fetch and cache contact information
 * Returns contact info object with loading and error states
 */
// Default fallback data in case API fails
const DEFAULT_CONTACT_INFO = {
  phone: "262-339-3160",
  email: "neutralgroundwb@gmail.com",
  address: {
    street: "7003 State Hwy 144",
    city: "West Bend",
    state: "WI",
    zip: "53090",
    full: "7003 State Hwy 144, West Bend, WI 53090",
    googleMapsLink: "https://maps.google.com/?q=Neutral+Ground+West+Bend",
    googleEmbedLink:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2912.7376514440213!2d-88.23043378451046!3d43.12882497914369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8804e8be5fdf0acf%3A0x9a758de8fe6f05ca!2s7003%20WI-144%2C%20West%20Bend%2C%20WI%2053090!5e0!3m2!1sen!2sus!4v1633553394067!5m2!1sen!2sus",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100057586954258",
    instagram: "https://www.instagram.com/neutralgroundcombatsports/",
  },
  businessName: "Neutral Ground Combat Sports",
};

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContactInfo() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(CONTACT_INFO_API, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to fetch contact info: ${res.status}`);
        }

        const data = await res.json();

        if (isMounted) {
          // Merge fetched data with defaults to ensure all fields exist
          setContactInfo({ ...DEFAULT_CONTACT_INFO, ...data });
        }
      } catch (e) {
        console.error("Failed to load contact info:", e);
        if (isMounted) {
          setError(e.message);
          // Use default data as fallback
          setContactInfo(DEFAULT_CONTACT_INFO);
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
