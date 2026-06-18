import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminPlayers from "./admin/AdminPlayers";
import AdminMatches from "./admin/AdminMatches";
import AdminDocuments from "./admin/AdminDocuments";
import AdminGallery from "./admin/AdminGallery";
import AdminNews from "./admin/AdminNews";

const TABS = ["Players","Matches","Documents","Gallery","News"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Players");
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">⚙️ Admin Dashboard</h1>
        <p className="page-sub">Logged in as: <strong>{user?.username}</strong></p>
        <div className="dash">
          <div className="dash-side">
            <h4>Manage</h4>
            {TABS.map(t=>(
              <button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>
                {{Players:"👥 Players",Matches:"📅 Matches",Documents:"📄 Documents",Gallery:"🖼️ Gallery",News:"📰 News"}[t]}
              </button>
            ))}
          </div>
          <div className="dash-main">
            {tab==="Players"   && <AdminPlayers/>}
            {tab==="Matches"   && <AdminMatches/>}
            {tab==="Documents" && <AdminDocuments/>}
            {tab==="Gallery"   && <AdminGallery/>}
            {tab==="News"      && <AdminNews/>}
          </div>
        </div>
      </div>
    </div>
  );
}
