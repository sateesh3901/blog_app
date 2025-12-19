import { Container, Card, Row, Col } from "react-bootstrap";

function Dashboard() {
  return (
    <Container className="mt-4">
      <h3>Admin Dashboard</h3>

      <Row className="mt-3">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text>Manage roles and permissions</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Posts</Card.Title>
              <Card.Text>Approve or reject posts</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Platform</Card.Title>
              <Card.Text>Moderation & content control</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
