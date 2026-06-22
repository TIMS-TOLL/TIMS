import { Routes, Route } from "react-router-dom";

import LoginPage from "../pages/login/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import MainLayout from "../layouts/MainLayout";
import SitesPage from "../pages/sites/SitesPage";
import LanesPage from "../pages/lanes/LanesPage";
import EquipmentPage from "../pages/equipment/EquipmentPage";
import InventoryPage from "../pages/inventory/InventoryPage";
import InstallationsPage from "../pages/installations/InstallationsPage";
import CableTrackingPage from "../pages/cables/CableTrackingPage";
import DailyLogsPage from "../pages/dailylogs/DailyLogsPage";
import WorkStatusPage from "../pages/workstatus/WorkStatusPage";
import ReportsPage from "../pages/reports/ReportsPage";
import UsersPage from "../pages/users/UsersPage";

import ProtectedRoute from "../components/ProtectedRoute";

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
          path="/lanes"element={
        <ProtectedRoute>
            allowedRoles={[
        "Admin",
        "Manager",
      ]}
              <LanesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/equipment"
          element={
            <ProtectedRoute>
              allowedRoles={[
        "Admin",
        "Manager",
      ]}
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
            <ProtectedRoute>
              allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
              <InstallationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cable-tracking"
          element={
            <ProtectedRoute>
              allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
              <CableTrackingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dailylogs"
          element={
            <ProtectedRoute>
              allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
              <DailyLogsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workstatus"
          element={
            <ProtectedRoute>
              allowedRoles={[
        "Admin",
        "Manager",
        "Engineer",
      ]}
              <WorkStatusPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              allowedRoles={[
        "Admin",
        "Manager",
      ]}
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