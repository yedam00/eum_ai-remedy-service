"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.css";

/* ========================================
 * Types
 * ======================================== */

type ModalContextValue = {
  isOpen: boolean;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
};

type ModalProviderProps = {
  children: ReactNode;
};

/* ========================================
 * Context
 * ======================================== */

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};

/* ========================================
 * ModalPortal — createPortal based modal shell
 * ======================================== */

type ModalPortalProps = {
  children: ReactNode;
  onClose: () => void;
};

const ModalPortal = ({ children, onClose }: ModalPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

/* ========================================
 * ModalProvider
 * ======================================== */

export default function ModalProvider({ children }: ModalProviderProps) {
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = (nextContent: ReactNode) => {
    setContent(nextContent);
  };

  const closeModal = () => {
    setContent(null);
  };

  const value: ModalContextValue = {
    isOpen: content !== null,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      {content !== null && (
        <ModalPortal onClose={closeModal}>{content}</ModalPortal>
      )}
    </ModalContext.Provider>
  );
}
