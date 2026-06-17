import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../services/api";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await courseService.getAllCourses();
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

    fetchCourses();
  }, []);

  return (
    <div>
      <header className="page-header">
        <h1>Exploration des Cours</h1>
        <p>
          Découvrez de nouvelles compétences et progressez dans votre voyage ML.
        </p>
      </header>

      {loading && <div className="loader">Chargement des cours...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="course-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <div className="course-image-container">
              {course.image_url ? (
                <img
                src={`http://127.0.0.1:9000${course.image_url}`}
                alt={course.titre}
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
