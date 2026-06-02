import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import { courseService } from "../services/api";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});

  const fetchCourseDetails = async () => {
    setLoading(true);
    try {
      const response = await courseService.getCourseById(id);
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

    window.location.reload();

  } catch (err) {

    console.error("Enrollment error:", err);

    Swal.fire({
      icon: "error",
      title: "Erreur",
      text:
        err.response?.data?.message ||
        "Erreur lors de l'inscription.",
      confirmButtonColor: "#ef4444",
    });

  } finally {
    setEnrolling(false);
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
            <span className="instructor-meta">Par {course.instructor}</span>
          </div>
        </div>
        {course.image_url && (
          <div className="header-right">
            <img
              src={`http://127.0.0.1:9000${course.image_url}`}
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
                    {chapitre.lecons.map((lecon) => (
                      <button
                        key={lecon.id}
                        className={`lesson-item ${activeLesson?.id === lecon.id ? "active" : ""}`}
                        onClick={() => setActiveLesson(lecon)}
                      >
                        <PlayCircle size={16} />
                        <span>{lecon.title || lecon.titre}</span>
                      </button>
                    ))}
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
