// src/pages/StudentsPage.jsx
import React, { useState } from 'react';
import '../styles/theme.css'; // or ../styles/theme.css depending on location

const StudentCard = ({ student, onDelete }) => {
  const initials = student.fullName ? student.fullName.split(' ').map(n=>n[0]).slice(0,2).join('') : 'S';
  return (
    <div className="card">
      <div className="card-left">
        <div className="avatar">{initials}</div>
        <div>
          <div className="card-title">{student.fullName}</div>
          <div className="card-sub">{student.email} • {student.department} • Year {student.year}</div>
        </div>
      </div>

      <div className="card-actions">
        <div className="badge gray">Student</div>
        <button className="btn btn-danger" onClick={() => onDelete(student.id)}>
          <i className="fa fa-trash" aria-hidden/> Delete
        </button>
      </div>
    </div>
  );
};

export default function StudentsPage(){
  // sample initial student, replace with backend fetch
  const [students, setStudents] = useState([
    { id:1, fullName:'Sanjay M', email:'mssanjay4444@gmail.com', department:'IT', year:3 }
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ fullName:'', email:'', department:'', year:'' });

  const handleAdd = (e) => {
    e.preventDefault();
    if(!form.fullName || !form.email) return alert('Please enter name & email');
    const newS = { ...form, id: Date.now() };
    setStudents(prev => [newS, ...prev]);
    setForm({ fullName:'', email:'', department:'', year:'' });
    setShowAdd(false);
  };

  const handleDelete = (id) => {
    if(!window.confirm('Delete student?')) return;
    setStudents(prev => prev.filter(s=>s.id !== id));
  };

  return (
    <div>
      <div className="topbar">
        <div className="inner">
          <div className="brand">AI Student Tracker</div>
          <nav className="navlinks">
            <a href="/students" className="active">Students</a>
            <a href="/assignments">Assignments</a>
            <a href="/grades">Grades</a>
            <a href="/ai">AI Prediction</a>
          </nav>
        </div>
      </div>

      <div className="app-container">
        <h1 className="page-title">Students</h1>

        <div className="panel">
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
            <div style={{fontWeight:700}}>Add Student</div>
            <div style={{marginLeft:'auto'}}>
              <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ New Student</button>
            </div>
          </div>

          <div style={{height:12}}/>

          {/* quick filters row (optional) */}
          <div className="form-row" style={{marginTop:8}}>
            <input placeholder="Search student by name or email" className="input" onChange={(e)=>{/* implement search */}} />
            <select className="input">
              <option>All departments</option>
              <option>IT</option>
              <option>Math</option>
              <option>English</option>
            </select>
            <button className="btn btn-ghost">Filter</button>
          </div>
        </div>

        <div className="cards-list">
          {students.length === 0 ? (
            <div className="panel empty">
              No students yet — click <strong>New Student</strong> to add one.
            </div>
          ) : (
            students.map(s => <StudentCard key={s.id} student={s} onDelete={handleDelete} />)
          )}
        </div>
      </div>

      {showAdd && (
        <div className="modal-backdrop" onClick={()=>setShowAdd(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3>Add Student</h3>
            <form onSubmit={handleAdd} style={{display:'grid', gap:10}}>
              <input className="input" value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} placeholder="Full name"/>
              <input className="input" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" type="email"/>
              <div style={{display:'flex', gap:10}}>
                <input className="input" value={form.department} onChange={e=>setForm({...form, department:e.target.value})} placeholder="Department"/>
                <input className="input" value={form.year} onChange={e=>setForm({...form, year:e.target.value})} placeholder="Year"/>
              </div>
              <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
                <button type="button" className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
