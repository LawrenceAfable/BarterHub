import styles from "./match.module.css";

// layout
import UserLayout from "../../../layouts/user-layout/UserLayour";

// component
import MatchItem from "../../../components/component/MatchItem";

// react
import { useState, useEffect } from "react";

// utils
import { fetchWithTokenRefresh } from "../../../utils/fetchWithTokenRefresh";

// ui
import Spinner from "../../../ui/Spinner";

export default function Match() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [matchedOffers, setMatchedOffers] = useState([]);
  const [completedOffers, setCompletedOffers] = useState([]);

  // === TABS
  const [activeTab, setActiveTab] = useState("offeredYou"); // default tab
  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem("access_token");
        const res = await fetchWithTokenRefresh(
          import.meta.env.VITE_OFFERS_API
        );

        if (!res.ok) throw new Error("Failed to load offers");

        const data = await res.json();
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) return;

        const userId = user.id;
        const offeredToYou = data.filter(
          (offer) =>
            offer.wanted_item?.user?.id === userId && offer.status === "pending"
        );

        const offeredByYou = data.filter(
          (offer) => offer.offered_by?.id === userId
        );

        const matchedOffers = data.filter(
          (offer) =>
            offer.status === "accepted" &&
            (offer.offered_by?.id === userId ||
              offer.wanted_item?.user?.id === userId) &&
            offer.wanted_item?.status !== "traded" &&
            offer.offered_item?.status !== "traded"
        );

        const completedOffers = data.filter(
          (offer) =>
            offer.wanted_item?.status === "traded" ||
            offer.offered_item?.status === "traded"
        );

        setReceivedOffers(offeredToYou);
        setMatchedOffers(matchedOffers);
        setCompletedOffers(completedOffers);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  // if (loading) return <p>Loading matches...</p>;
  if (loading) return <Spinner />;

  // Clear the offers based on active tab (Permanently delete from backend)
  const clearOffers = async () => {
    const token = localStorage.getItem("access_token");
    let offersToDelete = [];

    // Determine which offers to delete based on active tab
    if (activeTab === "offeredYou") {
      offersToDelete = receivedOffers;
    } else if (activeTab === "matched") {
      offersToDelete = matchedOffers;
    } else if (activeTab === "completed") {
      offersToDelete = completedOffers;
    }

    // Proceed with deletion for each offer
    for (let offer of offersToDelete) {
      try { 
        const res = await fetchWithTokenRefresh(
          `${import.meta.env.VITE_OFFERS_API}${offer.id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to delete offer with ID ${offer.id}`);
        }

        // Remove the deleted offer from the state
        if (activeTab === "offeredYou") {
          setReceivedOffers((prevOffers) =>
            prevOffers.filter((o) => o.id !== offer.id)
          );
        } else if (activeTab === "matched") {
          setMatchedOffers((prevOffers) =>
            prevOffers.filter((o) => o.id !== offer.id)
          );
        } else if (activeTab === "completed") {
          setCompletedOffers((prevOffers) =>
            prevOffers.filter((o) => o.id !== offer.id)
          );
        }
      } catch (e) {
        console.error(`Error deleting offer with ID ${offer.id}:`, e);
      }
    }
  };

  return (
    <main>
      <UserLayout>
        <div className={styles.matchPage}>
          <div className={styles.mHeader}>
            <h3>Your Matches</h3>
            <div className={styles.mIcon}>
              <i className="fa-solid fa-bolt"></i>
            </div>
          </div>
          <div className={styles.mBody}>
            <div className={styles.filterTabs}>
              <div
                className={`${styles.tab} ${
                  activeTab === "offeredYou" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("offeredYou")}
              >
                Offered You
              </div>
              <div
                className={`${styles.tab} ${
                  activeTab === "matched" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("matched")}
              >
                Matches
              </div>
              <div
                className={`${styles.tab} ${
                  activeTab === "completed" ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </div>
            </div>
            <div className={styles.clearIcon} onClick={clearOffers}>
              <i className="fa-solid fa-trash"></i> 
            </div>
            <MatchItem
              offers={
                activeTab === "offeredYou"
                  ? receivedOffers
                  : activeTab === "matched"
                  ? matchedOffers
                  : completedOffers
              }
            />
          </div>
        </div>
      </UserLayout>
    </main>
  );
}
