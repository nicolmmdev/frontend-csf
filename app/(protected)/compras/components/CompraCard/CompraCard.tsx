import styles from "./CompraCard.module.css";
import { Compra } from "@/types";

export default function CompraCard({
  compra,
  onVerDetalle,
}: {
  compra: Compra;
  onVerDetalle: (id: number) => void;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4>Compra #{compra.id}</h4>
        <span className={styles.badge}>Compra</span>
      </div>

      <div className={styles.row}>
        <span>Subtotal</span>
        <strong>S/ {Number(compra.subTotal).toFixed(2)}</strong>
      </div>

      <div className={styles.row}>
        <span>IGV</span>
        <strong>S/ {Number(compra.igv).toFixed(2)}</strong>
      </div>

      <div className={styles.total}>
        <span>Total</span>
        <strong>S/ {Number(compra.total).toFixed(2)}</strong>
      </div>

      <div className={styles.footer}>
        <small>
          {new Date(compra.fecRegistro).toLocaleDateString("es-PE")}
        </small>

        <button onClick={() => onVerDetalle(compra.id)}>
          Ver detalle
        </button>
      </div>
    </div>
  );
}