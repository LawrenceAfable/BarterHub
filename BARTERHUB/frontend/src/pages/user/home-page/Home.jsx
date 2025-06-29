import styles from "./home.module.css";

// layout
import UserLayout from "../../../layouts/user-layout/UserLayour";

// components
import CardItem from "../../../components/component/CardItem";

// react
import { useState, useEffect } from "react";

// utils
import { fetchWithTokenRefresh } from "../../../utils/fetchWithTokenRefresh";

// ui
import Spinner from "../../../ui/Spinner";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0); // Track current card index

  const handleSkip = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, items.length - 1)); // Move to next card
  };

  // FETCH AVAILABLE ITEMS
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true); // Start loading

        const accessToken = localStorage.getItem("access_token");
        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        const res = await fetchWithTokenRefresh(
          import.meta.env.VITE_AVAILABLE_ITEMS_API
        );

        if (!res.ok) throw new Error("Failed to fetch available items");

        let data = await res.json();

        if (loggedInUser) {
          data = data.filter(
            (item) =>
              item.user.id !== loggedInUser.id && item.status === "active"
          );
        }

        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setItems(data);
      } catch (err) {
        console.error("Error fetching available items:", err);
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchItems();
  }, []);

  return (
    <UserLayout>
      <div className={styles.homePage}>
        <div className={styles.hpHeader}>
          <h3>Discover Items</h3>
          <div className={styles.hpIcon}>
            <i className="fa-solid fa-fire"></i>
          </div>
        </div>

        {/* Render the current card */}
        {loading ? (
          <Spinner />
        ) : items.length > 0 && currentIndex < items.length ? (
          <CardItem 
            key={items[currentIndex]?.id} 
            item={items[currentIndex]} 
            onSkip={handleSkip} 
          />
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </UserLayout>
  );
}
