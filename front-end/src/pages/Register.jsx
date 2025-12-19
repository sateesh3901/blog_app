import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register/", form);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch {
      toast.error("Registration failed");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 400 }}>
      <h3>Signup</h3>

      <Form onSubmit={submit}>
        <Form.Control
          className="mb-3"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Form.Control
          className="mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Form.Control
          className="mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit">Register</Button>
      </Form>
    </Container>
  );
}

export default Register;
