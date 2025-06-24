import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Container from "./components/Container/Container";
import Login from "./components/Login";
import Register from "./components/Register";
import styles from "./App.module.css";
import axios from "axios";

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });
  const [showLogin, setShowLogin] = useState(true);
  const [userLinks, setUserLinks] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (auth && auth.token) {
      axios
        .get("http://localhost:5001/my-links", {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        .then((res) => setUserLinks(res.data))
        .catch(() => setUserLinks([]));
    }
  }, [auth]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth(null);
    setUserLinks([]);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div style={{ position: "absolute", top: 18, right: 24, zIndex: 10 }}>
        <button
          onClick={() => setDarkMode((d) => !d)}
          style={{
            background: darkMode
              ? "linear-gradient(90deg, #23272f 60%, #181c24 100%)"
              : "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
            color: darkMode ? "#fff" : "#fff",
            border: "none",
            borderRadius: 20,
            padding: "0.5rem 1.2rem",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "var(--color-shadow)",
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
      {!auth || !auth.token ? (
        <div>
          <div style={{ textAlign: "center", marginTop: 20, marginBottom: 24 }}>
            <div style={{
              display: "inline-flex",
              background: "var(--color-card)",
              borderRadius: 30,
              boxShadow: "var(--color-shadow)",
              overflow: "hidden",
              border: "1.5px solid var(--color-primary)",
            }}>
              <button
                onClick={() => setShowLogin(true)}
                style={{
                  background: showLogin ? "var(--color-primary)" : "transparent",
                  color: showLogin ? "#fff" : "var(--color-primary)",
                  border: "none",
                  outline: "none",
                  padding: "0.7rem 2.2rem",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 30,
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                Login
              </button>
              <button
                onClick={() => setShowLogin(false)}
                style={{
                  background: !showLogin ? "var(--color-secondary)" : "transparent",
                  color: !showLogin ? "#fff" : "var(--color-secondary)",
                  border: "none",
                  outline: "none",
                  padding: "0.7rem 2.2rem",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 30,
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                Register
              </button>
            </div>
          </div>
          {showLogin ? <Login setAuth={setAuth} /> : <Register setAuth={setAuth} />}
        </div>
      ) : (
        <>
          <button
            onClick={handleLogout}
            style={{
              position: "absolute",
              top: 18,
              left: 24,
              background: darkMode
                ? "linear-gradient(90deg, #ffb74d 60%, #ff8800 100%)"
                : "linear-gradient(90deg, #ff8800 60%, #ffb74d 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "0.5rem 1.4rem 0.5rem 1.1rem",
              fontWeight: 600,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "var(--color-shadow)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "background 0.2s, color 0.2s, transform 0.1s",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: "1.2em", marginRight: 6 }}>🚪</span> Logout
          </button>
          <Container auth={auth} userLinks={userLinks} setUserLinks={setUserLinks} />
        </>
      )}
      <footer style={{
        width: "100%",
        textAlign: "center",
        padding: "1.2rem 0 0.7rem 0",
        color: "var(--color-text)",
        fontSize: "1rem",
        opacity: 0.7,
        letterSpacing: "0.5px",
        position: "relative",
        bottom: 0
      }}>
        © {new Date().getFullYear()} Chaitra sri Jammula. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
