import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [sites, setSites] = useState([]);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Engineer");
  const [siteId, setSiteId] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadUsers();
    loadSites();
  }, []);

  async function loadUsers() {
    const { data } = await supabase
      .from("users")
      .select(`
        *,
        sites(site_name)
      `)
      .order("id");

    setUsers(data || []);
  }

  async function loadSites() {
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("site_name");

    setSites(data || []);
  }

  async function saveUser() {
    let error;

    if (editId) {
      const result = await supabase
        .from("users")
        .update({
          full_name: fullName,
          username,
          password,
          role,
          site_id: siteId || null,
          mobile,
          email,
          is_active: isActive,
        })
        .eq("id", editId);

      error = result.error;
    } else {
      const result = await supabase
        .from("users")
        .insert([
          {
            full_name: fullName,
            username,
            password,
            role,
            site_id: siteId || null,
            mobile,
            email,
            is_active: isActive,
          },
        ]);

      error = result.error;
    }

    if (error) {
      console.log(error);
      alert("Save Failed");
      return;
    }

    alert("User Saved Successfully");

    setEditId(null);
    setFullName("");
    setUsername("");
    setPassword("");
    setRole("Engineer");
    setSiteId("");
    setMobile("");
    setEmail("");
    setIsActive(true);

    loadUsers();
  }

  function editUser(user) {
    setEditId(user.id);

    setFullName(user.full_name || "");
    setUsername(user.username || "");
    setPassword(user.password || "");
    setRole(user.role || "Engineer");
    setSiteId(user.site_id || "");
    setMobile(user.mobile || "");
    setEmail(user.email || "");
    setIsActive(user.is_active);
  }

  async function deleteUser(id) {
    const confirmDelete = window.confirm(
      "Delete this user?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("users")
      .delete()
      .eq("id", id);

    loadUsers();
  }

  return (
    <div>
      <h1>User Management</h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>
          {editId ? "Edit User" : "Add User"}
        </h3>

        <br />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br /><br />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Engineer">Engineer</option>
        </select>

        <br /><br />

        <select
          value={siteId}
          onChange={(e) =>
            setSiteId(e.target.value)
          }
        >
          <option value="">
            Select Site
          </option>

          {sites.map((site) => (
            <option
              key={site.id}
              value={site.id}
            >
              {site.site_name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value)
          }
        />

        <br /><br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br /><br />

        <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />
          Active User
        </label>

        <br /><br />

        <button onClick={saveUser}>
          {editId ? "Update User" : "Save User"}
        </button>
      </div>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Site</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.full_name}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.sites?.site_name}</td>
              <td>{user.mobile}</td>
              <td>
                {user.is_active
                  ? "Active"
                  : "Inactive"}
              </td>

              <td>
                <button
                  onClick={() =>
                    editUser(user)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteUser(user.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;