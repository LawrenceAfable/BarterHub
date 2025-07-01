import { useState, useEffect } from "react";
import styles from "./user-profile-edit-modal.module.css";

export default function UserProfileEditModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    location: "",
    profile_picture: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        password: "",
        location: user.location || "",
        profile_picture: user.profile_picture || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    const formDataToSend = new FormData();

    // Append all other fields except profile_picture first
    for (const key of ["name", "username", "email", "location", "password"]) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Append profile_picture if it's a file
    if (formData.profile_picture && formData.profile_picture instanceof File) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }

    try {
      const res = await fetch(import.meta.env.VITE_PROFILE_API, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      alert("Profile updated successfully!");
      onSuccess(updatedUser);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.inputField}
          />
          <label>Username:</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={styles.inputField}
          />
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.inputField}
          />
          <label>Password (leave blank to keep unchanged):</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.inputField}
            autoComplete="new-password"
          />
          <label>Location:</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={styles.inputField}
          />
          <label>Profile Picture:</label>
          <input
            name="profile_picture"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                profile_picture: e.target.files[0], 
              }));
            }}
            className={styles.inputField}
          />
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
