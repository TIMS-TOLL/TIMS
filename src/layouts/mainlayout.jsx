import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/authcontext";

function MainLayout() {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "Admin";
  const isManager = user?.role === "Manager";
  const isEngineer = user?.role === "Engineer";

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "260px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h2>TIMS</h2>

        <div style={{ marginTop: "20px" }}>

          <Link
            to="/dashboard"
            className="sidebar-link"
          >
            Dashboard
          </Link>

          {(isAdmin || isManager) && (
            <>
              <Link
                to="/sites"
                className="sidebar-link"
              >
                Sites
              </Link>

              <Link
                to="/lanes"
                className="sidebar-link"
              >
                Lanes
              </Link>

              <Link
                to="/equipment"
                className="sidebar-link"
              >
                Equipment
              </Link>

              <Link
                to="/reports"
                className="sidebar-link"
              >
                Reports
              </Link>
            </>
          )}

          {(isAdmin ||
            isManager ||
            isEngineer) && (
            <Link
              to="/inventory"
              className="sidebar-link"
            >
              Inventory
            </Link>
          )}

          <Link
            to="/installations"
            className="sidebar-link"
          >
            Installations
          </Link>

          <Link
            to="/cable-tracking"
            className="sidebar-link"
          >
            Cable Tracking
          </Link>

          <Link
            to="/dailylogs"
            className="sidebar-link"
          >
            Daily Logs
          </Link>

          <Link
            to="/workstatus"
            className="sidebar-link"
          >
            Work Status
          </Link>

          {isAdmin && (
            <Link
              to="/users"
              className="sidebar-link"
            >
              Users
            </Link>
          )}
        </div>

        <div className="user-card">

          <p>
            <strong>User</strong>
            <br />
            {user?.full_name}
          </p>

          <br />

          <p>
            <strong>Role</strong>
            <br />
            {user?.role}
          </p>

          <br />

          <button
            onClick={logout}
            style={{
              width: "100%",
              background: "#dc2626",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#f3f4f6",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;