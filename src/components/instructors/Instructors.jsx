import React from "react";
import "./Instructors.css";
import InstructorCard from "./InstructorCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";

/**
 * Instructors component displays information about the gym's instructors.
 * It renders a list of instructor cards with their details.
 */
export default function Instructors() {
    // This could be moved to a constants file or fetched from an API
    const instructors = [
        {
            id: 1,
            name: "Tim Hagan",
            role: "Head Coach + Owner",
            disciplines: "Brazilian Jiu-Jitsu,Boxing,Kickboxing,MMA",
            bio: "Professional fighter with multiple championship titles.",
            imgSrc: "/tmpImgs/instructor1.png",
        },
        {
            id: 2,
            name: "Tyler Roberts",
            role: "Coach",
            disciplines: "Brazilian Jiu-Jitsu",
            bio: "Pretty cool dude",
            imgSrc: "/tmpImgs/instructor2.png",
        },
        // Add more instructors as needed
    ];

    return (
        <div className="instructors-page-wrapper">
            <Header />
            <section className="instructors-container">
                <div className="instructors-header">
                    <h1>Instructors</h1>
                    <p>Meet the experts who will guide you on your combat sports journey</p>
                </div>

                <div className="instructors-grid">
                    {instructors.map((instructor) => (
                        <InstructorCard key={instructor.id} instructor={instructor} />
                    ))}
                </div>
            </section>
            {/*<GoogleEmbedMap />*/}
            <Footer />
        </div>
    );
}