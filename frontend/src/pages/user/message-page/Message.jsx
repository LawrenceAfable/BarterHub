// style
import styles from "./message.module.css";

// layout
import UserLayout from "../../../layouts/user-layout/UserLayour";

// component
import MessageComp from "./components/MessageComp";



export default function Message() {
  return (
    <UserLayout>
      <div className={styles.messagePage}>
        <div className={styles.mpHeader}>
          <h3>Messages</h3>
          <div className={styles.mpIcon}>
            <i className="fa-solid fa-envelope"></i>
          </div>
        </div>
        <div className={styles.mBody}>
          <div className={styles.mMessagesCont}>
            <MessageComp />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
