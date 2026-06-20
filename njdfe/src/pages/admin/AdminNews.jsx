import { useEffect, useState } from "react";
import api from "../../api/axios";

const EMPTY = { title: "", content: "" };

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [imgFile, setImgFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/news/")
      .then(r => setNews(r.data.results ?? r.data))
      .catch(() => setErr("Failed to load news."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY); setImgFile(null);
    setEditId(null); setErr(""); setMsg("");
    setShowForm(true);
  };

  const openEdit = n => {
    setForm({ title: n.title, content: n.content });
    setImgFile(null); setEditId(n.id);
    setErr(""); setMsg(""); setShowForm(true);
  };

  const submit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setErr("Title and content are required."); return;
    }
    setSaving(true); setErr(""); setMsg("");
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("content", form.content.trim());
      if (imgFile) fd.append("image", imgFile);

      if (editId) {
        await api.patch(`/news/${editId}/`, fd);
      } else {
        await api.post("/news/", fd);
      }
      setShowForm(false);
      setMsg(editId ? "Article updated successfully!" : "Article published!");
      load();
    } catch (ex) {
      const d = ex.response?.data;
      if (d && typeof d === "object") {
        const k = Object.keys(d)[0];
        setErr(`${k}: ${Array.isArray(d[k]) ? d[k][0] : d[k]}`);
      } else {
        setErr("Save failed. Check all fields and try again.");
      }
    } finally { setSaving(false); }
  };

  const del = async id => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await api.delete(`/news/${id}/`);
      setMsg("Article deleted.");
      load();
    } catch { setErr("Delete failed."); }
  };

  if (loading) return <p className="loading">Loading news…</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 className="dash-title">📰 News</h2>
          <p className="dash-sub">Publish and manage club news articles</p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={openCreate}>+ New Article</button>
      </div>

      {err && <div className="err">{err}</div>}
      {msg && <div className="suc">{msg}</div>}

      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24, background: "var(--black3)" }}>
          <h3 style={{ color: "var(--gold)", marginBottom: 16 }}>
            {editId ? "Edit Article" : "New Article"}
          </h3>
          <form onSubmit={submit}>
            <div className="fg">
              <label>Title *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Enter article title"
                required
              />
            </div>
            <div className="fg">
              <label>Content *</label>
              <textarea
                rows="7"
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Write the article content here…"
                required
              />
            </div>
            <div className="fg">
              <label>Image (optional)</label>
              <input
  type="file"
  accept="image/*"
  onChange={e => setImgFile(e.target.files[0])}
  style={{ 
    color: "var(--gray)",
    width: "100%",
    padding: "8px",
    background: "var(--black3)",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    cursor: "pointer"
  }}
/>

              {imgFile && <p style={{ color: "var(--gold)", fontSize: "0.8rem", marginTop: 4 }}>Selected: {imgFile.name}</p>}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-gold" disabled={saving}>
                {saving ? "Saving…" : editId ? "Update Article" : "Publish Article"}
              </button>
              <button type="button" className="btn btn-dark" onClick={() => { setShowForm(false); setErr(""); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {news.length === 0 ? (
        <p className="empty">No articles yet. Click "+ New Article" to publish one.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map(n => (
              <tr key={n.id}>
                <td>
                  <div style={{ color: "var(--white)", fontWeight: 600 }}>{n.title}</div>
                  <div style={{ color: "var(--gray)", fontSize: "0.78rem", marginTop: 2 }}>
                    {n.content.slice(0, 60)}…
                  </div>
                </td>
                <td style={{ color: "var(--gray)", whiteSpace: "nowrap" }}>
                  {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-dark btn-sm" onClick={() => openEdit(n)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(n.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
