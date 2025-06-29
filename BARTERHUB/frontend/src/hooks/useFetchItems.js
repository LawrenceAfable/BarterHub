// src/hooks/useFetchItems.js
import { useState, useEffect } from "react";
import { fetchWithTokenRefresh } from "../utils/fetchWithTokenRefresh";

export const useFetchItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await fetchWithTokenRefresh(import.meta.env.VITE_MY_ITEMS_API);

        if (!res.ok) throw new Error("Failed to fetch my items");

        const data = await res.json();
        const activeItems = data.filter((item) => item.status === "active");

        setItems(
          activeItems.map((item) => ({
            id: item.id,
            title: item.title,
            image: item.images?.[0] || "",
            description: item.description,
          }))
        );
      } catch (error) {
        console.error("Error fetching my items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, []);

  return { items, loading };
};
