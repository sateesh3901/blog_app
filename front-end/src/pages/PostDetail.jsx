import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import api from "../services/api";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/api/public/posts/${id}/`).then((res) => setPost(res.data));
  }, [id]);

  if (!post) return null;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <Card.Title>{post.title}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Text>{post.content}</Card.Text>
          <small className="text-muted">Author: {post.author}</small>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default PostDetail;
