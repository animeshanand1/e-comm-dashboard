
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAdminLoginMutation } from "../../store/api/apiSlice";
import { loginStart, loginSuccess, loginFailure } from "../../store/slices/authSlice";
import styles from "./Login.module.css";


const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const error = useSelector((state) => state.auth.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await adminLogin({ email, password }).unwrap();
      dispatch(loginSuccess(res));
    } catch (err) {
      dispatch(loginFailure(err?.data?.message || "Login failed"));
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.leftPanel}>
        <h1>Veridian Dashboard</h1>
        <p>
          Your all-in-one solution for managing sales, products, and analytics
          with ease.
        </p>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.loginContainer}>
          <header className={styles.loginHeader}>
            <div className={styles.loginLogo}>
              <i className="fa-solid fa-lock"></i>
            </div>
            <h1 className={styles.loginTitle}>Admin Access</h1>
            <p className={styles.loginSubtitle}>Please sign in to continue.</p>
          </header>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <i className={`fa-solid fa-envelope ${styles.inputIcon}`}></i>
                <input
                  type="email"
                  id="email"
                  className={styles.inputField}
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <div className={styles.inputWrapper}>
                <i className={`fa-solid fa-key ${styles.inputIcon}`}></i>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.inputField}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={
                      showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>
            {error && (
              <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
            )}
            <button type="submit" className={styles.loginButton} disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
