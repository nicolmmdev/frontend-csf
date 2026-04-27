"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CompraDetalle } from "@/types";
import styles from "./CompraDetalleModal.module.css";
import { v4 as uuid } from "uuid";
export default function CompraDetalleModal({
  id,
  onClose,
}: {
  id: number;
  onClose: () => void;
}) {
  const [detalle, setDetalle] = useState<CompraDetalle[]>([]);

  useEffect(() => {
    api.get<CompraDetalle[]>(`/compras/${id}`)
      .then(res => setDetalle(res.data));
  }, [id]);

  const total = detalle.reduce((acc, i) => acc + Number(i.total), 0);

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Detalle Compra #{id}</h3>

        <div className={styles.headerRow}>
  <span>Producto</span>
  <span>Cant.</span>
  <span>Total</span>
</div>

        {detalle.length === 0 ? (
          <p>Cargando...</p>
        ) : (
          detalle.map((d, index) => (
            <div key={uuid()} className={styles.item}>
              <strong>{d.nombre_producto}</strong>
              <span>{d.cantidad} x S/ {d.precio}</span>
              <span>S/ {d.total}</span>
            </div>
          ))
        )}

<p className={styles.total}>
  Total: <strong>S/ {total.toFixed(2)}</strong>
</p>

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}