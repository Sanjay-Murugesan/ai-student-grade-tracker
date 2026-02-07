import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        <NavLink className="navbar-brand fw-bold" to="/">
          AI Student Tracker
        </NavLink>

        <button className="navbar-toggler" type="button" 
                data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
             <NavLink className="nav-link" to="/students">Students</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/assignments">Assignments</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/grades">Grades</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/ai">AI Prediction</NavLink>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}
