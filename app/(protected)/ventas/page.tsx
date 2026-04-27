"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css";
import { Producto, Item, VentaRequest } from "@/types";

type StockMap = Record<number, number>;
type CartItem = Item & {
  uuid: string;
  nombre: string;
  stock: number;
};

export default function VentasPOS() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [stockMap, setStockMap] = useState<StockMap>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    const [prodRes, stockRes] = await Promise.all([
      api.get<Producto[]>("/productos"),
      api.get<{ idProducto: number; stock: number }[]>("/movimientos/stock"),
    ]);

    setProductos(prodRes.data);

    const map: StockMap = {};
    stockRes.data.forEach((s) => (map[s.idProducto] = s.stock));
    setStockMap(map);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return productos.filter((p) =>
      p.nombre_producto.toLowerCase().includes(q)
    );
  }, [search, productos]);

  // ➕ agregar al carrito
  const addToCart = (p: Producto) => {
    setError("");

    const exists = cart.find((c) => c.idProducto === p.id_producto);
    if (exists) {
      // incrementar cantidad si no supera stock
      const nextQty = exists.cantidad + 1;
      const stock = stockMap[p.id_producto] || 0;
      if (nextQty > stock) {
        setError("No hay stock suficiente");
        return;
      }
      updateItem(exists.uuid, { cantidad: nextQty });
      return;
    }

    setCart((prev) => [
      ...prev,
      {
        uuid: crypto.randomUUID(),
        idProducto: p.id_producto,
        nombre: p.nombre_producto,
        precio: Number(p.precioVenta),
        cantidad: 1,
        stock: stockMap[p.id_producto] || 0,
      },
    ]);
  };

  const removeItem = (uuid: string) => {
    setCart((prev) => prev.filter((i) => i.uuid !== uuid));
  };

  const updateItem = (
    uuid: string,
    data: Partial<Pick<CartItem, "cantidad">>
  ) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.uuid !== uuid) return i;

        const next = { ...i, ...data };
        if (next.cantidad > i.stock) {
          setError("Cantidad mayor al stock");
          return i;
        }
        if (next.cantidad <= 0) return i;

        return next;
      })
    );
  };

  // 🧮 cálculos
  const calcSub = (i: CartItem) => i.cantidad * i.precio;
  const calcIgv = (i: CartItem) => calcSub(i) * 0.18;
  const calcTot = (i: CartItem) => calcSub(i) + calcIgv(i);

  const subtotal = cart.reduce((a, i) => a + calcSub(i), 0);
  const igv = cart.reduce((a, i) => a + calcIgv(i), 0);
  const total = subtotal + igv;

  // 💾 guardar venta
  const handleSave = async () => {
    setError("");

    if (cart.length === 0) {
      setError("Agrega productos");
      return;
    }

    for (const i of cart) {
      if (i.cantidad > i.stock) {
        setError("Cantidad mayor al stock");
        return;
      }
    }

    const payload: VentaRequest = {
      items: cart.map(({ uuid, nombre, stock, ...rest }) => rest),
    };

    try {
      setLoading(true);
      await api.post("/ventas", payload);
      setCart([]);
      await fetchAll();
    } catch {
      setError("Error al guardar venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.topBar}>
          <h2>Ventas</h2>
          <input
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.grid}>
          {filtered.map((p) => {
            const stock = stockMap[p.id_producto] || 0;
            const disabled = stock <= 0;

            return (
              <div
                key={p.id_producto}
                className={`${styles.card} ${
                  disabled ? styles.disabled : ""
                }`}
                onClick={() => !disabled && addToCart(p)}
              >
                <h4>{p.nombre_producto}</h4>
                <p className={styles.price}>
                  S/ {Number(p.precioVenta).toFixed(2)}
                </p>
                <small>Stock: {stock}</small>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.right}>
        <h3>Detalle</h3>

        <div className={styles.cart}>
          {cart.map((i) => (
            <div key={i.uuid} className={styles.cartItem}>
              <div>
                <strong>{i.nombre}</strong>
                <small>Stock: {i.stock}</small>
              </div>

              <div className={styles.controls}>
                <button onClick={() => updateItem(i.uuid, { cantidad: i.cantidad - 1 })}>
                  -
                </button>
                <input
                  value={i.cantidad}
                  onChange={(e) =>
                    updateItem(i.uuid, {
                      cantidad: Number(e.target.value),
                    })
                  }
                />
                <button onClick={() => updateItem(i.uuid, { cantidad: i.cantidad + 1 })}>
                  +
                </button>
              </div>

              <div className={styles.prices}>
                <small>S/ {calcSub(i).toFixed(2)}</small>
                <small>IGV: S/ {calcIgv(i).toFixed(2)}</small>
                <strong>S/ {calcTot(i).toFixed(2)}</strong>
              </div>

              <button onClick={() => removeItem(i.uuid)}>✕</button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <p>Subtotal: S/ {subtotal.toFixed(2)}</p>
          <p>IGV: S/ {igv.toFixed(2)}</p>
          <h4>Total: S/ {total.toFixed(2)}</h4>
        </div>

        {error && <span className={styles.error}>{error}</span>}

        <button
          className={styles.save}
          onClick={handleSave}
          disabled={cart.length === 0 || loading}
        >
          {loading ? "Guardando..." : "Guardar venta"}
        </button>
      </div>
    </div>
  );
}