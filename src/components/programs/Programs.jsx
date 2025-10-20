import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./Programs.css";
import ProgramCard from "./ProgramCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { PROGRAMS_API } from "../../common/constants";

export default function Programs() {

    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    function normalizeProgram(item) {
        if (!item || typeof item !== "object") return null;

        const id = item.id || uuidv4();
        const name = item.name ?? "Unnamed Program";
        const description = item.description ?? "";
        const skillLevel = item.skillLevel ?? "All Levels";

        return { id, name, description, skillLevel };
    }

    useEffect(() => {
        let isMounted = true;

        async function loadPrograms() {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(PROGRAMS_API, { cache: "no-store" });

                if (!res.ok) {
                  throw new Error(`Failed to fetch programs: ${res.status}`);
                }

                const data = await res.json();
                const list = Array.isArray(data) ? data : data?.programs || [];
                const normalized = list.map(normalizeProgram).filter(Boolean);

                if (isMounted) {
                    setPrograms(normalized);
                }
            } catch (e) {
                console.error("Failed to load programs:", e);
                if (isMounted) {
                    setError(e.message);
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

    const listToRender = programs.length > 0 ? programs : [];

    return (
        <div className="programs-page-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <section className="programs-container" style={{ flex: '1 0 auto' }}>
                <div className="programs-header">
                    <h1>Programs</h1>
                    <p>Choose your path and start training today</p>
                </div>

                {loading && (
                    <div className="programs-loading">Loading programs…</div>
                )}

                {error && !loading && (
                    <div className="programs-error">
                        Failed to load programs.
                    </div>
                )}

                <div className="programs-list">
                    {listToRender.map((program, index) => (
                        <ProgramCard
                            key={program.id}
                            program={program}
                            index={index}
                        />
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
}
