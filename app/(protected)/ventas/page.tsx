"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Item, VentaRequest } from "@/types";

export default function Ventas() {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (): void => {
    setItems([...items, { idProducto: 0, cantidad: 0, precio: 0 }]);
  };

  const updateItem = (index: number, field: keyof Item, value: number): void => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calcular = (item: Item) => {
    const subtotal = item.cantidad * item.precio;
    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    return { subtotal, igv, total };
  };

  const save = async (): Promise<void> => {
    const payload: VentaRequest = { items };
    await api.post("/ventas", payload);
    alert("Venta registrada");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Ventas</h2>

      {items.map((item, index) => {
        const { subtotal, igv, total } = calcular(item);

        return (
          <div key={index}>
            <input
              placeholder="ID Producto"
              onChange={(e) =>
                updateItem(index, "idProducto", Number(e.target.value))
              }
            />
            <input
              placeholder="Cantidad"
              onChange={(e) =>
                updateItem(index, "cantidad", Number(e.target.value))
              }
            />
            <input
              placeholder="Precio"
              onChange={(e) =>
                updateItem(index, "precio", Number(e.target.value))
              }
            />

            <p>Subtotal: {subtotal}</p>
            <p>IGV: {igv}</p>
            <p>Total: {total}</p>
          </div>
        );
      })}

      <button onClick={addItem}>Agregar</button>
      <button onClick={save}>Guardar venta</button>
    </div>
  );
}