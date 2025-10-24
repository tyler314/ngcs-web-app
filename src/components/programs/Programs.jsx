import React, { useState } from "react";
import "./Programs.css";
import ProgramCard from "./ProgramCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default function Programs() {
  // Mock programs - one for each animation style
  const ANIMATION_DEMO_PROGRAMS = [
    {
      name: "Standard Dropdown",
      description: "Basic dropdown animation with height and opacity transitions. Clean and professional.",
      skillLevel: "Animation Style: Default",
      animationStyle: "default"
    },
    {
      name: "Hover Tilt Effect",
      description: "Card tilts based on your mouse position creating a 3D parallax effect. Interactive and engaging.",
      skillLevel: "Animation Style: Hover Tilt",
      animationStyle: "hoverTilt"
    },
    {
      name: "Staggered Children",
      description: "Each section appears one after another in a cascading effect. Smooth and sequential.",
      skillLevel: "Animation Style: Stagger",
      animationStyle: "stagger"
    },
    {
      name: "Bounce on Expand",
      description: "Dropdown uses spring physics for a bouncy, playful entrance and exit. Fun and dynamic.",
      skillLevel: "Animation Style: Bounce",
      animationStyle: "bounce"
    },
    {
      name: "Letter by Letter",
      description: "Program title reveals character by character like a typewriter. Attention-grabbing.",
      skillLevel: "Animation Style: Letter Reveal",
      animationStyle: "letterReveal"
    },
    {
      name: "Pulse Indicator",
      description: "Expand arrow continuously pulses to draw attention. Guides user interaction.",
      skillLevel: "Animation Style: Pulse",
      animationStyle: "pulse"
    },
    {
      name: "Image Scale + Rotate",
      description: "Hero image spins and scales into view. Dramatic and eye-catching.",
      skillLevel: "Animation Style: Scale Rotate",
      animationStyle: "scaleRotate"
    },
    {
      name: "Background Image Overlay",
      description: "Full background image with dark overlay for text. Immersive atmosphere.",
      skillLevel: "Animation Style: Background",
      animationStyle: "background"
    },
    {
      name: "Carousel Slide + Fade",
      description: "Images slide in from the side while fading. More dynamic than pure fade.",
      skillLevel: "Animation Style: Carousel Slide",
      animationStyle: "carouselSlide"
    },
    {
      name: "Animated Dots",
      description: "Carousel navigation dots scale and bounce on interaction. Enhanced feedback.",
      skillLevel: "Animation Style: Animated Dots",
      animationStyle: "animatedDots"
    },
  ];

  const [loading] = useState(false);
  const [error] = useState(null);

  return (
      <div
          className="programs-page-wrapper"
          style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <section className="programs-container" style={{ flex: "1 0 auto" }}>
          <div className="programs-header">
            <h1>Animation Showcase</h1>
            <p>Click each card to see different animation styles in action</p>
          </div>

          {loading && <div className="programs-loading">Loading programs…</div>}

          {error && !loading && (
              <div className="programs-error">Failed to load programs.</div>
          )}

          <div className="programs-list">
            {ANIMATION_DEMO_PROGRAMS.map((program, index) => (
                <ProgramCard
                    key={index}
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