import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAssignments, getCourses, getGrades } from "../services/api";
import { average } from "../utils/portal";
import "../styles/portal.css";

export default function CourseAnalyticsPage() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    let active = true;

    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");

        const [courseResponse, assignmentResponse, gradeResponse] = await Promise.all([
          getCourses(),
          getAssignments(),
          getGrades(),
        ]);

        if (!active) return;

        const allCourses = Array.isArray(courseResponse?.data) ? courseResponse.data : [];
        const visibleCourses =
          user?.role === "INSTRUCTOR"
            ? allCourses.filter((course) => String(course.instructorId) === String(user.id))
            : allCourses;

        setCourses(visibleCourses);
        setAssignments(Array.isArray(assignmentResponse?.data) ? assignmentResponse.data : []);
        setGrades(Array.isArray(gradeResponse?.data) ? gradeResponse.data : []);
      } catch (err) {
        if (!active) return;
        console.error("Course analytics load failed", err);
        setError("We could not load course analytics right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      active = false;
    };
  }, [user?.id, user?.role]);

  const analytics = useMemo(() => {
    return courses.map((course) => {
      const courseAssignments = assignments.filter(
        (assignment) => String(assignment.courseId) === String(course.courseId)
      );
      const assignmentIds = new Set(courseAssignments.map((assignment) => String(assignment.assignmentId)));
      const courseGrades = grades.filter((grade) => assignmentIds.has(String(grade.assignmentId)));

      return {
        ...course,
        assignmentCount: courseAssignments.length,
        gradeCount: courseGrades.length,
        averageScore: average(courseGrades.map((grade) => Number(grade.score) || 0)),
      };
    });
  }, [assignments, courses, grades]);

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Course analytics</div>
          <h1>Course performance overview</h1>
          <p>
            Compare visible courses at a glance using the assignments and grade entries already saved
            in the current backend.
          </p>
        </div>
        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>{analytics.length}</strong>
            <p>Courses included in this overview</p>
          </div>
        </div>
      </section>

      {error ? <div className="portal-error">{error}</div> : null}

      {loading ? (
        <section className="portal-card">
          <div className="portal-empty">
            <h4>Loading analytics...</h4>
            <p>Course summaries are being generated.</p>
          </div>
        </section>
      ) : analytics.length ? (
        <section className="portal-grid-equal">
          {analytics.map((course) => (
            <article className="portal-card" key={course.courseId}>
              <div className="portal-card-header">
                <div>
                  <h3 className="portal-card-title">{course.courseName}</h3>
                  <p className="portal-card-subtitle">{course.description || "No course description available."}</p>
                </div>
                <span className={`portal-pill ${course.averageScore >= 75 ? "success" : course.averageScore >= 60 ? "warning" : "info"}`}>
                  Avg {course.averageScore}
                </span>
              </div>

              <div className="portal-kpi-grid">
                <div className="portal-kpi">
                  <strong>{course.assignmentCount}</strong>
                  <span>Assignments linked to this course</span>
                </div>
                <div className="portal-kpi">
                  <strong>{course.gradeCount}</strong>
                  <span>Grade rows tied to course assignments</span>
                </div>
                <div className="portal-kpi">
                  <strong>{course.averageScore}</strong>
                  <span>Average raw score</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="portal-card">
          <div className="portal-empty">
            <h4>No course analytics available</h4>
            <p>Create or load courses first to unlock the full course overview.</p>
          </div>
        </section>
      )}
    </div>
  );
}
