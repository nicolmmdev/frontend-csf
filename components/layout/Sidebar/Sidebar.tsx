"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const go = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const isActive = (path: string) => pathname.startsWith(path);

  const logout = () => {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();

      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=None;Secure`;
    });

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/login";
  };

  return (
    <>
      <button className={styles.toggle} onClick={() => setOpen(!open)}>
        ☰
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`${styles.container} ${open ? styles.open : ""}`}>
        <div>
          <h3 className={styles.logo}>Clínica San Felipe</h3>

          <nav className={styles.menu}>
            <div
              className={`${styles.item} ${
                isActive("/productos") ? styles.active : ""
              }`}
              onClick={() => go("/productos")}
            >
              Productos
            </div>

            <div
              className={`${styles.item} ${
                isActive("/compras") ? styles.active : ""
              }`}
              onClick={() => go("/compras")}
            >
              Compras
            </div>

            <div
              className={`${styles.item} ${
                isActive("/ventas") ? styles.active : ""
              }`}
              onClick={() => go("/ventas")}
            >
              Ventas
            </div>

            <div
              className={`${styles.item} ${
                isActive("/kardex") ? styles.active : ""
              }`}
              onClick={() => go("/kardex")}
            >
              Kardex
            </div>
          </nav>
        </div>

        <div className={styles.logout} onClick={logout}>
          Logout
        </div>
      </aside>
    </>
  );
}