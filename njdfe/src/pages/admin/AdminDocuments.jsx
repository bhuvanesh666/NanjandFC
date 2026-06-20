import { useEffect, useState } from "react";
import api from "../../api/axios";

const LABELS = { aadhar:"Aadhar Card", pan:"PAN Card", license:"Driving License" };

export default function AdminDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/players/admin/documents/")
      .then(r => setDocs(r.data.results ?? r.data))
      .catch(() => setErr("Failed to load."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/players/admin/documents/${id}/`, { status });
      setMsg(`Document ${status}!`);
      setDocs(docs.map(d => d.id === id ? { ...d, status } : d));
    } catch { setErr("Update failed."); }
  };

  const filtered = filter === "all" ? docs : docs.filter(d => d.status === filter);
  const counts = { pending: docs.filter(d => d.status === "pending").length, verified: docs.filter(d => d.status === "verified").length, rejected: docs.filter(d => d.status === "rejected").length };

  if (loading) return <p className="loading">Loading documents…</p>;

  return (
    <div>
      <h2 className="dash-title">📄 Documents</h2>
      <p className="dash-sub">Verify or reject player uploaded documents</p>
      {err && <div className="err">{err}</div>}
      {msg && <div className="suc">{msg}</div>}

      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {[["all","All"],["pending",`Pending (${counts.pending})`],["verified",`Verified (${counts.verified})`],["rejected",`Rejected (${counts.rejected})`]].map(([k, l]) => (
          <button key={k} className={`filter-tab ${filter === k ? "active" : ""}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>

      {filtered.length === 0
        ? <p className="empty">No documents found.</p>
        : <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr><th>Player</th><th>Document</th><th>Status</th><th>Uploaded</th><th>File</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(d => (
                  <tr key={d.id}>
                    <td><strong style={{ color: "var(--white)" }}>{d.player?.user?.username || "—"}</strong></td>
                    <td>{LABELS[d.doc_type] || d.doc_type}</td>
                    <td><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                    <td style={{ color: "var(--gray)" }}>{new Date(d.uploaded_at).toLocaleDateString()}</td>
                    <td><a href={d.file} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">View</a></td>
                    <td style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-gold btn-sm" onClick={() => setStatus(d.id, "verified")}>✔ Verify</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setStatus(d.id, "rejected")}>✘ Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
}
