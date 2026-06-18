import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ username:"", email:"", phone:"", password:"", password2:"" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setErr(""); setOk("");
    if (form.password !== form.password2) { setErr("Passwords do not match."); return; }
    setLoading(true);
    try {
      await register(form);
      setOk("Account created! Redirecting to login…");
      setTimeout(() => nav("/login"), 1500);
    } catch (ex) {
      const d = ex.response?.data;
      if (d && typeof d === "object") {
        const k = Object.keys(d)[0];
        const v = Array.isArray(d[k]) ? d[k][0] : d[k];
        setErr(`${k}: ${v}`);
      } else setErr("Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="form-wrap" style={{maxWidth:460}}>
        <h2>Join Nanjanad FC</h2>
        <p className="form-sub">Create your account</p>
        {err && <div className="err">{err}</div>}
        {ok  && <div className="suc">{ok}</div>}
        <form onSubmit={onSubmit}>
          {[
            { label:"Username", name:"username", type:"text" },
            { label:"Email",    name:"email",    type:"email" },
            { label:"Phone",    name:"phone",    type:"tel" },
            { label:"Password", name:"password", type:"password" },
            { label:"Confirm Password", name:"password2", type:"password" },
          ].map(f => (
            <div className="fg" key={f.name}>
              <label>{f.label}</label>
              <input type={f.type} name={f.name} value={form[f.name]} onChange={onChange}
                required={f.name !== "phone"} minLength={f.name.includes("pass") ? 6 : undefined} />
            </div>
          ))}
          <button className="btn btn-primary" style={{width:"100%"}} disabled={loading}>
            {loading ? "Creating…" : "Register"}
          </button>
        </form>
        <div className="form-footer">Already have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  );
}
