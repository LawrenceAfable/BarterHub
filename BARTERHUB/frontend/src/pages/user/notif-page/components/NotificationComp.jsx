import styles from "./notification-comp.module.css";

export default function NotificationComp({ notif }) {
  return (
    <div className={styles.notifComp}>
      <div className={styles.ncImageCont}>
        <img
          src={notif.user?.profile_picture || "/slide2.svg"}
          alt="notif-icon"
        />
      </div>
      <div className={styles.ncDetailCont}>
        <div className={styles.ncName}>{notif.type.replace("_", " ")}</div>
        <div className={styles.ncDetails}>{notif.content}</div>
        <div className={styles.ncTime}>
          {new Date(notif.created_at)
            .toLocaleString("en-US", {
              weekday: "long", // "Monday"
              year: "numeric", // "2025"
              month: "long", // "June"
              day: "numeric", // "29"
              hour: "numeric", // "4"
              minute: "2-digit", // "45"
              hour12: true, // 12-hour format
            })
            .replace(",", "")}{" "}
        </div>
      </div>
    </div>
  );
}
