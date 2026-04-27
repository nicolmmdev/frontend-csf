"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css";
import KardexMovimientosModal from "./components/KardexMovimientosModal";

type KardexItem = {
  idProducto: number;
  nombre_producto: string;
  stock: number;
  costo: number;
  precioVenta: number;
};

export default function KardexPage() {
  const [data, setData] = useState<KardexItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const fetchData = async () => {
    const res = await api.get<KardexItem[]>("/movimientos/stock");
    setData(res.data.sort((a, b) => a.idProducto - b.idProducto));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Kardex</h2>

      <div className={styles.table}>
        <div className={styles.head}>
          <span>ID</span>
          <span>Producto</span>
          <span>Stock</span>
          <span>Costo</span>
          <span>Precio</span>
          <span></span>
        </div>

        {data.map((item) => (
          <div key={item.idProducto} className={styles.row}>
            <span>{item.idProducto}</span>
            <span>{item.nombre_producto}</span>
            <span className={styles.stock}>{item.stock}</span>
            <span>S/ {Number(item.costo).toFixed(2)}</span>
            <span className={styles.price}>
              S/ {Number(item.precioVenta).toFixed(2)}
            </span>

            <button className="button" onClick={() => setSelected(item.idProducto)}>
              Ver
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <KardexMovimientosModal
          idProducto={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}