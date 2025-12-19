import { useEffect, useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // load existing post
  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await api.get(`/api/posts/${id}/`);
        setTitle(res.data.title);
        setContent(res.data.content);
      } catch (err) {
        toast.error("Failed to load post");
        navigate("/author/posts");
      }
    };

    loadPost();
  }, [id, navigate]);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/api/posts/${id}/`, {
        title,
        content,
      });

      toast.success("Post updated and sent for approval");
      navigate("/author/posts");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Edit Post</h3>

      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit">Update Post</Button>
      </Form>
    </Container>
  );
}

export default EditPost;
