import React from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { AuthProvider, useAuth } from "./components/AuthContext";
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
import Videos from "./pages/Video";
import MainLayout from "./pages/Profile/MainLayout";
import ProfileOverview from "./pages/Profile/ProfileOverview";
import ProfileCourses from "./pages/Profile/ProfileCourses";
import ProfileFlashcards from "./pages/Profile/ProfileFlashcards";
import ProfileProgress from "./pages/Profile/ProfileProgress";
import ProfileSettings from "./pages/Profile/ProfileSettings";

import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminAccount from "./admin/pages/pagesOfAdminUser/AdminAccount";
import EditUser from "./admin/pages/pagesOfAdminUser/EditUser";
import AdminAds from "./admin/pages/pagesOfAds/AdminAds";
import EditAd from "./admin/pages/pagesOfAds/EditAd";
import AdminFlashcardList from "./admin/pages/pagesOfFlashcard/AdminFlashcardList";
import AdminVideo from "./admin/pages/pagesOfVideo/AdminVideo";
import EditVideo from "./admin/pages/pagesOfVideo/EditVideo";
import EditFlashcard from "./admin/pages/pagesOfFlashcard/EditFlashcard";
import ManageFlashcards from "./admin/pages/pagesOfFlashcard/ManagerFlashcards";
// import Purchase from "./pages/Purchase";
import Skills from "./pages/Skills";
import SpeakingTopics from "./pages/SpeakingTopics";
import SpeakingTest from "./pages/SpeakingTest";
import NotFound from "./pages/NotFound";
import LessonsPage from "./pages/LessonsPage"; // Import the LessonsPage component
import ExercisePage from "./pages/ExercisePage"; // Import the ExercisePage component

const ProtectedRoute: React.FC<{
  children: React.ReactElement;
  requiredRole?: string;
}> = ({ children, requiredRole }) => {
  const { isLoggedIn, role } = useAuth(); // Sửa isAuthenticated thành isLoggedIn

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

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
            <Route path="/course" element={<CourseList />} />
            <Route path="/videos" element={<Videos />} />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <Flashcards />
                </ProtectedRoute>
              }
            />
            <Route path="/collection" element={<CollectionFlashcards />} />
            <Route
              path="/create-flash-card/:id"
              element={<CreateFlashcards />}
            />
            <Route
              path="/update-profile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/course/:courseId/lessons" element={<LessonsPage />} />
            <Route path="/exercise/:exerciseId" element={<ExercisePage />} />
            <Route
              path="/skills"
              element={
                <ProtectedRoute>
                  <Skills />
                </ProtectedRoute>
              }
            />
            <Route
              path="/speaking-topics"
              element={
                <ProtectedRoute>
                  <SpeakingTopics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/speaking-test"
              element={
                <ProtectedRoute>
                  <SpeakingTest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase"
              element={
                <ProtectedRoute>
                  <CourseList />
                </ProtectedRoute>
              }
            />

            {/* Profile Routes with Layout */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfileOverview />} />
              <Route path="courses" element={<ProfileCourses />} />
              <Route path="flashcards" element={<ProfileFlashcards />} />
              <Route path="videos" element={<Videos />} />
              <Route path="progress" element={<ProfileProgress />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            {/* Backward compatibility route */}
            <Route
              path="/profileVideos"
              element={
                <ProtectedRoute>
                  <Navigate to="/profile/videos" replace />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Protected Routes for admin */}
          <Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="account"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminAccount />
                  </ProtectedRoute>
                }
              />
              <Route
                path="account/add"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="account/edit/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditUser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ads"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminAds />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ads/add"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditAd />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ads/edit/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditAd />
                  </ProtectedRoute>
                }
              />
              <Route
                path="flashcard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminFlashcardList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="flashcard/list/:listId"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <ManageFlashcards />
                  </ProtectedRoute>
                }
              />
              <Route
                path="flashcard/edit/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditFlashcard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="video"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminVideo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="video/add"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditVideo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="video/edit/:id"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <EditVideo />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>

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
