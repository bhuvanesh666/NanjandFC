import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const { login } = useAuth(); const nav = useNavigate();
  const onSubmit = async e => {
    e.preventDefault(); setErr(""); setLoading(true);
    try { const u = await login(form.username, form.password); nav(u.role === "admin" ? "/admin" : "/dashboard"); }
    catch (ex) { setErr(ex.response?.data?.detail || "Invalid credentials."); }
    finally { setLoading(false); }
  };
  return (
    <div className="page">
      <div className="form-wrap">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-sub">Login to your Nanjanad FC account</p>
        {err && <div className="err">{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="fg"><label>Username</label><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required /></div>
          <div className="fg"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
          <button className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>{loading ? "Logging in…" : "Login"}</button>
        </form>
        <div className="form-footer">No account? <Link to="/register">Register here</Link></div>
      </div>
    </div>
  );
}
