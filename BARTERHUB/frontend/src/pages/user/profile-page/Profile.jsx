// style
import styles from "./profile.module.css";

// layout
import UserLayout from "../../../layouts/user-layout/UserLayour";

// component
import MyListedCardItem from "../../../components/component/MyListedCardItem";
import ItemForm from "../../../components/modal/ItemForm";

// modal
import UserProfileEditModal from "./modals/UserProfileEditModal";

// react
import { useState } from "react";

// hooks
import { useUserProfile } from "../../../hooks/useUserProfile";
import { useUserItems } from "../../../hooks/useUserItems";
import { useUserRating } from "../../../hooks/useUserRating";

// ui
import Spinner from "../../../ui/Spinner";

export default function Profile() {
  // Custom hooks
  const { userData, loadingUser, setUserData } = useUserProfile();
  const { items, loadingItems, setItems } = useUserItems();

  // Ratings
  const { ratingData, loading: loadingRating } = useUserRating(userData?.id);

  // Modal states
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const completedTradesCount = items.filter(
    (item) => item.status === "traded"
  ).length;

  // Handlers
  const handleUserEditClick = () => setShowUserEditModal(true);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleDeleteItem = async (itemId) => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(`${import.meta.env.VITE_ITEMS_API}${itemId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete the item.");
    }
  };

  if (loadingUser || loadingItems) return <Spinner />;

  return (
    <UserLayout>
      <div className={styles.profilePage}>
        <div className={styles.pHeader}>
          <h3>Profile</h3>
          <div className={styles.pIcon}>
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
        <div className={styles.pBody}>
          <div className={styles.ppTop}>
            <div className={styles.ppTopWrapper}>
              <div className={styles.profileImageContainer}>
                <img
                  src={userData?.profile_picture ?? "/BarterHub_Logo.png"}
                  className={styles.profileImage}
                  alt="Profile"
                />
              </div>
              <div className={styles.profileInfo}>
                <h3>{userData?.name || "Unnamed User"}</h3>
                <span>{userData?.email}</span>
              </div>
            </div>
            <div
              className={styles.imageEditButton}
              onClick={handleUserEditClick}
            >
              <i className="fa-solid fa-pencil-alt"></i>
            </div>
          </div>
          <div className={styles.ppMid}>
            {/* <div className={styles.midPointCont}>
              <div className={styles.midHeader}>
                <div className={styles.midTitle}>User Barter Ratings</div>
                <div className={styles.midIcon}>
                  <i className="fas fa-chart-line"></i>
                </div>
              </div>

              {loadingRating ? (
                <p>Loading rating...</p>
              ) : (
                <>
                  <h3>{ratingData.average_rating.toFixed(1)}</h3>
                  <span>Based on {ratingData.total_ratings} ratings</span>
                </>
              )}
            </div> */}
          </div>
          <div className={styles.ppBot}>
            <div className={styles.botItem}>
              <div className={styles.botIcon}>
                <i className="fas fa-box"></i>
              </div>
              <h4>{items.length}</h4>
              <span>Item Listed</span>
            </div>
            <div className={styles.botItem}>
              <div className={styles.botIcon}>
                <i className="fas fa-trophy"></i>
              </div>
              <h4>{completedTradesCount}</h4>
              <span>Completed Trades</span>
            </div>
          </div>
        </div>
        <div className={styles.pItemListed}>
          <h3>My Listings</h3>
          <div className={styles.itemCont}>
            {items.length > 0 ? (
              items.map((item) => (
                <MyListedCardItem
                  key={item.id}
                  item={item}
                  onEdit={() => handleEditItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))
            ) : (
              <p>No items found.</p>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <ItemForm
          item={selectedItem}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updatedItem) => {
            setItems((prev) =>
              prev.map((itm) => (itm.id === updatedItem.id ? updatedItem : itm))
            );
            setShowEditModal(false);
          }}
        />
      )}

      {showUserEditModal && (
        <UserProfileEditModal
          user={userData}
          onClose={() => setShowUserEditModal(false)}
          onSuccess={(updatedUser) => {
            setUserData(updatedUser);
            setShowUserEditModal(false);
          }}
        />
      )}
    </UserLayout>
  );
}
