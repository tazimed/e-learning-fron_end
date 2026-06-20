import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import SkillTreePage from "./pages/SkillTreePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import MyCoursesPage from "./pages/MyCoursesPage";
import QuizPage from "./pages/QuizPage";
import CertificatePage from "./pages/CertificatePage";
import ProfilePage from "./pages/ProfilePage";
import ConcentrationDashboard from "./pages/ConcentrationDashboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes inside DashboardLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="skill-tree" element={<SkillTreePage />} />

            {/* Quiz Routes */}
            <Route path="quiz/chapter/:chapterId" element={<QuizPage />} />
            <Route path="quiz/course/:courseId" element={<QuizPage />} />

            {/* Certificate Route */}
            <Route path="certificate/:courseId" element={<CertificatePage />} />

            {/* Profile Route */}
            <Route path="profile" element={<ProfilePage />} />

            {/* Teacher Routes */}
            <Route
              path="teacher/create-course"
              element={<CreateCoursePage />}
            />
            <Route
              path="teacher/edit-course/:id"
              element={<CreateCoursePage />}
            />
            <Route path="teacher/my-courses" element={<MyCoursesPage />} />
            <Route
              path="teacher/concentration"
              element={<ConcentrationDashboard />}
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
