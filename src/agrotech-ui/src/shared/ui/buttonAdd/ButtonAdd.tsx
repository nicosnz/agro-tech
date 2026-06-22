import type { ReactNode } from "react";
import styles from "./button.module.css";

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="7.5" y1="1" x2="7.5" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="1" y1="7.5" x2="14" y2="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface Props {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

export const ButtonAdd = ({ label, onClick, icon = <PlusIcon /> }: Props) => {
  return (
    <button onClick={onClick} className={styles["button-add"]}>
      {icon}
      <span className={styles["button-add__label"]}>{label}</span>
    </button>
  );
};
