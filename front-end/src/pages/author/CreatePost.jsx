import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

function CreatePost() {
  const [form, setForm] = useState({ title: "", content: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/posts/", form);
      toast.success("Post submitted for approval");
      navigate("/author/posts");
    } catch {
      toast.error("Failed to create post");
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <h3>Create Post</h3>

      <Form onSubmit={submit}>
        <Form.Control
          className="mb-3"
          placeholder="Title"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <Form.Control
          as="textarea"
          rows={6}
          className="mb-3"
          placeholder="Content"
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default CreatePost;
