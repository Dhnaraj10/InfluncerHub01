import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayouts";

// Import your pages
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ProfilePage from "./pages/Profile";
import BrandProfilePage from "./pages/BrandProfile";
import PublicBrandProfilePage from "./pages/PublicBrandProfile";
import DashboardPage from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import InfluencerPage from "./pages/InfluencerPage";
import SponsorshipsPage from "./pages/SponsorshipsPage";
import CreateSponsorshipPage from "./pages/CreateSponsorship";
import AnalyticsPage from "./pages/AnalyticsPage";
import MessagesPage from "./pages/MessagesPage";
import NotFoundPage from "./pages/NotFound";
import SettingsPage from "./pages/Settings";
import SponsorshipDetailPage from "./pages/SponsorshipDetailPage";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import BlogPage from "./pages/Blog";
import CareersPage from "./pages/Careers";
import PricingPage from "./pages/Pricing";
import PrivacyPage from "./pages/Privacy";
import TermsPage from "./pages/Terms";
import CookiesPage from "./pages/Cookies";
import ForBrandsPage from "./pages/ForBrands";
import ForInfluencersPage from "./pages/ForInfluencers";
import ContactBrandPage from "./pages/ContactBrandPage";

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
          <Route path="/brand/:brandId" element={<PublicBrandProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/influencer/:handle" element={<InfluencerPage />} />
          <Route path="/sponsorships" element={<SponsorshipsPage />} />
          <Route path="/sponsorships/create" element={<CreateSponsorshipPage />} />
          <Route path="/sponsorships/:id" element={<SponsorshipDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/contact-brand/:id" element={<ContactBrandPage />} />
          <Route path="/brands" element={<ForBrandsPage />} />
          <Route path="/influencers" element={<ForInfluencersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;