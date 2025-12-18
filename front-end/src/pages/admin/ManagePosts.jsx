import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import api from "../../services/api";

function ManagePosts() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await api.get("/api/admin/posts/pending/");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/api/admin/posts/${id}/status/`, { status });
    fetchPosts();
  };

  const deletePost = async (id) => {
    await api.delete(`/api/admin/posts/${id}/`);
    fetchPosts();
  };

  return (
    <Container className="mt-4">
      <h3>Pending Posts</h3>

      {posts.map((post) => (
        <Card key={post.id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content}</Card.Text>

            <div className="d-flex gap-2">
              <Button
                variant="success"
                onClick={() => updateStatus(post.id, "APPROVED")}
              >
                Approve
              </Button>

              <Button
                variant="warning"
                onClick={() => updateStatus(post.id, "REJECTED")}
              >
                Reject
              </Button>

              <Button variant="danger" onClick={() => deletePost(post.id)}>
                Delete
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default ManagePosts;
