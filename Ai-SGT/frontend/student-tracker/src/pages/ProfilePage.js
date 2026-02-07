import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getProfile, updateProfile } from "../services/api";
import "../styles/profile.css";

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const [profile, setProfile] = useState(user || {});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            setProfile(res.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateProfile(profile);
            setEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    return (
        <div className="container-fluid p-4">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card">
                        <div className="card-header bg-primary text-white">
                            <h2>My Profile</h2>
                        </div>
                        <div className="card-body">
                            {editing ? (
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={profile.name || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={profile.email || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {profile.department && (
                                        <div className="mb-3">
                                            <label className="form-label">Department</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="department"
                                                value={profile.department || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}

                                    {profile.year && (
                                        <div className="mb-3">
                                            <label className="form-label">Year</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="year"
                                                value={profile.year || ""}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-success me-2"
                                            onClick={handleSave}
                                            disabled={loading}
                                        >
                                            {loading ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="profile-info">
                                        <p><strong>Username:</strong> {profile.username}</p>
                                        <p><strong>Email:</strong> {profile.email}</p>
                                        <p><strong>Role:</strong> {profile.role}</p>
                                        {profile.department && <p><strong>Department:</strong> {profile.department}</p>}
                                        {profile.year && <p><strong>Year:</strong> {profile.year}</p>}
                                        {profile.gpa && <p><strong>GPA:</strong> {profile.gpa?.toFixed(2)}</p>}
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => setEditing(true)}
                                        >
                                            Edit Profile
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
