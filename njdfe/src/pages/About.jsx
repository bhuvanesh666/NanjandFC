export default function About() {
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">About Nanjanad FC</h1>
        <p className="page-sub">Siva Memorial Recreation Club, Nanjanad</p>
        <div className="card" style={{marginBottom:28}}>
          <div className="card-body">
            <p style={{marginBottom:14}}>Nanjanad Football Club was formed under the Siva Memorial Recreation Club with a mission to nurture local football talent and bring the community together through sport. Over the years the club has grown from a small group of enthusiasts to a competitive team participating in district and state-level tournaments.</p>
            <p>We believe in discipline, teamwork, and giving every player — junior to senior — the opportunity to grow both as athletes and individuals.</p>
          </div>
        </div>
        <div className="grid g3">
          {[["Our Mission","To develop skilled, disciplined footballers and promote sportsmanship across all age groups in Nanjanad."],
            ["Our Vision","To become a leading football club at district level, recognised for talent, fair play, and community impact."],
            ["Our Values","Respect, hard work, unity, and a deep love for the game guide everything we do — on and off the pitch."]
          ].map(([t,d]) => (
            <div className="card" key={t}><div className="card-body"><h3 style={{marginBottom:8}}>{t}</h3><p style={{color:"var(--muted)",fontSize:".9rem"}}>{d}</p></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
