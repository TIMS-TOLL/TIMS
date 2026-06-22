import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/login/loginpage";
import DashboardPage from "../pages/dashboard/dashboardpage";
import MainLayout from "../layouts/mainlayout";
import SitesPage from "../pages/sites/sitespage";
import LanesPage from "../pages/lanes/lanespage";
import EquipmentPage from "../pages/equipment/equipmentpage";
import InventoryPage from "../pages/inventory/inventorypage";
import InstallationsPage from "../pages/installations/installationspage";
import CableTrackingPage from "../pages/cables/cabletrackingpage";
import DailyLogsPage from "../pages/dailylogs/dailylogspage";
import WorkStatusPage from "../pages/workstatus/workstatuspage";
import ReportsPage from "../pages/reports/reportspage";
import UsersPage from "../pages/users/userspage";

import ProtectedRoute from "../components/protectedroute";

function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />

      <Route element={<MainLayout />}>

        <Route path="/dashboard"element={
    <ProtectedRoute
      allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
    >
      <DashboardPage />
    </ProtectedRoute>
  }
/>

        <Route path="/sites" element={
    <ProtectedRoute
      allowedRoles={[
        "Admin",
        "Manager",
      ]}
    >
      <SitesPage />
    </ProtectedRoute>
  }
/>
        <Route
          path="/lanes"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Manager",
              ]}
            >
              <LanesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/equipment"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Admin",
                "Manager",
              ]}
            >
              <EquipmentPage />
            </ProtectedRoute>
          }
        />

        <Route path="/inventory"element={
    <ProtectedRoute
      allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
    >
      <InventoryPage />
    </ProtectedRoute>
  }
/>

        <Route
          path="/installations"
          element={
            <ProtectedRoute
              allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
      >
              <InstallationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cable-tracking"
          element={
            <ProtectedRoute
              allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
      >
              <CableTrackingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dailylogs"
          element={
            <ProtectedRoute
              allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
      >
              <DailyLogsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workstatus"
          element={
            <ProtectedRoute
              allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
      >
              <WorkStatusPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              allowedRoles={[
        "Admin",
        "Manager",
      ]}
      >
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
  path="/users"
  element={
    <ProtectedRoute
      allowedRoles={["Admin"]}
    >
      <UsersPage />
    </ProtectedRoute>
  }
/>

      </Route>

    </Routes>
  );
}

export default AppRoutes;