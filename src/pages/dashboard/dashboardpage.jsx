import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../context/authcontext";

function DashboardPage() {
  const [siteCount, setSiteCount] = useState(0);

  const { user } = useAuth();

  const [laneCount, setLaneCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [inventoryCount, setInventoryCount] = useState(0);
  const [installationCount, setInstallationCount] = useState(0);

  const [cableCount, setCableCount] = useState(0);
  const [dailyLogCount, setDailyLogCount] = useState(0);
  const [workStatusCount, setWorkStatusCount] = useState(0);

  const [pendingCount, setPendingCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const [completionPercent, setCompletionPercent] =
    useState(0);

  const [recentStatus, setRecentStatus] = useState([]);
  const [recentInstallations,setRecentInstallations] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const { data: sites } = await supabase
      .from("sites")
      .select("*");

    const { data: lanes } = await supabase
      .from("lanes")
      .select("*");

    const { data: users } = await supabase
      .from("users")
      .select("*");

    const { data: inventory } = await supabase
      .from("inventory")
      .select("*");

    const { data: installations } = await supabase
      .from("equipment_installations")
      .select("*");

    const { data: cables } = await supabase
      .from("cable_tracking")
      .select("*");

    const { data: dailyLogs } = await supabase
      .from("daily_logs")
      .select("*");

    let workQuery = supabase
  .from("work_status")
  .select("*");

if (user?.role === "Engineer") {
  workQuery = workQuery.eq(
    "site_id",
    user.site_id
  );
}

const { data: workStatus } =
  await workQuery;
    const { data: latestStatus } = await supabase
      .from("work_status")
      .select(`
        *,
        sites(site_name)
      `)
      .order("id", { ascending: false })
      .limit(5);
      const { data: latestInstallations } =
  await supabase
    .from("equipment_installations")
    .select(`
      *,
      sites(site_name),
      equipment_types(equipment_name)
    `)
    .order("id", {
      ascending: false,
    })
    .limit(5);

    setSiteCount(sites?.length || 0);
    setLaneCount(lanes?.length || 0);
    setUserCount(users?.length || 0);
    setInventoryCount(inventory?.length || 0);
    setInstallationCount(
      installations?.length || 0
    );

    setCableCount(cables?.length || 0);
    setDailyLogCount(dailyLogs?.length || 0);
    setWorkStatusCount(workStatus?.length || 0);

    const pending =
      workStatus?.filter(
        (x) => x.status === "Pending"
      ).length || 0;

    const inProgress =
      workStatus?.filter(
        (x) => x.status === "In Progress"
      ).length || 0;

    const completed =
      workStatus?.filter(
        (x) => x.status === "Completed"
      ).length || 0;

    setPendingCount(pending);
    setProgressCount(inProgress);
    setCompletedCount(completed);

    const total = workStatus?.length || 0;

    const percentage =
      total > 0
        ? ((completed / total) * 100).toFixed(0)
        : 0;

    setCompletionPercent(percentage);

    setRecentStatus(latestStatus || []);
    setRecentInstallations(
  latestInstallations || []
);
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <div className="cards">

        <div className="card">
          <h3>Total Sites</h3>
          <h2>{siteCount}</h2>
        </div>

        <div className="card">
          <h3>Total Lanes</h3>
          <h2>{laneCount}</h2>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <h2>{userCount}</h2>
        </div>

        <div className="card">
          <h3>Inventory Items</h3>
          <h2>{inventoryCount}</h2>
        </div>

        <div className="card">
          <h3>Installations</h3>
          <h2>{installationCount}</h2>
        </div>

        <div className="card">
          <h3>Cable Entries</h3>
          <h2>{cableCount}</h2>
        </div>

        <div className="card">
          <h3>Daily Logs</h3>
          <h2>{dailyLogCount}</h2>
        </div>

        <div className="card">
          <h3>Work Status</h3>
          <h2>{workStatusCount}</h2>
        </div>

        <div className="card">
          <h3>Pending</h3>
          <h2>{pendingCount}</h2>
        </div>

        <div className="card">
          <h3>In Progress</h3>
          <h2>{progressCount}</h2>
        </div>

        <div className="card">
          <h3>Completed</h3>
          <h2>{completedCount}</h2>
        </div>

        <div className="card">
          <h3>Project Progress</h3>
          <h2>{completionPercent}%</h2>
        </div>

      </div>

      <br />

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Recent Work Status</h2>

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Site</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentStatus.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {item.sites?.site_name}
                </td>
                <td>{item.location}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
<br />

<div
  style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
  }}
>
  <h2>Recent Installations</h2>

  <table
    border="1"
    cellPadding="10"
    style={{
      width: "100%",
      marginTop: "10px",
    }}
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>Site</th>
        <th>Equipment</th>
        <th>Location</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {recentInstallations.map(
        (item) => (
          <tr key={item.id}>
            <td>{item.id}</td>

            <td>
              {item.sites?.site_name}
            </td>

            <td>
              {item.equipment_types?.equipment_name}
            </td>

            <td>{item.location}</td>

            <td>{item.status}</td>
          </tr>
        )
      )}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default DashboardPage;