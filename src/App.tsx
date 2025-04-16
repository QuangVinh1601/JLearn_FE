import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

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
import MainLayout from "./pages/Profile/MainLayout"; // Assuming this layout wraps profile sections
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAccount from "./admin/pages/pagesOfAdminUser/AdminAccount";
import EditUser from "./admin/pages/pagesOfAdminUser/EditUser";
import AdminFlashcard from "./admin/pages/pagesOfFlashcard/AdminFlashcard";
import AdminVideo from "./admin/pages/pagesOfVideo/AdminVideo";
import EditVideo from "./admin/pages/pagesOfVideo/EditVideo";
import EditFlashcard from "./admin/pages/pagesOfFlashcard/EditFlashcard";
import Purchase from "./pages/Purchase"; // Added from develop
import Skills from "./pages/Skills"; // Added from Trung
import SpeakingTopics from "./pages/SpeakingTopics"; // Added from Trung
import SpeakingTest from "./pages/SpeakingTest"; // Added from Trung
import LessonsPage from "./pages/LessonsPage"; // Import the LessonsPage component
import ExercisePage from "./pages/ExercisePage"; // Import the ExercisePage component

// Assuming AuthProvider exists and handles authentication context
import { AuthProvider } from "./components/AuthContext";

function App() {
  const location = useLocation();
  const navigate = useNavigate(); // Added from develop for the button

  // Determine if the current page is an authentication or admin page
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    // Added AuthProvider from Trung
    <AuthProvider>
      {!isAuthPage && !isAdminPage && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
      )}

      <main
        // Use responsive margin from develop, conditional logic from both
        className={`flex-grow ${!isAuthPage && !isAdminPage ? "mt-14 sm:mt-16" : ""}`}
      >
        <Routes>
          {/* Common Routes from both */}
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
          <Route path="/course/:courseId/lessons" element={<LessonsPage />} />
          <Route path="/exercise/:exerciseId" element={<ExercisePage />} />

          {/* Speaking Routes from Trung */}
          <Route path="/skills" element={<Skills />} />
          <Route path="/speaking-topics" element={<SpeakingTopics />} />
          <Route path="/speaking-test" element={<SpeakingTest />} />

          {/* Profile Routes using MainLayout (consistent in both) */}
          <Route element={<MainLayout />}>
            <Route path="/profileProfile" element={<Profile />} />
            <Route path="/profileCourses" element={<Courses />} />
            <Route path="/profileVideos" element={<Videos />} />
          </Route>

          {/* Purchase Route from develop */}
          <Route path="/purchase" element={<Purchase />} />

          {/* Admin Routes using AdminLayout and structure from develop */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* Redirect /admin to /admin/dashboard or handle index route */}
            {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
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

      {/* Floating Purchase Button from develop */}
      {!isAuthPage && !isAdminPage && (
        <button
          onClick={() => navigate("/purchase")}
          className="fixed bottom-16 sm:bottom-24 right-2 sm:right-4 z-50 bg-[#e82813] text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-red-700"
          aria-label="Go to purchase page" // Added aria-label for accessibility
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
      )}

      {/* Conditional Footer from both */}
      {!isAuthPage && !isAdminPage && <Footer />}
    </AuthProvider> // Close AuthProvider
  );
}

export default App;