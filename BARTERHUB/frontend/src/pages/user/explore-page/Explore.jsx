// style
import styles from "./explore.module.css";

// component
import CardItem from "../../../components/component/CardItem";
import TradeSuggestion from "../../../components/component/TradeSuggestions";
import AISuggestions from "../../../components/component/AISuggestions";

// layout
import UserLayout from "../../../layouts/user-layout/UserLayour";

// react
import { useState, useEffect } from "react";

// utils
import { fetchWithTokenRefresh } from "../../../utils/fetchWithTokenRefresh";

// ui
import Spinner from "../../../ui/Spinner";

export default function Explore() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedItems, setSuggestedItems] = useState([]); // ADDED: state for AI suggested items
  const [loggedInUser, setLoggedInUser] = useState(null);

  // FETCH AVAILABLE ITEMS
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true); // Start loading
        const accessToken = localStorage.getItem("access_token");
        const loggedInUser = JSON.parse(localStorage.getItem("user"));

        // const res = await fetch(import.meta.env.VITE_AVAILABLE_ITEMS_API, {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // });

        const res = await fetchWithTokenRefresh(
          import.meta.env.VITE_AVAILABLE_ITEMS_API
        );

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
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchItems();
  }, []);

  // FETCH ML-BASED SUGGESTED ITEMS
  useEffect(() => {
    const fetchSuggestedItems = async () => {
      try {
        setLoading(true); // Start loading
        const accessToken = localStorage.getItem("access_token");

        // const res = await fetch(import.meta.env.VITE_ML_ITEMS_API, {
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        // });

        const res = await fetchWithTokenRefresh(
          import.meta.env.VITE_ML_ITEMS_API
        );

        if (!res.ok) throw new Error("Failed to fetch suggestions");

        const data = await res.json();
        console.log("ML suggested items:", data);
        setSuggestedItems(data);
      } catch (err) {
        console.error("Error fetching suggested items:", err);
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchSuggestedItems();
  }, []);

  return (
    <UserLayout>
      <div className={styles.explorePage}>
        {/* Page Header */}
        <div className={styles.xpHeader}>
          <h3>Explore</h3>
          <div className={styles.xpIcon}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        {/* Card Items Feed */}
        <div className={styles.cardListWrapper}>
          {loading ? (
            <Spinner />
          ) : items.length > 0 ? (
            items.map((item) => <CardItem key={item.id} item={item} />)
          ) : (
            <p>No items found.</p>
          )}
        </div>

        {/* AI Suggestions Section */}
        <div className={styles.xpTradeSuggestions}>
          <div className={styles.trHeader}>
            <h3>Recommended For You</h3>
          </div>
          <div className={styles.trWrapper}>
            {loading ? (
              <Spinner />
            ) : suggestedItems.length > 0 ? (
              suggestedItems.map((item) => (
                <AISuggestions
                  key={item.id}
                  item={item}
                  currentUserId={loggedInUser?.id}
                />
              ))
            ) : (
              <p>No AI suggestions available.</p>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
