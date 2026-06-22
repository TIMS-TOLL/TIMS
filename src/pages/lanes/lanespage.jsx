import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

function LanesPage() {
  const [lanes, setLanes] = useState([]);
  const [laneName, setLaneName] = useState("");
  const [siteId, setSiteId] = useState(1);

  useEffect(() => {
    loadLanes();
  }, []);

  async function loadLanes() {
    const { data } = await supabase
      .from("lanes")
      .select("*")
      .order("id");

    setLanes(data || []);
  }

  async function addLane() {
    if (!laneName.trim()) return;

    await supabase
      .from("lanes")
      .insert([
        {
          site_id: siteId,
          lane_name: laneName,
        },
      ]);

    setLaneName("");
    loadLanes();
  }

  async function deleteLane(id) {
    await supabase
      .from("lanes")
      .delete()
      .eq("id", id);

    loadLanes();
  }

  return (
    <div>
      <h1>Lanes Management</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="number"
          placeholder="Site ID"
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
        />

        <input
          type="text"
          placeholder="Lane Name"
          value={laneName}
          onChange={(e) => setLaneName(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={addLane}
          style={{ marginLeft: "10px" }}
        >
          Add Lane
        </button>
      </div>

      <table
        border="1"
        cellPadding="10"
        style={{ marginTop: "20px", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Site ID</th>
            <th>Lane Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {lanes.map((lane) => (
            <tr key={lane.id}>
              <td>{lane.id}</td>
              <td>{lane.site_id}</td>
              <td>{lane.lane_name}</td>

              <td>
                <button
                  onClick={() => deleteLane(lane.id)}
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

export default LanesPage;