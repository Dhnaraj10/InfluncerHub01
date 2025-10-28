import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayouts";

// Import your pages
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ProfilePage from "./pages/Profile";
import BrandProfilePage from "./pages/BrandProfile";
import DashboardPage from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import InfluencerPage from "./pages/InfluencerPage";
import SponsorshipsPage from "./pages/SponsorshipsPage";
import CreateSponsorshipPage from "./pages/CreateSponsorship";
import AnalyticsPage from "./pages/AnalyticsPage";
import MessagesPage from "./pages/MessagesPage";
import NotFoundPage from "./pages/NotFound";
import SettingsPage from "./pages/Settings";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/brand-profile" element={<BrandProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/influencer/:handle" element={<InfluencerPage />} />
          <Route path="/sponsorships" element={<SponsorshipsPage />} />
          <Route path="/sponsorships/create" element={<CreateSponsorshipPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;