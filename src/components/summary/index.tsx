"use client";

import { useRouter } from "next/navigation";
import SummaryItem from "@/commons/components/summary-item";
import Button from "@/commons/components/button";
import Header from "@/commons/components/header";
import { LockOpen } from "@/commons/components/icons";
import styles from "./styles.module.css";

/* ========================================
 * Summary UI
 * header · content(scroll) · floating button
 * Figma header 2076:5921 · content 454:5872 · button 451:5698
 * ======================================== */

const MEDIA_IMAGE_URLS = [
  "/images/level1.png",
  "/images/level2.png",
  "/images/level3.png",
  "/images/level4.png",
  "/images/level5.png",
  "/images/level1.png",
];

export default function Summary() {
  const router = useRouter();

  return (
    <div className={styles.summary}>
      <div className={styles.header}>
        <Header
          state="chat"
          title="문진 요약 차트 - 의료진용"
          onBack={() => router.back()}
        />
      </div>

      <div className={styles.content}>
        {/* S-Subjective 주관적 의견 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>S-Subjective 주관적 의견</h2>
          <div className={styles.sectionBody}>
            <SummaryItem
              variant="default"
              label="주소(Chief Complaint)"
              answerLabel="두통(Headache)"
            />
            <SummaryItem
              variant="default"
              label="발생 시점"
              answerLabel="며칠에 걸침"
            />
            <SummaryItem
              variant="default"
              label="통증 양상"
              answerLabel="어지럽거나 속이 메스껍고 토할 거 같다"
            />
            <SummaryItem
              variant="default"
              label="통증 강도"
              answerLabel="NRS 기준 6~7단계 매우 아픔 표현"
            />
            <SummaryItem
              variant="default"
              label="외상력 및 선행 사건"
              answerLabel="최근 머리를 세게 부딪힌 명확한 외상 이력이 존재함."
            />
            <SummaryItem
              variant="default"
              label="동반 증상"
              answerLabel="몸이 한쪽으로 기울거나 걸음걸이가 눈에 띄게 비틀거리는 현상(보행 장애 및 균형 감각 상실) 동반됨."
            />
            <SummaryItem
              variant="media"
              label="첨부한 사진"
              imageUrls={MEDIA_IMAGE_URLS}
            />
          </div>
        </section>

        {/* O-Objective 객관적 데이터 */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>O-Objective 객관적 데이터</h2>
          <div className={styles.sectionBody}>
            <SummaryItem
              variant="list"
              label="복용 약물"
              answerLabel={["당뇨약", "진통제", "고혈압약"]}
            />
            <SummaryItem
              variant="list"
              label="과거력"
              answerLabel={["당뇨", "고혈압"]}
            />
          </div>
        </section>

        {/* 환자 추가 질문 */}
        <section className={styles.section}>
          <SummaryItem
            variant="opinion"
            title="환자 추가 질문"
            answerLabel="재발하지 않으려면 평상시에 어떻게 관리해야할까요?"
          />
        </section>
      </div>

      <div className={styles.floatingButton}>
        <Button
          className={styles.exitButton}
          variant="default"
          state="default"
          size="md"
          label="의료진 모드 종료"
          leftIcon={<LockOpen />}
        />
      </div>
    </div>
  );
}
