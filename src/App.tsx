import { Routes, Route, createRoutesFromElements, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import SettingsLayout from '@/components/layout/SettingsLayout';
import DashboardPage from '@/pages/DashboardPage';
import WorkflowsPage from '@/pages/WorkflowsPage';
import ConnectionsPage from '@/pages/settings/ConnectionsPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/workflows" element={<WorkflowsPage />} />
      <Route path="/settings" element={<SettingsLayout />}>
        <Route path="connections" element={<ConnectionsPage />} />
      </Route>
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;