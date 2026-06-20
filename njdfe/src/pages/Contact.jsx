export default function Contact() {
  return (
    <div>
      <div className="page-hero"><div className="container"><h1>Contact Us</h1><p>Get in touch with Nanjanad FC</p></div></div>
      <div className="page"><div className="container">
        <div className="grid g2">
          <div className="card"><div className="card-body" style={{ padding: 32 }}>
            <div style={{ color: "var(--gold)", fontSize: "0.75rem", letterSpacing: 3, marginBottom: 16 }}>CLUB INFORMATION</div>
            {[["Club","Nanjanad Football Club"],["Organisation","Siva Memorial Recreation Club"],["Location","Nanjanad, Tamilnadu, India"],["Email","nanjanadfc@gmail.in"],["Phone","+91 98765 43210"]].map(([k,v]) => (
              <div key={k} style={{ display: "flex", gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border2)" }}>
                <span style={{ color: "var(--gray)", minWidth: 100, fontSize: "0.85rem" }}>{k}</span>
                <span style={{ color: "var(--white)", fontSize: "0.85rem" }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop: 20, color: "var(--gold)", fontSize: "0.75rem", letterSpacing: 3, marginBottom: 12 }}>TRAINING SCHEDULE</div>
            <p style={{ color: "var(--gray)", fontSize: "0.88rem" }}>Mon – Fri: 4:00 PM – 6:30 PM</p>
            <p style={{ color: "var(--gray)", fontSize: "0.88rem" }}>Sat-Sun: 8:00 AM – 11:00 AM</p>
          </div></div>
          <div className="card"><div className="card-body" style={{ padding: 32 }}>
            <div style={{ color: "var(--gold)", fontSize: "0.75rem", letterSpacing: 3, marginBottom: 16 }}>FIND US</div>
            <iframe title="map" src="https://maps.google.com/maps?q=Nanjanad,Tamilnadu&output=embed" width="100%" height="320" style={{ border: 0, borderRadius: 6, filter: "invert(0.9) hue-rotate(180deg)" }} loading="lazy" />
          </div></div>
        </div>
      </div></div>
    </div>
  );
}
