import "./Instructors.css";
import InstructorCard from "./InstructorCard";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SEO from "../../common/SEO";
import { useInstructors } from "../../common/commonUtils";

export default function Instructors() {
  const { instructors, loading, error } = useInstructors();

  return (
    <div
      className="instructors-page-wrapper"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <SEO
        title="Instructors | Neutral Ground Combat Sports"
        description="Meet our world-class instructors at Neutral Ground Combat Sports. BJJ black belts, pro MMA fighters, and expert striking coaches dedicated to your progress."
        canonical="https://www.westbendbjj.com/instructors"
      />
      <Header />
      <section className="instructors-container" style={{ flex: "1 0 auto" }}>
        <div className="instructors-header">
          <h1>Instructors</h1>
          <p>
            Meet the experts who will guide you on your combat sports journey
          </p>
        </div>

        {/* Loading and error states */}
        {loading && (
          <div className="instructors-loading">Loading instructors…</div>
        )}

        {error && !loading && (
          <div className="instructors-error">Failed to load instructors.</div>
        )}

        {!loading && !error && instructors.length === 0 && (
          <div className="instructors-loading">No instructors available.</div>
        )}

        <div className="instructors-grid">
          {instructors.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
