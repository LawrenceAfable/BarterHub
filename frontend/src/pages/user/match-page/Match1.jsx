// style
import styles from "./match.module.css";

// layout
import UserLayout from "../../../layouts/user-layout/UserLayour";

// component
import MatchItem from "../../../components/component/MatchItem";

// react
import { useState, useEffect } from "react";

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
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${import.meta.env.VITE_OFFERS_API}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load offers");

        const data = await res.json();
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.id) return;

        const userId = user.id;

        const offeredToYou = data.filter(
          (offer) => offer.wanted_item?.user?.id === userId
        );

        const offeredByYou = data.filter(
          (offer) => offer.offered_by?.id === userId
        );

        // const matchedOffers = data.filter(
        //   (offer) =>
        //     offer.status === "accepted" &&
        //     (offer.wanted_item?.user?.id === userId ||
        //       offer.offered_by?.id === userId)
        // );

        const matchedOffers = data.filter(
          (offer) =>
            offer.status === "accepted" &&
            (offer.offered_by?.id === userId || 
              offer.wanted_item?.user?.id === userId) 
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

  // useEffect(() => {
  //   async function fetchOffers() {
  //     try {
  //       const token = localStorage.getItem("access_token");
  //       const res = await fetch(`${import.meta.env.VITE_OFFERS_API}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status}`);
  //       }

  //       if (!res.ok) throw new Error("Failed to load offers");
  //       const data = await res.json();

  //       setOffers(data);
  //     } catch (e) {
  //       console.error(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchOffers();
  // }, []);

  // === OFFERS ===
  // offers
  // const [userId, setUserId] = useState(null);

  // === OFFERS
  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   if (storedUser?.id) {
  //     setUserId(storedUser.id);
  //   }
  // }, []);

  // useEffect(() => {
  //   async function fetchOffers() {
  //     try {
  //       const token = localStorage.getItem("access_token");
  //       const res = await fetch(`${import.meta.env.VITE_OFFERS_API}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       if (!res.ok) throw new Error("Failed to load offers");
  //       const data = await res.json();

  //       // Filter: offers made on your items
  //       const yourReceivedOffers = data.filter(
  //         (offer) => offer.wanted_item?.user?.id === userId
  //       );

  //       setOffers(data);
  //       setReceivedOffers(yourReceivedOffers);
  //     } catch (e) {
  //       console.error(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   if (userId) {
  //     fetchOffers();
  //   }
  // }, [userId]);

  if (loading) return <p>Loading matches...</p>;

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
            {/* <div className={styles.filterTabs}>
              <div className={styles.tab}>Offered You</div>
              <div className={styles.tab}>Matches</div>
              <div className={styles.tab}>Completed</div>
            </div> */}
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
            {/* <MatchItem offers={offers} /> */}
            {/* <MatchItem offers={receivedOffers} /> */}
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
