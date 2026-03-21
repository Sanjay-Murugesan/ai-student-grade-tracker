import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProfile } from "../services/api";
import "../pages/ProfilePage.css";

    
export default function ProfilePage() {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      try {
        const res = await getProfile(user.id);
        setProfile(res.data || {});
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Unable to load profile data.");
      }
    }
    fetchData();
  }, [user?.id]);

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
          {error && (
            <div>
              <label>Status</label>
              <p>{error}</p>
            </div>
          )}
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
