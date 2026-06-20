import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminPlayers from "./admin/AdminPlayers";
import AdminMatches from "./admin/AdminMatches";
import AdminDocuments from "./admin/AdminDocuments";
import AdminGallery from "./admin/AdminGallery";
import AdminNews from "./admin/AdminNews";

const TABS = [
  { key: "Players",   icon: "👥", label: "Players" },
  { key: "Matches",   icon: "📅", label: "Matches" },
  { key: "Documents", icon: "📄", label: "Documents" },
  { key: "Gallery",   icon: "🖼️", label: "Gallery" },
  { key: "News",      icon: "📰", label: "News" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Players");
  const { user } = useAuth();

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <h1>Admin Panel</h1>
          <p>Logged in as {user?.username}</p>
        </div>
      </div>
      <div className="page">
        <div className="container">
          <div className="dash">
            <div className="dash-side">
              <h4>Manage</h4>
              {TABS.map(t => (
                <button
                  key={t.key}
                  className={tab === t.key ? "active" : ""}
                  onClick={() => setTab(t.key)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div className="dash-main">
              {tab === "Players"   && <AdminPlayers />}
              {tab === "Matches"   && <AdminMatches />}
              {tab === "Documents" && <AdminDocuments />}
              {tab === "Gallery"   && <AdminGallery />}
              {tab === "News"      && <AdminNews />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
