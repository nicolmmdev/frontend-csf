"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Producto } from "@/types";
import styles from "./page.module.css";
import ProductoCard from "./components/ProductoCard/ProductoCard";
import ProductoModal from "./components/ProductoModal/ProductoModal";


export default function Productos() {
  const [data, setData] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProductos = async () => {
    const res = await api.get<Producto[]>("/productos");
    setData(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductos();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Productos</h2>

        <button onClick={() => setShowModal(true)}>
          + Nuevo producto
        </button>
      </div>

      <div className={styles.grid}>
        {data.map((p) => (
          <ProductoCard key={p.id_producto} producto={p} />
        ))}
      </div>

      {showModal && (
        <ProductoModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchProductos}
        />
      )}
    </div>
  );
}