"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Movimiento } from "@/types";

export default function Kardex() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get<Movimiento[]>("/kardex");
      setMovimientos(res.data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Kardex</h2>

      {movimientos.map((m) => (
        <div key={m.id}>
          <p>
            Producto: {m.idProducto} | Tipo: {m.tipo} | Cantidad: {m.cantidad}
          </p>
        </div>
      ))}
    </div>
  );
}