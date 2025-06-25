import React, { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";
import { serverBase } from "../../api";

export default function Login({ setAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${serverBase}/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      setAuth({ user: res.data.user, token: res.data.token });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginCard}>
        <div className={styles.loginTitle}>Login</div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className={styles.inputField}
        />
        {error && <div className={styles.errorMsg}>{error}</div>}
        <button type="submit" className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
} 