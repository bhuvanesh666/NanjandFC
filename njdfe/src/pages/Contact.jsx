export default function Contact() {
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-sub">Get in touch with Nanjanad Football Club</p>
        <div className="grid g2">
          <div className="card"><div className="card-body">
            <h3 style={{marginBottom:12}}>Club Information</h3>
            {[["Club","Nanjanad Football Club"],["Organisation","Siva Memorial Recreation Club, Nanjanad"],["Location","Nanjanad, Tamilnadu, India"],["Email","nanjanadfc.in"],["Phone","+91 7339326341"]].map(([k,v])=>(
              <p key={k} style={{marginBottom:6}}><strong>{k}:</strong> {v}</p>
            ))}
            <hr className="divider"/>
            <h3 style={{marginBottom:8}}>Training Schedule</h3>
            <p>Mon – sat: 4:00 PM – 6:30 PM</p>
            <p>Sunday: 8:00 AM – 11:00 AM</p>
          </div></div>
          <div className="card"><div className="card-body">
            <h3 style={{marginBottom:12}}>Find Us</h3>
            <iframe title="map" src="https://maps.google.com/maps?q=Nanjanad,Kerala&output=embed" width="100%" height="300" style={{border:0,borderRadius:6}} loading="lazy"/>
          </div></div>
        </div>
      </div>
    </div>
  );
}
