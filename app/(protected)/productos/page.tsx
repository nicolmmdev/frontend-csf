"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Producto } from "@/types";
import styles from "./productos.module.css";

export default function Productos() {
  const [data, setData] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [form, setForm] = useState({
    nombre_producto: "",
    nroLote: "",
    costo: 0,
  });

  const fetchProductos = async (): Promise<void> => {
    const res = await api.get<Producto[]>("/productos");
    setData(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProductos();
  }, []);

  const handleCreate = async (): Promise<void> => {
    await api.post("/productos", {
      ...form,
      precioVenta: form.costo * 1.35,
    });

    setShowModal(false);
    fetchProductos();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Productos</h2>

      <button
        className={styles.button}
        onClick={() => setShowModal(true)}
      >
        Nuevo producto
      </button>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lote</th>
            <th>Costo</th>
            <th>Precio</th>
          </tr>
        </thead>

        <tbody>
          {data.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nombre_producto}</td>
              <td>{p.nroLote}</td>
              <td>{p.costo}</td>
              <td>{p.precioVenta}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Nuevo Producto</h3>

            <input
              placeholder="Nombre"
              onChange={(e) =>
                setForm({ ...form, nombre_producto: e.target.value })
              }
            />

            <input
              placeholder="Lote"
              onChange={(e) =>
                setForm({ ...form, nroLote: e.target.value })
              }
            />

            <input
              placeholder="Costo"
              type="number"
              onChange={(e) =>
                setForm({ ...form, costo: Number(e.target.value) })
              }
            />

            <button onClick={handleCreate}>Guardar</button>

            <button onClick={() => setShowModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}