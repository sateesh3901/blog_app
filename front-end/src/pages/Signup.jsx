import { useState } from "react";
import api from "../services/api";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register/", form);
      alert("Signup successful");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Signup</h2>
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button>Signup</button>
    </form>
  );
}

const styles = {
  form: {
    maxWidth: "300px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default Signup;
