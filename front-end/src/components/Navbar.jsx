import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Blog Platform
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/posts">
              Posts
            </Nav.Link>

            {!user && (
              <>
                <Nav.Link as={Link} to="/signup">
                  Signup
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
              </>
            )}

            {user?.role === "AUTHOR" && (
              <Nav.Link as={Link} to="/author/posts">
                My Posts
              </Nav.Link>
            )}

            {user?.role === "ADMIN" && (
              <>
                <Nav.Link as={Link} to="/admin/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/users">
                  Users
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/posts">
                  Posts
                </Nav.Link>
              </>
            )}

            {user && (
              <Button variant="outline-light" className="ms-3" onClick={logout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
