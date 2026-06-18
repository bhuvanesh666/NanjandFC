import { useEffect, useState } from "react";
import api from "../../api/axios";

const EMPTY = { title:"", content:"" };

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

  const load = () => api.get("/news/").then(r=>setNews(r.data.results??r.data)).catch(()=>setErr("Failed.")).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const openCreate = () => { setForm(EMPTY); setImgFile(null); setEditId(null); setShowForm(true); };
  const openEdit = n => { setForm({title:n.title,content:n.content}); setImgFile(null); setEditId(n.id); setShowForm(true); };

  const submit = async e => {
    e.preventDefault(); setSaving(true); setErr(""); setMsg("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      if(imgFile) fd.append("image", imgFile);
      if(editId) await api.patch(`/news/${editId}/`, fd, {headers:{"Content-Type":"multipart/form-data"}});
      else       await api.post("/news/", fd, {headers:{"Content-Type":"multipart/form-data"}});
      setShowForm(false); setMsg(editId?"Article updated!":"Article published!"); load();
    } catch { setErr("Save failed."); }
    finally { setSaving(false); }
  };

  const del = async id => {
    if(!window.confirm("Delete this article?")) return;
    await api.delete(`/news/${id}/`); load();
  };

  if(loading) return <p className="loading">Loading…</p>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h2>📰 Manage News</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ New Article</button>
      </div>
      {err && <div className="err">{err}</div>}
      {msg && <div className="suc">{msg}</div>}

      {showForm && (
        <form onSubmit={submit} className="card" style={{padding:20,marginBottom:20}}>
          <h3 style={{marginBottom:14}}>{editId?"Edit Article":"New Article"}</h3>
          <div className="fg"><label>Title *</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
          </div>
          <div className="fg"><label>Content *</label>
            <textarea rows="6" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} required></textarea>
          </div>
          <div className="fg"><label>Image (optional)</label>
            <input type="file" accept="image/*" onChange={e=>setImgFile(e.target.files[0])}/>
          </div>
          <button className="btn btn-primary" disabled={saving} style={{marginRight:10}}>
            {saving?"Saving…":editId?"Update Article":"Publish Article"}
          </button>
          <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
        </form>
      )}

      {news.length===0 ? <p className="empty">No articles yet. Click "+ New Article" to publish one.</p> : (
        <table>
          <thead><tr><th>Title</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {news.map(n=>(
              <tr key={n.id}>
                <td><strong>{n.title}</strong></td>
                <td>{new Date(n.date).toLocaleDateString()}</td>
                <td style={{display:"flex",gap:6}}>
                  <button className="btn btn-outline btn-sm" onClick={()=>openEdit(n)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>del(n.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
