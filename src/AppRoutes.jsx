import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Posts from './pages/Posts';
import PostDynamic from './pages/PostDynamic';
import Archives from "./pages/Archives";
import Projects from "./pages/Projects";
import Links from "./pages/Links";
import Admin from "./pages/Admin";
import Sitemap from "./pages/Sitemap";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/post-list" element={<Posts />} />
      <Route path="/archives" element={<Archives />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/links" element={<Links />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/404" element={<NotFound />} />

      {/* Dynamic Routes */}
      <Route path="/:lang" element={<Home />} />
      <Route path="/posts/:slug" element={<PostDynamic />} />
      <Route path="/posts/:lang/:slug" element={<PostDynamic />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
