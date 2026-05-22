import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  addStudent,
  deleteStudent,
  getAssignments,
  getCourses,
  getGrades,
  getStudents,
  updateStudent,
} from "../services/api";
import { average, daysUntil, formatDisplayDate } from "../utils/portal";
import "../styles/portal.css";
import "../styles/dashboard-pages.css";

const EMPTY_STUDENT = {
  name: "",
  email: "",
  department: "",
  year: "",
  semester: "",
  section: "",
  gpa: "",
  cgpa: "",
  attendancePercentage: "",
  subjectAttendance: "",
};

const EMPTY_CLASS_FILTER = {
  department: "",
  year: "",
  semester: "",
  section: "",
};

export default function TeacherDashboardPage() {
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);

  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [savingStudent, setSavingStudent] = useState(false);

  const [classFilter, setClassFilter] = useState(EMPTY_CLASS_FILTER);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [
          studentResponse,
          assignmentResponse,
          gradeResponse,
          courseResponse,
        ] = await Promise.all([
          getStudents(),
          getAssignments(),
          getGrades(),
          getCourses().catch(() => null),
        ]);

        if (!active) return;

        setStudents(Array.isArray(studentResponse?.data) ? studentResponse.data : []);
        setAssignments(Array.isArray(assignmentResponse?.data) ? assignmentResponse.data : []);
        setGrades(Array.isArray(gradeResponse?.data) ? gradeResponse.data : []);
        setCourses(Array.isArray(courseResponse?.data) ? courseResponse.data : []);
      } catch (err) {
        if (!active) return;
        console.error("Teacher dashboard load failed", err);
        setError("We could not load the teaching dashboard right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const handleClassFilterChange = (event) => {
    const { name, value } = event.target;

    setClassFilter((current) => ({
      ...current,
      [name]: name === "department" || name === "section" ? value.toUpperCase() : value,
    }));
  };

  const clearClassFilter = () => {
    setClassFilter(EMPTY_CLASS_FILTER);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const departmentMatch =
        !classFilter.department ||
        String(student.department || "").toLowerCase() ===
          String(classFilter.department || "").toLowerCase();

      const yearMatch =
        !classFilter.year ||
        Number(student.year) === Number(classFilter.year);

      const semesterMatch =
        !classFilter.semester ||
        Number(student.semester) === Number(classFilter.semester);

      const sectionMatch =
        !classFilter.section ||
        String(student.section || "").toLowerCase() ===
          String(classFilter.section || "").toLowerCase();

      return departmentMatch && yearMatch && semesterMatch && sectionMatch;
    });
  }, [students, classFilter]);

  const assignmentAverages = useMemo(() => {
    const byAssignment = new Map();

    grades.forEach((grade) => {
      const key = String(grade.assignmentId);
      const scores = byAssignment.get(key) || [];
      scores.push(Number(grade.score ?? grade.marks) || 0);
      byAssignment.set(key, scores);
    });

    return assignments
      .map((assignment) => ({
        ...assignment,
        average: average(byAssignment.get(String(assignment.assignmentId)) || []),
        submissions: (byAssignment.get(String(assignment.assignmentId)) || []).length,
      }))
      .sort((left, right) => right.average - left.average);
  }, [assignments, grades]);

  const lowCoverageAssignments = useMemo(() => {
    return assignmentAverages
      .filter((assignment) => {
        const remaining = daysUntil(assignment.dueDate);
        return remaining !== null && remaining < 0 && assignment.submissions === 0;
      })
      .slice(0, 4);
  }, [assignmentAverages]);

  const upcomingAssignments = useMemo(() => {
    return [...assignments]
      .filter((assignment) => {
        const remaining = daysUntil(assignment.dueDate);
        return remaining !== null && remaining >= 0;
      })
      .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate))
      .slice(0, 5);
  }, [assignments]);

  const courseNameById = useMemo(() => {
    const map = new Map();

    courses.forEach((course) => {
      map.set(String(course.courseId), course.courseName);
    });

    return map;
  }, [courses]);

  const classAverage = average(
    grades.map((grade) => Number(grade.score ?? grade.marks) || 0)
  );

  const overdueAssignments = assignments.filter((assignment) => {
    const remaining = daysUntil(assignment.dueDate);
    return remaining !== null && remaining < 0;
  }).length;

  const refreshStudents = async () => {
    const studentResponse = await getStudents();
    setStudents(Array.isArray(studentResponse?.data) ? studentResponse.data : []);
  };

  const handleStudentFormChange = (event) => {
    const { name, value } = event.target;

    setStudentForm((current) => ({
      ...current,
      [name]: name === "department" || name === "section" ? value.toUpperCase() : value,
    }));
  };

  const handleEditStudent = (student) => {
    setEditingStudentId(student.studentId);

    setStudentForm({
      name: student.name || "",
      email: student.email || "",
      department: student.department || "",
      year: student.year ?? "",
      semester: student.semester ?? "",
      section: student.section || "",
      gpa: student.gpa ?? "",
      cgpa: student.cgpa ?? "",
      attendancePercentage: student.attendancePercentage ?? "",
      subjectAttendance: student.subjectAttendance || "",
    });
  };

  const handleSaveStudent = async (event) => {
    event.preventDefault();

    setSavingStudent(true);
    setError("");

    const payload = {
      ...studentForm,
      department: studentForm.department
        ? studentForm.department.trim().toUpperCase()
        : "",
      year: studentForm.year === "" ? null : Number(studentForm.year),
      semester:
        studentForm.semester === "" ? null : Number(studentForm.semester),
      gpa: studentForm.gpa === "" ? null : Number(studentForm.gpa),
      cgpa: studentForm.cgpa === "" ? null : Number(studentForm.cgpa),
      attendancePercentage:
        studentForm.attendancePercentage === ""
          ? null
          : Number(studentForm.attendancePercentage),
      section: studentForm.section
        ? studentForm.section.trim().toUpperCase()
        : "",
    };

    try {
      if (editingStudentId) {
        await updateStudent(editingStudentId, payload);
      } else {
        await addStudent(payload);
      }

      setStudentForm(EMPTY_STUDENT);
      setEditingStudentId(null);
      await refreshStudents();
    } catch (err) {
      console.error("Student save failed", err);
      setError(err.response?.data?.message || "Student save failed.");
    } finally {
      setSavingStudent(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Remove this student record?")) return;

    try {
      await deleteStudent(studentId);
      await refreshStudents();
    } catch (err) {
      console.error("Student delete failed", err);
      setError(err.response?.data?.message || "Student delete failed.");
    }
  };

  if (loading) {
    return (
      <div className="portal-page">
        <div className="portal-hero">
          <div className="portal-hero-copy">
            <div className="portal-kicker">Instructor Workspace</div>
            <h1>Preparing your teaching dashboard...</h1>
            <p>Class data, grading activity, and course performance are loading.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page dashboard-clean">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Instructor Workspace</div>

          <h1>
            {`Welcome back, ${
              user?.name || user?.username || "Instructor"
            }`}
          </h1>

          <p>
            This control center helps you manage class-wise students,
            assignments, submissions, grades, attendance, and academic risk
            insights.
          </p>
        </div>

        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>
              {formatDisplayDate(new Date(), {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </strong>

            <p>
              {`${courses.length} course${
                courses.length === 1 ? "" : "s"
              } visible in the system`}
            </p>
          </div>

          <span className="portal-pill info">Instructor dashboard</span>
        </div>
      </section>

      {error ? <div className="portal-error">{error}</div> : null}

      <section className="portal-stat-grid">
        <article className="portal-stat">
          <div className="portal-stat-label">Students</div>
          <div className="portal-stat-value">{students.length}</div>
          <div className="portal-stat-note">
            Learners currently visible across the tracker.
          </div>
        </article>

        <article className="portal-stat">
          <div className="portal-stat-label">Filtered Students</div>
          <div className="portal-stat-value">{filteredStudents.length}</div>
          <div className="portal-stat-note">
            Students matching selected department, year, semester, and section.
          </div>
        </article>

        <article className="portal-stat">
          <div className="portal-stat-label">Assignments</div>
          <div className="portal-stat-value">{assignments.length}</div>
          <div className="portal-stat-note">
            Published assignment records in the backend.
          </div>
        </article>

        <article className="portal-stat">
          <div className="portal-stat-label">Class average</div>
          <div className="portal-stat-value">{classAverage}</div>
          <div className="portal-stat-note">
            Average raw score across all grade entries.
          </div>
        </article>

        <article className="portal-stat">
          <div className="portal-stat-label">Overdue</div>
          <div className="portal-stat-value">{overdueAssignments}</div>
          <div className="portal-stat-note">
            Assignments with due dates already behind us.
          </div>
        </article>
      </section>

      <section className="portal-card">
        <div className="portal-card-header">
          <div>
            <h3 className="portal-card-title">Class / Section Filter</h3>
            <p className="portal-card-subtitle">
              Select a class to view the correct group of students.
            </p>
          </div>

          <button
            className="portal-button soft"
            type="button"
            onClick={clearClassFilter}
          >
            Clear filter
          </button>
        </div>

        <div className="portal-inline-form">
          <div className="portal-field">
            <label>Department</label>
            <input
              name="department"
              value={classFilter.department}
              onChange={handleClassFilterChange}
              placeholder="IT"
            />
          </div>

          <div className="portal-field">
            <label>Year</label>
            <input
              name="year"
              type="number"
              min="1"
              max="4"
              value={classFilter.year}
              onChange={handleClassFilterChange}
              placeholder="2"
            />
          </div>

          <div className="portal-field">
            <label>Semester</label>
            <input
              name="semester"
              type="number"
              min="1"
              max="8"
              value={classFilter.semester}
              onChange={handleClassFilterChange}
              placeholder="4"
            />
          </div>

          <div className="portal-field">
            <label>Section</label>
            <input
              name="section"
              value={classFilter.section}
              onChange={handleClassFilterChange}
              placeholder="A"
            />
          </div>
        </div>
      </section>

      <section className="portal-grid-2">
        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Classroom watchlist</h3>
              <p className="portal-card-subtitle">
                Fast checks for places that may need attention this week.
              </p>
            </div>

            <div className="portal-actions">
              <Link className="portal-button soft" to="/grades">
                Open grades
              </Link>

              <Link className="portal-button primary" to="/course-analytics">
                Course analytics
              </Link>
            </div>
          </div>

          <div className="portal-kpi-grid">
            <div className="portal-kpi">
              <strong>{lowCoverageAssignments.length}</strong>
              <span>Past-due assignments with no grade entries yet</span>
            </div>

            <div className="portal-kpi">
              <strong>{grades.length}</strong>
              <span>Total grade records saved so far</span>
            </div>

            <div className="portal-kpi">
              <strong>{courses.length}</strong>
              <span>Active courses available for review</span>
            </div>
          </div>

          <div className="portal-stack" style={{ marginTop: 16 }}>
            {lowCoverageAssignments.length ? (
              lowCoverageAssignments.map((assignment) => (
                <div className="portal-list-item" key={assignment.assignmentId}>
                  <div>
                    <strong>{assignment.title}</strong>
                    <p>
                      {assignment.courseName ||
                        courseNameById.get(String(assignment.courseId)) ||
                        "General assignment"}
                    </p>
                  </div>

                  <div>
                    <span className="portal-pill danger">
                      Needs grading activity
                    </span>
                    <p>{`Due ${formatDisplayDate(assignment.dueDate)}`}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="portal-empty">
                <h4>No urgent watchlist items</h4>
                <p>
                  The current data does not show any past-due assignments
                  without grading activity.
                </p>
              </div>
            )}
          </div>
        </article>

        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Upcoming schedule</h3>
              <p className="portal-card-subtitle">
                The next deadlines likely to shape student workload.
              </p>
            </div>

            <Link className="portal-button soft" to="/assignments">
              Manage assignments
            </Link>
          </div>

          {upcomingAssignments.length ? (
            <div className="portal-stack">
              {upcomingAssignments.map((assignment) => {
                const remaining = daysUntil(assignment.dueDate);

                return (
                  <div className="portal-list-item" key={assignment.assignmentId}>
                    <div>
                      <strong>{assignment.title}</strong>
                      <p>
                        {assignment.courseName ||
                          courseNameById.get(String(assignment.courseId)) ||
                          "No course label"}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`portal-pill ${
                          remaining <= 2 ? "warning" : "info"
                        }`}
                      >
                        {remaining === 0 ? "Due today" : `${remaining} days left`}
                      </span>

                      <p>{formatDisplayDate(assignment.dueDate)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="portal-empty">
              <h4>No upcoming deadlines</h4>
              <p>You currently do not have dated assignments coming up next.</p>
            </div>
          )}
        </article>
      </section>

      <section className="portal-grid-2">
        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Manage students</h3>
              <p className="portal-card-subtitle">
                Add, edit, remove, and update class, attendance, or GPA records.
              </p>
            </div>
          </div>

          <form className="portal-stack" onSubmit={handleSaveStudent}>
            <div className="portal-inline-form">
              <div className="portal-field">
                <label>Name</label>
                <input
                  name="name"
                  value={studentForm.name}
                  onChange={handleStudentFormChange}
                  required
                />
              </div>

              <div className="portal-field">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={studentForm.email}
                  onChange={handleStudentFormChange}
                  required
                />
              </div>

              <div className="portal-field">
                <label>Department</label>
                <input
                  name="department"
                  value={studentForm.department}
                  onChange={handleStudentFormChange}
                  placeholder="IT"
                />
              </div>

              <div className="portal-field">
                <label>Year</label>
                <input
                  name="year"
                  type="number"
                  min="1"
                  max="4"
                  value={studentForm.year}
                  onChange={handleStudentFormChange}
                  placeholder="2"
                />
              </div>
            </div>

            <div className="portal-inline-form">
              <div className="portal-field">
                <label>Semester</label>
                <input
                  name="semester"
                  type="number"
                  min="1"
                  max="8"
                  value={studentForm.semester}
                  onChange={handleStudentFormChange}
                  placeholder="4"
                />
              </div>

              <div className="portal-field">
                <label>Section</label>
                <input
                  name="section"
                  value={studentForm.section}
                  onChange={handleStudentFormChange}
                  placeholder="A"
                />
              </div>

              <div className="portal-field">
                <label>GPA</label>
                <input
                  name="gpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={studentForm.gpa}
                  onChange={handleStudentFormChange}
                />
              </div>

              <div className="portal-field">
                <label>CGPA</label>
                <input
                  name="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={studentForm.cgpa}
                  onChange={handleStudentFormChange}
                />
              </div>
            </div>

            <div className="portal-inline-form">
              <div className="portal-field">
                <label>Attendance %</label>
                <input
                  name="attendancePercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={studentForm.attendancePercentage}
                  onChange={handleStudentFormChange}
                />
              </div>
            </div>

            <div className="portal-field">
              <label>Subject attendance</label>
              <textarea
                name="subjectAttendance"
                value={studentForm.subjectAttendance}
                onChange={handleStudentFormChange}
                placeholder='Example: [{"subject":"Math","attendance":82},{"subject":"DBMS","attendance":74}]'
              />
            </div>

            <div className="portal-actions">
              <button
                className="portal-button primary"
                type="submit"
                disabled={savingStudent}
              >
                {savingStudent
                  ? "Saving..."
                  : editingStudentId
                  ? "Update student"
                  : "Add student"}
              </button>

              {editingStudentId && (
                <button
                  className="portal-button soft"
                  type="button"
                  onClick={() => {
                    setEditingStudentId(null);
                    setStudentForm(EMPTY_STUDENT);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Student roster</h3>
              <p className="portal-card-subtitle">
                Showing students based on selected class / section filter.
              </p>
            </div>
          </div>

          {filteredStudents.length ? (
            <div className="portal-stack">
              {filteredStudents.slice(0, 8).map((student) => (
                <div className="portal-list-item" key={student.studentId}>
                  <div>
                    <strong>
                      {student.name || `Student ${student.studentId}`}
                    </strong>

                    <p>
                      {`${student.email || "No email"} · ${
                        student.department || "Dept"
                      } Year ${student.year || "-"} Sem ${
                        student.semester || "-"
                      } Sec ${
                        student.section || "-"
                      } · Attendance ${Math.round(
                        Number(student.attendancePercentage || 0)
                      )}%`}
                    </p>
                  </div>

                  <div className="portal-actions">
                    <button
                      className="portal-button soft"
                      type="button"
                      onClick={() => handleEditStudent(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="portal-button"
                      type="button"
                      onClick={() => handleDeleteStudent(student.studentId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="portal-empty">
              <h4>No students found</h4>
              <p>
                Add students or change the class filter to view the correct
                roster.
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="portal-card">
        <div className="portal-card-header">
          <div>
            <h3 className="portal-card-title">
              Assignment performance snapshot
            </h3>

            <p className="portal-card-subtitle">
              Top and low-performing assignment averages from the current
              gradebook.
            </p>
          </div>
        </div>

        {assignmentAverages.length ? (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Course</th>
                <th>Average score</th>
                <th>Grade entries</th>
                <th>Due date</th>
              </tr>
            </thead>

            <tbody>
              {assignmentAverages.slice(0, 8).map((assignment) => (
                <tr key={assignment.assignmentId}>
                  <td>{assignment.title}</td>

                  <td className="portal-muted">
                    {assignment.courseName ||
                      courseNameById.get(String(assignment.courseId)) ||
                      "Not linked"}
                  </td>

                  <td>{assignment.average}</td>
                  <td>{assignment.submissions}</td>
                  <td className="portal-muted">
                    {formatDisplayDate(assignment.dueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="portal-empty">
            <h4>No assignment analytics yet</h4>
            <p>
              Once assignments and grades are added, this table will show a
              cleaner performance view.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}