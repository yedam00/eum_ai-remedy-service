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

type ModalPosition = "center" | "top";

type ModalContextValue = {
  isOpen: boolean;
  openModal: (content: ReactNode, position?: ModalPosition) => void;
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
  position: ModalPosition;
};

const ModalPortal = ({ children, onClose, position }: ModalPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const overlayClass =
    position === "top" ? styles.overlayTop : styles.overlay;
  const modalClass = position === "top" ? styles.modalTop : styles.modal;

  return createPortal(
    <div className={overlayClass} onClick={onClose} role="presentation">
      <div
        className={modalClass}
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
  const [position, setPosition] = useState<ModalPosition>("center");

  const openModal = (nextContent: ReactNode, nextPosition: ModalPosition = "center") => {
    setContent(nextContent);
    setPosition(nextPosition);
  };

  const closeModal = () => {
    setContent(null);
    setPosition("center");
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
        <ModalPortal onClose={closeModal} position={position}>
          {content}
        </ModalPortal>
      )}
    </ModalContext.Provider>
  );
}
