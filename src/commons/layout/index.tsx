"use client";

import { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "../components/header";
import {
  NavigationBar,
  type NavigationMenu,
} from "../components/navigation";
import {
  UrlKey,
  getLayoutByPath,
  getUrlMetaByPath,
  getUrlPath,
} from "../constants/url";
import styles from "./styles.module.css";

/* ========================================
 * Types — Layout shell (Figma Header 2058:8210 · navigation 317:3795)
 * ======================================== */

export type LayoutProps = {
  children: ReactNode;
};

/* ========================================
 * Constants — menu ↔ route 연동
 * ======================================== */

const MENU_PATH: Partial<Record<NavigationMenu, string>> = {
  home: getUrlPath(UrlKey.HOME),
};

const PATH_MENU: Record<string, NavigationMenu> = {
  [getUrlPath(UrlKey.HOME)]: "home",
};

/* ========================================
 * Helpers
 * ======================================== */

const resolveSelectedMenu = (pathname: string): NavigationMenu =>
  PATH_MENU[pathname] ?? "home";

/* ========================================
 * Component
 * ======================================== */

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const layoutVisibility = getLayoutByPath(pathname);
  const urlMeta = getUrlMetaByPath(pathname);

  /** 미등록 경로는 Figma 홈 레이아웃(헤더·내비 노출)을 기본값으로 사용 */
  const showHeader = layoutVisibility?.header.visible ?? true;
  const showNavigation = layoutVisibility?.navigation ?? true;
  const headerState = layoutVisibility?.header.backButton ? "chat" : "home";
  const selectedMenu = resolveSelectedMenu(pathname);

  const handleMenuClick = (menu: NavigationMenu) => {
    const path = MENU_PATH[menu];
    if (path) {
      router.push(path);
    }
  };

  const handleBack = () => {
    // chat 페이지에서는 /home으로 직접 이동
    if (pathname === getUrlPath(UrlKey.CHAT)) {
      router.push(getUrlPath(UrlKey.HOME));
    } else {
      router.back();
    }
  };

  return (
    <div className={styles.layout}>
      {showHeader ? (
        <Header
          className={styles.header}
          state={headerState}
          title={urlMeta?.label}
          onBack={handleBack}
        />
      ) : null}
      <main
        className={
          showHeader
            ? `${styles.children} ${styles.gap40}`
            : styles.children
        }
      >
        {children}
      </main>
      {showNavigation ? (
        <div className={styles.navigation}>
          <NavigationBar
            selectedMenu={selectedMenu}
            onMenuClick={handleMenuClick}
          />
        </div>
      ) : null}
    </div>
  );
}
