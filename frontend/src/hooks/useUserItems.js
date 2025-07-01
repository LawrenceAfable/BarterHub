import { useState, useEffect } from "react";

export function useUserItems() {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setLoadingItems(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(import.meta.env.VITE_MY_ITEMS_API, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        const sorted = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setItems(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingItems(false);
      }
    }
    fetchItems();
  }, []);

  return { items, loadingItems, setItems };
}
