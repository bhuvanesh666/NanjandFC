import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Players from "./pages/Players";
import Matches from "./pages/Matches";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Leaderboard from "./pages/Leaderboard";
import PlayerDashboard from "./pages/PlayerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/"           element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/about"      element={<AnimatedPage><About /></AnimatedPage>} />
          <Route path="/players"    element={<AnimatedPage><Players /></AnimatedPage>} />
          <Route path="/matches"    element={<AnimatedPage><Matches /></AnimatedPage>} />
          <Route path="/gallery"    element={<AnimatedPage><Gallery /></AnimatedPage>} />
          <Route path="/news"       element={<AnimatedPage><News /></AnimatedPage>} />
          <Route path="/contact"    element={<AnimatedPage><Contact /></AnimatedPage>} />
          <Route path="/leaderboard" element={<AnimatedPage><Leaderboard /></AnimatedPage>} />
          <Route path="/login"      element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/register"   element={<AnimatedPage><Register /></AnimatedPage>} />
          <Route path="/dashboard"  element={<ProtectedRoute role="player"><AnimatedPage><PlayerDashboard /></AnimatedPage></ProtectedRoute>} />
          <Route path="/admin"      element={<ProtectedRoute role="admin"><AnimatedPage><AdminDashboard /></AnimatedPage></ProtectedRoute>} />
          <Route path="*"           element={<AnimatedPage><div className="page text-center container" style={{paddingTop:120}}><h1 style={{fontSize:"4rem",color:"var(--gold)"}}>404</h1><p style={{color:"var(--gray)"}}>Page not found</p><Link to="/" className="btn btn-gold" style={{marginTop:20}}>Go Home</Link></div></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}

// missing import
import { Link } from "react-router-dom";
