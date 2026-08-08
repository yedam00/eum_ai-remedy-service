import styles from "./styles.module.css";

/* ========================================
 * Home Wireframe
 * header · gap · content · gap · button · gap · navigation
 * ======================================== */

export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.header} />
      <div className={styles.gap40} />
      <div className={styles.content} />
      <div className={styles.gap380} />
      <div className={styles.button} />
      <div className={styles.gap48} />
      <div className={styles.navigation} />
    </div>
  );
}
