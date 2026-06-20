import { motion } from "framer-motion";
export default function About() {
  return (
    <div>
      <div className="page-hero"><div className="container"><h1>About the Club</h1><p>Our story, mission and values</p></div></div>
      <div className="page"><div className="container">
        <div className="grid g2" style={{ marginBottom: 40 }}>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="card">
            <div className="card-body" style={{ padding: 32 }}>
              <div style={{ color: "var(--gold)", fontSize: "0.75rem", letterSpacing: 3, marginBottom: 12 }}>OUR STORY</div>
              <h2 style={{ fontSize: "1.8rem", color: "var(--white)", marginBottom: 16 }}>A Legacy Born in Nanjanad</h2>
              <p style={{ color: "var(--gray)", lineHeight: 1.8 }}>Nanjanad Football Club was formed under the Siva Memorial Recreation Club with a mission to nurture local football talent and bring the community together through sport. Over the years the club has grown from a small group of enthusiasts to a competitive team participating in district and state-level tournaments.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="card">
            <div className="card-body" style={{ padding: 32 }}>
              <div style={{ color: "var(--gold)", fontSize: "0.75rem", letterSpacing: 3, marginBottom: 12 }}>THE FOUNDATION</div>
              <h2 style={{ fontSize: "1.8rem", color: "var(--white)", marginBottom: 16 }}>Community at the Core</h2>
              <p style={{ color: "var(--gray)", lineHeight: 1.8 }}>We believe in discipline, teamwork, and giving every player — junior to senior — the opportunity to grow both as athletes and individuals. Our training sessions, friendly matches, and tournament participation are all part of building a strong football culture in Nanjanad.</p>
            </div>
          </motion.div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[["🎯 Our Mission","To develop skilled, disciplined footballers and promote sportsmanship across all age groups in our community."],
            ["👁️ Our Vision","To become a leading football club at district level, recognised for talent, fair play, and community impact."],
            ["💎 Our Values","Respect, hard work, unity, and a deep love for the game guide everything we do — on and off the pitch."]
          ].map(([t, d]) => (
            <motion.div key={t} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <div className="card-body" style={{ padding: 24 }}>
                <h3 style={{ fontSize: "1.3rem", color: "var(--white)", marginBottom: 10 }}>{t}</h3>
                <p style={{ color: "var(--gray)", fontSize: "0.9rem", lineHeight: 1.7 }}>{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div></div>
    </div>
  );
}
