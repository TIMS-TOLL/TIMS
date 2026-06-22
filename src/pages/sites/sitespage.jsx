import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

function SitesPage() {
  const [sites, setSites] = useState([]);
  const [siteName, setSiteName] = useState("");

  useEffect(() => {
    loadSites();
  }, []);

  async function loadSites() {
    const { data } = await supabase
      .from("sites")
      .select("*")
      .order("id");

    setSites(data || []);
  }

  async function addSite() {
    if (!siteName.trim()) return;

    await supabase
      .from("sites")
      .insert([
        {
          site_name: siteName,
        },
      ]);

    setSiteName("");
    loadSites();
  }

  async function deleteSite(id) {
    await supabase
      .from("sites")
      .delete()
      .eq("id", id);

    loadSites();
  }

  return (
    <div>
      <h1>Sites Management</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter Site Name"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />

        <button
          onClick={addSite}
          style={{ marginLeft: "10px" }}
        >
          Add Site
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
            <th>Site Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sites.map((site) => (
            <tr key={site.id}>
              <td>{site.id}</td>
              <td>{site.site_name}</td>

              <td>
                <button
                  onClick={() => deleteSite(site.id)}
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

export default SitesPage;