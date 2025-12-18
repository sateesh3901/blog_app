import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import api from "../../services/api";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get("/api/admin/users/");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    await api.put(`/api/admin/users/${id}/role/`, { role });
    fetchUsers();
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
                  onClick={() =>
                    updateRole(u.id, u.role === "ADMIN" ? "AUTHOR" : "ADMIN")
                  }
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
