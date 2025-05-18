import Link from "next/link";
import { Flag, Home } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import styles from "./navbar.module.css";

const NavBar = () => {
  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <Link
              href="/"
              className={styles.logo}
              aria-label="Formula 1 Champions Home"
            >
              <Flag className={styles.logoIcon} aria-hidden="true" />
              <span className={styles.logoText}>F1</span>
              <span className={styles.logoSubtext}>Champions</span>
            </Link>
          </div>
          <div className={styles.actions}>
            <Link href="/" className={styles.navLink} aria-current="page">
              <Home className={styles.navLinkIcon} aria-hidden="true" />
              Home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
