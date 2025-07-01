// style
import styles from "./user-sidebar.module.css";

// React
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UserSideBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear tokens from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  return (
    <div className={styles.sbContainer}>
      <div className={styles.sbWrapper}>
        <NavLink
          to="/home"
          end
          className={({ isActive }) =>
            `${styles.sbItems} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.sbIcon}>
            <i className="fa-solid fa-home"></i>
          </div>
          <div className={styles.sbTitle}>Home</div>
        </NavLink>

        <NavLink
          to="/explore"
          end
          className={({ isActive }) =>
            `${styles.sbItems} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.sbIcon}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <div className={styles.sbTitle}>Explore</div>
        </NavLink>

        <NavLink
          to="/notification"
          end
          className={({ isActive }) =>
            `${styles.sbItems} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.sbIcon}>
            <i className="fa-solid fa-bell"></i>
          </div>
          <div className={styles.sbTitle}>Notifications</div>
        </NavLink>

        <NavLink
          to="/add-item"
          end
          className={({ isActive }) =>
            `${styles.sbItems} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.sbIcon}>
            <i className="fa-solid fa-plus"></i>
          </div>
          <div className={styles.sbTitle}>Add Item</div>
        </NavLink>

        <NavLink
          to="/match"
          end
          className={({ isActive }) =>
            `${styles.sbItems} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.sbIcon}>
            <i className="fa-solid fa-heart"></i>
          </div>
          <div className={styles.sbTitle}>Match</div>
        </NavLink>

        <NavLink
          to="/messages"
          end
          className={({ isActive }) =>
            `${styles.sbItems} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.sbIcon}>
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className={styles.sbTitle}>Messages</div>
        </NavLink>

        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.sbItems} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.sbIcon}>
            <i className="fa-solid fa-user"></i>
          </div>
          <div className={styles.sbTitle}>Profile</div>
        </NavLink>

        <NavLink
          onClick={handleLogout}
          to="/login"
          end
          className={({ isActive }) =>
            `${styles.sbItems} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.sbIcon}>
            <i className="fa-solid fa-right-from-bracket"></i>
          </div>
          <div className={styles.sbTitle}>Logout</div>
        </NavLink>
      </div>
    </div>
  );
}
