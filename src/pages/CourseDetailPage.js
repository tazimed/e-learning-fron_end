import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PlayCircle,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  ArrowLeft,
  Lock,
  BookOpen,
} from "lucide-react";
import { courseService } from "../services/api";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [completingLesson, setCompletingLesson] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourseById(id);
      setCourse(response.data);
      const expanded = {};
      response.data.chapitres.forEach((chap) => {
        expanded[chap.id] = true;
      });
      setExpandedChapters(expanded);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await courseService.enroll(id);
      await fetchCourseDetails();
    } catch (error) {
      console.error("Enrollment error:", error);
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteLesson = async (lessonId) => {
    setCompletingLesson(lessonId);
    try {
      setExpandedLessons((prev) => ({ ...prev, [lessonId]: true }));
    } catch (error) {
      console.error(error);
    } finally {
      setCompletingLesson(null);
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const toggleLesson = (lessonId) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  if (loading) return <div className="loader">Chargement du cours...</div>;
  if (!course) return <div className="error-message">Cours non trouvé.</div>;

  return (
    <div className="course-player-container">
      <div className="player-header">
        <div className="header-left">
          <Link to="/courses" className="back-link">
            <ArrowLeft size={20} />
            <span>Retour aux cours</span>
          </Link>
          <h1>{course.titre}</h1>
          <div className="header-meta">
            <span className="badge-meta">{course.niveau}</span>
          </div>

          {course.enrolled && (
            <div style={{ marginTop: "16px", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#4b5563",
                  }}
                >
                  Progression du cours
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: "#7c3aed",
                  }}
                >
                  {Math.round(course.progression)}%
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#7c3aed",
                    borderRadius: "999px",
                    width: `${course.progression}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {course.image_url && (
          <div className="header-right">
            <img
              src={
                course.image_url.startsWith("http")
                  ? course.image_url
                  : `http://localhost:8000${course.image_url}`
              }
              alt={course.titre}
              className="course-header-img"
            />
          </div>
        )}
      </div>

      <div className="player-main">
        <aside className="player-sidebar">
          <div className="sidebar-title">Contenu du cours</div>
          <div className="chapters-list">
            {course.chapitres.map((chapitre) => (
              <div key={chapitre.id} className="chapter-item">
                <button
                  className="chapter-header"
                  onClick={() => toggleChapter(chapitre.id)}
                >
                  {expandedChapters[chapitre.id] ? (
                    <ChevronDown size={18} />
                  ) : (
                    <PlayCircle size={18} />
                  )}
                  <span>{chapitre.titre}</span>
                </button>

                {expandedChapters[chapitre.id] && (
                  <div className="lessons-list">
                    {chapitre.lecons.map((lecon) => {
                      const isCompleted = expandedLessons[lecon.id];
                      return (
                        <button
                          key={lecon.id}
                          className={`lesson-item-sidebar ${
                            isCompleted ? "completed" : ""
                          }`}
                          onClick={() => toggleLesson(lecon.id)}
                          style={{ opacity: isCompleted ? 0.7 : 1 }}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} color="#10b981" />
                          ) : (
                            <PlayCircle size={16} />
                          )}
                          <span>{lecon.titre}</span>
                        </button>
                      );
                    })}
                    {course.enrolled && (
                      <Link
                        to={`/quiz/chapter/${chapitre.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px 16px",
                          marginLeft: "32px",
                          color: "#7c3aed",
                          fontWeight: "500",
                          textDecoration: "none",
                          borderRadius: "8px",
                          background: "#ede9fe",
                          marginTop: "8px",
                        }}
                      >
                        📝 Ouvrir le QCM du chapitre
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <section className="lesson-content-area scrollable-chapters">
          {!course.enrolled ? (
            <div className="enroll-preview">
              <div className="preview-overlay">
                <Lock size={48} />
                <h2>Ce contenu est réservé aux étudiants inscrits</h2>
                <p>
                  Inscrivez-vous dès maintenant pour accéder aux leçons, vidéos
                  et ressources.
                </p>
                <button
                  className="enroll-btn-large"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? "Inscription..." : "S'inscrire au cours"}
                </button>
              </div>
            </div>
          ) : (
            <div className="chapters-scroll-container">
              {course.chapitres.map((chapitre) => (
                <div key={chapitre.id} className="chapter-content-block">
                  <div className="chapter-header-display">
                    <h2 className="chapter-title">{chapitre.titre}</h2>
                  </div>

                  {chapitre.lecons.map((lecon) => {
                    const isCompleted = expandedLessons[lecon.id];
                    return (
                      <div key={lecon.id} className="lesson-content-block">
                        <div className="lesson-header-display">
                          <div className="lesson-title-wrap">
                            {isCompleted && (
                              <CheckCircle2
                                size={20}
                                color="#10b981"
                                style={{ marginRight: "12px" }}
                              />
                            )}
                            <h3 className="lesson-title-display">
                              {lecon.titre}
                            </h3>
                          </div>
                          <button
                            onClick={() => toggleLesson(lecon.id)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px 16px",
                              backgroundColor: "#f3f4f6",
                              border: "none",
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                          >
                            {expandedLessons[lecon.id] ? (
                              <ChevronDown size={16} />
                            ) : (
                              <BookOpen size={16} />
                            )}
                            {expandedLessons[lecon.id]
                              ? "Fermer la leçon"
                              : "Ouvrir la leçon"}
                          </button>
                        </div>

                        {expandedLessons[lecon.id] && (
                          <>
                            {lecon.video_url && (
                              <div className="video-container">
                                <iframe
                                  width="100%"
                                  height="450"
                                  src={lecon.video_url.replace(
                                    "watch?v=",
                                    "embed/",
                                  )}
                                  title={lecon.titre}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            )}

                            {lecon.image_url && (
                              <div className="lesson-image-container">
                                <img
                                  src={
                                    lecon.image_url.startsWith("http")
                                      ? lecon.image_url
                                      : `http://localhost:8000${lecon.image_url}`
                                  }
                                  alt={`Illustration pour ${lecon.titre}`}
                                  className="lesson-image"
                                />
                              </div>
                            )}

                            <div className="markdown-body">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {lecon.contenu}
                              </ReactMarkdown>
                            </div>

                            {lecon.ressources?.length > 0 && (
                              <div className="resources-section">
                                <h3>Ressources et Travaux Pratiques</h3>
                                <div className="resources-grid">
                                  {lecon.ressources.map((res) => {
                                    const isNotebook =
                                      res.nom.endsWith(".ipynb");
                                    return (
                                      <div
                                        key={res.id}
                                        className="resource-card-item"
                                      >
                                        <div className="resource-info">
                                          {isNotebook ? (
                                            <BookOpen
                                              size={20}
                                              className="text-orange-500"
                                            />
                                          ) : (
                                            <Download
                                              size={20}
                                              className="text-blue-500"
                                            />
                                          )}
                                          <span>{res.nom}</span>
                                        </div>
                                        <div className="resource-actions">
                                          {isNotebook ? (
                                            <a
                                              href={res.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="action-btn colab-btn"
                                            >
                                              <ExternalLink size={14} />
                                              Google Colab
                                            </a>
                                          ) : (
                                            <a
                                              href={res.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="action-btn download-btn"
                                            >
                                              <Download size={14} />
                                              Télécharger
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {!isCompleted && (
                              <div
                                style={{
                                  marginTop: "24px",
                                  paddingTop: "20px",
                                  borderTop: "1px solid #e5e7eb",
                                  display: "flex",
                                  gap: "16px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  onClick={() => handleCompleteLesson(lecon.id)}
                                  disabled={completingLesson === lecon.id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    backgroundColor: "#10b981",
                                    color: "white",
                                    border: "none",
                                    padding: "12px 28px",
                                    borderRadius: "10px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                  }}
                                >
                                  <CheckCircle2 size={18} />
                                  {completingLesson === lecon.id
                                    ? "Marquage..."
                                    : "Marquer la leçon comme terminée"}
                                </button>
                              </div>
                            )}

                            <div className="lesson-spacer" />
                          </>
                        )}
                      </div>
                    );
                  })}

                  <div
                    style={{
                      marginTop: "24px",
                      textAlign: "center",
                      padding: "24px",
                      background: "#faf5ff",
                      borderRadius: "12px",
                      border: "2px solid #ddd6fe",
                    }}
                  >
                    <h3 style={{ marginBottom: "12px", color: "#7c3aed" }}>
                      Chapitre terminé ?
                    </h3>
                    <Link
                      to={`/quiz/chapter/${chapitre.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "#7c3aed",
                        color: "white",
                        padding: "12px 32px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      📝 Passer le QCM du chapitre
                    </Link>
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: "40px",
                  marginBottom: "80px",
                  textAlign: "center",
                  padding: "40px",
                  background: "#f0fdf4",
                  borderRadius: "16px",
                  border: "3px solid #10b981",
                }}
              >
                <h2
                  style={{
                    fontSize: "28px",
                    marginBottom: "12px",
                    color: "#10b981",
                  }}
                >
                  🎓 Cours complet ?
                </h2>
                <p
                  style={{
                    fontSize: "18px",
                    marginBottom: "24px",
                    color: "#4b5563",
                  }}
                >
                  Testez vos connaissances avec l'examen final de 25 questions !
                </p>
                <Link
                  to={`/quiz/course/${id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "16px 48px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "18px",
                    boxShadow: "0 4px 6px rgba(16, 185, 129, 0.3)",
                  }}
                >
                  🎯 Générer et passer l'examen final
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CourseDetailPage;
