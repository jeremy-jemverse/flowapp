import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { TopBar } from "./TopBar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#1C1F26]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}