"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./KardexMovimientosModal.module.css";
import { v4 as uuid } from "uuid";

type Movimiento = {
  id: number;
  tipo: number;
  cantidad: number;
  fecha: string;
};

export default function KardexMovimientosModal({
  idProducto,
  onClose,
}: {
  idProducto: number;
  onClose: () => void;
}) {
  const [data, setData] = useState<Movimiento[]>([]);

  useEffect(() => {
    api
      .get<Movimiento[]>(`/movimientos/${idProducto}`)
      .then((res) => setData(res.data));
  }, [idProducto]);

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Movimientos Producto #{idProducto}</h3>

        <div className={styles.table}>
          <div className={styles.head}>
            <span>Fecha</span>
            <span>Tipo</span>
            <span>Cantidad</span>
          </div>

          {data.map((m) => (
            <div key={uuid()} className={styles.row}>
              <span>
                {new Date(m.fecha).toLocaleDateString()}
              </span>

              <span
                className={
                  m.tipo === 1 ? styles.entrada : styles.salida
                }
              >
                {m.tipo === 1 ? "Entrada" : "Salida"}
              </span>

              <span>{m.cantidad}</span>
            </div>
          ))}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}