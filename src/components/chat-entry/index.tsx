import styles from "./styles.module.css";

/* ========================================
 * ChatEntry Wireframe
 * header · gap · content · gap · voice button · gap · chat-input-area
 * ======================================== */

export default function ChatEntry() {
  return (
    <div className={styles.chatEntry}>
      <div className={styles.header} />
      <div className={styles.gap40} />
      <div className={styles.content} />
      <div className={styles.gap205} />
      <div className={styles.voiceButton} />
      <div className={styles.gap195} />
      <div className={styles.chatInputArea} />
    </div>
  );
}
