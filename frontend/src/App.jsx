import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Chargement...");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Teste la connexion avec le backend Laravel
    fetch(`${apiUrl}/ping`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch(() => setMessage("❌ Impossible de joindre le backend"));
  }, []);

  return (
    <div className="App" style={{ textAlign: "center", padding: "3rem" }}>
      <h1>Portfolio – Frontend Ready 🚀</h1>
      <p>API URL : <code>{apiUrl}</code></p>
      <h2>Backend dit :</h2>
      <p style={{ fontSize: "1.2rem", color: "#42b883" }}>{message}</p>
      <hr />
      <p>Ce message vient de ton backend Laravel.</p>
    </div>
  );
}

export default App;
