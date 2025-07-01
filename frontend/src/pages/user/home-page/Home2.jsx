// HAS SKIP FUNCTIONALITY, 2ND TO ORIGINAL
import styles from "./home.module.css";

// layout
import UserLayout from "../../../layouts/user-layout/UserLayour";

// components
import CardItem from "../../../components/component/CardItem";

// react
import { useState, useEffect } from "react";

export default function Home() {
  const [items, setItems] = useState([]);

  const handleSkip = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // FETCH AVAILABLE ITEMS
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        const res = await fetch(import.meta.env.VITE_AVAILABLE_ITEMS_API, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch available items");

        let data = await res.json();

        console.log("First item status:", data[0]?.status);

        if (loggedInUser) {
          data = data.filter(
            (item) =>
              item.user.id !== loggedInUser.id && item.status === "active" // Only show available items
          );
        }

        data = data.filter(
          (item) => item.user.id !== loggedInUser.id && item.status === "active"
        );

        // Sort from latest to oldest by created_at
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setItems(data);
      } catch (err) {
        console.error("Error fetching available items:", err);
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

        {/* old */}

        {items.length > 0 ? (
          items.map((item) => (
            <CardItem key={item.id} item={item} onSkip={handleSkip} />
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </UserLayout>
  );
}
