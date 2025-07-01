// style
import styles from "./auth.module.css";

import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Email is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_FORGOT_PASSWORD_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message); // Show success message
      } else {
        setError(data.error); // Show error message
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.animatedBackground}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>

      <section className={styles.formContainer}>
        <h2>Forgot Password</h2>
        <p>Enter your email address, and we'll send you a new password.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Email
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={handleEmailChange}
              className={styles.fpEMail}
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={styles.loginButton}
          >
            {loading ? "Sending..." : "Send New Password"}
          </button>
        </form>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
    </main>
  );
}

export default ForgotPassword;
