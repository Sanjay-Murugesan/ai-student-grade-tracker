import React, { useEffect, useState } from "react";
import { createAssignment, getAssignments, getAllSubmissions, getCourses, publishAssignment } from "../../services/api";

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    weightage: "",
    priority: "MEDIUM",
    maxMarks: 100,
    instructorId: 1,
  });

  const loadData = () =>
    Promise.all([getAssignments(), getCourses(), getAllSubmissions()]).then(([assignmentRes, courseRes, submissionRes]) => {
      setAssignments(assignmentRes.data);
      setCourses(courseRes.data);
      setSubmissions(submissionRes.data);
    });

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    await createAssignment({
      ...form,
      courseId: Number(form.courseId),
      weightage: Number(form.weightage),
      dueDate: new Date(form.dueDate).toISOString(),
    });
    setForm({
      title: "",
      description: "",
      courseId: "",
      dueDate: "",
      weightage: "",
      priority: "MEDIUM",
      maxMarks: 100,
      instructorId: 1,
    });
    await loadData();
  };

  return (
    <div className="page-stack">
      <section className="content-grid two-column">
        <form className="panel form-panel" onSubmit={handleCreate}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">Create Assignment</p>
              <h2>Publish-ready authoring form</h2>
            </div>
          </div>
          {[
            ["title", "Title"],
            ["dueDate", "Due Date"],
            ["weightage", "Weightage"],
          ].map(([key, label]) => (
            <label key={key}>
              {label}
              <input
                type={key === "dueDate" ? "datetime-local" : "text"}
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                required
              />
            </label>
          ))}
          <label>
            Course
            <select value={form.courseId} onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))} required>
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />
          </label>
          <button className="primary-button" type="submit">Create Assignment</button>
        </form>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Assignment Queue</p>
              <h2>Drafts and published work</h2>
            </div>
          </div>
          <div className="list-stack">
            {assignments.map((assignment) => (
              <div className="list-item static" key={assignment.assignmentId}>
                <div>
                  <strong>{assignment.title}</strong>
                  <p>
                    {assignment.published ? "Published" : "Draft"} • {submissions.filter((item) => item.assignmentId === assignment.assignmentId).length} submissions
                  </p>
                </div>
                <button className="secondary-button" type="button" onClick={() => publishAssignment(assignment.assignmentId)}>
                  Publish
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
