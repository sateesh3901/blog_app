import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login/", form);
      login(res.data);

      if (res.data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/author/posts");
      }
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <Container style={{ maxWidth: "400px" }} className="mt-5">
      <h3>Login</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Control
          className="mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Form.Control
          type="password"
          className="mb-3"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
}

export default Login;
