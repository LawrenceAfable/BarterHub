  // style
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
          // const res = await fetch(`${import.meta.env.VITE_OFFERS_API}`, {
          //   headers: { Authorization: `Bearer ${token}` },
          // });

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
