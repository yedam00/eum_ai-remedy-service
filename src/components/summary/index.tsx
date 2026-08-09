import styles from "./styles.module.css";

/* ========================================
 * Summary Wireframe
 * header · content(scroll) · floating button
 * S-Subjective · O-Objective · 첨부 사진 · 과거력
 * ======================================== */

export default function Summary() {
  return (
    <div className={styles.summary}>
      <div className={styles.header} />
      <div className={styles.content}>
        {/* 주관적 의견 S-Subjective */}
        <div className={`${styles.section} ${styles.sectionTall}`} />
        {/* 객관적 데이터 O-Objective */}
        <div className={`${styles.section} ${styles.sectionTall}`} />
        {/* 첨부 사진 */}
        <div className={styles.section} />
        {/* 과거력 */}
        <div className={styles.section} />
      </div>
      <div className={styles.floatingButton} />
    </div>
  );
}
