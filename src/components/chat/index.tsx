import ChatInput from "@/commons/components/chatinput";
import styles from "./styles.module.css";

/* ========================================
 * Chat Wireframe
 * header · content · chat-input
 * ======================================== */

export default function Chat() {
  return (
    <div className={styles.chat}>
      <div className={styles.header} />
      <div className={styles.content} />
      <div className={styles.chatInput}>
        <ChatInput uitype="option-trio" />
      </div>
    </div>
  );
}
