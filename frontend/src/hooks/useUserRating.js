import { useState, useEffect } from "react";

export function useUserRating(userId) {
  const [ratingData, setRatingData] = useState({ average_rating: 0, total_ratings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem("access_token");
    setLoading(true);
    setError(null);

    fetch(`${import.meta.env.VITE_MATCHES_RATINGS_API}?rated_user=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch ratings");
        return res.json();
      })
      .then((ratings) => {
        if (!Array.isArray(ratings) || ratings.length === 0) {
          setRatingData({ average_rating: 0, total_ratings: 0 });
        } else {
          const total = ratings.reduce((acc, r) => acc + r.rating, 0);
          setRatingData({ average_rating: total / ratings.length, total_ratings: ratings.length });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return { ratingData, loading, error };
}
