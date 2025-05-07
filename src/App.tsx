import React from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom"; // Thêm Navigate
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { AuthProvider } from "./components/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute";

// Import Components
import Header from "./components/Header";
import Footer from "./components/Footerr";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Translater from "./pages/Translate";
import Flashcards from "./pages/Flashcards";
import CollectionFlashcards from "./pages/CollectionFlashcards";
import CreateFlashcards from "./pages/CreateFlashcards";
import UpdateProfile from "./pages/UpdateProfile";
import CourseList from "./pages/CourseList";
import Profile from "./pages/Profile/Profile";
import Courses from "./pages/Profile/Courses";
import Videos from "./pages/Profile/Videos";
import MainLayout from "./pages/Profile/MainLayout";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAccount from "./admin/pages/pagesOfAdminUser/AdminAccount";
import EditUser from "./admin/pages/pagesOfAdminUser/EditUser";
import AdminFlashcard from "./admin/pages/pagesOfFlashcard/AdminFlashcard";
import AdminVideo from "./admin/pages/pagesOfVideo/AdminVideo";
import EditVideo from "./admin/pages/pagesOfVideo/EditVideo";
import EditFlashcard from "./admin/pages/pagesOfFlashcard/EditFlashcard";
import Purchase from "./pages/Purchase";
import Skills from "./pages/Skills";
import SpeakingTopics from "./pages/SpeakingTopics";
import SpeakingTest from "./pages/SpeakingTest";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      {!isAuthPage && !isAdminPage && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
      )}

      <main
        className={`flex-grow ${!isAuthPage && !isAdminPage ? "mt-14 sm:mt-16" : ""}`}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/translate" element={<Translater />} />
          {/* Protected Routes for authenticated users */}
          <Route>
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/collection" element={<CollectionFlashcards />} />
            <Route path="/create-flash-card" element={<CreateFlashcards />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/course" element={<CourseList />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/speaking-topics" element={<SpeakingTopics />} />
            <Route path="/speaking-test" element={<SpeakingTest />} />
            <Route path="/purchase" element={<Purchase />} />

            {/* Profile Routes */}
            <Route element={<MainLayout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/profileCourses" element={<Courses />} />
              <Route path="/profileVideos" element={<Videos />} />
            </Route>
          </Route>
          {/* Protected Routes for admin */}
          <Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />{" "}
              {/* Thêm index route */}
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="account" element={<AdminAccount />} />
              <Route path="account/add" element={<EditUser />} />
              <Route path="account/edit/:id" element={<EditUser />} />
              <Route path="flashcard" element={<AdminFlashcard />} />
              <Route path="flashcard/add" element={<EditFlashcard />} />
              <Route path="flashcard/edit/:id" element={<EditFlashcard />} />
              <Route path="video" element={<AdminVideo />} />
              <Route path="video/add" element={<EditVideo />} />
              <Route path="video/edit/:id" element={<EditVideo />} />
            </Route>
          </Route>
          {/* 404 Route */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />{" "}
          {/* Thêm catch-all route */}
        </Routes>
      </main >

      {!isAuthPage && !isAdminPage && (
        <button
          onClick={() => navigate("/course")}
          className="fixed bottom-16 sm:bottom-24 right-2 sm:right-4 z-50 bg-[#e82813] text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-red-700"
          aria-label="Go to purchase page"
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      )}

      {!isAuthPage && !isAdminPage && <Footer />}
    </AuthProvider>
  );
}

export default App;
