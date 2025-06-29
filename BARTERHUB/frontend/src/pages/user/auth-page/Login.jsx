import styles from "./auth.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.detail || "Login failed. Please check your credentials."
        );
        setLoading(false);
        return;
      }

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      const profileRes = await fetch(import.meta.env.VITE_PROFILE_API, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (!profileRes.ok) throw new Error("Failed to fetch user profile.");

      const userData = await profileRes.json();
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.animatedBackground}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>

      <section className={styles.formContainer}>
        <h2>Login</h2>
        <p>Welcome back! Please enter your details.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          <button type="submit" disabled={loading} className={styles.loginButton}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.forgotPassword} onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </div>

        <div className={styles.footerText}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/registration")}>Register here</span>
        </div>
      </section>
    </main>
  );
}
