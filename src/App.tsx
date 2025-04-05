import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footerr";
import Home from "./pages/Home";
import Translater from "./pages/Translate";
import Flashcards from "./pages/Flashcards";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./pages/Profile/MainLayout";
import Profile from "./pages/Profile/Profile";
import Courses from "./pages/Profile/Courses";
import Videos from "./pages/Profile/Videos";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAccount from "./admin/pages/AdminAccount";
import { AuthProvider } from "./components/AuthContext";
// Component để kiểm tra và render layout
const AppLayout: React.FC = () => {
  const location = useLocation();

  // Kiểm tra nếu đang ở trang login hoặc register
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  // Kiểm tra nếu đang ở trang admin
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      <AuthProvider>
        {/* Header chỉ hiển thị khi không phải trang auth và không phải trang admin */}
        {!isAuthPage && !isAdminPage && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <Header />
          </div>
        )}

        {/* Nội dung trang */}
        <main
          className={`flex-grow ${!isAuthPage && !isAdminPage ? "mt-16" : ""}`}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/translate" element={<Translater />} />
            <Route path="/flashcards" element={<Flashcards />} />

            <Route element={<MainLayout />}>
              <Route path="/profileProfile" element={<Profile />} />
              <Route path="/profileCourses" element={<Courses />} />
              <Route path="/profileVideos" element={<Videos />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin-account" element={<AdminAccount />} />
            </Route>
          </Routes>
        </main>

        {/* Footer chỉ hiển thị khi không phải trang auth và không phải trang admin */}
        {!isAuthPage && !isAdminPage && <Footer />}
      </AuthProvider>
    </div>
  );
};

const App: React.FC = () => {
  return <AppLayout />;
};

export default App;
