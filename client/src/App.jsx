import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadLecture from "./pages/UploadLecture";
import SlideToNotes from "./pages/SlideToNotes";
import QAGenerator from "./pages/QAGenerator";
import CommunityNotes from "./pages/CommunityNotes";
import MyNotes from "./pages/MyNotes";
import Settings from "./pages/Settings";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadLecture />} />
              <Route path="/slides" element={<SlideToNotes />} />
              <Route path="/qa" element={<QAGenerator />} />
              <Route path="/community" element={<CommunityNotes />} />
              <Route path="/my-notes" element={<MyNotes />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
