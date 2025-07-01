import { useState } from "react";
import styles from "./rating.module.css"; // Rename CSS if needed

export default function Rating({
  matchId,
  ratedUserId,
  onClose,
  inline = false, // new prop
}) {
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const submitRating = async () => {
    const token = localStorage.getItem("access_token");
    try {
      setSubmitting(true);
      const res = await fetch(import.meta.env.VITE_MATCHES_RATINGS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          match: matchId,
          rated_user: ratedUserId,
          rating,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      alert("Thank you for your rating!");
      if (onClose) onClose();
    } catch (err) {
      alert("Failed to submit rating.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={inline ? styles.inlineContainer : styles.modalOverlay}>
      <div className={inline ? styles.inlineBox : styles.modal}>
        {!inline && (
          <>
            <h2 className={styles.title}>Rate Your Trade Experience</h2>
            <p className={styles.subtitle}>How would you rate the other trader?</p>
          </>
        )}

        <div className={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`${styles.star} ${star <= rating ? styles.filled : ""}`}
              onClick={() => setRating(star)}
            >
              +
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.submitButton}
            onClick={submitRating}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
          {!inline && (
            <button
              className={styles.cancelButton}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
