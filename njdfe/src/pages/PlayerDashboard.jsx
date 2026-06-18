import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const POS = { GK:"Goalkeeper", DEF:"Defender", MID:"Midfielder", FWD:"Forward" };

export default function PlayerDashboard() {
  const [tab, setTab] = useState("Profile");
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Player Dashboard</h1>
        <p className="page-sub">Welcome, {user?.username}</p>
        <div className="dash">
          <div className="dash-side">
            <h4>Menu</h4>
            {["Profile","Documents","Upcoming Matches"].map(t => (
              <button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t}</button>
            ))}
          </div>
          <div className="dash-main">
            {tab === "Profile"           && <ProfileTab />}
            {tab === "Documents"         && <DocsTab />}
            {tab === "Upcoming Matches"  && <UpcomingTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Profile ── */
function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ position:"MID", jersey_number:"", dob:"", bio:"" });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/players/me/").then(r => {
      setProfile(r.data);
      setForm({ position:r.data.position||"MID", jersey_number:r.data.jersey_number||"", dob:r.data.dob||"", bio:r.data.bio||"" });
    }).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const save = async e => {
    e.preventDefault(); setSaving(true); setMsg(""); setErr("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => { if(v) fd.append(k,v); });
      if (photo) fd.append("photo", photo);
      const r = await api.patch("/players/me/", fd, { headers:{"Content-Type":"multipart/form-data"} });
      setProfile({ ...profile, ...r.data });
      setMsg("Profile saved successfully!");
    } catch { setErr("Failed to save profile."); }
    finally { setSaving(false); }
  };

  if (loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <h2 style={{marginBottom:16}}>My Profile</h2>
      {msg && <div className="suc">{msg}</div>}
      {err && <div className="err">{err}</div>}

      {/* avatar + stats */}
      <div style={{display:"flex",gap:16,alignItems:"center",marginBottom:20}}>
        {profile?.photo
          ? <img src={profile.photo} alt="" style={{width:72,height:72,borderRadius:"50%",objectFit:"cover"}}/>
          : <div style={{width:72,height:72,borderRadius:"50%",background:"var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem"}}>👤</div>
        }
        <div>
          <h3>{profile?.user?.username}</h3>
          <p style={{color:"var(--muted)",fontSize:".88rem"}}>{profile?.user?.email}</p>
        </div>
      </div>

      <div className="grid g3" style={{marginBottom:22}}>
        {[["Goals",profile?.goals??0,"⚽"],["Assists",profile?.assists??0,"🎯"],["Matches",profile?.matches_played??0,"📅"]].map(([l,v,ic])=>(
          <div className="card" key={l}><div className="card-body text-center">
            <div style={{fontSize:"1.8rem",fontWeight:800,color:"var(--green)"}}>{ic} {v}</div>
            <div style={{color:"var(--muted)",fontSize:".85rem"}}>{l}</div>
          </div></div>
        ))}
      </div>

      <form onSubmit={save}>
        <div className="fg"><label>Profile Photo</label>
          <input type="file" accept="image/*" onChange={e=>setPhoto(e.target.files[0])}/>
        </div>
        <div className="fg"><label>Position</label>
          <select value={form.position} onChange={e=>setForm({...form,position:e.target.value})}>
            {Object.entries(POS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="fg"><label>Jersey Number</label>
          <input type="number" value={form.jersey_number} onChange={e=>setForm({...form,jersey_number:e.target.value})} min="0" max="99"/>
        </div>
        <div className="fg"><label>Date of Birth</label>
          <input type="date" value={form.dob} onChange={e=>setForm({...form,dob:e.target.value})}/>
        </div>
        <div className="fg"><label>Bio</label>
          <textarea rows="3" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})}></textarea>
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving?"Saving…":"Save Profile"}</button>
      </form>
    </div>
  );
}

/* ── Documents ── */
function DocsTab() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dtype, setDtype] = useState("aadhar");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const LABELS = { aadhar:"Aadhar Card", pan:"PAN Card", license:"Driving License" };

  const load = () => api.get("/players/me/documents/").then(r=>setDocs(r.data.results??r.data)).catch(()=>{}).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const upload = async e => {
    e.preventDefault(); if(!file){setErr("Select a file.");return;}
    setUploading(true); setErr(""); setMsg("");
    try {
      const fd = new FormData(); fd.append("doc_type",dtype); fd.append("file",file);
      await api.post("/players/me/documents/", fd, {headers:{"Content-Type":"multipart/form-data"}});
      setMsg("Uploaded! Awaiting admin verification."); setFile(null); load();
    } catch { setErr("Upload failed."); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <h2 style={{marginBottom:16}}>My Documents</h2>
      {msg && <div className="suc">{msg}</div>}
      {err && <div className="err">{err}</div>}

      <form onSubmit={upload} className="row" style={{marginBottom:22}}>
        <div className="fg" style={{marginBottom:0}}>
          <label>Document Type</label>
          <select value={dtype} onChange={e=>setDtype(e.target.value)}>
            {Object.entries(LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="fg" style={{marginBottom:0}}>
          <label>File (PDF or Image)</label>
          <input type="file" accept=".pdf,image/*" onChange={e=>setFile(e.target.files[0])}/>
        </div>
        <button className="btn btn-primary btn-sm" style={{alignSelf:"flex-end"}} disabled={uploading}>
          {uploading?"Uploading…":"Upload"}
        </button>
      </form>

      {loading ? <p className="loading">Loading…</p> : docs.length === 0 ? <p className="empty">No documents uploaded yet.</p> : (
        <table>
          <thead><tr><th>Type</th><th>Status</th><th>Uploaded</th><th>File</th></tr></thead>
          <tbody>
            {docs.map(d=>(
              <tr key={d.id}>
                <td>{LABELS[d.doc_type]||d.doc_type}</td>
                <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                <td>{new Date(d.uploaded_at).toLocaleDateString()}</td>
                <td><a href={d.file} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">View</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── Upcoming Matches ── */
function UpcomingTab() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    api.get("/matches/?status=upcoming").then(r=>setMatches(r.data.results??r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[]);
  if(loading) return <p className="loading">Loading…</p>;
  if(!matches.length) return <p className="empty">No upcoming matches.</p>;
  return (
    <div>
      <h2 style={{marginBottom:16}}>Upcoming Matches</h2>
      <div className="grid g2">
        {matches.map(m=>(
          <div className="card" key={m.id}><div className="card-body">
            <div className="match-head"><h3>vs {m.opponent}</h3><span className="tag tag-upcoming">Upcoming</span></div>
            <p className="meta">📅 {new Date(m.date).toLocaleString()}<br/>📍 {m.venue}{m.competition?` · ${m.competition}`:""}</p>
          </div></div>
        ))}
      </div>
    </div>
  );
}
