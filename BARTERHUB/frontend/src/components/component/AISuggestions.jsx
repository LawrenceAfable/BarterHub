// style
// style from trade suggestions
import styles from "./trade-suggestions.module.css";

// react-router
import { useNavigate } from "react-router-dom";

export default function AISuggestions({ item, currentUserId }) {
  // Fallbacks if some data is missing
  const imageUrl =
    item?.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image";
  const title = item?.title || "Untitled Item";
  const location = item?.user?.location || "Unknown Location";
  const ownerName = item?.user?.name || "Unknown Owner";
  const isOwner = item?.user?.id === currentUserId;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/item-detail", { state: { item, mode: "make" } });
  };

  return (
    <div
      className={styles.trCont}
      onClick={handleClick}
      style={{ cursor: "pointer" }} // show pointer on hover
      role="button" // accessibility
      tabIndex={0} // keyboard focus
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <div className={styles.trTop}>
        <img src={imageUrl} alt={title} />
      </div>
      <div className={styles.trBot}>
        <div className={styles.trTitle}>{title}</div>
        <div className={styles.trOwner}>by {ownerName}</div>
        <div className={styles.trLocation}>from {location}</div>
      </div>
    </div>
  );
}
