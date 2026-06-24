import { useEffect, type ReactNode } from "react";
import styles from "./Modal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAnterior?: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Modal = ({ isOpen, onClose, onAnterior, title, subtitle, children }: Props) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles["modal"]} onClick={onClose}>
      <div className={styles["modal__container"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["modal__header"]}>
          {onAnterior && (
            <button className={styles["modal__back"]} onClick={onAnterior}>
              <BackIcon />
            </button>
          )}
          <div className={styles["modal__header-content"]}>
            <h2 className={styles["modal__title"]}>{title}</h2>
            {subtitle && <p className={styles["modal__subtitle"]}>{subtitle}</p>}
          </div>
          <button className={styles["modal__close"]} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className={styles["modal__body"]}>
          {children}
        </div>
      </div>
    </div>
  );
};
