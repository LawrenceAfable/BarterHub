import { useEffect, useState } from "react";
import styles from "./notification.module.css";
import NotificationComp from "./components/NotificationComp";
import UserLayout from "../../../layouts/user-layout/UserLayour";

// utils
import { fetchWithTokenRefresh } from "../../../utils/fetchWithTokenRefresh";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await fetch(import.meta.env.VITE_NOTIFICATIONS_API, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchNotifications();
  }, []);

  const handleClearNotifications = async () => {
    if (!window.confirm("Clear all notifications?")) return;
    const token = localStorage.getItem("access_token");

    try {
      const res = await fetch(import.meta.env.VITE_NOTIFICATIONS_API, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNotifications([]); // Clear frontend state
      } else {
        console.error("Failed to delete notifications");
      }
    } catch (err) {
      console.error("Error deleting notifications", err);
    }
  };

  return (
    <UserLayout>
      <div className={styles.notificationPage}>
        <div className={styles.npHeader}>
          <h3>Notifications</h3>
          <div className={styles.npIcon}>
            <i className="fa-solid fa-bell"></i>
          </div>
        </div>

        <div className={styles.npBody}>
          <div
            className={styles.npClearNotif}
            onClick={handleClearNotifications}
          >
            <i className="fa-solid fa-trash"></i>
          </div>

          <div className={styles.npNotifCont}>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationComp key={notif.id} notif={notif} />
              ))
            ) : (
              <p>No notifications yet.</p>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
