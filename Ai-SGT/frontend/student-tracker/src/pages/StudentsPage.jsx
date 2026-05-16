// src/pages/StudentsPage.jsx

import React, { useEffect, useState } from "react";
import { getAllStudents } from "../services/api";

import "../styles/theme.css";

const StudentCard = ({ student, onDelete }) => {

  const initials = student.name
    ? student.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "S";

  return (
    <div className="card">

      <div className="card-left">

        <div className="avatar">
          {initials}
        </div>

        <div>

          <div className="card-title">
            {student.name}
          </div>

          <div className="card-sub">
            {student.email} • {student.department} • Year {student.year}
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "13px",
              color: "#6b7280",
            }}
          >
            CGPA: {student.cgpa || 0} • Attendance:{" "}
            {student.attendancePercentage || 0}%
          </div>

        </div>
      </div>

      <div className="card-actions">

        <div className="badge gray">
          Student
        </div>

        <button className="btn btn-primary">
          View
        </button>

        <button className="btn btn-warning">
          Prediction
        </button>

        <button
          className="btn btn-danger"
          onClick={() => onDelete(student.studentId)}
        >
          <i className="fa fa-trash" aria-hidden />
          {" "}Delete
        </button>

      </div>
    </div>
  );
};

export default function StudentsPage() {

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    year: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {

    try {

      const res = await getAllStudents();

      setStudents(Array.isArray(res.data) ? res.data : []);

    } catch (err) {

      console.error("Failed to load students", err);

    } finally {

      setLoading(false);

    }
  };

  const handleAdd = (e) => {

    e.preventDefault();

    alert(
      "Backend add student API not connected yet."
    );

    setShowAdd(false);
  };

  const handleDelete = (id) => {

    if (!window.confirm("Delete student?")) return;

    setStudents((prev) =>
      prev.filter((s) => s.studentId !== id)
    );
  };

  const filteredStudents = students.filter((s) => {

    const term = search.toLowerCase();

    return (
      (s.name || "")
        .toLowerCase()
        .includes(term) ||

      (s.email || "")
        .toLowerCase()
        .includes(term)
    );
  });

  if (loading) {
    return (
      <div className="page-title">
        Loading students...
      </div>
    );
  }

  return (
    <div className="app-container">

      {/* ================= HEADER ================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >

        <div>

          <h1 className="page-title">
            Students Management
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "-10px",
            }}
          >
            View and manage all students
          </p>

        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAdd(true)}
        >
          + New Student
        </button>

      </div>

      {/* ================= FILTER PANEL ================= */}

      <div className="panel">

        <div
          className="form-row"
          style={{
            marginTop: 8,
          }}
        >

          <input
            placeholder="Search student by name or email"
            className="input"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select className="input">

            <option>
              All departments
            </option>

            <option>
              IT
            </option>

            <option>
              CSE
            </option>

            <option>
              ECE
            </option>

          </select>

          <button className="btn btn-ghost">
            Filter
          </button>

        </div>

      </div>

      {/* ================= STUDENT LIST ================= */}

      <div className="cards-list">

        {filteredStudents.length === 0 ? (

          <div className="panel empty">

            No students found.

          </div>

        ) : (

          filteredStudents.map((student) => (

            <StudentCard
              key={student.studentId}
              student={student}
              onDelete={handleDelete}
            />

          ))

        )}

      </div>

      {/* ================= ADD STUDENT MODAL ================= */}

      {showAdd && (

        <div
          className="modal-backdrop"
          onClick={() => setShowAdd(false)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <h3>Add Student</h3>

            <form
              onSubmit={handleAdd}
              style={{
                display: "grid",
                gap: 10,
              }}
            >

              <input
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Full name"
              />

              <input
                className="input"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="Email"
                type="email"
              />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >

                <input
                  className="input"
                  value={form.department}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      department: e.target.value,
                    })
                  }
                  placeholder="Department"
                />

                <input
                  className="input"
                  value={form.year}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      year: e.target.value,
                    })
                  }
                  placeholder="Year"
                />

              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "flex-end",
                }}
              >

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}