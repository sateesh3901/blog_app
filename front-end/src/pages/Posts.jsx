import { useEffect, useState } from "react";
import api from "../services/api";
import { Card, Container, Row, Col } from "react-bootstrap";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get("/api/public/posts/")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Public Posts</h2>
      <Row>
        {posts.map((post) => (
          <Col md={4} key={post.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Text>{post.content}</Card.Text>
                <small className="text-muted">
                  Author:{" "}
                  {typeof post.author === "string" ? post.author : "Unknown"}
                </small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Posts;
