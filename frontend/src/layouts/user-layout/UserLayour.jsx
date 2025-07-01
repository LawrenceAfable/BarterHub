// style
import styles from "./user-layout.module.css";

// components
import UserNav from "../../components/navigations/user-nav/UserNav";
import UserSideBar from "../../components/sidebar/user-sidebar/UserSidebar";

export default function UserLayout({ children, rightPanel = null }) {
  return (
    <>
      <UserNav />
      <main className={styles.userLayoutPage}>
        <section className={styles.ulPageWrapper}>
          <div className={styles.ulSection}>
            <UserSideBar />
          </div>
          <div className={styles.contentSection}>{children}</div>
          <div className={styles.xSection}>{rightPanel}</div>
        </section>
      </main>
    </>
  );
}
