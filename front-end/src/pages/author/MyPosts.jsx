import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../services/api";

function PublicPosts() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const loadPosts = async (pageNumber = 1) => {
    const res = await api.get(`/api/public/posts/?page=${pageNumber}`);
    setPosts(res.data.results);
    setHasNext(res.data.next !== null);
  };

  useEffect(() => {
    loadPosts(page);
  }, [page]);

  return (
    <Container className="mt-4">
      <h3>Public Blogs</h3>

      {posts.map((post) => (
        <Card key={post.id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{post.title}</Card.Title>
            <Card.Text>{post.content.slice(0, 150)}...</Card.Text>
            <p className="text-muted">Author: {post.author}</p>
            <Button as={Link} to={`/post/${post.id}`} size="sm">
              Read More
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* Pagination buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>

        <Button disabled={!hasNext} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>
    </Container>
  );
}

export default PublicPosts;
