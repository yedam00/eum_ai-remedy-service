"use client";

import SpeechBubble from "@/commons/components/speech-bubble";
import Button from "@/commons/components/button";
import { EditPencile } from "@/commons/components/icons";
import styles from "./styles.module.css";
import { useLinkRouting } from "./hooks/index.link.routing.hook";

/* ========================================
 * Home UI
 * content · gap · button · gap · navigation
 * Figma content 2045:7819 · button 2048:8021
 * (header · gap40 · navigation은 Layout에서 제공)
 * ======================================== */

export default function Home() {
  const { handleStartButtonClick } = useLinkRouting();

  return (
    <div className={styles.home} data-testid="home-container">
      <div className={styles.content}>
        <SpeechBubble
          variant="ai"
          hasImage={false}
          label={"예담님, 안녕하세요\n저는 의료 도우미 AI OO입니다."}
          userLabel=""
        />
        <SpeechBubble
          variant="ai"
          hasImage={false}
          label="어디가 불편하신가요?"
          userLabel=""
        />
      </div>
      <div className={styles.gap380} />
      <div className={styles.button}>
        <Button
          className={styles.startButton}
          variant="default"
          state="default"
          size="lg"
          label="문진 시작하기"
          leftIcon={<EditPencile />}
          onClick={handleStartButtonClick}
          data-testid="home-start-button"
        />
      </div>
      <div className={styles.gap48} />
      <div className={styles.navigation} />
    </div>
  );
}
