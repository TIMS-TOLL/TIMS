import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

function WorkStatusPage() {
  const [statuses, setStatuses] = useState([]);

  const { user } = useAuth();

  const [sites, setSites] = useState([]);

  const [siteId, setSiteId] = useState("");
  const [zoneType, setZoneType] = useState("Plaza");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Pending");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadStatuses();
    loadSites();
  }, []);

  async function loadSites() {
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("site_name");

    setSites(data || []);
  }

  async function loadStatuses() {
  let query = supabase
    .from("work_status")
    .select(`
      *,
      sites(site_name)
    `)
    .order("id", { ascending: false });

  if (user?.role === "Engineer") {
    query = query.eq(
      "site_id",
      user.site_id
    );
  }

  const { data } = await query;

  setStatuses(data || []);
}

  async function saveStatus() {
    if (
  !(user?.role === "Engineer" ? user.site_id : siteId) ||
  !location ||
  !status ||
  !description
){
      alert("Please fill all fields");
      return;
    }

    let error;

    if (editId) {
      const result = await supabase
        .from("work_status")
        .update({
         site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
          zone_type: zoneType,
          location: location,
          status: status,
          description: description,
          updated_by: 1,
        })
        .eq("id", editId);

      error = result.error;
    } else {
      const result = await supabase
        .from("work_status")
        .insert([
          {
            site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
            zone_type: zoneType,
            location: location,
            status: status,
            description: description,
            updated_by: 1,
          },
        ]);

      error = result.error;
    }

    if (error) {
      console.log(error);
      alert("Save Failed");
      return;
    }

    setEditId(null);

    setSiteId("");
    setZoneType("Plaza");
    setLocation("");
    setStatus("Pending");
    setDescription("");

    loadStatuses();

    alert("Saved Successfully");
  }

  function editStatus(item) {
    setEditId(item.id);

    setSiteId(item.site_id);
    setZoneType(item.zone_type);
    setLocation(item.location);
    setStatus(item.status);
    setDescription(item.description);
  }

  async function deleteStatus(id) {
    const confirmDelete = window.confirm(
      "Delete this Work Status?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("work_status")
      .delete()
      .eq("id", id);

    loadStatuses();
  }

  return (
    <div>
      <h1>Work Status</h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>Add Work Status</h3>

        <br />
{user?.role !== "Engineer" && (
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
)}
        <br /><br />

        <select
          value={zoneType}
          onChange={(e) =>
            setZoneType(e.target.value)
          }
        >
          <option value="Plaza">
            Plaza
          </option>

          <option value="Lane">
            Lane
          </option>
        </select>

        <br /><br />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

        <br /><br />

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="Pending">
            Pending
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br /><br />

        <button onClick={saveStatus}>
          {editId
            ? "Update Status"
            : "Save Status"}
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
            <th>Site</th>
            <th>Zone</th>
            <th>Location</th>
            <th>Status</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {statuses.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.sites?.site_name}</td>
              <td>{item.zone_type}</td>
              <td>{item.location}</td>
              <td>{item.status}</td>
              <td>{item.description}</td>

              <td>
                <button
                  onClick={() =>
                    editStatus(item)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteStatus(item.id)
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

export default WorkStatusPage;