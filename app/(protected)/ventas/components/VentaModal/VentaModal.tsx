"use client";

import { useState } from "react";
import styles from "./VentaModal.module.css";
import { Producto, Item, VentaRequest } from "@/types";
import api from "@/lib/api";

type ItemUI = Item & { uuid: string; stock: number };

export default function VentaModal({
  productos,
  stockMap,
  onClose,
  onSuccess,
}: {
  productos: Producto[];
  stockMap: Record<number, number>;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [items, setItems] = useState<ItemUI[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        uuid: crypto.randomUUID(),
        idProducto: 0,
        cantidad: 1,
        precio: 0,
        stock: 0,
      },
    ]);
  };

  const removeItem = (uuid: string) => {
    setItems((prev) => prev.filter((i) => i.uuid !== uuid));
  };

  const updateItem = (uuid: string, data: Partial<ItemUI>) => {
    setItems((prev) =>
      prev.map((i) => (i.uuid === uuid ? { ...i, ...data } : i))
    );
  };

  const selectedIds = items.map((i) => i.idProducto);

  const calcSubtotal = (i: ItemUI) => i.cantidad * i.precio;
  const calcIgv = (i: ItemUI) => calcSubtotal(i) * 0.18;
  const calcTotal = (i: ItemUI) => calcSubtotal(i) + calcIgv(i);

  const subtotal = items.reduce((acc, i) => acc + calcSubtotal(i), 0);
  const igv = items.reduce((acc, i) => acc + calcIgv(i), 0);
  const total = subtotal + igv;

  const handleCreate = async () => {
    setError("");

    if (items.length === 0) {
      setError("Agrega al menos un producto");
      return;
    }

    for (const i of items) {
      if (!i.idProducto) {
        setError("Selecciona todos los productos");
        return;
      }
      if (i.cantidad <= 0) {
        setError("Cantidad inválida");
        return;
      }
      if (i.cantidad > i.stock) {
        setError("Cantidad no puede ser mayor al stock");
        return;
      }
    }

    const payload: VentaRequest = {
      items: items.map(({ uuid, stock, ...rest }) => rest),
    };

    try {
      setLoading(true);
      await api.post("/ventas", payload);
      onSuccess();
      onClose();
    } catch {
      setError("Error al registrar venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Nueva Venta</h3>

        {items.map((item) => (
          <div key={item.uuid} className={styles.row}>
            <select
              value={item.idProducto || ""}
              onChange={(e) => {
                setError("");
                const id = Number(e.target.value);

                const prod = productos.find(
                  (p) => p.id_producto === id
                );
                if (!prod) return;

                const already = items.some(
                  (i) => i.idProducto === id && i.uuid !== item.uuid
                );
                if (already) {
                  setError("Producto ya agregado");
                  return;
                }

                updateItem(item.uuid, {
                  idProducto: id,
                  precio: Number(prod.precioVenta),
                  stock: stockMap[id] || 0,
                });
              }}
            >
              <option value="">Producto</option>

              {productos.map((p) => {
                const disabled =
                  selectedIds.includes(p.id_producto) &&
                  item.idProducto !== p.id_producto;

                return (
                  <option
                    key={p.id_producto}
                    value={p.id_producto}
                    disabled={disabled}
                  >
                    {p.nombre_producto}
                    {disabled ? " (ya agregado)" : ""}
                  </option>
                );
              })}
            </select>

            <input
              type="number"
              min={1}
              max={item.stock}
              value={item.cantidad}
              onChange={(e) =>
                updateItem(item.uuid, {
                  cantidad: Number(e.target.value),
                })
              }
            />

            <span className={styles.stock}>
              Stock: {item.stock}
            </span>

            <button onClick={() => removeItem(item.uuid)}>✕</button>

            <div className={styles.calc}>
              <small>Sub: S/ {calcSubtotal(item).toFixed(2)}</small>
              <small>IGV: S/ {calcIgv(item).toFixed(2)}</small>
              <strong>Total: S/ {calcTotal(item).toFixed(2)}</strong>
            </div>
          </div>
        ))}

        <button className={styles.addBtn} onClick={addItem}>
          + Agregar producto
        </button>

        <div className={styles.summary}>
          <p>Subtotal: S/ {subtotal.toFixed(2)}</p>
          <p>IGV: S/ {igv.toFixed(2)}</p>
          <h4>Total: S/ {total.toFixed(2)}</h4>
        </div>

        {error && <span className={styles.error}>{error}</span>}

        <div className={styles.actions}>
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}