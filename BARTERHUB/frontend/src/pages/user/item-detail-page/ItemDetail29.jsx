import styles from "./item-detail.module.css";
import UserLayout from "../../../layouts/user-layout/UserLayour";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import OfferModal from "../../../components/modal/OfferModal";
// style
import general from "../../../styles/general.module.css";

// utils
import { fetchWithTokenRefresh } from "../../../utils/fetchWithTokenRefresh";

// loading
import Spinner from "../../../ui/Spinner";

export default function ItemDetail() {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [items, setItems] = useState([]);
  const [notice, setNotice] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const item = location.state?.item;
  const mode = location.state?.mode || "view";
  const offerId = location.state?.offerId;
  const wantedItem = location.state?.wanted_item;

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isOwner = currentUser?.id === wantedItem?.user?.id;
  const isMatched = item?.status === "matched";

  const displayItem =
    (mode === "accept" || mode === "accepted") &&
    isMatched &&
    !isOwner &&
    wantedItem
      ? wantedItem
      : item;

  // Delay until location.state is ready
  useEffect(() => {
    if (location.state?.item) {
      setInitializing(false);
    } else {
      const timeout = setTimeout(() => setInitializing(false), 800);
      return () => clearTimeout(timeout);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await fetchWithTokenRefresh(
          import.meta.env.VITE_MY_ITEMS_API
        );

        if (!res.ok) throw new Error("Failed to fetch my items");

        const data = await res.json();

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

  const patchOfferStatus = async (status, successMsg) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${import.meta.env.VITE_OFFERS_API}${offerId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const patchResponse = await res.json();
      console.log("📦 PATCH response:", patchResponse);

      if (!res.ok) throw new Error(`Failed to ${status} offer`);

      const verifyRes = await fetch(
        `${import.meta.env.VITE_OFFERS_API}${offerId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedOffer = await verifyRes.json();
      console.log("🔄 Updated offer from backend:", updatedOffer);

      alert(successMsg);
      navigate(-1);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => patchOfferStatus("accepted", "Offer accepted");
  const handleReject = () => patchOfferStatus("rejected", "Offer rejected");
  const handleCancel = () => patchOfferStatus("cancelled", "Offer cancelled");

  const handleMakeOffer = () => {
    if (items.length === 0) {
      setNotice("You need to list an item before making an offer.");
      return;
    }
    setNotice("");
    setShowOfferModal(true);
  };

  // Show spinner while waiting for router state
  if (initializing) {
    return (
      <UserLayout>
        <div className={styles.itemDetailPage}>
          <Spinner />
        </div>
      </UserLayout>
    );
  }

  // Fallback if router state never provides item
  if (!item) {
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
    const isActive = item.status === "active";
    const isTraded = item.status === "traded";
    const offerStatus = item.status;
    const isOfferRecipient = currentUser?.id === wantedItem?.user?.id;

    if (isTraded) {
      return (
        <p style={{ color: "gray" }}>This item has already been traded.</p>
      );
    }

    if (mode === "accept" && isOfferRecipient && offerStatus === "active") {
      return (
        <>
          <button
            className={styles.idCancelButton}
            onClick={() => navigate(-1)}
            disabled={loading}
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

    if (mode === "accept" && isMatched && isOwner) {
      return (
        <>
          <button
            className={styles.idCancelButton}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel Match
          </button>
          <button
            className={styles.idRejectButton}
            onClick={handleReject}
            disabled={loading}
          >
            Reject Match
          </button>
          <button
            className={styles.idMessageButton}
            onClick={() => navigate("/messages")}
          >
            Message
          </button>
        </>
      );
    }

    if ((mode === "accept" || mode === "accepted") && isMatched && !isOwner) {
      return (
        <>
          <button
            className={styles.idCancelButton}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel Match
          </button>
          <button
            className={styles.idRejectButton}
            onClick={handleReject}
            disabled={loading}
          >
            Reject Match
          </button>
          <button
            className={styles.idMessageButton}
            onClick={() => navigate("/messages")}
          >
            Message
          </button>
        </>
      );
    }

    if (mode === "make" && !isOwner && isActive) {
      return (
        <>
          <button
            className={styles.idCancelButton}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <button className={styles.idAgreeButton} onClick={handleMakeOffer}>
            Make Offer
          </button>
        </>
      );
    }

    if (mode === "make" && !isOwner && !isActive) {
      return (
        <>
          <button
            className={styles.idCancelButton}
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
          <p style={{ color: "red", marginTop: "8px" }}>
            This item is not available for barter.
          </p>
        </>
      );
    }

    if (mode === "view" && isOwner) {
      return (
        <p style={{ color: "gray" }}>You are viewing your own listed item.</p>
      );
    }

    return null;
  };

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
              src={displayItem.images?.[0] || "https://via.placeholder.com/600"}
              alt={displayItem.title || "Item image"}
            />
          </div>

          <div className={styles.idTitleCont}>
            <h3>{displayItem.title}</h3>
            <div>
              {" "}
              <span
                className={`${general.status} ${
                  general[displayItem.status] || general.unknown
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>

          <div className={styles.idDescriptionCont}>
            <p>{displayItem.description}</p>
          </div>

          <div className={styles.idCategoryCont}>
            <h4>Categories</h4>
            {displayItem.categories && displayItem.categories.length > 0 ? (
              displayItem.categories.map((cat) => (
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
              {displayItem.tags?.length > 0 ? (
                displayItem.tags.map((tag, idx) => <span key={idx}>{tag}</span>)
              ) : (
                <span>No tags</span>
              )}
            </div>
          </div>

          <div className={styles.idImageListCont}>
            <h4>Other Images</h4>
            <div className={styles.idImageListWrapper}>
              {displayItem.images?.slice(1).length > 0 ? (
                displayItem.images
                  .slice(1)
                  .map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${displayItem.title} ${idx + 2}`}
                    />
                  ))
              ) : (
                <span>No other images</span>
              )}
            </div>
          </div>

          {displayItem.user && (
            <div className={styles.idOwnerInfo}>
              <h4>Owner Info</h4>
              <div className={styles.idOwnerInfoCont}>
                <img src={displayItem.user.profile_picture} alt="" />
                <div className={styles.idOwnerDetails}>
                  <p>{displayItem.user.name || "N/A"}- </p>
                  <p>{displayItem.user.location || "Unknown"}</p>
                </div>
              </div>
            </div>
          )}

          {notice && <p style={{ color: "red", marginTop: "8px" }}>{notice}</p>}

          <div className={styles.idButtonCont}>{renderButtons()}</div>
        </div>
      </div>

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
