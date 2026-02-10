import React, { useContext, useEffect, useState, useRef } from "react";
import { getAssignments, addAssignment, deleteAssignment, updateAssignment } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/assignments.css";
import { AuthContext } from "../context/AuthContext";

export default function AssignmentsPage() {
  const { user } = useContext(AuthContext);
  const isTeacher = user?.role === "INSTRUCTOR";
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    overdue: 0,
    averageMarks: 0,
    highestMarks: 0
  });
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'overdue'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxMarks: "",
    priority: "medium"
  });

  const formRef = useRef(null);

  // Load assignments on page load
  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [assignments]);

  const calculateStats = () => {
    const now = new Date();
    const upcoming = assignments.filter(a => new Date(a.dueDate) > now).length;
    const overdue = assignments.filter(a => new Date(a.dueDate) < now).length;
    const totalMarks = assignments.reduce((sum, a) => sum + Number(a.maxMarks || 0), 0);
    const highestMarks = assignments.reduce((max, a) => Math.max(max, Number(a.maxMarks || 0)), 0);
    const averageMarks = assignments.length > 0 ? Math.round(totalMarks / assignments.length) : 0;

    setStats({
      total: assignments.length,
      upcoming,
      overdue,
      averageMarks,
      highestMarks
    });
  };

  const fetchAssignments = () => {
    setLoading(true);
    getAssignments()
      .then(res => {
        setAssignments(res.data);
        toast.success("Assignments loaded successfully!");
      })
      .catch(err => {
        console.error("Failed to fetch assignments", err);
        toast.error("Failed to load assignments. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validation
    if (!form.title.trim()) {
      toast.error("Title is required");
      setSubmitting(false);
      return;
    }

    if (!form.dueDate) {
      toast.error("Due date is required");
      setSubmitting(false);
      return;
    }

    const maxMarks = Number(form.maxMarks);
    if (isNaN(maxMarks) || maxMarks < 0) {
      toast.error("Max marks must be a positive number");
      setSubmitting(false);
      return;
    }

    const assignmentData = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      maxMarks: maxMarks,
      status: new Date(form.dueDate) > new Date() ? 'upcoming' : 'overdue'
    };

    if (editingId) {
      // Update existing assignment
      updateAssignment(editingId, assignmentData)
        .then(() => {
          toast.success("Assignment updated successfully!");
          setForm({ title: "", description: "", dueDate: "", maxMarks: "", priority: "medium" });
          setEditingId(null);
          fetchAssignments();
          setShowForm(false);
        })
        .catch(err => {
          console.error("Failed to update assignment", err);
          toast.error(err.response?.data?.message || "Failed to update assignment");
        })
        .finally(() => setSubmitting(false));
    } else {
      // Add new assignment
      addAssignment(assignmentData)
        .then(() => {
          toast.success("Assignment added successfully!");
          setForm({ title: "", description: "", dueDate: "", maxMarks: "", priority: "medium" });
          fetchAssignments();
          setShowForm(false);
        })
        .catch(err => {
          console.error("Failed to add assignment", err);
          toast.error(err.response?.data?.message || "Failed to add assignment");
        })
        .finally(() => setSubmitting(false));
    }
  };

  const handleEdit = (assignment) => {
    setForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate.split('T')[0],
      maxMarks: assignment.maxMarks,
      priority: assignment.priority || "medium"
    });
    setEditingId(assignment.assignmentId);
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment(id)
        .then(() => {
          toast.success("Assignment deleted successfully!");
          fetchAssignments();
        })
        .catch(err => {
          console.error("Failed to delete assignment", err);
          toast.error("Failed to delete assignment");
        });
    }
  };

  const handleCancel = () => {
    setForm({ title: "", description: "", dueDate: "", maxMarks: "", priority: "medium" });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f56565';
      case 'medium': return '#ed8936';
      case 'low': return '#48bb78';
      default: return '#667eea';
    }
  };

  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'upcoming') return matchesSearch && new Date(assignment.dueDate) > new Date();
    if (filter === 'overdue') return matchesSearch && new Date(assignment.dueDate) < new Date();
    
    return matchesSearch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="assignments-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="page-header fw-bold display-5 mb-2">Assignments Dashboard</h1>
          <p className="text-muted">Manage and track all your assignments in one place</p>
        </div>
        <div className="d-flex gap-3">
          <div className="input-group" style={{ width: '300px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control form-control-modern border-start-0"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isTeacher && (
            <button 
              className="btn-modern d-flex align-items-center gap-2"
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setForm({ title: "", description: "", dueDate: "", maxMarks: "", priority: "medium" });
              }}
            >
              <i className="bi bi-plus-lg"></i>
              {showForm ? 'Cancel' : 'New Assignment'}
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="row mb-5 g-4">
        <div className="col-md-3">
          <div className="stats-card primary hover-lift">
            <i className="bi bi-journal-check display-6 mb-3 text-primary"></i>
            <h3 className="stats-number">{stats.total}</h3>
            <p className="text-muted mb-0">Total Assignments</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card success hover-lift">
            <i className="bi bi-calendar-check display-6 mb-3 text-success"></i>
            <h3 className="stats-number">{stats.upcoming}</h3>
            <p className="text-muted mb-0">Upcoming</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card warning hover-lift">
            <i className="bi bi-exclamation-triangle display-6 mb-3 text-warning"></i>
            <h3 className="stats-number">{stats.overdue}</h3>
            <p className="text-muted mb-0">Overdue</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stats-card hover-lift">
            <i className="bi bi-bar-chart display-6 mb-3 text-info"></i>
            <h3 className="stats-number">{stats.averageMarks}</h3>
            <p className="text-muted mb-0">Avg Marks</p>
          </div>
        </div>
      </div>

      {/* Assignment Form - Conditionally Rendered */}
      {showForm && isTeacher && (
        <div className="card form-modern p-4 mb-5" ref={formRef}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              <i className="bi bi-pencil-square me-2"></i>
              {editingId ? 'Edit Assignment' : 'Create New Assignment'}
            </h4>
            <span className="badge-modern">
              <i className="bi bi-lightning-fill"></i>
              {editingId ? 'Edit Mode' : 'Create Mode'}
            </span>
          </div>
          
          <form onSubmit={handleSubmit} className="row g-4">
            <div className="col-md-6">
              <label htmlFor="title" className="form-label-modern">
                <i className="bi bi-card-heading"></i> Assignment Title *
              </label>
              <input
                id="title"
                name="title"
                required
                className="form-control form-control-modern"
                placeholder="Enter assignment title"
                value={form.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="dueDate" className="form-label-modern">
                <i className="bi bi-calendar-date"></i> Due Date *
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="form-control form-control-modern"
                value={form.dueDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="maxMarks" className="form-label-modern">
                <i className="bi bi-trophy"></i> Maximum Marks
              </label>
              <input
                id="maxMarks"
                name="maxMarks"
                type="number"
                min="0"
                max="1000"
                className="form-control form-control-modern"
                placeholder="e.g., 100"
                value={form.maxMarks}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="priority" className="form-label-modern">
                <i className="bi bi-flag"></i> Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                className="form-control form-control-modern"
                value={form.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label-modern">
                <i className="bi bi-text-paragraph"></i> Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control form-control-modern"
                placeholder="Enter assignment description (optional)"
                rows="3"
                value={form.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-12 mt-3">
              <div className="d-flex gap-3">
                <button 
                  type="submit" 
                  className="btn-modern px-5"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {editingId ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className={`bi ${editingId ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                      {editingId ? 'Update Assignment' : 'Create Assignment'}
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4"
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="d-flex gap-3 mb-4">
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-4`}
          onClick={() => setFilter('all')}
        >
          All Assignments ({assignments.length})
        </button>
        <button 
          className={`btn ${filter === 'upcoming' ? 'btn-success' : 'btn-outline-success'} rounded-pill px-4`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming ({stats.upcoming})
        </button>
        <button 
          className={`btn ${filter === 'overdue' ? 'btn-danger' : 'btn-outline-danger'} rounded-pill px-4`}
          onClick={() => setFilter('overdue')}
        >
          Overdue ({stats.overdue})
        </button>
      </div>

      {/* Assignments List */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">
            <i className="bi bi-list-task me-2"></i>
            {filter === 'all' ? 'All Assignments' : filter === 'upcoming' ? 'Upcoming Assignments' : 'Overdue Assignments'}
            <span className="badge bg-primary ms-3">{filteredAssignments.length}</span>
          </h4>
          <div className="text-muted">
            Showing {filteredAssignments.length} of {assignments.length} assignments
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="loading-spinner mb-3"></div>
            <h5 className="text-muted">Loading assignments...</h5>
            <p className="text-muted">Please wait while we fetch your data</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-5 assignment-card-glass">
            <i className="bi bi-clipboard-x display-1 text-muted mb-4"></i>
            <h4 className="mb-3">No assignments found</h4>
            <p className="text-muted mb-4">
              {searchTerm ? 'No assignments match your search' : 'Start by creating your first assignment'}
            </p>
            {isTeacher && (
              <button 
                className="btn-modern"
                onClick={() => setShowForm(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Create Assignment
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {filteredAssignments.map(assignment => {
              const daysRemaining = getDaysRemaining(assignment.dueDate);
              const isOverdue = daysRemaining < 0;
              const isDueSoon = daysRemaining >= 0 && daysRemaining <= 3;
              
              return (
                <div key={assignment.assignmentId} className="col-lg-6">
                  <div className={`assignment-item ${isOverdue ? 'overdue' : 'upcoming'} hover-lift`}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h5 className="fw-bold mb-0">{assignment.title}</h5>
                          <span className="assignment-marks">
                            {assignment.maxMarks} pts
                          </span>
                          <span 
                            className="badge rounded-pill"
                            style={{ 
                              backgroundColor: getPriorityColor(assignment.priority || 'medium'),
                              color: 'white'
                            }}
                          >
                            {assignment.priority || 'medium'}
                          </span>
                        </div>
                        {assignment.description && (
                          <p className="text-muted mb-3">{assignment.description}</p>
                        )}
                      </div>
                      {isTeacher && (
                        <div className="dropdown">
                          <button 
                            className="btn btn-sm btn-outline-secondary border-0"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => handleEdit(assignment)}
                              >
                                <i className="bi bi-pencil me-2"></i> Edit
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(assignment.assignmentId)}
                              >
                                <i className="bi bi-trash me-2"></i> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <span className={`badge ${isOverdue ? 'bg-danger' : isDueSoon ? 'bg-warning' : 'bg-success'}`}>
                          <i className="bi bi-clock me-1"></i>
                          {formatDate(assignment.dueDate)}
                        </span>
                        <span className="text-muted ms-3">
                          <i className="bi bi-hash me-1"></i>
                          ID: {assignment.assignmentId}
                        </span>
                      </div>
                      
                      {/* Progress indicator */}
                      <div style={{ width: '100px' }}>
                        <div className="progress-container">
                          <div 
                            className="progress-bar" 
                            style={{ 
                              width: `${isOverdue ? 100 : Math.max(0, Math.min(100, (1 - daysRemaining/30) * 100))}%`,
                              backgroundColor: isOverdue ? '#f56565' : isDueSoon ? '#ed8936' : '#48bb78'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Stats Panel */}
      <div className="card assignment-card-glass p-4 mb-5">
        <h5 className="fw-bold mb-4">
          <i className="bi bi-graph-up me-2"></i>
          Assignment Insights
        </h5>
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded-3">
              <div className="text-primary fw-bold fs-4">{stats.highestMarks}</div>
              <div className="text-muted small">Highest Marks</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded-3">
              <div className="text-success fw-bold fs-4">{stats.upcoming}</div>
              <div className="text-muted small">Upcoming Assignments</div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-light rounded-3">
              <div className="text-warning fw-bold fs-4">
                {assignments.length > 0 ? Math.round((stats.overdue / assignments.length) * 100) : 0}%
              </div>
              <div className="text-muted small">Overdue Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      {!showForm && isTeacher && (
        <div 
          className="fab"
          onClick={() => setShowForm(true)}
          title="Create New Assignment"
        >
          <i className="bi bi-plus-lg"></i>
        </div>
      )}
    </div>
  );
}
