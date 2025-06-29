// style
import styles from "./my-listed-card-item.module.css";
import general from "../../styles/general.module.css";

export default function MyListedCardItem({ item, onEdit, onDelete }) {
  if (!item) return null;

  return (
    <div className={styles.cardItemCont}>
      <div className={styles.cardHeader}>
        <CardDetails item={item} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

function CardDetails({ item, onEdit, onDelete }) {
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      onDelete();
    }
  };

  return (
    <>
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
            {/* <span>{item.status}</span> */}
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
            <div className={styles.cardDelete} onClick={handleDeleteClick}>
              <i className="fa-solid fa-trash"></i>
            </div>
            <div className={styles.cardEdit} onClick={onEdit}>
              <i className="fa-solid fa-pen-to-square"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
