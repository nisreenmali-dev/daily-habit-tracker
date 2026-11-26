import { useEffect, useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setTasks(data);
      setError("");
    } catch {
      setError("Backend unreachable");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Failed to add");
      const created = await res.json();
      setTasks([...tasks, created]);
      setTitle("");
      setError("");
    } catch {
      setError("Could not save task");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>DevOps Task Tracker</h2>
        <form onSubmit={handleAdd} style={styles.form}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New deployment task..."
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Add</button>
        </form>
        {error && <p style={styles.error}>{error}</p>}
        <ul style={styles.list}>
          {tasks.map((t) => (
            <li key={t.id} style={styles.item}>
              {t.done ? "✅" : "⏳"} {t.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0f172a", fontFamily: "sans-serif" },
  card: { background: "#1e293b", color: "#f8fafc", padding: "30px", borderRadius: "12px", width: "100%", maxWidth: "400px" },
  heading: { margin: "0 0 16px", color: "#38bdf8", textAlign: "center" },
  form: { display: "flex", gap: "8px", marginBottom: "16px" },
  input: { flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #334155", background: "#0f172a", color: "#fff" },
  button: { padding: "10px 16px", borderRadius: "6px", border: "none", background: "#0284c7", color: "#fff", fontWeight: "bold", cursor: "pointer" },
  error: { color: "#f87171", fontSize: "14px", textAlign: "center" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" },
  item: { background: "#0f172a", padding: "10px 12px", borderRadius: "6px", fontSize: "14px" },
};
