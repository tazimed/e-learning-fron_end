import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Swal from "sweetalert2";
import {
  PlayCircle,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Download,
  ExternalLink,
  ArrowLeft,
  Lock,
  BookOpen,
  Award,
} from "lucide-react";
import { courseService } from "../services/api";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completingLesson, setCompletingLesson] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourseById(id);
      console.log("Course data from API:", response.data);
      console.log("enrolled?", response.data.enrolled);
      setCourse(response.data);
      // Set first lesson as active by default if available
      if (
        response.data.chapitres?.length > 0 &&
        response.data.chapitres[0].lecons?.length > 0
      ) {
        setActiveLesson(response.data.chapitres[0].lecons[0]);
        setExpandedChapters({ [response.data.chapitres[0].id]: true });
      }
    } catch (err) {
      console.error("Error fetching course details:", err);
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
      const response = await courseService.enroll(id);

      await Swal.fire({
        icon: "success",
        title: "Inscription réussie 🎉",
        text: response.data.message || "Bienvenue dans le cours !",
        confirmButtonColor: "#7c3aed",
        background: "#ffffff",
        color: "#111827",
        timer: 2000,
        showConfirmButton: false,
      });

      await fetchCourseDetails();
    } catch (err) {
      console.error("Enrollment error:", err);

      // If we got 400 (already enrolled), still refresh course data!
      if (err.response?.status === 400) {
        await fetchCourseDetails();
      }

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: err.response?.data?.message || "Erreur lors de l'inscription.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteLesson = async (lecon) => {
    setCompletingLesson(lecon.id);
    try {
      await courseService.completeLesson(lecon.id);
      await Swal.fire({
        icon: "success",
        title: "Leçon complétée ! 🎉",
        confirmButtonColor: "#10b981",
      });
      await fetchCourseDetails();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de la complétion de la leçon",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setCompletingLesson(null);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await courseService.markAsCompleted(id);

      await Swal.fire({
        icon: "success",
        title: "Félicitations! 🎉",
        text: "Vous avez terminé ce cours ! Les prochains cours sont maintenant débloqués.",
        confirmButtonColor: "#10b981",
      });

      navigate("/skill-tree");
    } catch (err) {
      console.error("Completion error:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text:
          err.response?.data?.message ||
          "Erreur lors de la mise à jour du statut.",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setCompleting(false);
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
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
            {course.creator && (
              <span className="instructor-meta">
                Par {course.creator.name || course.creator.email}
              </span>
            )}
          </div>
          
          {course.enrolled && (
            <div style={{ marginTop: "16px", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "#4b5563" }}>
                  Progression du cours
                </span>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#7c3aed" }}>
                  {Math.round(course.progression)}%
                </span>
              </div>
              <div style={{ 
                width: "100%", 
                height: "10px", 
                backgroundColor: "#e5e7eb", 
                borderRadius: "999px",
                overflow: "hidden" 
              }}>
                <div style={{ 
                  height: "100%", 
                  backgroundColor: "#7c3aed",
                  borderRadius: "999px",
                  width: `${course.progression}%`,
                  transition: "width 0.3s ease"
                }} />
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
                  : `http://127.0.0.1:9000${course.image_url}`
              }
              alt={course.titre}
              className="course-header-img"
            />
          </div>
        )}
      </div>

      <div className="player-main">
        {/* Sidebar du Syllabus */}
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
                    <ChevronRight size={18} />
                  )}
                  <span>{chapitre.titre}</span>
                </button>

                {expandedChapters[chapitre.id] && (
                  <div className="lessons-list">
                    {chapitre.lecons.map((lecon) => {
                      const isLessonCompleted = course.lessonProgress?.some(lp => lp.lecon_id === lecon.id && lp.completed);
                      return (
                        <button
                          key={lecon.id}
                          className={`lesson-item ${activeLesson?.id === lecon.id ? "active" : ""}`}
                          onClick={() => setActiveLesson(lecon)}
                          style={{ 
                            opacity: isLessonCompleted ? 0.7 : 1,
                            position: "relative"
                          }}
                        >
                          {isLessonCompleted ? (
                            <CheckCircle2 size={16} color="#10b981" />
                          ) : (
                            <PlayCircle size={16} />
                          )}
                          <span>{lecon.title || lecon.titre}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Zone de Contenu */}
        <section className="lesson-content-area">
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
          ) : activeLesson ? (
            <div className="active-lesson">
              {activeLesson.video_url && (
                <div className="video-container">
                  <iframe
                    width="100%"
                    height="450"
                    src={activeLesson.video_url.replace("watch?v=", "embed/")}
                    title={activeLesson.titre}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              <div className="lesson-text-content">
                <h2>{activeLesson.titre}</h2>
                <div className="markdown-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activeLesson.contenu}
                  </ReactMarkdown>
                </div>

                {activeLesson.ressources?.length > 0 && (
                  <div className="resources-section">
                    <h3>Ressources et Travaux Pratiques</h3>
                    <div className="resources-grid">
                      {activeLesson.ressources.map((res) => {
                        const isNotebook = res.nom.endsWith(".ipynb");
                        return (
                          <div key={res.id} className="resource-card-item">
                            <div className="resource-info">
                              {isNotebook ? (
                                <BookOpen
                                  size={20}
                                  className="text-orange-500"
                                />
                              ) : (
                                <Download size={20} className="text-blue-500" />
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

                <div
                  style={{
                    marginTop: "40px",
                    paddingTop: "20px",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap"
                  }}
                >
                  {!course.lessonProgress?.some(lp => lp.lecon_id === activeLesson.id && lp.completed) && (
                    <button
                      onClick={() => handleCompleteLesson(activeLesson)}
                      disabled={completingLesson === activeLesson.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: "#7c3aed",
                        color: "white",
                        border: "none",
                        padding: "14px 32px",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <CheckCircle2 size={20} />
                      {completingLesson === activeLesson.id 
                        ? "Marquage en cours..." 
                        : "Marquer la leçon comme terminée"}
                    </button>
                  )}
                  
                  {course.completed ? (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "14px 32px",
                      borderRadius: "12px",
                      backgroundColor: "#10b98120",
                      color: "#10b981",
                      fontWeight: "600"
                    }}>
                      <Award size={20} />
                      Cours terminé !
                    </div>
                  ) : (
                    <button
                      onClick={handleComplete}
                      disabled={completing}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        padding: "14px 32px",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <Award size={20} />
                      {completing
                        ? "Marquage en cours..."
                        : "Marquer le cours comme terminé"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="no-lesson-selected">
              <p>Sélectionnez une leçon pour commencer à apprendre.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CourseDetailPage;
