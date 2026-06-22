import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../services/api";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedLevel) params.append("level", selectedLevel);
      
      const response = await courseService.getAllCourses(params);
      setCourses(response.data);
      setError(null);
    } catch (err) {
      console.error("CoursesPage: Error fetching courses:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors de la récupération des cours.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchTerm, selectedLevel]);

  return (
    <div>
      <header className="page-header">
        <h1>Exploration des Cours</h1>
        <p>
          Découvrez de nouvelles compétences et progressez dans votre voyage ML.
        </p>
      </header>

      {/* Search and Filter Section */}
      <div style={{ 
        marginBottom: "32px", 
        display: "flex", 
        gap: "16px", 
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <input
          type="text"
          placeholder="Rechercher un cours..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: "250px",
            padding: "12px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "16px"
          }}
        />
        
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          style={{
            padding: "12px 16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            fontSize: "16px",
            minWidth: "180px"
          }}
        >
          <option value="">Tous les niveaux</option>
          <option value="Débutant">Débutant</option>
          <option value="Intermédiaire">Intermédiaire</option>
          <option value="Avancé">Avancé</option>
        </select>
      </div>

      {loading && <div className="loader">Chargement des cours...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="course-grid">
        {courses.length === 0 && !loading && (
          <div style={{ 
            width: "100%", 
            textAlign: "center", 
            padding: "40px 0" 
          }}>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>
              Aucun cours trouvé avec ces critères.
            </p>
          </div>
        )}

        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image-container">
              {course.image_url ? (
                <img
                  src={course.image_url.startsWith('http') 
                    ? course.image_url 
                    : `http://localhost:8000${course.image_url}`}
                  alt={course.title}
                  className="course-thumb"
                />
              ) : (
                <div
                  className={`course-thumb-placeholder bg-gradient-to-br ${course.color || "from-violet-500 to-purple-500"}`}
                ></div>
              )}
              <div className="course-badge">{course.level}</div>
            </div>

            <div className="course-card-content">
              <h2>{course.title}</h2>
              <p className="instructor">Par {course.instructor}</p>
              <p className="description line-clamp-2">{course.description}</p>

              {course.enrolled && (
                <div className="course-progress-mini">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span>{course.progress}% complété</span>
                </div>
              )}

              <div className="course-footer">
                <span>{course.lessons} Leçons</span>
                <Link to={`/courses/${course.id}`} className="enroll-btn">
                  {course.enrolled ? "Continuer" : "Voir les détails"}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
