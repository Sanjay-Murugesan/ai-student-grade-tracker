import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/api";
import "../styles/portal.css";

export default function ProfilePage() {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getProfile(user.id);
        if (!active) return;
        const data = response?.data || {};
        setProfile(data);
        setForm(data);
      } catch (err) {
        if (!active) return;
        console.error("Profile load failed", err);
        setError("We could not load your profile right now.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [user?.id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!user?.id) return;

    try {
      setSaving(true);
      setError("");
      setMessage("");
      await updateProfile(user.id, form);
      setProfile(form);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update failed", err);
      setError("Profile update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const displayName = profile.name || user?.name || user?.username || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="portal-page">
        <div className="portal-hero">
          <div className="portal-hero-copy">
            <div className="portal-kicker">Account center</div>
            <h1>Loading your profile...</h1>
            <p>Your account details and editable fields are being prepared.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="portal-hero-copy">
          <div className="portal-kicker">Account center</div>
          <h1>{displayName}</h1>
          <p>Keep your personal details current so dashboards and role-based views stay accurate.</p>
        </div>

        <div className="portal-hero-side">
          <div className="portal-glass">
            <strong>{user?.role || "Account"}</strong>
            <p>{profile.email || user?.email || "No email saved yet"}</p>
          </div>
        </div>
      </section>

      {error ? <div className="portal-error">{error}</div> : null}
      {message ? <div className="portal-banner"><h3>Saved</h3><p>{message}</p></div> : null}

      <section className="portal-grid-equal">
        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Profile summary</h3>
              <p className="portal-card-subtitle">The details currently stored for your account.</p>
            </div>
          </div>

          <div className="portal-list-item" style={{ alignItems: "center" }}>
            <div className="sgt-avatar sgt-avatar-lg">{initials}</div>
            <div>
              <strong>{displayName}</strong>
              <p>{user?.role || "User"}</p>
            </div>
          </div>

          <div className="portal-stack" style={{ marginTop: 16 }}>
            <div className="portal-list-item">
              <div>
                <strong>Username</strong>
                <p>{profile.username || user?.username || "Not available"}</p>
              </div>
            </div>
            <div className="portal-list-item">
              <div>
                <strong>Email</strong>
                <p>{profile.email || "No email saved"}</p>
              </div>
            </div>
            <div className="portal-list-item">
              <div>
                <strong>Department</strong>
                <p>{profile.department || "Not set"}</p>
              </div>
            </div>
            <div className="portal-list-item">
              <div>
                <strong>Year</strong>
                <p>{profile.year || "Not set"}</p>
              </div>
            </div>
          </div>

          <div className="portal-actions" style={{ marginTop: 18 }}>
            <button className="portal-button primary" onClick={() => setEditing((current) => !current)}>
              {editing ? "Close editor" : "Edit profile"}
            </button>
            <button className="portal-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </article>

        <article className="portal-card">
          <div className="portal-card-header">
            <div>
              <h3 className="portal-card-title">Edit details</h3>
              <p className="portal-card-subtitle">Update the fields that shape your account identity.</p>
            </div>
          </div>

          {editing ? (
            <form className="portal-stack" onSubmit={handleSave}>
              <div className="portal-field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" value={form.name || ""} onChange={handleChange} />
              </div>
              <div className="portal-field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={form.email || ""} onChange={handleChange} />
              </div>
              <div className="portal-field">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  name="department"
                  value={form.department || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="portal-field">
                <label htmlFor="year">Year</label>
                <select id="year" name="year" value={form.year || ""} onChange={handleChange}>
                  <option value="">Select year</option>
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>

              <div className="portal-actions">
                <button className="portal-button primary" disabled={saving} type="submit">
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  className="portal-button soft"
                  onClick={() => {
                    setForm(profile);
                    setEditing(false);
                  }}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="portal-empty">
              <h4>Profile editor is closed</h4>
              <p>Open the editor when you want to update account details.</p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
