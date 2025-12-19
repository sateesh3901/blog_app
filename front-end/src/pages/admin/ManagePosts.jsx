import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import api from "../../services/api";

function ManagePosts() {
  const [posts, setPosts] = useState([]);

  const load = async () => {
    const res = await api.get("/api/admin/posts/pending/");
    setPosts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/api/admin/posts/${id}/status/`, { status });
    load();
  };

  return (
    <Container className="mt-4">
      <h3>Pending Posts</h3>
      {posts.map((p) => (
        <Card key={p.id} className="mb-3">
          <Card.Body>
            <Card.Title>{p.title}</Card.Title>
            <Card.Text>{p.content}</Card.Text>
            <Button onClick={() => updateStatus(p.id, "APPROVED")}>
              Approve
            </Button>{" "}
            <Button
              variant="danger"
              onClick={() => updateStatus(p.id, "REJECTED")}
            >
              Reject
            </Button>
            <p className="text-muted">Author: {p.author}</p>
          </Card.Body>
          <span className="badge bg-warning me-2">{p.status}</span>
        </Card>
      ))}
    </Container>
  );
}

export default ManagePosts;
