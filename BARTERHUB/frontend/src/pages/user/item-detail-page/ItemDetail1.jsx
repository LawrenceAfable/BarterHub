import styles from "./item-detail.module.css";
import UserLayout from "../../../layouts/user-layout/UserLayour";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import OfferModal from "../../../components/modal/OfferModal";

export default function ItemDetail() {
  const [showOfferModal, setShowOfferModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const mode = location.state?.mode || "view";
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [notice, setNotice] = useState(""); // New notice state

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isOfferRecipient = currentUser?.id === item.user?.id; // You own the wanted_item (i.e., offer was made TO you)
  const isOfferedItem = mode === "accept"; // You are seeing the offered item

  const offerId = location.state?.offerId;

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const res = await fetch(import.meta.env.VITE_MY_ITEMS_API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch my items");
        }

        // one
        const data = await res.json();

        // Only keep active items - two
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

  const handleAccept = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${import.meta.env.VITE_OFFERS_API}${offerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (!res.ok) throw new Error("Failed to accept offer");
      alert("Offer accepted");
      navigate(-1);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${import.meta.env.VITE_OFFERS_API}${offerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (!res.ok) throw new Error("Failed to reject offer");
      alert("Offer rejected");
      navigate(-1);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${import.meta.env.VITE_OFFERS_API}${offerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (!res.ok) throw new Error("Failed to cancel offer");
      alert("Offer cancelled");
      navigate(-1);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = () => {
    if (items.length === 0) {
      setNotice("You need to list an item before making an offer.");
      return;
    }
    setNotice(""); // Clear any previous notice
    setShowOfferModal(true);
  };

  if (!item) {
    // If no item data, maybe navigate back or show a message
    return (
      <UserLayout>
        <div className={styles.itemDetailPage}>
          <p>No item data found.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </UserLayout>
    );
  }

  const renderButtons = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const isOwner = currentUser?.id === item.user?.id;
    const isMatched = item.status === "matched";
    const isActive = item.status === "active";
    const isTraded = item.status === "traded";

    const offerStatus = item.status;
    const wantedItem = location.state?.wanted_item;
    const isOfferRecipient = currentUser?.id === wantedItem?.user?.id;

    // const cUser = JSON.parse(localStorage.getItem("user"));
    // console.log("🔧 renderButtons:", {
    //   mode,
    //   status: item.status,
    //   currentUserId: cUser?.id,
    //   itemOwnerId: item.user?.id,
    //   isOfferRecipient: mode === "accept" && cUser.id === item.user?.id,
    // });

    // 0. Item is traded — hide everything
    if (isTraded) {
      return (
        <p style={{ color: "gray" }}>This item has already been traded.</p>
      );
    }

    // 1. If someone offered you this item (you are the owner
    if (mode === "accept" && isOfferRecipient && offerStatus === "active") {
      return (
        <>
          <button
            className={styles.idCancelButton}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            className={styles.idAgreeButton}
            onClick={handleAccept}
            disabled={loading}
          >
            Accept Offer
          </button>
          <button
            className={styles.idRejectButton}
            onClick={handleReject}
            disabled={loading}
          >
            Reject Offer
          </button>
        </>
      );
    }

    // 2. If the offer was accepted, and you are the owner (you matched with someone)
    if (mode === "accept" && isMatched && isOwner) {
      return (
        <>
          <button className={styles.idCancelButton} onClick={handleCancel}>
            Cancel Match
          </button>
          <button className={styles.idRejectButton} onClick={handleReject}>
            Reject Match
          </button>
          <button className={styles.idMessageButton}>Message</button>
        </>
      );
    }

    // 3. If the current user is NOT the owner but their offer was accepted (they matched)
    if (mode === "accept" && isMatched && !isOwner) {
      return (
        <>
          <button className={styles.idCancelButton} onClick={handleCancel}>
            Cancel Match
          </button>
          <button className={styles.idRejectButton} onClick={handleReject}>
            Reject Match
          </button>
          <button className={styles.idMessageButton}>Message</button>
        </>
      );
    }

    // 4. If this is a listing and user wants to offer
    if (mode === "make" && !isOwner && isActive) {
      return (
        <>
          <button
            className={styles.idCancelButton}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button className={styles.idAgreeButton} onClick={handleMakeOffer}>
            Make Offer
          </button>
        </>
      );
    }

    // 5. If the item is not active (i.e. matched or traded), but user is trying to make an offer
    if (mode === "make" && !isOwner && !isActive) {
      return (
        <>
          <button
            className={styles.idCancelButton}
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <p style={{ color: "red", marginTop: "8px" }}>
            This item is not available for barter.
          </p>
        </>
      );
    }

    if (mode === "matched" && isMatched && !isOwner) {
      return (
        <>
          <button className={styles.idCancelButton} onClick={handleCancel}>
            Cancel Match
          </button>
          <button className={styles.idRejectButton} onClick={handleReject}>
            Reject Match
          </button>
          <button className={styles.idMessageButton}>Message</button>
        </>
      );
    }

    // 6. If you're just viewing your own item
    if (mode === "view" && isOwner) {
      return (
        <p style={{ color: "gray" }}>You are viewing your own listed item.</p>
      );
    }

    // 7. Fallback
    return null;
  };

  // debug
  console.log("ItemDetail state:", { mode, item, offerId });

  return (
    <UserLayout>
      <div className={styles.itemDetailPage}>
        <div className={styles.idHeader} onClick={() => navigate(-1)}>
          <div className={styles.idIcon}>
            <i className="fas fa-arrow-left"></i>
          </div>
          <h3>Item Details</h3>
        </div>
        <div className={styles.idBody}>
   
          <div className={styles.idImageCont}>
            <img
              src={item.images?.[0] || "https://via.placeholder.com/600"}
              alt={item.title || "Item image"}
            />
          </div>

          <div className={styles.idTitleCont}>
            <h3>{item.title}</h3>
          </div>

          <div className={styles.idDescriptionCont}>
            <p>{item.description}</p>
          </div>


          <div className={styles.idCategoryCont}>
            <h4>Categories</h4>
            {item.categories && item.categories.length > 0 ? (
              item.categories.map((cat) => (
                <span key={cat.id} className={styles.categoryBadge}>
                  {cat.name}
                </span>
              ))
            ) : (
              <span>No categories</span>
            )}
          </div>

          <div className={styles.idTagCont}>
            <h4>Tags</h4>
            <div className={styles.idTagContWrapper}>
              {item.tags?.length > 0 ? (
                item.tags.map((tag, idx) => <span key={idx}>{tag}</span>)
              ) : (
                <span>No tags</span>
              )}
            </div>
          </div>

          <div className={styles.idImageListCont}>
            <h4>Other Images</h4>
            <div className={styles.idImageListWrapper}>
              {item.images?.slice(1).length > 0 ? (
                item.images
                  .slice(1)
                  .map((img, idx) => (
                    <img key={idx} src={img} alt={`${item.title} ${idx + 2}`} />
                  ))
              ) : (
                <span>No other images</span>
              )}
            </div>
          </div>

          {item.user && (
            <div className={styles.idOwnerInfo}>
              <h4>Owner Info</h4>
              <p>Name: {item.user.name || "N/A"}</p>
              <p>Location: {item.user.location || "Unknown"}</p>

            </div>
          )}

          {notice && <p style={{ color: "red", marginTop: "8px" }}>{notice}</p>}

 
          <div className={styles.idButtonCont}>{renderButtons()}</div>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <OfferModal
          wantedItem={{
            id: item.id,
            title: item.title,
            image: item.images?.[0] || "",
            description: item.description,
            recipient_id: item.user?.id,
          }}
          myItems={items}
          onCancel={() => setShowOfferModal(false)}
          onSuccess={() => {
            setShowOfferModal(false);
          }}
        />
      )}
    </UserLayout>
  );
}
