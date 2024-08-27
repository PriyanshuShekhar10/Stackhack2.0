import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

export default function Users() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/admins", {
        withCredentials: true,
      });
      if (response.data.ok) {
        setAdmins(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/admin/users", {
        withCredentials: true,
      });
      if (response.data.ok) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditingAdmin
        ? `http://localhost:8000/admin/admins/${selectedAdmin._id}`
        : "http://localhost:8000/admin/register";
      const method = isEditingAdmin ? "put" : "post";
      const response = await axios[method](url, formData, {
        withCredentials: true,
      });

      if (response.data.ok) {
        alert(
          isEditingAdmin
            ? "Admin updated successfully!"
            : "Admin registered successfully!"
        );
        fetchAdmins();
        setFormData({ name: "", email: "", password: "" });
        setIsEditingAdmin(false);
      }
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setFormData({ name: admin.name, email: admin.email, password: "" });
    setIsEditingAdmin(true);
  };

  const handleDeleteAdmin = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/admin/admins/${adminId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.ok) {
          alert("Admin deleted successfully!");
          fetchAdmins();
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email });
    setIsEditingUser(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8000/admin/users/${selectedUser._id}`;
      const response = await axios.put(url, formData, {
        withCredentials: true,
      });

      if (response.data.ok) {
        alert("User updated successfully!");
        fetchUsers();
        setFormData({ name: "", email: "" });
        setIsEditingUser(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/admin/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (response.data.ok) {
          alert("User deleted successfully!");
          fetchUsers();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>{isEditingAdmin ? "Edit Admin" : "Create Admin"}</h2>
        <form onSubmit={handleAdminSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {!isEditingAdmin && (
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <button type="submit">
            {isEditingAdmin ? "Update Admin" : "Create Admin"}
          </button>
        </form>

        <h2>Admin List</h2>
        {admins.length > 0 ? (
          <ul>
            {admins.map((admin) => (
              <li key={admin._id}>
                {admin.name} ({admin.email})
                <button onClick={() => handleEditAdmin(admin)}>Edit</button>
                <button onClick={() => handleDeleteAdmin(admin._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No admins available.</p>
        )}

        <h2>User List</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                {user.name} ({user.email})
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users available.</p>
        )}

        {isEditingUser && (
          <div>
            <h2>Edit User</h2>
            <form onSubmit={handleUserSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Update User</button>
              <button
                type="button"
                onClick={() => {
                  setIsEditingUser(false);
                  setFormData({ name: "", email: "" });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
