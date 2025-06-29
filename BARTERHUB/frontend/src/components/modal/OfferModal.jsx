import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styles from "./offer-modal.module.css";

export default function OfferModal({
  wantedItem,
  myItems,
  onCancel,
  onSuccess,
}) {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    if (!selectedItem) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(import.meta.env.VITE_OFFERS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wanted_item_id: wantedItem.id,
          offered_item_id: selectedItem.id,
          // recipient_id: wantedItem?.recipient_id || "",
        }),
      });

      const offerData = {
        wanted_item_id: wantedItem.id, // ID of the item the user wants
        offered_item_id: selectedItem.id, // ID of the item the user is offering
        status: "pending", // Offer status
      };
      console.log("Offer Data being sent:", offerData);

      if (!res.ok) {
        const data = await res.json();
        console.error("API error response:", data);
        throw new Error(data.detail || "Failed to create offer");
      }

      // debug
      console.log("wantedItem.id:", wantedItem.id);
      console.log("selectedItem.id:", selectedItem.id);
      console.log("offered_by", wantedItem.user);

      // Offer created successfully
      console.log("Offer created successfully");
      navigate("/match")
      setLoading(false);
      onSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>
          Select an item to offer for barter
        </h2>

        <div className={styles.itemGrid}>
          {/* Wanted Item */}
          <div className={styles.itemCard}>
            <h3 className={styles.itemLabel}>Wanted Item</h3>
            <img src={wantedItem.image} alt={wantedItem.title} />
            <h4>{wantedItem.title}</h4>
            <p>{wantedItem.description}</p>
          </div>

          {/* Your Item Selector */}
          <div className={styles.itemCard}>
            <h3 className={styles.itemLabel}>Your Offer</h3>

            {/* Display Selected Item or Selector */}
            {selectedItem ? (
              <div
                className={styles.selectedItemDisplay}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <img src={selectedItem.image} alt={selectedItem.title} />
                <h4>{selectedItem.title}</h4>
              </div>
            ) : (
              <button
                className={styles.selectButton}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Select Your Item
              </button>
            )}

            {showDropdown && (
              <div className={styles.dropdownGallery}>
                {myItems.map((item) => (
                  <div
                    key={item.id}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDropdown(false);
                    }}
                  >
                    <img src={item.image} alt={item.title} />
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={!selectedItem || loading}
          >
            {loading ? "Sending..." : "Confirm Offer"}
          </button>
          {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
