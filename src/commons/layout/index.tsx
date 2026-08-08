import { type ReactNode } from "react";
import styles from "./styles.module.css";

export type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header} />
      <div className={styles.gap40} />
      <main className={styles.content}>{children}</main>
      <div className={styles.gap380} />
      <div className={styles.button} />
      <div className={styles.gap48} />
      <nav className={styles.navigation} />
    </div>
  );
}
