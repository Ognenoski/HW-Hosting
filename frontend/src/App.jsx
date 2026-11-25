import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";
console.log("API URL:", API_URL);

function Section({ title, endpoint }) {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/${endpoint}`);
      const resData = await res.json();

      if (!res.ok) {
        setError(resData.message);
        setData([]);
        return;
      }

      setData(resData);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Proxy-to ne e dostapen!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return; // ne prakjame prazno ime

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const resData = await res.json();
        setError(resData.message || "Greska pri dodavanje!");
        return;
      }

      setName(""); // go praznime inputot
      fetchData(); // povtorno gi zemame podatocite
    } catch (err) {
      console.log(err);
      setError("Proxy-to ne e dostapen!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>{title}</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Vnesi ime"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">Dodaj</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column" }}>
        {data.map((d) => (
          <span key={d._id}>{d.name}</span>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <h1>MERN Microservices</h1>

      <div style={{ display: "flex", gap: "60px" }}>
        <Section title="Studenti" endpoint="students" />
        <Section title="Kursevi" endpoint="courses" />
      </div>
    </>
  );
}

export default App;
