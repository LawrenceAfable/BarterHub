import { useState } from 'react';
import styles from './user-nav.module.css';

export default function UserNav() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogoClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500); 
  };

  return (
    <nav className={styles.userNav}>
      <div
        className={`${styles.navLogo} ${isAnimating ? styles.animate : ''}`}
        onClick={handleLogoClick}
      >
        <h2 className={styles.navLogoFirst}>B_</h2>
        <h2 className={styles.navLogoSec}>H</h2>
      </div>
    </nav>
  );
}
