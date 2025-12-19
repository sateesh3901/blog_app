import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../services/api";

function PublicPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/api/public/posts/").then((res) => setPosts(res.data));
  }, []);

  return (
    <Container className="mt-4">
      <h3>Public Posts</h3>

      {posts.map((post) => (
        <Card key={post.id} className="mb-3">
          <Card.Header>
            <Card.Title>{post.title}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Card.Text>{post.content.slice(0, 150)}...</Card.Text>
            <small className="text-muted">
              Author:{" "}
              <span className="badge bg-secondary ms-1">{post.author}</span>
            </small>

            <div className="mt-2">
              <Button as={Link} to={`/post/${post.id}`} size="sm">
                Read More
              </Button>
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default PublicPosts;
