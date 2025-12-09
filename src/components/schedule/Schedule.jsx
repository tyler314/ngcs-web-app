import "./Schedule.css";
import ScheduleCalendar from "./ScheduleCalendar";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import SEO from "../../common/SEO";

export default function Schedule() {
  return (
    <div
      className="schedule-page-wrapper"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <SEO
        title="Class Schedule | Neutral Ground Combat Sports"
        description="View our complete weekly schedule of BJJ, MMA, Kickboxing, and Boxing classes. Find a time that works for you and start training today."
        canonical="https://www.westbendbjj.com/schedule"
      />
      <div style={{ flex: "1 0 auto", paddingBottom: "0" }}>
        <ScheduleCalendar />
      </div>
      <Footer />
    </div>
  );
}
