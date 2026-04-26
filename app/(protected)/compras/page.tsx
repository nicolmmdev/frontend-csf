"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Item, CompraRequest } from "@/types";

export default function Compras() {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = (): void => {
    setItems([...items, { idProducto: 0, cantidad: 0, precio: 0 }]);
  };

  const updateItem = (index: number, field: keyof Item, value: number): void => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const save = async (): Promise<void> => {
    const payload: CompraRequest = { items };
    await api.post("/compras", payload);
    alert("Compra registrada");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Compras</h2>

      {items.map((item, index) => (
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
        </div>
      ))}

      <button onClick={addItem}>Agregar producto</button>
      <button onClick={save}>Guardar compra</button>
    </div>
  );
}