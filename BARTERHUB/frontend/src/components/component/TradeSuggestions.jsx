// style
import styles from "./trade-suggestions.module.css";

export default function TradeSuggestion({ item, currentUserId }) {
  // Fallbacks if some data is missing
  const imageUrl =
    item?.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image";
  const title = item?.title || "Untitled Item";
  const ownerName = item?.user?.name || "Unknown Owner";
  const isOwner = item?.user?.id === currentUserId;

  return (
    <div className={styles.trCont}>
      <div className={styles.trTop}>
        <img src={imageUrl} alt={title} />
      </div>
      <div className={styles.trBot}>
        <div className={styles.trTitle}>{title}</div>
        <div className={styles.trOwner}>
          by {ownerName}{" "}
          {isOwner && (
            <span className={styles.fromYourList}>(from Your List)</span>
          )}
        </div>
        {/* <div className={styles.trOwner}>by {ownerName}</div> */}
      </div>
    </div>
  );
}
