"use client";

import styles from "./loading.module.css";

export default function Loading({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}