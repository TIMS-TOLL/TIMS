import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/AuthContext";

function DailyLogsPage() {
  const [logs, setLogs] = useState([]);

  const { user } = useAuth();

  const [sites, setSites] = useState([]);

  const [siteId, setSiteId] = useState("");
  const [logDate, setLogDate] = useState("");
  const [zoneType, setZoneType] = useState("Lane");
  const [location, setLocation] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [status, setStatus] = useState("Completed");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadLogs();
    loadSites();
  }, []);

  async function loadSites() {
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("site_name");

    setSites(data || []);
  }

  async function loadLogs() {
  let query = supabase
    .from("daily_logs")
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

  setLogs(data || []);
}

  async function saveLog() {
    if (
  !(user?.role === "Engineer" ? user.site_id : siteId) ||
  !logDate ||
  !location ||
  !workDescription
) {
      alert("Please fill all fields");
      return;
    }

    let error;

    if (editId) {
      const result = await supabase
        .from("daily_logs")
        .update({
          site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
          log_date: logDate,
          zone_type: zoneType,
          location: location,
          work_description: workDescription,
          status: status,
        })
        .eq("id", editId);

      error = result.error;
    } else {
      const result = await supabase
        .from("daily_logs")
        .insert([
          {
            site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
            log_date: logDate,
            zone_type: zoneType,
            location: location,
            work_description: workDescription,
            status: status,
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
    setLogDate("");
    setZoneType("Lane");
    setLocation("");
    setWorkDescription("");
    setStatus("Completed");

    loadLogs();

    alert("Saved Successfully");
  }

  function editLog(item) {
    setEditId(item.id);

    setSiteId(item.site_id);
    setLogDate(item.log_date);
    setZoneType(item.zone_type);
    setLocation(item.location);
    setWorkDescription(item.work_description);
    setStatus(item.status);
  }

  async function deleteLog(id) {
    const confirmDelete = window.confirm(
      "Delete this Daily Log?"
    );

    if (!confirmDelete) return;

    await supabase
      .from("daily_logs")
      .delete()
      .eq("id", id);

    loadLogs();
  }

  return (
    <div>
      <h1>Daily Logs</h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>Add Daily Log</h3>

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

        <input
          type="date"
          value={logDate}
          onChange={(e) =>
            setLogDate(e.target.value)
          }
        />

        <br /><br />

        <select
          value={zoneType}
          onChange={(e) =>
            setZoneType(e.target.value)
          }
        >
          <option value="Lane">
            Lane
          </option>

          <option value="Plaza">
            Plaza
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

        <textarea
          placeholder="Work Description"
          value={workDescription}
          onChange={(e) =>
            setWorkDescription(
              e.target.value
            )
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

        <button onClick={saveLog}>
          {editId
            ? "Update Log"
            : "Save Log"}
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
            <th>Date</th>
            <th>Site</th>
            <th>Zone</th>
            <th>Location</th>
            <th>Work Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.log_date}</td>
              <td>{item.sites?.site_name}</td>
              <td>{item.zone_type}</td>
              <td>{item.location}</td>
              <td>
                {item.work_description}
              </td>
              <td>{item.status}</td>

              <td>
                <button
                  onClick={() =>
                    editLog(item)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteLog(item.id)
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

export default DailyLogsPage;