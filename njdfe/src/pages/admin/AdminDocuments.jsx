import { useEffect, useState } from "react";
import api from "../../api/axios";

const LABELS = { aadhar:"Aadhar Card", pan:"PAN Card", license:"Driving License" };

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");

  const load = () => api.get("/players/admin/documents/").then(r=>setDocs(r.data.results??r.data)).catch(()=>setErr("Failed.")).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const setStatus = async (id, status) => {
    try { await api.patch(`/players/admin/documents/${id}/`, { status }); setDocs(docs.map(d=>d.id===id?{...d,status}:d)); }
    catch { setErr("Update failed."); }
  };

  const filtered = filter==="all" ? docs : docs.filter(d=>d.status===filter);

  return (
    <div>
      <h2 style={{marginBottom:16}}>📄 Verify Documents</h2>
      {err && <div className="err">{err}</div>}

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {["all","pending","verified","rejected"].map(s=>(
          <button key={s} className={`btn btn-sm ${filter===s?"btn-primary":"btn-outline"}`} onClick={()=>setFilter(s)}>
            {s.charAt(0).toUpperCase()+s.slice(1)} {s!=="all" && `(${docs.filter(d=>d.status===s).length})`}
          </button>
        ))}
      </div>

      {loading ? <p className="loading">Loading…</p> : filtered.length===0 ? <p className="empty">No documents.</p> : (
        <table>
          <thead><tr><th>Player</th><th>Document</th><th>Status</th><th>Uploaded</th><th>File</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(d=>(
              <tr key={d.id}>
                <td>{d.player?.user?.username||"—"}</td>
                <td>{LABELS[d.doc_type]||d.doc_type}</td>
                <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                <td>{new Date(d.uploaded_at).toLocaleDateString()}</td>
                <td><a href={d.file} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">View</a></td>
                <td style={{display:"flex",gap:6}}>
                  <button className="btn btn-primary btn-sm" onClick={()=>setStatus(d.id,"verified")}>✔ Verify</button>
                  <button className="btn btn-danger btn-sm"  onClick={()=>setStatus(d.id,"rejected")}>✘ Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
