import styles from "./auth.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "", // New state for OTP
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false); // To track if OTP has been sent
  const [isVerified, setIsVerified] = useState(false); // To track if OTP is verified

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const sendOtp = async () => {
    // Send OTP request to backend API
    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_SEND_OTP_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Failed to send OTP.");
        setLoading(false);
        return;
      }

      setOtpSent(true); // Mark OTP as sent
      alert("OTP sent! Please check your email.");
      setLoading(false);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Something went wrong while sending OTP.");
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    // Verify OTP entered by the user
    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_VERIFY_OTP_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Invalid OTP.");
        setLoading(false);
        return;
      }

      setIsVerified(true); // Mark OTP as verified
      alert("OTP verified successfully!");
      setLoading(false);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Something went wrong while verifying OTP.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isVerified) {
      setError("Please verify the OTP before registering.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_REGISTER_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.error || data?.detail || "Registration failed.";
        setError(errorMessage);
        setLoading(false);
        return;
      }

      alert("Registration successful! You can now log in.");
      navigate("/login"); // Redirect to login
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
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
        <h2>Register</h2>
        <p>Please fill in your details to create an account.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {!otpSent ? (
            // Step 1: Enter email and send OTP
            <>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </label>

              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className={`${styles.loginButton} ${
                  loading ? styles.buttonLoading : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          ) : !isVerified ? (
            // Step 2: Enter OTP to verify
            <>
              <label>
                OTP
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  required
                />
              </label>

              <button
                type="button"
                onClick={verifyOtp}
                disabled={loading}
                className={`${styles.loginButton} ${
                  loading ? styles.buttonLoading : ""
                }`}
              >
                {loading ? (
                  <>
                    <div className={styles.spinner}></div>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </>
          ) : (
            // Step 3: Enter user details and register
            <>
              <label>
                Username
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </label>

              <label>
                Full Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
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

              <label>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </>
          )}
        </form>

        <div className={styles.footerText}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </div>
      </section>
    </main>
  );
}
