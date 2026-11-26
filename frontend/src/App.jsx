import React, { useEffect, useState } from "react";

export default function App() {
  const [habits, setHabits] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError("Backend unreachable");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    setInput("");
    fetchHabits();
  };

  const handleToggle = async (id) => {
    await fetch(`/api/habits/${id}`, { method: "PUT" });
    fetchHabits();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Daily Habit Tracker</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleAdd} style={styles.form}>
          <input
            type="text"
            placeholder="New daily habit..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Add
          </button>
        </form>

        <div style={styles.list}>
          {habits.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              style={styles.row}
            >
              <span style={styles.icon}>{item.completed ? "🔥" : "🎯"}</span>
              <span
                style={{
                  ...styles.text,
                  textDecoration: item.completed ? "line-through" : "none",
                  opacity: item.completed ? 0.75 : 1,
                }}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#0b1322",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "560px",
    backgroundColor: "#162032",
    borderRadius: "14px",
    padding: "36px 40px",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.45)",
  },
  title: {
    color: "#38bdf8",
    textAlign: "center",
    fontSize: "2rem",
    fontWeight: "700",
    margin: "0 0 26px 0",
  },
  error: {
    color: "#f87171",
    textAlign: "center",
    marginBottom: "14px",
    fontSize: "0.9rem",
  },
  form: {
    display: "flex",
    gap: "12px",
    marginBottom: "22px",
  },
  input: {
    flex: 1,
    backgroundColor: "#0b1322",
    border: "1px solid #2b3952",
    borderRadius: "8px",
    padding: "13px 16px",
    color: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    backgroundColor: "#0ea5e9",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "0 22px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  row: {
    backgroundColor: "#0b1322",
    borderRadius: "8px",
    padding: "15px 18px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  icon: {
    fontSize: "1.1rem",
  },
  text: {
    color: "#f8fafc",
    fontSize: "1.05rem",
    fontWeight: "500",
  },
};
