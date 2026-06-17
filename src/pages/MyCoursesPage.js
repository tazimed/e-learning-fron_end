import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../services/api";
import {
  Edit,
  Eye,
  EyeOff,
  Users,
  BookOpen,
  Calendar,
  MoreVertical,
  Plus,
} from "lucide-react";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.getMyCourses();
      setCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch my courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      await courseService.toggleVisibility(id);
      // Update local state
      setCourses(
        courses.map((c) =>
          c.id === id ? { ...c, is_active: !c.is_active } : c,
        ),
      );
    } catch (error) {
      console.error("Toggle visibility failed:", error);
    }
  };

  if (loading) return <div className="loader">Chargement de vos cours...</div>;

  return (
    <div className="my-courses-container">
      <header className="page-header flex-between">
        <div>
          <h1>Mes Cours</h1>
          <p>Gérez vos contenus et suivez l'engagement de vos étudiants.</p>
        </div>
        <Link to="/teacher/create-course" className="btn-primary">
          <Plus size={20} /> Nouveau cours
        </Link>
      </header>

      <div className="courses-dashboard-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="teacher-course-card glass-card">
              <div className="course-card-top">
                <div className="course-image-mini">
                  {course.image_url ? (
                    <img
                      src={
                        course.image_url.startsWith("http")
                          ? course.image_url
                          : `http://127.0.0.1:8000${course.image_url}`
                      }
                      alt={course.titre}
                    />
                  ) : (
                    <div className="placeholder-mini"></div>
                  )}
                </div>
                <div className="course-info-mini">
                  <h3>{course.titre}</h3>
                  <span className="badge-meta">{course.niveau}</span>
                </div>
                <div className="course-status-badge">
                  {course.is_active ? (
                    <span className="status-online">
                      <Eye size={14} /> Public
                    </span>
                  ) : (
                    <span className="status-offline">
                      <EyeOff size={14} /> Masqué
                    </span>
                  )}
                </div>
              </div>

              <div className="course-stats-row">
                <div className="stat">
                  <Users size={16} />
                  <span>
                    <strong>{course.students_count}</strong> étudiants
                  </span>
                </div>
                <div className="stat">
                  <BookOpen size={16} />
                  <span>
                    <strong>{course.chapters_count}</strong> chapitres
                  </span>
                </div>
                <div className="stat">
                  <Calendar size={16} />
                  <span>
                    Créé le {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="course-actions-footer">
                <Link
                  to={`/teacher/edit-course/${course.id}`}
                  className="btn-action"
                >
                  <Edit size={18} /> Modifier
                </Link>
                <button
                  className={`btn-action ${course.is_active ? "text-orange" : "text-success"}`}
                  onClick={() => handleToggleVisibility(course.id)}
                >
                  {course.is_active ? (
                    <>
                      <EyeOff size={18} /> Masquer
                    </>
                  ) : (
                    <>
                      <Eye size={18} /> Afficher
                    </>
                  )}
                </button>
                <Link to={`/courses/${course.id}`} className="btn-action">
                  <Eye size={18} /> Voir
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Vous n'avez pas encore créé de cours.</p>
            <Link to="/teacher/create-course" className="btn-primary mt-4">
              Créer mon premier cours
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
