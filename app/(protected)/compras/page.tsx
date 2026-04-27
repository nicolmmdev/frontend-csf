"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css";
import CompraCard from "./components/CompraCard/CompraCard";
import CompraModal from "./components/CompraModal/CompraModal";
import { Compra } from "@/types";
import CompraDetalleModal from "./components/CompraDetalleModal/CompraDetalleModal";

export default function Compras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchCompras = async () => {
    const res = await api.get<Compra[]>("/compras");
    console.log('res', res)
    setCompras(res.data);
  };
  const [detalleId, setDetalleId] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompras();
  }, []);

  return (
    <div className={styles.container}>

{detalleId && (
  <CompraDetalleModal
    key={detalleId} 
    id={detalleId}
    onClose={() => setDetalleId(null)}
  />
)}
      <div className={styles.header}>
        <h2>Compras</h2>

        <button onClick={() => setShowModal(true)}>
          + Nueva compra
        </button>
      </div>

      <div className={styles.grid}>
        {compras.map((c) => (
          <CompraCard key={c.id} compra={c} onVerDetalle={setDetalleId} />
        ))}
      </div>

      {showModal && (
        <CompraModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchCompras}
        />
      )}
    </div>
  );
}