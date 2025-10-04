import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./Instructors.css";
import InstructorCard from "./InstructorCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import {
  INSTRUCTORS_API,
  S3_INSTRUCTORS_BUCKET_URL,
  DEFAULT_INSTRUCTOR_IMAGE
} from "../../common/constants";

export default function Instructors() {
  // Minimal mock data to keep the page usable if fetch fails
  const MOCK_INSTRUCTORS = useMemo(
    () => [
      {
        id: "mock-1",
        name: "Tim Hagan",
        role: "Head Coach + Owner",
        disciplines: "Brazilian Jiu-Jitsu,Boxing,Kickboxing,MMA",
        bio: "Professional fighter with multiple championship titles.",
        imgSrc: `${S3_INSTRUCTORS_BUCKET_URL}${DEFAULT_INSTRUCTOR_IMAGE}`,
      },
      {
        id: "mock-2",
        name: "Tyler Roberts",
        role: "Coach",
        disciplines: "Brazilian Jiu-Jitsu",
        bio: "Pretty cool dude",
        imgSrc: `${S3_INSTRUCTORS_BUCKET_URL}${DEFAULT_INSTRUCTOR_IMAGE}`,
      },
    ],
    [S3_INSTRUCTORS_BUCKET_URL, DEFAULT_INSTRUCTOR_IMAGE]
  );

  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function normalizeInstructor(item) {
    if (!item || typeof item !== "object") return null;

    const id = uuidv4();
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

  useEffect(() => {
    let isMounted = true;

    async function loadInstructors() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(INSTRUCTORS_API, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to fetch instructors: ${res.status}`);
        }

        const data = await res.json();

        const list = Array.isArray(data) ? data : data?.instructors || [];
        const normalized = list
          .map(normalizeInstructor)
          .filter(Boolean);

        if (isMounted) {
          setInstructors(normalized);
        }
      } catch (e) {
        console.error("Failed to load instructors:", e);
        if (isMounted) {
          setError(e.message);
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

  const listToRender = instructors.length > 0 ? instructors : MOCK_INSTRUCTORS;

  return (
    <div className="instructors-page-wrapper">
      <Header />
      <section className="instructors-container">
        <div className="instructors-header">
          <h1>Instructors</h1>
          <p>Meet the experts who will guide you on your combat sports journey</p>
        </div>

        {/* Loading and error states */}
        {loading && (
          <div className="instructors-loading">Loading instructors…</div>
        )}

        {error && !loading && (
          <div className="instructors-error">
            Failed to load instructors. Using sample data instead.
          </div>
        )}

        <div className="instructors-grid">
          {listToRender.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}