import styles from "./ProductoCard.module.css";
import { Producto } from "@/types";

export default function ProductoCard({ producto }: { producto: Producto }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>{producto.nombre_producto}</h4>
        <span className={styles.lote}>{producto.nroLote}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.row}>
          <span>Costo</span>
          <strong>S/ {Number(producto.costo).toFixed(2)}</strong>
        </div>

        <div className={styles.row}>
          <span>Precio</span>
          <strong className={styles.price}>
            S/ {Number(producto.precioVenta).toFixed(2)}
          </strong>
        </div>
      </div>
    </div>
  );
}