"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import Loading from "@/components/ui/Loading/Loading";
import { emailRegex, passwordRegex, removeSpaces } from "@/utils/utils";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const router = useRouter();

  const blockSpaces = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Tab") e.preventDefault();
  };

  const blockPasteSpaces = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (/\s/.test(text)) e.preventDefault();
  };

  const validate = () => {
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!emailRegex.test(username)) {
      setEmailError("El correo no tiene un formato válido");
      hasError = true;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Mín. 5 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 símbolo"
      );
      hasError = true;
    }

    return hasError;
  };

  const handleLogin = async () => {
    if (validate()) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token2", res.data.access_token);
      document.cookie = `token2=${res.data.access_token}; path=/`;

      router.push("/compras");
    } catch {
      setPasswordError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {loading && <Loading text="Iniciando sesión..." />}

      <div className={styles.card}>
        <div className={styles.logo}>Clínica San Felipe</div>

        <label className={styles.label}>Ingrese su correo</label>

        <input
          value={username}
          className={`${styles.input} ${emailError ? styles.inputError : ""}`}
          placeholder="Ingresa su correo"
          onKeyDown={blockSpaces}
          onPaste={blockPasteSpaces}
          onChange={(e) => {
            setUsername(removeSpaces(e.target.value, true));
            setEmailError("");
          }}
        />

        {emailError && <span className={styles.error}>{emailError}</span>}

        <label className={styles.label}>Ingresa tu contraseña</label>

        <div
          className={`${styles.passwordWrapper} ${
            passwordError ? styles.inputPasswordError : ""
          }`}
        >
          <input
            value={password}
            className={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Ingresa la contraseña"
            onKeyDown={blockSpaces}
            onPaste={blockPasteSpaces}
            onChange={(e) => {
              setPassword(removeSpaces(e.target.value));
              setPasswordError("");
            }}
          />

          <span
            className={styles.eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            👁
          </span>
        </div>

        {passwordError && (
          <span className={styles.error}>{passwordError}</span>
        )}

        <div className={styles.checkbox}>
          <input type="checkbox" />
          Recordarme
        </div>

        <div className={styles.actions}>
          <button className={styles.loginBtn} onClick={handleLogin}>
            INICIAR SESIÓN
          </button>
        </div>
      </div>
    </div>
  );
}