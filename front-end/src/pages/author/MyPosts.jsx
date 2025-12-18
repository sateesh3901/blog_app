import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await api.get("/api/posts/my-posts/");
      setPosts(res.data);
    } catch (err) {
      alert("Failed to load posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/api/posts/${id}/`);
      fetchPosts();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <Container className="mt-4">
      <h3>My Posts</h3>

      {posts.map((post) => (
        <Card key={post.id} className="mb-3">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content}</Card.Text>

            <small className="text-muted">
              Author: {user?.name} | Status: {post.status}
            </small>

            <div className="mt-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => deletePost(post.id)}
              >
                Delete
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default MyPosts;
