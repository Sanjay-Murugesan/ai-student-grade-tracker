import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProfile } from "../services/api";
import "../pages/ProfilePage.css";

    
export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function fetchData() {
      const res = await getProfile();
      setProfile(res.data);
    }
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {(profile.name || profile.username || "U")[0]?.toUpperCase()}
          </div>
          <div>
            <h3>{profile.name || profile.username}</h3>
            <p>{profile.role}</p>
          </div>
        </div>

        <div className="profile-info-grid">
          <div>
            <label>Username</label>
            <p>{profile.username}</p>
          </div>

          <div>
            <label>Email</label>
            <p>{profile.email}</p>
          </div>

          {profile.department && (
            <div>
              <label>Department</label>
              <p>{profile.department}</p>
            </div>
          )}

          {profile.year && (
            <div>
              <label>Year</label>
              <p>{profile.year}</p>
            </div>
          )}

          {profile.gpa && (
            <div>
              <label>GPA</label>
              <p>{profile.gpa.toFixed(2)}</p>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="btn btn-primary">Edit Profile</button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
