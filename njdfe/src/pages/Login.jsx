import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const u = await login(form.username, form.password);
      nav(u.role === "admin" ? "/admin" : "/dashboard");
    } catch (e) {
      setErr(e.response?.data?.detail || "Invalid username or password.");
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="form-wrap">
        <h2>Welcome Back</h2>
        <p className="form-sub">Login to your Nanjanad FC account</p>
        {err && <div className="err">{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="fg"><label>Username</label>
            <input name="username" value={form.username} onChange={onChange} required />
          </div>
          <div className="fg"><label>Password</label>
            <input type="password" name="password" value={form.password} onChange={onChange} required />
          </div>
          <button className="btn btn-primary" style={{width:"100%"}} disabled={loading}>
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
        <div className="form-footer">
          No account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
