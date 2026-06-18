import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminGallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:"", year:new Date().getFullYear(), description:"" });
  const [selected, setSelected] = useState(null); // album for image management
  const [err, setErr] = useState("");

  const load = () => api.get("/gallery/albums/").then(r=>setAlbums(r.data.results??r.data)).catch(()=>setErr("Failed.")).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const createAlbum = async e => {
    e.preventDefault();
    try { await api.post("/gallery/albums/", form); setShowForm(false); setForm({title:"",year:new Date().getFullYear(),description:""}); load(); }
    catch { setErr("Create failed."); }
  };

  const delAlbum = async id => {
    if(!window.confirm("Delete album and all its images?")) return;
    await api.delete(`/gallery/albums/${id}/`); load();
  };

  if(selected) return <AlbumImages album={selected} onBack={()=>{ setSelected(null); load(); }}/>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h2>🖼️ Gallery Albums</h2>
        <button className="btn btn-primary btn-sm" onClick={()=>setShowForm(!showForm)}>
          {showForm?"Cancel":"+ New Album"}
        </button>
      </div>
      {err && <div className="err">{err}</div>}

      {showForm && (
        <form onSubmit={createAlbum} className="card" style={{padding:20,marginBottom:20}}>
          <div className="fg"><label>Album Title *</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/></div>
          <div className="fg"><label>Year *</label><input type="number" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} required/></div>
          <div className="fg"><label>Description</label><textarea rows="2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea></div>
          <button className="btn btn-primary">Create Album</button>
        </form>
      )}

      {loading ? <p className="loading">Loading…</p> : albums.length===0 ? <p className="empty">No albums yet.</p> : (
        <table>
          <thead><tr><th>Title</th><th>Year</th><th>Images</th><th>Actions</th></tr></thead>
          <tbody>
            {albums.map(a=>(
              <tr key={a.id}>
                <td><strong>{a.title}</strong></td>
                <td>{a.year}</td>
                <td>{a.images?.length||0}</td>
                <td style={{display:"flex",gap:6}}>
                  <button className="btn btn-primary btn-sm" onClick={()=>setSelected(a)}>📸 Manage Images</button>
                  <button className="btn btn-danger btn-sm" onClick={()=>delAlbum(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AlbumImages({ album, onBack }) {
  const [images, setImages] = useState(album.images||[]);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const upload = async e => {
    e.preventDefault(); if(!file){setErr("Select an image.");return;}
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("album",album.id); fd.append("image",file); fd.append("caption",caption);
      const r = await api.post("/gallery/images/", fd, {headers:{"Content-Type":"multipart/form-data"}});
      setImages([...images, r.data]); setFile(null); setCaption("");
    } catch { setErr("Upload failed."); }
    finally { setUploading(false); }
  };

  const del = async id => {
    await api.delete(`/gallery/images/${id}/`);
    setImages(images.filter(i=>i.id!==id));
  };

  return (
    <div>
      <button className="btn btn-outline btn-sm" onClick={onBack} style={{marginBottom:14}}>← Back to Albums</button>
      <h2 style={{marginBottom:14}}>📸 {album.title} ({album.year})</h2>
      {err && <div className="err">{err}</div>}

      <form onSubmit={upload} className="row" style={{marginBottom:20}}>
        <div className="fg" style={{marginBottom:0}}><label>Image *</label>
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}/>
        </div>
        <div className="fg" style={{marginBottom:0,flex:1}}><label>Caption</label>
          <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Optional caption"/>
        </div>
        <button className="btn btn-primary btn-sm" style={{alignSelf:"flex-end"}} disabled={uploading}>
          {uploading?"Uploading…":"Upload Image"}
        </button>
      </form>

      {images.length===0 ? <p className="empty">No images yet.</p> : (
        <div className="grid g4">
          {images.map(img=>(
            <div className="card" key={img.id}>
              <img className="card-img" src={img.image} alt={img.caption} style={{height:120}}/>
              <div className="card-body" style={{padding:"8px 10px"}}>
                {img.caption && <p style={{fontSize:".82rem",marginBottom:6,color:"var(--muted)"}}>{img.caption}</p>}
                <button className="btn btn-danger btn-sm" onClick={()=>del(img.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
