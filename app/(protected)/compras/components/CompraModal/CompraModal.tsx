"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./CompraModal.module.css";
import { Producto, Item, CompraRequest } from "@/types";

export default function CompraModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [items, setItems] = useState<Item[]>([

  ]); const [error, setError] = useState("");

  useEffect(() => {
    api.get<Producto[]>("/productos").then((res) => {
      setProductos(res.data);
    });

  }, []);


  const addItem = () => {
    setItems([...items, { idProducto: 0, cantidad: 1, precio: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Item, value: number) => {
    console.log('index0', index)
    console.log('value', value)
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const total = items.reduce(
    (acc, i) => acc + i.cantidad * i.precio,
    0
  );

  const handleCreate = async () => {
    setError("");

    // 🔥 1. mínimo 1 producto válido
    if (items.length === 0 || items.every(i => !i.idProducto)) {
      setError("Debes agregar al menos un producto");
      return;
    }

    // 🔥 2. validar campos
    for (const i of items) {
      if (!i.idProducto) {
        setError("Seleccione todos los productos");
        return;
      }
      if (i.cantidad <= 0) {
        setError("Cantidad inválida");
        return;
      }
    }

    // 🔥 3. evitar duplicados
    const ids = items.map(i => i.idProducto);
    const hasDuplicates = new Set(ids).size !== ids.length;

    if (hasDuplicates) {
      setError("No puedes repetir productos");
      return;
    }

    const payload: CompraRequest = { items };

    await api.post("/compras", payload);

    onSuccess();
    onClose();
  };
  const selectedIds = items.map(i => i.idProducto);
  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Nueva Compra</h3>

        {items.map((item, index) => (
          <div key={index} className={styles.row}>
            <select
              value={item.idProducto || ""}
              onChange={(e) => {
                setError("");

                const prod = productos.find(
                  (p) => p.id_producto === Number(e.target.value)
                );

                if (!prod) return;

                setItems((prev) => {
                  const newItems = [...prev];
                  newItems[index] = {
                    ...newItems[index],
                    idProducto: Number(prod.id_producto),
                    precio: Number(prod.costo),
                  };
                  return newItems;
                });
              }}
            >
              <option value="" disabled hidden>
                Selecciona producto
              </option>

              {productos.map((p) => {
                const isSelected = selectedIds.includes(p.id_producto);

                return (
                  <option
                    key={p.id_producto}
                    value={p.id_producto}
                    disabled={isSelected && item.idProducto !== p.id_producto}
                  >
                    {p.nombre_producto}
                  </option>
                );
              })}
            </select>

            <input
              type="number"
              min={1}
              value={item.cantidad}
              onChange={(e) => {
                setError("");
                updateItem(index, "cantidad", Number(e.target.value));
              }}
            />

            <span>S/ {item.precio}</span>

            <button onClick={() => removeItem(index)}>✕</button>
          </div>
        ))}

        <button className={styles.addBtn} onClick={addItem}>
          + Agregar producto
        </button>

        <p className={styles.total}>
          Total: <strong>S/ {total.toFixed(2)}</strong>
        </p>

        {error && <span className={styles.error}>{error}</span>}

        <div className={styles.actions}>
          <button
            onClick={handleCreate}
            disabled={
              items.length === 0 ||
              items.some(i => !i.idProducto || i.cantidad <= 0)
            }
          >
            Guardar
          </button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}