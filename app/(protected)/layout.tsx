"use client";

import Sidebar from "@/components/layout/Sidebar/Sidebar";import styles from "./layout.module.css";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}