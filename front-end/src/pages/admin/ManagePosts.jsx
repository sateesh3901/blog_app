import { useEffect, useState } from "react";
import { Container, Card, Button, Badge, Spinner } from "react-bootstrap";
import api from "../../services/api";
import { toast } from "react-toastify";

function ManagePosts() {
  const [posts, setPosts] = useState([]); // ALWAYS array
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/admin/posts/pending/");

      // 🔒 HARD SAFETY CHECK
      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error(err);
      setPosts([]);
      toast.error("Failed to load pending posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/admin/posts/${id}/status/`, { status });
      toast.success(`Post ${status.toLowerCase()}`);
      loadPosts();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Pending Posts</h3>

      {/* Loading */}
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      )}

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <p className="text-muted mt-3">No pending posts</p>
      )}

      {/* Posts list */}
      {!loading &&
        Array.isArray(posts) &&
        posts.map((p) => (
          <Card key={p.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <Card.Title>{p.title}</Card.Title>
                <Badge bg="warning">{p.status}</Badge>
              </div>

              <Card.Text className="mt-2">{p.content}</Card.Text>

              <p className="text-muted mb-2">Author: {p.author || "Unknown"}</p>

              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => updateStatus(p.id, "APPROVED")}
                >
                  Approve
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => updateStatus(p.id, "REJECTED")}
                >
                  Reject
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
    </Container>
  );
}

export default ManagePosts;
