import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/authcontext";

function CableTrackingPage() {
  const [entries, setEntries] = useState([]);

  const { user } = useAuth();

  const [sites, setSites] = useState([]);
  const [cableTypes, setCableTypes] = useState([]);

  const [siteId, setSiteId] = useState("");
  const [zoneType, setZoneType] = useState("Plaza");
  const [location, setLocation] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [cableTypeId, setCableTypeId] = useState("");
  const [startReading, setStartReading] = useState("");
  const [endReading, setEndReading] = useState("");
  const [remarks, setRemarks] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadEntries();
    loadSites();
    loadCableTypes();
  }, []);

  async function loadEntries() {
  let query = supabase
    .from("cable_tracking")
    .select(`
      *,
      sites(site_name),
      cable_types(cable_name)
    `)
    .order("id", { ascending: false });

  if (user?.role === "Engineer") {
    query = query.eq(
      "site_id",
      user.site_id
    );
  }

  const { data } = await query;

  setEntries(data || []);
}

  async function loadSites() {
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("site_name");

    setSites(data || []);
  }

  async function loadCableTypes() {
    const { data } = await supabase
      .from("cable_types")
      .select("*")
      .order("cable_name");

    setCableTypes(data || []);
  }

  async function saveEntry() {
    if (
  !(user?.role === "Engineer"
    ? user.site_id
    : siteId) ||
  !location ||
  !entryDate ||
  !purpose ||
  !cableTypeId
) {
  alert("Please fill all required fields");
  return;
}
  const totalUsed =
    parseFloat(endReading || 0) -
    parseFloat(startReading || 0);

  let error;

  if (editId) {
    const result = await supabase
      .from("cable_tracking")
      .update({
        site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
        zone_type: zoneType,
        location,
        entry_date: entryDate,
        purpose,
        cable_type_id: cableTypeId,
        start_reading: startReading,
        end_reading: endReading,
        total_used: totalUsed,
        remarks,
      })
      .eq("id", editId);

    error = result.error;

  } else {
    const result = await supabase
      .from("cable_tracking")
      .insert([
        {
         site_id:
  user?.role === "Engineer"
    ? user.site_id
    : siteId,
          zone_type: zoneType,
          location,
          entry_date: entryDate,
          purpose,
          cable_type_id: cableTypeId,
          start_reading: startReading,
          end_reading: endReading,
          total_used: totalUsed,
          remarks,
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
  setEntryDate("");
  setPurpose("");
  setCableTypeId("");
  setStartReading("");
  setEndReading("");
  setRemarks("");

  loadEntries();

  alert("Saved Successfully");
}
  async function deleteEntry(id) {
  const confirmDelete = window.confirm(
    "Delete this entry?"
  );

  if (!confirmDelete) return;

  await supabase
    .from("cable_tracking")
    .delete()
    .eq("id", id);

  loadEntries();
}

  function editEntry(item) {
  setEditId(item.id);

  setSiteId(item.site_id);
  setZoneType(item.zone_type);
  setLocation(item.location);
  setEntryDate(item.entry_date);
  setPurpose(item.purpose);
  setCableTypeId(item.cable_type_id);
  setStartReading(item.start_reading);
  setEndReading(item.end_reading);
  setRemarks(item.remarks || "");
}

  return (
    <div>
      <h1>Cable Tracking</h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>Add Cable Entry</h3>

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

        <input
          type="date"
          value={entryDate}
          onChange={(e) =>
            setEntryDate(e.target.value)
          }
        />

        <br /><br />

        <input
          type="text"
          placeholder="Purpose"
          value={purpose}
          onChange={(e) =>
            setPurpose(e.target.value)
          }
        />

        <br /><br />

        <select
          value={cableTypeId}
          onChange={(e) =>
            setCableTypeId(e.target.value)
          }
        >
          <option value="">
            Select Cable Type
          </option>

          {cableTypes.map((item) => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.cable_name}
            </option>
          ))}
        </select>

        <br /><br />

        <input
          type="number"
          placeholder="Start Reading"
          value={startReading}
          onChange={(e) =>
            setStartReading(e.target.value)
          }
        />

        <br /><br />

        <input
          type="number"
          placeholder="End Reading"
          value={endReading}
          onChange={(e) =>
            setEndReading(e.target.value)
          }
        />

        <br /><br />

        <textarea
          placeholder="Remarks"
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
        />

        <br /><br />

        <button onClick={saveEntry}>
          {editId ? "Update Entry" : "Save Entry"}
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
            <th>Location</th>
            <th>Cable</th>
            <th>Start</th>
            <th>End</th>
            <th>Used</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.sites?.site_name}</td>
              <td>{item.location}</td>
              <td>{item.cable_types?.cable_name}</td>
              <td>{item.start_reading}</td>
              <td>{item.end_reading}</td>
              <td>{item.total_used}</td>

              <td>
                <button
                  onClick={() => editEntry(item)}
                >
                 Edit
               </button>

               <button
                 onClick={() =>
                   deleteEntry(item.id)
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

export default CableTrackingPage;