import { useEffect, useState } from "react";
import { Table, Container, Button } from "react-bootstrap";
import api from "../../services/api";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    api.get("/api/admin/users/").then((res) => setUsers(res.data));
  }, []);

  const toggleRole = async (id, role) => {
    await api.put(`/api/admin/users/${id}/role/`, {
      role: role === "ADMIN" ? "AUTHOR" : "ADMIN",
    });
    const res = await api.get("/api/admin/users/");
    setUsers(res.data);
  };

  return (
    <Container className="mt-4">
      <h3>Manage Users</h3>
      <Table bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <Button
                  size="sm"
                  disabled={u.id === currentUser.id}
                  onClick={() => toggleRole(u.id, u.role)}
                >
                  Toggle Role
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ManageUsers;
