// HAS SKIP, 2ND TO ORIGINAL
// style
import styles from "./card-item.module.css";
import general from "../../styles/general.module.css";

// react
import { useNavigate } from "react-router-dom";

// Accept props
export default function CardItem({ item, onSkip }) {  // === Added onSkip
  return (
    <div className={styles.cardItemCont}>
      <div className={styles.cardHeader}>
        <CardDetails item={item} onSkip={onSkip} />  {/* === Pass onSkip */}
      </div>
    </div>
  );
}

function CardDetails({ item, onSkip }) {
  if (!item) return null;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/item-detail", { state: { item, mode: "make" } });
    console.log("status:", item.status, "className:", general[item.status]);
  };

  const handleSkip = async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/items/${item.id}/skip/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to skip item");

      console.log(`Item ${item.id} skipped.`);
      onSkip?.(item.id);  // === Trigger item removal in parent

    } catch (err) {
      console.error("Error skipping item:", err);
    }
  };

  return (
    <div className={styles.cardDetailsCont}>
      <div className={styles.cardTop}>
        <img
          src={item.images?.[0] || "https://via.placeholder.com/150"}
          alt={item.title}
        />
      </div>
      <div className={styles.cardBot}>
        <div className={styles.cardTitle}>
          <h4>{item.title}</h4>
          <span
            className={`${general.status} ${
              general[item.status] || general.unknown
            }`}
          >
            {item.status}
          </span>
        </div>
        <div className={styles.cardDescription}>
          <p>{item.description}</p>
        </div>
        <div className={styles.cardOwner}>
          <div className={styles.cardOwnerName}>
            by {item.user?.name || "N/A"}
          </div>
          <div className={styles.cardOwnerLocation}>
            {item.user?.location || "Unknown"}
          </div>
        </div>
        <div className={styles.cardAction}>
          <div className={styles.cardDecline} onClick={handleSkip}>
            <i className="fa-solid fa-xmark"></i>
          </div>

          <div className={styles.cardOffer} onClick={handleClick}>
            <i className="fa-regular fa-heart"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
