import React, { useState } from "react";
import { useUpdateAdminPasswordMutation } from "../../store/api/apiSlice";
import styles from "./Settings.module.css";

const Settings = () => {
  const [updateAdminPassword, { isLoading, isSuccess, isError, error }] =
    useUpdateAdminPasswordMutation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long.");
      return;
    }

    try {
      const result = await updateAdminPassword({
        oldPassword,
        newPassword,
      }).unwrap();
      setMessage(result.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.data?.message || "An error occurred.");
    }
  };

  return (
    <div className={styles.settingsPage}>
      <h1>Settings</h1>
      <div className={styles.settingsContainer}>
        <div className={styles.settingCard}>
          <h2>Change Password</h2>
          <form
            onSubmit={handlePasswordChange}
            className={styles.passwordForm}
          >
            <div className={styles.formGroup}>
              <label htmlFor="oldPassword">Old Password</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showOldPassword ? "text" : "password"}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  <i className={`fas ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
            {message && (
              <p
                className={`${styles.message} ${
                  isError
                    ? styles.error
                    : isSuccess
                    ? styles.success
                    : ""
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
