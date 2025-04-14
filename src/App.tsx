import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Header from "./components/Header";
import Footer from "./components/Footerr";
import Home from "./pages/Home";
import CollectionFlashcards from "./pages/CollectionFlashcards";
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
import AdminAccount from "./admin/pages/pagesOfAdminUser/AdminAccount";
import EditUser from "./admin/pages/pagesOfAdminUser/EditUser";
import AdminFlashcard from "./admin/pages/pagesOfFlashcard/AdminFlashcard";
import AdminVideo from "./admin/pages/pagesOfVideo/AdminVideo";
import EditVideo from "./admin/pages/pagesOfVideo/EditVideo";
import EditFlashcard from "./admin/pages/pagesOfFlashcard/EditFlashcard";
import { AuthProvider } from "./components/AuthContext";
import CreateFlashcards from "./pages/CreateFlashcards";
import UpdateProfile from "./pages/UpdateProfile";
import CourseList from "./pages/CourseList";
import Purchase from "./pages/Purchase";

const InnerAppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && !isAdminPage && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
      )}

      <main
        className={`flex-grow ${!isAuthPage && !isAdminPage ? "mt-14 sm:mt-16" : ""}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/translate" element={<Translater />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/collection" element={<CollectionFlashcards />} />
          <Route path="/create-flash-card" element={<CreateFlashcards />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/course" element={<CourseList />} />
          <Route element={<MainLayout />}>
            <Route path="/profileProfile" element={<Profile />} />
            <Route path="/profileCourses" element={<Courses />} />
            <Route path="/profileVideos" element={<Videos />} />
          </Route>

          <Route path="/purchase" element={<Purchase />} />

          <Route path="/admin" element={<AdminLayout />}>
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
        </Routes>
      </main>

      {!isAuthPage && !isAdminPage && (
        <button
          onClick={() => navigate("/purchase")}
          className="fixed bottom-16 sm:bottom-24 right-2 sm:right-4 z-50 bg-[#e82813] text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-red-700"
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      )}

      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <InnerAppLayout />
    </AuthProvider>
  );
};

export default App;
