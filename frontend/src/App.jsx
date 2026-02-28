import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Home from "./pages/Home.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Games from "./pages/Games.jsx";
import YouTube from "./pages/YouTube.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Contact from "./pages/Contact.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProjects from "./pages/admin/AdminProjects.jsx";
import AdminSkills from "./pages/admin/AdminSkills.jsx";
import AdminGames from "./pages/admin/AdminGames.jsx";
import AdminYouTube from "./pages/admin/AdminYouTube.jsx";
import AdminExperiences from "./pages/admin/AdminExperiences.jsx";
import AdminFormations from "./pages/admin/AdminFormations.jsx";
import AdminContacts from "./pages/admin/AdminContacts.jsx";
import DilemmeLayout from "./game-theory/DilemmeLayout.jsx";
import DilemmeAccueil from "./game-theory/DilemmeAccueil.jsx";
import DuelPage from "./game-theory/DuelPage.jsx";
import TournoiPage from "./game-theory/TournoiPage.jsx";
import EvolutionPage from "./game-theory/EvolutionPage.jsx";
import SandboxPage from "./game-theory/SandboxPage.jsx";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin routes – sans Navbar/Footer */}
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="games" element={<AdminGames />} />
            <Route path="youtube" element={<AdminYouTube />} />
            <Route path="experiences" element={<AdminExperiences />} />
            <Route path="formations" element={<AdminFormations />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Dilemme du Prisonnier – standalone cyberpunk layout */}
          <Route path="/dilemme" element={<DilemmeLayout />}>
            <Route index element={<DilemmeAccueil />} />
            <Route path="duel" element={<DuelPage />} />
            <Route path="tournoi" element={<TournoiPage />} />
            <Route path="evolution" element={<EvolutionPage />} />
            <Route path="sandbox" element={<SandboxPage />} />
          </Route>

          {/* Public routes */}
          <Route path="/*" element={
            <div className="app-shell">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/games" element={<Games />} />
                <Route path="/youtube" element={<YouTube />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
              <Footer />
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
