"use client";

import { useState } from "react";
import api from "@/lib/api";
import styles from "./ProductoModal.module.css";

export default function ProductoModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    nombre_producto: "",
    nroLote: "",
    costo: 0,
  });

  const [errors, setErrors] = useState({
    nombre: "",
    lote: "",
    costo: "",
  });

  const validate = () => {
    let valid = true;

    const newErrors = {
      nombre: "",
      lote: "",
      costo: "",
    };

    if (form.nombre_producto.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres";
      valid = false;
    }

    if (!form.nroLote.trim()) {
      newErrors.lote = "El lote no puede estar vacío";
      valid = false;
    }

    if (/\s/.test(form.nroLote)) {
      newErrors.lote = "El lote no debe contener espacios";
      valid = false;
    }

    if (!form.costo || form.costo <= 0) {
      newErrors.costo = "El costo debe ser mayor a 0";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const hasErrors = errors.nombre || errors.lote || errors.costo;

  const isValid =
    form.nombre_producto.trim().length >= 3 &&
    form.nroLote.trim().length > 0 &&
    !/\s/.test(form.nroLote) &&
    form.costo > 0 &&
    !hasErrors;

  const handleCreate = async () => {
    if (!validate()) return;

    await api.post("/productos", {
      ...form,
      precioVenta: Number((form.costo * 1.35).toFixed(2)),
      fec_registro: new Date().toISOString(),
    });

    onSuccess();
    onClose();
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={styles.title}>Nuevo Producto</h3>

        <input
          className={`${styles.input} ${errors.nombre ? styles.inputError : ""}`}
          placeholder="Nombre"
          value={form.nombre_producto}
          onChange={(e) => {
            setForm({ ...form, nombre_producto: e.target.value });
            setErrors({ ...errors, nombre: "" });
          }}
        />
        {errors.nombre && (
          <span className={styles.error}>{errors.nombre}</span>
        )}

        <input
          className={`${styles.input} ${errors.lote ? styles.inputError : ""}`}
          placeholder="Lote"
          value={form.nroLote}
          onChange={(e) => {
            const value = e.target.value.replace(/\s/g, "");
            setForm({ ...form, nroLote: value });
            setErrors({ ...errors, lote: "" });
          }}
        />
        {errors.lote && (
          <span className={styles.error}>{errors.lote}</span>
        )}

        <input
          className={`${styles.input} ${errors.costo ? styles.inputError : ""}`}
          type="number"
          placeholder="Costo"
          value={form.costo || ""}
          onChange={(e) => {
            setForm({ ...form, costo: Number(e.target.value) });
            setErrors({ ...errors, costo: "" });
          }}
        />
        {errors.costo && (
          <span className={styles.error}>{errors.costo}</span>
        )}

        <p className={styles.preview}>
          Precio estimado:{" "}
          <strong>S/ {(form.costo * 1.35).toFixed(2)}</strong>
        </p>

        <div className={styles.actions}>
          <button
            className={styles.saveBtn}
            onClick={handleCreate}
            disabled={!isValid}
          >
            Guardar
          </button>

          <button className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}