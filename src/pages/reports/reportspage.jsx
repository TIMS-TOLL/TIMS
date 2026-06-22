import { supabase } from "../../services/supabase";

function ReportsPage() {

  async function downloadCSV(tableName, fileName) {
    const { data, error } = await supabase
      .from(tableName)
      .select("*");

    if (error) {
      console.log(error);
      alert("Export Failed");
      return;
    }

    if (!data || data.length === 0) {
      alert("No Data Found");
      return;
    }

    const csv =
      [
        Object.keys(data[0]).join(","),
        ...data.map((row) =>
          Object.values(row).join(",")
        ),
      ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h1>Reports</h1>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>Available Reports</h3>

        <br />

        <button
          onClick={() =>
            downloadCSV(
              "equipment_installations",
              "Installation_Report.csv"
            )
          }
        >
          Installation Report
        </button>

        <br /><br />

        <button
          onClick={() =>
            downloadCSV(
              "cable_tracking",
              "Cable_Tracking_Report.csv"
            )
          }
        >
          Cable Tracking Report
        </button>

        <br /><br />

        <button
          onClick={() =>
            downloadCSV(
              "daily_logs",
              "Daily_Logs_Report.csv"
            )
          }
        >
          Daily Logs Report
        </button>

        <br /><br />

        <button
          onClick={() =>
            downloadCSV(
              "work_status",
              "Work_Status_Report.csv"
            )
          }
        >
          Work Status Report
        </button>
      </div>
    </div>
  );
}

export default ReportsPage;