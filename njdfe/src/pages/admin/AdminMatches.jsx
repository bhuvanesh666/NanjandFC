import { useEffect, useState } from "react";
import api from "../../api/axios";

const EMPTY = { opponent:"", date:"", venue:"", competition:"", status:"upcoming" };

export default function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [summaryFor, setSummaryFor] = useState(null);
  const [err, setErr] = useState("");

  const load = () => api.get("/matches/").then(r=>setMatches(r.data.results??r.data)).catch(()=>setErr("Failed.")).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit   = m  => { setForm({opponent:m.opponent,date:m.date.slice(0,16),venue:m.venue,competition:m.competition||"",status:m.status}); setEditId(m.id); setShowForm(true); };

  const submit = async e => {
    e.preventDefault(); setErr("");
    try {
      if(editId) await api.put(`/matches/${editId}/`, form);
      else       await api.post("/matches/", form);
      setShowForm(false); load();
    } catch { setErr("Save failed. Check all fields."); }
  };

  const del = async id => {
    if(!window.confirm("Delete this match?")) return;
    await api.delete(`/matches/${id}/`); load();
  };

  if(loading) return <p className="loading">Loading…</p>;
  if(summaryFor) return <SummaryEditor matchId={summaryFor} onBack={()=>{ setSummaryFor(null); load(); }}/>;

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <h2>📅 Manage Matches</h2>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add Match</button>
      </div>
      {err && <div className="err">{err}</div>}

      {showForm && (
        <form onSubmit={submit} className="card" style={{padding:20,marginBottom:20}}>
          <h3 style={{marginBottom:14}}>{editId?"Edit Match":"New Match"}</h3>
          <div className="grid g2">
            <div className="fg"><label>Opponent *</label><input value={form.opponent} onChange={e=>setForm({...form,opponent:e.target.value})} required/></div>
            <div className="fg"><label>Date & Time *</label><input type="datetime-local" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/></div>
            <div className="fg"><label>Venue *</label><input value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} required/></div>
            <div className="fg"><label>Competition</label><input value={form.competition} onChange={e=>setForm({...form,competition:e.target.value})} placeholder="e.g. District League"/></div>
            <div className="fg"><label>Status</label>
              <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option value="upcoming">Upcoming</option>
                <option value="played">Played</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" style={{marginRight:10}}>{editId?"Update":"Create"}</button>
          <button type="button" className="btn btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
        </form>
      )}

      {matches.length === 0
        ? <p className="empty">No matches yet. Click "+ Add Match" to create one.</p>
        : <table>
          <thead><tr><th>Opponent</th><th>Date</th><th>Venue</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {matches.map(m=>(
              <tr key={m.id}>
                <td><strong>{m.opponent}</strong></td>
                <td>{new Date(m.date).toLocaleString()}</td>
                <td>{m.venue}</td>
                <td><span className={`tag tag-${m.status}`}>{m.status}</span></td>
                <td style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <button className="btn btn-outline btn-sm" onClick={()=>openEdit(m)}>Edit</button>
                  {m.status==="played" && <button className="btn btn-gold btn-sm" onClick={()=>setSummaryFor(m.id)}>📊 Summary</button>}
                  <button className="btn btn-danger btn-sm" onClick={()=>del(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
}

/* ── Match Summary Editor ── */
function SummaryEditor({ matchId, onBack }) {
  const [s, setS] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/matches/${matchId}/summary/`).then(r=>setS(r.data)).catch(()=>setErr("Failed to load summary."));
    api.get(`/matches/photos/?match=${matchId}`).then(r=>setPhotos(r.data.results??r.data)).catch(()=>{});
  }, [matchId]);

  const chg = e => setS({...s,[e.target.name]:e.target.value});
  const lstChg = (field,i,key,val) => { const l=[...(s[field]||[])]; l[i]={...l[i],[key]:val}; setS({...s,[field]:l}); };
  const lstAdd = (field,tpl) => setS({...s,[field]:[...(s[field]||[]),tpl]});
  const lstDel = (field,i) => { const l=[...(s[field]||[])]; l.splice(i,1); setS({...s,[field]:l}); };

  const save = async e => {
    e.preventDefault(); setSaving(true); setMsg(""); setErr("");
    try { await api.put(`/matches/${matchId}/summary/`, s); setMsg("Summary saved!"); }
    catch { setErr("Save failed."); }
    finally { setSaving(false); }
  };

  const uploadPhoto = async e => {
    e.preventDefault(); if(!photoFile) return;
    const fd = new FormData(); fd.append("match",matchId); fd.append("image",photoFile);
    try {
      await api.post("/matches/photos/", fd, {headers:{"Content-Type":"multipart/form-data"}});
      const r = await api.get(`/matches/photos/?match=${matchId}`);
      setPhotos(r.data.results??r.data); setPhotoFile(null);
    } catch { setErr("Photo upload failed."); }
  };

  const delPhoto = async id => {
    await api.delete(`/matches/photos/${id}/`);
    setPhotos(photos.filter(p=>p.id!==id));
  };

  if(!s) return <p className="loading">Loading summary…</p>;

  return (
    <div>
      <button className="btn btn-outline btn-sm" onClick={onBack} style={{marginBottom:16}}>← Back to Matches</button>
      <h2 style={{marginBottom:16}}>📊 Match Summary</h2>
      {msg && <div className="suc">{msg}</div>}
      {err && <div className="err">{err}</div>}

      <form onSubmit={save}>
        <div className="grid g2" style={{marginBottom:14}}>
          {[["home_score","Home Score"],["away_score","Away Score"],["possession","Possession %"],["shots_on_target","Shots on Target"],["fouls","Fouls"]].map(([n,l])=>(
            <div className="fg" key={n}><label>{l}</label>
              <input type="number" name={n} value={s[n]||0} onChange={chg} min="0" max={n==="possession"?100:undefined}/>
            </div>
          ))}
          <div className="fg"><label>Man of the Match</label>
            <input name="man_of_the_match" value={s.man_of_the_match||""} onChange={chg} placeholder="Player name"/>
          </div>
        </div>

        {/* Scorers */}
        <ListEditor title="⚽ Goal Scorers" items={s.scorers||[]}
          onAdd={()=>lstAdd("scorers",{player:"",minute:""})}
          onChg={(i,k,v)=>lstChg("scorers",i,k,v)}
          onDel={i=>lstDel("scorers",i)}/>

        {/* Assists */}
        <ListEditor title="🎯 Assists" items={s.assists||[]}
          onAdd={()=>lstAdd("assists",{player:"",minute:""})}
          onChg={(i,k,v)=>lstChg("assists",i,k,v)}
          onDel={i=>lstDel("assists",i)}/>

        {/* Yellow Cards */}
        <ListEditor title="🟨 Yellow Cards" items={s.yellow_cards||[]}
          onAdd={()=>lstAdd("yellow_cards",{player:"",minute:""})}
          onChg={(i,k,v)=>lstChg("yellow_cards",i,k,v)}
          onDel={i=>lstDel("yellow_cards",i)}/>

        {/* Red Cards */}
        <ListEditor title="🟥 Red Cards" items={s.red_cards||[]}
          onAdd={()=>lstAdd("red_cards",{player:"",minute:""})}
          onChg={(i,k,v)=>lstChg("red_cards",i,k,v)}
          onDel={i=>lstDel("red_cards",i)}/>

        {/* Subs */}
        <div style={{marginBottom:18}}>
          <strong>🔄 Substitutions</strong>
          {(s.substitutions||[]).map((sub,i)=>(
            <div key={i} className="row" style={{marginTop:8}}>
              <input placeholder="Player Out" value={sub.out||""} onChange={e=>lstChg("substitutions",i,"out",e.target.value)}/>
              <input placeholder="Player In"  value={sub.in||""}  onChange={e=>lstChg("substitutions",i,"in",e.target.value)}/>
              <input type="number" placeholder="Min" value={sub.minute||""} style={{width:70}} onChange={e=>lstChg("substitutions",i,"minute",e.target.value)}/>
              <button type="button" className="btn btn-danger btn-sm" onClick={()=>lstDel("substitutions",i)}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn-outline btn-sm" style={{marginTop:8}}
            onClick={()=>lstAdd("substitutions",{out:"",in:"",minute:""})}>+ Add Sub</button>
        </div>

        <button className="btn btn-primary" disabled={saving}>{saving?"Saving…":"💾 Save Summary"}</button>
      </form>

      {/* Photos */}
      <hr className="divider"/>
      <h3 style={{marginBottom:12}}>📸 Match Photos</h3>
      <form onSubmit={uploadPhoto} className="row" style={{marginBottom:16}}>
        <input type="file" accept="image/*" onChange={e=>setPhotoFile(e.target.files[0])}/>
        <button className="btn btn-primary btn-sm">Upload Photo</button>
      </form>
      <div className="grid g4">
        {photos.map(ph=>(
          <div className="card" key={ph.id}>
            <img className="card-img" src={ph.image} alt="" style={{height:110}}/>
            <div className="card-body" style={{padding:8}}>
              <button className="btn btn-danger btn-sm" onClick={()=>delPhoto(ph.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListEditor({ title, items, onAdd, onChg, onDel }) {
  return (
    <div style={{marginBottom:18}}>
      <strong>{title}</strong>
      {items.map((item,i)=>(
        <div key={i} className="row" style={{marginTop:8}}>
          <input placeholder="Player Name" value={item.player||""} onChange={e=>onChg(i,"player",e.target.value)} style={{flex:1}}/>
          <input type="number" placeholder="Minute" value={item.minute||""} style={{width:80}} onChange={e=>onChg(i,"minute",e.target.value)}/>
          <button type="button" className="btn btn-danger btn-sm" onClick={()=>onDel(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" style={{marginTop:8}} onClick={onAdd}>+ Add</button>
    </div>
  );
}
