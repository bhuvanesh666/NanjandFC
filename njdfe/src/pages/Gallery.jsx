import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Gallery() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lb, setLb] = useState(null); // lightbox image

  useEffect(() => {
    api.get("/gallery/albums/")
      .then(r => setAlbums(r.data.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Club Gallery</h1>
        <p className="page-sub">Training, events, trophies and team moments</p>

        {loading && <p className="loading">Loading gallery…</p>}
        {!loading && albums.length === 0 && <p className="empty">No albums yet.</p>}

        {albums.map(album => (
          <div key={album.id} style={{marginBottom:36}}>
            <h2 style={{color:"var(--green2)",marginBottom:4}}>
              {album.title} <span style={{color:"var(--muted)",fontSize:".9rem"}}>({album.year})</span>
            </h2>
            {album.description && <p style={{color:"var(--muted)",marginBottom:12,fontSize:".9rem"}}>{album.description}</p>}
            {!album.images?.length
              ? <p className="empty" style={{padding:"16px 0"}}>No images in this album.</p>
              : <div className="grid g4">
                  {album.images.map(img => (
                    <div className="card" key={img.id} style={{cursor:"zoom-in"}} onClick={() => setLb(img)}>
                      <img className="card-img" src={img.image} alt={img.caption}/>
                      {img.caption && <div className="card-body" style={{padding:"8px 12px",fontSize:".82rem",color:"var(--muted)"}}>{img.caption}</div>}
                    </div>
                  ))}
                </div>
            }
          </div>
        ))}

        {lb && (
          <div className="lightbox" onClick={() => setLb(null)}>
            <div>
              <img src={lb.image} alt={lb.caption}/>
              {lb.caption && <p>{lb.caption}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
