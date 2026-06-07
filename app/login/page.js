"use client";

import { useState } from "react";

export default function Login() {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "Be-mabdlt?77") {
      document.cookie = "auth=true; path=/";
      window.location.href = "/";
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f1f5f9"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        width: "300px",
        textAlign: "center"
      }}>
        <h2>Accès sécurisé</h2>

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "10px",
            background: "black",
            color: "white"
          }}
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}