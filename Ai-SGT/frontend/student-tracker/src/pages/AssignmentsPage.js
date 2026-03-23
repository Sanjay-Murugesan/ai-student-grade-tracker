import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getAssignments, addAssignment, updateAssignment, deleteAssignment,
} from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/assignments.css";

const EMPTY = {
  title: "", description: "", dueDate: "", maxMarks: "", priority: "medium",
};

function dueBadge(dueDate) {
  if (!dueDate) return { label: "No due date", cls: "no-date" };
  const diff = Math.ceil((new Date(dueDate) - new Date()) / 86400000);
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`,  cls: "overdue"  };
  if (diff === 0) return { label: "Due today",                   cls: "due-soon" };
  if (diff <= 3)  return { label: `Due in ${diff}d`,             cls: "due-soon" };
  return { label: new Date(dueDate).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }), cls: "upcoming" };
}

export default function AssignmentsPage() {
  const { user }    = useContext(AuthContext);
  const isTeacher   = user?.role === "INSTRUCTOR";

  const [assignments, setAssignments] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [editingId,   setEditingId]   = useState(null);
  const [filter,      setFilter]      = useState("all");
  const [search,      setSearch]      = useState("");
  const [form,        setForm]        = useState(EMPTY);
  const formRef = useRef(null);

  /* ── Fetch ── */
  const fetchAssignments = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await getAssignments();
      setAssignments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total:    assignments.length,
      upcoming: assignments.filter(a => a.dueDate && new Date(a.dueDate) > now).length,
      overdue:  assignments.filter(a => a.dueDate && new Date(a.dueDate) < now).length,
      avgMarks: assignments.length
        ? Math.round(assignments.reduce((s, a) => s + Number(a.maxMarks || 0), 0) / assignments.length)
        : 0,
      highestMarks: assignments.reduce((m, a) => Math.max(m, Number(a.maxMarks || 0)), 0),
    };
  }, [assignments]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const now  = new Date();
    const term = search.toLowerCase();
    return assignments.filter(a => {
      const matchSearch =
        (a.title       || "").toLowerCase().includes(term) ||
        (a.description || "").toLowerCase().includes(term);
      if (filter === "upcoming") return matchSearch && a.dueDate && new Date(a.dueDate) > now;
      if (filter === "overdue")  return matchSearch && a.dueDate && new Date(a.dueDate) < now;
      return matchSearch;
    });
  }, [assignments, filter, search]);

  /* ── Submit (create / update) — duplication guard ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required."); return; }

    /* ── Duplicate check (client-side guard) ── */
    if (!editingId) {
      const duplicate = assignments.some(
        (a) => a.title.trim().toLowerCase() === form.title.trim().toLowerCase()
      );
      if (duplicate) {
        toast.error("An assignment with this title already exists.");
        return;
      }
    }

    setSubmitting(true);
    const payload = {
      ...form,
      title:    form.title.trim(),
      description: form.description.trim(),
      maxMarks: Number(form.maxMarks) || 0,
    };

    try {
      if (editingId) {
        await updateAssignment(editingId, payload);
        toast.success("Assignment updated!");
      } else {
        await addAssignment(payload);
        toast.success("Assignment created!");
      }
      setForm(EMPTY);
      setEditingId(null);
      setShowForm(false);
      await fetchAssignments(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Edit ── */
  const handleEdit = (a) => {
    setForm({
      title:       a.title       || "",
      description: a.description || "",
      dueDate:     a.dueDate     ? a.dueDate.split("T")[0] : "",
      maxMarks:    a.maxMarks    ?? "",
      priority:    a.priority    || "medium",
    });
    setEditingId(a.assignmentId);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await deleteAssignment(id);
      toast.success("Assignment deleted.");
      await fetchAssignments(true);
    } catch {
      toast.error("Failed to delete assignment.");
    }
  };

  const handleCancel = () => {
    setForm(EMPTY); setEditingId(null); setShowForm(false);
  };

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  return (
    <div className="assignments-page">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* ── Header ── */}
      <div className="asgn-header">
        <div className="asgn-header-left">
          <h1>Assignments Dashboard</h1>
          <p>Manage and track all assignments in one place</p>
        </div>
        <div className="asgn-header-right">
          {/* Search */}
          <div className="asgn-search">
            <svg viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              placeholder="Search assignments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* New button (teacher only) */}
          {isTeacher && (
            <button className="asgn-new-btn" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(EMPTY); }}>
              + {showForm && !editingId ? "Cancel" : "New Assignment"}
            </button>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="asgn-stats">
        {[
          { icon: "📋", value: stats.total,    label: "Total",    cls: "blue"   },
          { icon: "📅", value: stats.upcoming, label: "Upcoming", cls: "green"  },
          { icon: "⚠️", value: stats.overdue,  label: "Overdue",  cls: "red"    },
          { icon: "📊", value: stats.avgMarks, label: "Avg Marks",cls: "yellow" },
        ].map((s) => (
          <div key={s.label} className="asgn-stat">
            <div className={`asgn-stat-icon ${s.cls}`}>{s.icon}</div>
            <div className="asgn-stat-body">
              <div className="asgn-stat-value">{s.value}</div>
              <div className="asgn-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Create / Edit form ── */}
      {showForm && isTeacher && (
        <div className="asgn-form-card" ref={formRef}>
          <div className="asgn-form-header">
            <div className="asgn-form-title">
              {editingId ? "✏️ Edit Assignment" : "➕ Create Assignment"}
            </div>
            <span className="asgn-mode-badge">
              {editingId ? "EDIT MODE" : "CREATE MODE"}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="asgn-form-grid">
              {/* Title */}
              <div className="sgt-form-group">
                <label className="sgt-label">Title *</label>
                <input name="title" required className="sgt-input"
                  placeholder="Assignment title" value={form.title} onChange={handle} />
              </div>

              {/* Due date */}
              <div className="sgt-form-group">
                <label className="sgt-label">Due Date</label>
                <input name="dueDate" type="date" className="sgt-input"
                  value={form.dueDate} onChange={handle}
                  min={new Date().toISOString().split("T")[0]} />
              </div>

              {/* Max marks */}
              <div className="sgt-form-group">
                <label className="sgt-label">Max Marks</label>
                <input name="maxMarks" type="number" min="0" max="1000"
                  className="sgt-input" placeholder="e.g. 100"
                  value={form.maxMarks} onChange={handle} />
              </div>

              {/* Priority */}
              <div className="sgt-form-group">
                <label className="sgt-label">Priority</label>
                <select name="priority" className="sgt-input" value={form.priority} onChange={handle}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Description */}
              <div className="sgt-form-group asgn-form-full">
                <label className="sgt-label">Description</label>
                <textarea name="description" className="sgt-input" rows={3}
                  placeholder="Optional description…"
                  value={form.description} onChange={handle}
                  style={{ resize: "vertical" }} />
              </div>
            </div>

            <div className="asgn-form-actions">
              <button type="submit" className="asgn-form-submit" disabled={submitting}>
                {submitting
                  ? <><span style={{ width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"asgn-spin 0.7s linear infinite" }} /> Saving…</>
                  : editingId ? "Update Assignment" : "Create Assignment"}
              </button>
              <button type="button" className="asgn-form-cancel" onClick={handleCancel} disabled={submitting}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Filter tabs ── */}
      <div className="asgn-filters">
        {[
          { key: "all",      label: `All Assignments (${stats.total})`,    activeCls: "active"        },
          { key: "upcoming", label: `Upcoming (${stats.upcoming})`,         activeCls: "active"        },
          { key: "overdue",  label: `Overdue (${stats.overdue})`,           activeCls: "active-danger" },
        ].map((f) => (
          <button
            key={f.key}
            className={`asgn-filter-btn ${filter === f.key ? f.activeCls : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── List header ── */}
      <div className="asgn-list-header">
        <div className="asgn-list-title">
          📋 {filter === "all" ? "All Assignments" : filter === "upcoming" ? "Upcoming" : "Overdue"}
          <span className="asgn-count-badge">{filtered.length}</span>
        </div>
        <span className="asgn-showing">
          Showing {filtered.length} of {assignments.length}
        </span>
      </div>

      {/* ── Cards ── */}
      {loading ? (
        <div className="asgn-loading">
          <div className="asgn-spinner" />
          Loading assignments…
        </div>
      ) : filtered.length === 0 ? (
        <div className="asgn-empty">
          <div className="asgn-empty-icon">📭</div>
          <h4>No assignments found</h4>
          <p>{search ? "No assignments match your search." : "No assignments yet."}</p>
          {isTeacher && !search && (
            <button className="asgn-new-btn" onClick={() => setShowForm(true)}>
              + Create First Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="asgn-grid">
          {filtered.map((a) => {
            const { label, cls } = dueBadge(a.dueDate);
            const daysLeft = a.dueDate
              ? Math.ceil((new Date(a.dueDate) - new Date()) / 86400000)
              : null;
            const progress = daysLeft === null ? 0
              : daysLeft < 0 ? 100
              : Math.max(0, Math.min(100, (1 - daysLeft / 30) * 100));

            return (
              <div
                key={a.assignmentId}
                className={`asgn-card ${cls}`}
              >
                {/* Top row */}
                <div className="asgn-card-top">
                  <div style={{ flex: 1 }}>
                    <div className="asgn-card-title">{a.title}</div>
                    <div className="asgn-card-meta">
                      <span className="asgn-pts-badge">{a.maxMarks ?? 0} pts</span>
                      <span
                        className={`asgn-priority-badge ${a.priority || "medium"}`}
                      >
                        {a.priority || "medium"}
                      </span>
                    </div>
                  </div>

                  {/* Edit / Delete (teacher only) */}
                  {isTeacher && (
                    <div className="asgn-card-actions">
                      <button
                        className="asgn-action-btn"
                        title="Edit"
                        onClick={() => handleEdit(a)}
                      >✏️</button>
                      <button
                        className="asgn-action-btn danger"
                        title="Delete"
                        onClick={() => handleDelete(a.assignmentId)}
                      >🗑️</button>
                    </div>
                  )}
                </div>

                {/* Description */}
                {a.description && (
                  <p className="asgn-card-desc">{a.description}</p>
                )}

                {/* Footer */}
                <div className="asgn-card-footer">
                  <span className={`asgn-due-badge ${cls}`}>
                    🕐 {label}
                  </span>
                  <span className="asgn-id"># ID: {a.assignmentId}</span>
                  <div className="asgn-progress">
                    <div
                      className="asgn-progress-fill"
                      style={{
                        width: `${progress}%`,
                        background: cls === "overdue" ? "#ef4444"
                          : cls === "due-soon" ? "#f59e0b" : "#10b981",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Insights ── */}
      <div className="asgn-insights">
        <div className="asgn-insights-title">📈 Assignment Insights</div>
        <div className="asgn-insights-grid">
          {[
            { value: stats.highestMarks, label: "Highest Marks",    color: "#3b82f6" },
            { value: stats.upcoming,     label: "Upcoming",          color: "#10b981" },
            { value: stats.total > 0
                ? `${Math.round((stats.overdue / stats.total) * 100)}%`
                : "0%",               label: "Overdue Rate",         color: "#f59e0b" },
          ].map((i) => (
            <div key={i.label} className="asgn-insight-item">
              <div className="asgn-insight-value" style={{ color: i.color }}>
                {i.value}
              </div>
              <div className="asgn-insight-label">{i.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
