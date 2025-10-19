import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage"; // your Homepage.jsx
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <Router>
      <Routes>
        {/* Main landing page */}
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard_bloo_admin_ou_fa" element={<AdminDashboard />} />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
