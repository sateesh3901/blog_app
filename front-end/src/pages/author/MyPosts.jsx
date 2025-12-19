import { useEffect, useState } from "react";
import { Container, Card, Button, Badge, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../../services/api";

function MyPosts() {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    const res = await api.get("/api/posts/my-posts/");
    setPosts(res.data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await api.delete(`/api/posts/${id}/`);
    loadPosts();
  };

  const badgeVariant = (status) => {
    if (status === "APPROVED") return "success";
    if (status === "REJECTED") return "danger";
    return "warning";
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h3>My Posts</h3>
        </Col>
        <Col className="text-end">
          <Button as={Link} to="/author/posts/create">
            Create Post
          </Button>
        </Col>
      </Row>
      <p className="text-muted">
        Note: Edited posts will require admin approval again.
      </p>
      {posts.map((post) => (
        <Card key={post.id} className="mb-3 shadow-sm">
          <Badge bg={badgeVariant(post.status)} className="mb-2">
            {post.status}
          </Badge>
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content.slice(0, 120)}...</Card.Text>
            <div className="d-flex gap-2">
              <Button
                size="sm"
                variant="outline-primary"
                as={Link}
                to={`/author/posts/edit/${post.id}`}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
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
