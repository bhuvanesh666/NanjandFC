import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "", password2: "" });
  const [err, setErr] = useState(""); const [ok, setOk] = useState(""); const [loading, setLoading] = useState(false);
  const { register } = useAuth(); const nav = useNavigate();
  const onSubmit = async e => {
    e.preventDefault(); setErr(""); setOk("");
    if (form.password !== form.password2) { setErr("Passwords do not match."); return; }
    setLoading(true);
    try { await register(form); setOk("Account created! Redirecting…"); setTimeout(() => nav("/login"), 1500); }
    catch (ex) {
      const d = ex.response?.data;
      if (d && typeof d === "object") { const k = Object.keys(d)[0]; const v = Array.isArray(d[k]) ? d[k][0] : d[k]; setErr(`${k}: ${v}`); }
      else setErr("Registration failed. Please try again.");
    } finally { setLoading(false); }
  };
  return (
    <div className="page">
      <div className="form-wrap" style={{ maxWidth: 460 }}>
        <h2 className="form-title">Join NFC</h2>
        <p className="form-sub">Create your Nanjanad FC account</p>
        {err && <div className="err">{err}</div>}
        {ok && <div className="suc">{ok}</div>}
        <form onSubmit={onSubmit}>
          {[["Username","username","text"],["Email","email","email"],["Phone","phone","tel"],["Password","password","password"],["Confirm Password","password2","password"]].map(([l,n,t]) => (
            <div className="fg" key={n}><label>{l}</label><input type={t} value={form[n]} onChange={e => setForm({ ...form, [n]: e.target.value })} required={n !== "phone"} minLength={n.includes("pass") ? 6 : undefined} /></div>
          ))}
          <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>{loading ? "Creating…" : "Register"}</button>
        </form>
        <div className="form-footer">Already registered? <Link to="/login">Login here</Link></div>
      </div>
    </div>
  );
}
