import { useEffect, useState } from "react";
import api from "../../api/axios";
import { mediaUrl } from "../../api/media";

export default function AdminGallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", year: new Date().getFullYear(), description: "" });
  const [selected, setSelected] = useState(null);
  const [err, setErr] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/gallery/albums/")
      .then(r => setAlbums(r.data.results ?? r.data))
      .catch(() => setErr("Failed to load."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const createAlbum = async e => {
    e.preventDefault();
    try { await api.post("/gallery/albums/", form); setShowForm(false); setForm({ title: "", year: new Date().getFullYear(), description: "" }); load(); }
    catch { setErr("Create failed."); }
  };

  const delAlbum = async id => {
    if (!window.confirm("Delete album and all its images?")) return;
    await api.delete(`/gallery/albums/${id}/`); load();
    if (selected?.id === id) setSelected(null);
  };

  if (selected) return <AlbumImages album={selected} onBack={() => { setSelected(null); load(); }} />;
  if (loading) return <p className="loading">Loading gallery…</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 className="dash-title">🖼️ Gallery</h2>
          <p className="dash-sub">Create albums and upload club photos</p>
        </div>
        <button className="btn btn-gold btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Album"}
        </button>
      </div>

      {err && <div className="err">{err}</div>}

      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24, background: "var(--black3)" }}>
          <h3 style={{ color: "var(--gold)", marginBottom: 16 }}>New Album</h3>
          <form onSubmit={createAlbum}>
            <div className="fg"><label>Album Title *</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="fg"><label>Year *</label><input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} required /></div>
            <div className="fg"><label>Description</label><textarea rows="2" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <button type="submit" className="btn btn-gold">Create Album</button>
          </form>
        </div>
      )}

      {albums.length === 0
        ? <p className="empty">No albums yet. Click "+ New Album" to create one.</p>
        : <table>
            <thead><tr><th>Title</th><th>Year</th><th>Images</th><th>Actions</th></tr></thead>
            <tbody>
              {albums.map(a => (
                <tr key={a.id}>
                  <td><strong style={{ color: "var(--white)" }}>{a.title}</strong></td>
                  <td style={{ color: "var(--gray)" }}>{a.year}</td>
                  <td><span style={{ color: "var(--gold)", fontWeight: 700 }}>{a.images?.length || 0}</span></td>
                  <td style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-gold btn-sm" onClick={() => setSelected(a)}>📸 Images</button>
                    <button className="btn btn-danger btn-sm" onClick={() => delAlbum(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      }
    </div>
  );
}

function AlbumImages({ album, onBack }) {
  const [images, setImages] = useState(album.images || []);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const upload = async e => {
    e.preventDefault();
    if (!file) { setErr("Please select an image."); return; }
    setUploading(true); setErr(""); setMsg("");
    try {
      const fd = new FormData();
      fd.append("album", album.id);
      fd.append("image", file);
      fd.append("caption", caption);
      const r = await api.post("/gallery/images/", fd);
      setImages([...images, r.data]);
      setFile(null); setCaption(""); setMsg("Image uploaded!");
    } catch { setErr("Upload failed."); }
    finally { setUploading(false); }
  };

  const del = async id => {
    await api.delete(`/gallery/images/${id}/`);
    setImages(images.filter(i => i.id !== id));
  };

  return (
    <div>
      <button className="btn btn-dark btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>← Back to Albums</button>
      <h2 className="dash-title">📸 {album.title}</h2>
      <p className="dash-sub">{album.year} · {images.length} images</p>

      {err && <div className="err">{err}</div>}
      {msg && <div className="suc">{msg}</div>}

      <form onSubmit={upload} style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div className="fg" style={{ marginBottom: 0 }}>
          <label>Image *</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ color: "var(--gray)" }} />
        </div>
        <div className="fg" style={{ flex: 1, marginBottom: 0 }}>
          <label>Caption</label>
          <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Optional caption" />
        </div>
        <button type="submit" className="btn btn-gold" disabled={uploading}>{uploading ? "Uploading…" : "Upload Image"}</button>
      </form>

      {images.length === 0
        ? <p className="empty">No images yet. Upload one above.</p>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 16 }}>
            {images.map(img => (
              <div key={img.id} className="card">
                <img src={mediaUrl(img.image)} alt={img.caption} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                <div style={{ padding: 10 }}>
                  {img.caption && <p style={{ fontSize: "0.78rem", color: "var(--gray)", marginBottom: 8 }}>{img.caption}</p>}
                  <button className="btn btn-danger btn-sm" onClick={() => del(img.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}
