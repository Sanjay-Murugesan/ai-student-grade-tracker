import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getAttendance,
  getAttendanceByStudent,
  getCourses,
  getStudentByUserId,
  getStudents,
  markAttendance,
  updateAttendance,
} from "../services/api";
import "../styles/attendance.css";
import "../styles/portal.css";

const EMPTY = { studentId: "", courseId: "", totalClasses: "", attendedClasses: "" };

export default function AttendancePage() {
  const { user } = useContext(AuthContext);
  const isTeacher = user?.role === "INSTRUCTOR";
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const courseResponse = await getCourses().catch(() => null);
      setCourses(Array.isArray(courseResponse?.data) ? courseResponse.data : []);

      if (isTeacher) {
        const [attendanceResponse, studentResponse] = await Promise.all([getAttendance(), getStudents()]);
        setAttendance(Array.isArray(attendanceResponse?.data) ? attendanceResponse.data : []);
        setStudents(Array.isArray(studentResponse?.data) ? studentResponse.data : []);
      } else if (user?.id) {
        const studentResponse = await getStudentByUserId(user.id);
        const studentId = studentResponse?.data?.studentId;
        if (studentId) {
          const attendanceResponse = await getAttendanceByStudent(studentId);
          setAttendance(Array.isArray(attendanceResponse?.data) ? attendanceResponse.data : []);
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load attendance.");
    } finally {
      setLoading(false);
    }
  }, [isTeacher, user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const courseMap = useMemo(() => {
    const map = new Map();
    courses.forEach((course) => map.set(String(course.courseId), course));
    return map;
  }, [courses]);

  const averageAttendance = useMemo(() => {
    if (!attendance.length) return 0;
    const total = attendance.reduce((sum, item) => sum + Number(item.percentage || 0), 0);
    return Math.round(total / attendance.length);
  }, [attendance]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      studentId: Number(form.studentId),
      courseId: Number(form.courseId),
      totalClasses: Number(form.totalClasses),
      attendedClasses: Number(form.attendedClasses),
    };

    try {
      if (editingId) {
        await updateAttendance(editingId, payload);
      } else {
        await markAttendance(payload);
      }
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save attendance.");
    }
  }

  function edit(item) {
    setEditingId(item.attendanceId);
    setForm({
      studentId: item.studentId || "",
      courseId: item.courseId || "",
      totalClasses: item.totalClasses || "",
      attendedClasses: item.attendedClasses || "",
    });
  }

  return (
    <div className="portal-page attendance-page">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Attendance tracker</div>
          <h1>Attendance</h1>
          <p>Track attendance percentage by course and surface low-attendance warnings below 75 percent.</p>
        </div>
        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>{averageAttendance}%</strong>
            <p>Average attendance</p>
          </div>
          {averageAttendance > 0 && averageAttendance < 75 && <span className="portal-pill danger">Low attendance</span>}
        </div>
      </section>

      {message && <div className="portal-error">{message}</div>}

      {isTeacher && (
        <section className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">{editingId ? "Update attendance" : "Mark attendance"}</h3>
              <p className="portal-card-subtitle">Percentage is calculated as attended classes divided by total classes.</p>
            </div>
          </div>

          <form className="portal-inline-form" onSubmit={handleSubmit}>
            <div className="portal-field">
              <label>Student</label>
              <select name="studentId" required value={form.studentId} onChange={handleChange}>
                <option value="">Select student</option>
                {students.map((student) => (
                  <option key={student.studentId} value={student.studentId}>{student.name}</option>
                ))}
              </select>
            </div>
            <div className="portal-field">
              <label>Course</label>
              <select name="courseId" required value={form.courseId} onChange={handleChange}>
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>{course.courseName}</option>
                ))}
              </select>
            </div>
            <div className="portal-field">
              <label>Total classes</label>
              <input name="totalClasses" type="number" min="1" required value={form.totalClasses} onChange={handleChange} />
            </div>
            <div className="portal-field">
              <label>Attended classes</label>
              <input name="attendedClasses" type="number" min="0" required value={form.attendedClasses} onChange={handleChange} />
            </div>
            <button className="portal-button primary" type="submit">{editingId ? "Update" : "Mark"}</button>
          </form>
        </section>
      )}

      <section className="portal-card">
        <div className="portal-card-header">
          <div>
            <h3 className="portal-card-title">Subject-wise attendance</h3>
            <p className="portal-card-subtitle">Present and absent split is shown with progress bars.</p>
          </div>
        </div>

        {loading ? (
          <div className="portal-empty"><h4>Loading attendance...</h4><p>Records are being fetched.</p></div>
        ) : attendance.length ? (
          <div className="portal-stack">
            {attendance.map((item) => {
              const percentage = Math.round(Number(item.percentage || 0));
              const course = courseMap.get(String(item.courseId));
              return (
                <div className="attendance-row" key={item.attendanceId}>
                  <div className="attendance-row-top">
                    <strong>{course?.courseName || `Course ${item.courseId}`}</strong>
                    <span className={`portal-pill ${percentage < 75 ? "danger" : "success"}`}>{percentage}%</span>
                  </div>
                  <div className="portal-meter"><span style={{ width: `${percentage}%` }} /></div>
                  <p>{item.attendedClasses || 0} present, {Math.max(0, Number(item.totalClasses || 0) - Number(item.attendedClasses || 0))} absent</p>
                  {isTeacher && <button className="portal-button soft" type="button" onClick={() => edit(item)}>Edit</button>}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="portal-empty"><h4>No attendance records</h4><p>Attendance will appear here once marked by a teacher.</p></div>
        )}
      </section>
    </div>
  );
}
