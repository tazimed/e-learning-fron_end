import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api, { courseService } from "../services/api";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  Video,
  Save,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  ExternalLink,
  Check,
} from "lucide-react";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [courseData, setCourseData] = useState({
    titre: "",
    description: "",
    niveau: "Débutant",
    image_url: "",
    hasPrerequisites: false,
    prerequisites: [],
    chapitres: [
      {
        id: "temp-" + Date.now(),
        titre: "",
        ordre: 1,
        lecons: [
          {
            id: "temp-" + (Date.now() + 1),
            titre: "",
            contenu: "",
            video_url: "",
            ressources: [],
          },
        ],
      },
    ],
  });

  useEffect(() => {
    fetchAvailableCourses();
    if (isEditMode) fetchCourseForEdit();
  }, [id]);

  const fetchAvailableCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setAvailableCourses(response.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourseForEdit = async () => {
    try {
      const response = await courseService.getCourseById(id);
      const data = response.data;
      setCourseData((prev) => ({
        ...prev,
        titre: data.titre,
        description: data.description,
        niveau: data.niveau,
        image_url: data.image_url,
        chapitres: data.chapitres.map((c) => ({
          id: c.id,
          titre: c.titre,
          ordre: c.ordre,
          lecons: c.lecons.map((l) => ({
            id: l.id,
            titre: l.titre,
            contenu: l.contenu,
            video_url: l.video_url,
            ressources: l.ressources || [],
          })),
        })),
      }));
    } catch {
      alert("Impossible de charger les données du cours.");
      navigate("/teacher/my-courses");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    try {
      const response = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      callback(response.data.url, response.data.name);
    } catch {
      alert("Erreur lors de l'upload.");
    }
  };

  const togglePrerequisite = (courseId) => {
    setCourseData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.includes(courseId)
        ? prev.prerequisites.filter((id) => id !== courseId)
        : [...prev.prerequisites, courseId],
    }));
  };

  const addChapter = () => {
    setCourseData((prev) => ({
      ...prev,
      chapitres: [
        ...prev.chapitres,
        {
          id: "temp-" + Date.now(),
          titre: "",
          ordre: prev.chapitres.length + 1,
          lecons: [
            {
              id: "temp-" + (Date.now() + 1),
              titre: "",
              contenu: "",
              video_url: "",
              ressources: [],
            },
          ],
        },
      ],
    }));
  };

  const removeChapter = (chapterId) =>
    setCourseData((prev) => ({
      ...prev,
      chapitres: prev.chapitres.filter((c) => c.id !== chapterId),
    }));
  const addLesson = (chapterId) =>
    setCourseData((prev) => ({
      ...prev,
      chapitres: prev.chapitres.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              lecons: [
                ...c.lecons,
                {
                  id: "temp-" + Date.now(),
                  titre: "",
                  contenu: "",
                  video_url: "",
                  ressources: [],
                },
              ],
            }
          : c,
      ),
    }));
  const removeLesson = (chapterId, lessonId) =>
    setCourseData((prev) => ({
      ...prev,
      chapitres: prev.chapitres.map((c) =>
        c.id === chapterId
          ? { ...c, lecons: c.lecons.filter((l) => l.id !== lessonId) }
          : c,
      ),
    }));

  const addResource = (chapterId, lessonId, url, nom, type = null) => {
    const finalType = type || (url.endsWith(".pdf") ? "pdf" : "image");
    setCourseData((prev) => ({
      ...prev,
      chapitres: prev.chapitres.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              lecons: c.lecons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      ressources: [
                        ...l.ressources,
                        { nom, type: finalType, url },
                      ],
                    }
                  : l,
              ),
            }
          : c,
      ),
    }));
  };

  const removeResource = (chapterId, lessonId, resIndex) =>
    setCourseData((prev) => ({
      ...prev,
      chapitres: prev.chapitres.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              lecons: c.lecons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      ressources: l.ressources.filter((_, i) => i !== resIndex),
                    }
                  : l,
              ),
            }
          : c,
      ),
    }));

  const addExternalLink = (chapterId, lessonId) => {
    const url = prompt("Entrez l'URL du lien :");
    if (!url) return;
    const nom = prompt("Nom du lien :", "Lien externe");
    if (!nom) return;
    addResource(chapterId, lessonId, url, nom, "link");
  };

  const handleSubmit = async () => {
    // VALIDATION FIRST
    if (!courseData.titre.trim()) {
      alert("Veuillez saisir un titre pour le cours !");
      setStep(1);
      setIsSubmitting(false);
      return;
    }

    if (!courseData.description.trim()) {
      alert("Veuillez saisir une description pour le cours !");
      setStep(1);
      setIsSubmitting(false);
      return;
    }

    // Check chapters and lessons
    for (let i = 0; i < courseData.chapitres.length; i++) {
      const chap = courseData.chapitres[i];
      if (!chap.titre.trim()) {
        alert(`Veuillez saisir un titre pour le chapitre ${i + 1} !`);
        setStep(2);
        setIsSubmitting(false);
        return;
      }

      for (let j = 0; j < chap.lecons.length; j++) {
        const lecon = chap.lecons[j];
        if (!lecon.titre.trim()) {
          alert(
            `Veuillez saisir un titre pour la leçon ${j + 1} du chapitre ${i + 1} !`,
          );
          setStep(2);
          setIsSubmitting(false);
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...courseData,
        prerequisites: courseData.hasPrerequisites
          ? courseData.prerequisites
          : [],
      };

      console.log("Sending payload to create course:", payload);

      if (isEditMode) {
        await courseService.updateCourse(id, payload);
      } else {
        await courseService.createCourse(payload);
      }
      setSuccessMessage(
        `Cours ${isEditMode ? "mis à jour" : "créé"} avec succès !`,
      );

      // Redirection automatique
      setTimeout(() => {
        navigate("/teacher/my-courses");
      }, 2000);
    } catch (e) {
      console.error("Create course error:", e);
      console.error("Error response:", e.response);

      setSuccessMessage("");

      const errorMsg =
        e.response?.data?.error ||
        e.response?.data?.message ||
        "Erreur lors de l'enregistrement du cours.";
      alert(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loader">Chargement...</div>;

  return (
    <>
      {successMessage && (
        <div className="custom-success-popup">
          <div className="success-popup-content">
            <div className="success-icon">✓</div>

            <h2>Succès</h2>

            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <div className="create-course-container">
        <header className="page-header">
          <h1>{isEditMode ? "Modifier le cours" : "Créer un nouveau cours"}</h1>

          <p>
            {isEditMode
              ? "Mettez à jour vos contenus pédagogiques."
              : "Partagez votre expertise avec la communauté ML Mastery."}
          </p>
        </header>

        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            1. Informations générales
          </div>

          <div className={`step ${step >= 2 ? "active" : ""}`}>
            2. Programme du cours
          </div>

          <div className={`step ${step >= 3 ? "active" : ""}`}>
            3. Prérequis
          </div>

          <div className={`step ${step >= 4 ? "active" : ""}`}>
            4. Finalisation
          </div>
        </div>

        <div className="form-card glass-card">
          {/* STEP 1 */}

          {step === 1 && (
            <div className="form-step animate-in">
              <div className="form-group">
                <label>Titre du cours</label>

                <input
                  type="text"
                  placeholder="ex: Python Fundamentals"
                  value={courseData.titre}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      titre: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  rows="4"
                  placeholder="Décrivez votre cours"
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Niveau</label>

                  <select
                    value={courseData.niveau}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        niveau: e.target.value,
                      })
                    }
                  >
                    <option>Débutant</option>
                    <option>Intermédiaire</option>
                    <option>Avancé</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Image de couverture</label>

                  <div className="file-upload-wrapper">
                    {courseData.image_url ? (
                      <div className="preview-image">
                        <img src={courseData.image_url} alt="preview" />

                        <button
                          className="remove-file"
                          onClick={() =>
                            setCourseData({
                              ...courseData,
                              image_url: "",
                            })
                          }
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="upload-placeholder">
                        <Upload size={24} />

                        <span>Uploader une image</span>

                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            handleFileUpload(e, "course_image", (url) =>
                              setCourseData({
                                ...courseData,
                                image_url: url,
                              }),
                            )
                          }
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn-primary" onClick={() => setStep(2)}>
                  Continuer <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}

          {step === 2 && (
            <div className="form-step animate-in">
              {courseData.chapitres.map((chap, chapIndex) => (
                <div key={chap.id} className="chapter-form-item">
                  <div className="chapter-form-header">
                    <input
                      type="text"
                      placeholder={`Chapitre ${chapIndex + 1}`}
                      value={chap.titre}
                      onChange={(e) => {
                        const newChaps = [...courseData.chapitres];

                        newChaps[chapIndex].titre = e.target.value;

                        setCourseData({
                          ...courseData,
                          chapitres: newChaps,
                        });
                      }}
                    />

                    <button
                      className="btn-icon-danger"
                      onClick={() => removeChapter(chap.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="lessons-editor">
                    {chap.lecons.map((lec, lecIndex) => (
                      <div key={lec.id} className="lesson-form-item">
                        <div className="lesson-form-header">
                          <input
                            type="text"
                            placeholder={`Leçon ${lecIndex + 1}`}
                            value={lec.titre}
                            onChange={(e) => {
                              const newChaps = [...courseData.chapitres];

                              newChaps[chapIndex].lecons[lecIndex].titre =
                                e.target.value;

                              setCourseData({
                                ...courseData,
                                chapitres: newChaps,
                              });
                            }}
                          />

                          <button
                            className="btn-icon-danger"
                            onClick={() => removeLesson(chap.id, lec.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <textarea
                          rows="3"
                          placeholder="Contenu pédagogique"
                          value={lec.contenu}
                          onChange={(e) => {
                            const newChaps = [...courseData.chapitres];

                            newChaps[chapIndex].lecons[lecIndex].contenu =
                              e.target.value;

                            setCourseData({
                              ...courseData,
                              chapitres: newChaps,
                            });
                          }}
                        />

                        <div className="asset-input">
                          <Video size={16} />

                          <input
                            type="text"
                            placeholder="URL Vidéo YouTube"
                            value={lec.video_url}
                            onChange={(e) => {
                              const newChaps = [...courseData.chapitres];

                              newChaps[chapIndex].lecons[lecIndex].video_url =
                                e.target.value;

                              setCourseData({
                                ...courseData,
                                chapitres: newChaps,
                              });
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      className="btn-add-lesson"
                      onClick={() => addLesson(chap.id)}
                    >
                      <Plus size={16} /> Ajouter une leçon
                    </button>
                  </div>
                </div>
              ))}

              <button className="btn-add-chapter" onClick={addChapter}>
                <Plus size={18} /> Ajouter un chapitre
              </button>

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(1)}>
                  <ChevronLeft size={18} /> Précédent
                </button>

                <button className="btn-primary" onClick={() => setStep(3)}>
                  Continuer <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}

          {step === 3 && (
            <div className="form-step animate-in">
              <div className="form-group">
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={courseData.hasPrerequisites}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        hasPrerequisites: e.target.checked,
                        prerequisites: [],
                      })
                    }
                  />
                  Ce cours nécessite des prérequis
                </label>
              </div>

              {!courseData.hasPrerequisites ? (
                <div className="empty-state" style={{ padding: "40px" }}>
                  <Check size={40} className="text-success" />

                  <h3>Aucun prérequis requis</h3>

                  <p>Les étudiants pourront accéder directement à ce cours.</p>
                </div>
              ) : (
                <div className="course-grid">
                  {availableCourses
                    .filter((course) => course.title !== courseData.titre)
                    .map((course) => {
                      const selected = courseData.prerequisites.includes(
                        course.id,
                      );

                      return (
                        <div
                          key={course.id}
                          className="course-card"
                          onClick={() => togglePrerequisite(course.id)}
                          style={{
                            cursor: "pointer",
                            border: selected ? "2px solid #8b5cf6" : undefined,
                          }}
                        >
                          <div className="course-card-content">
                            <div className="course-footer">
                              <div>
                                <h2>{course.title}</h2>

                                <p className="description">
                                  {course.description?.slice(0, 80)}...
                                </p>
                              </div>

                              {selected && (
                                <div className="course-badge">
                                  <Check size={14} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}

              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep(2)}>
                  <ChevronLeft size={18} /> Précédent
                </button>

                <button className="btn-primary" onClick={() => setStep(4)}>
                  Finalisation <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 */}

          {step === 4 && (
            <div className="form-step animate-in text-center">
              <div className="summary-card">
                <div className="summary-icon">
                  <Save size={48} />
                </div>

                <h2>Prêt à publier ?</h2>

                <p>
                  Votre cours contient {courseData.chapitres.length} chapitres.
                </p>

                <div className="summary-details">
                  <div className="detail">
                    <span>Chapitres</span>
                    <strong>{courseData.chapitres.length}</strong>
                  </div>

                  <div className="detail">
                    <span>Prérequis</span>
                    <strong>{courseData.prerequisites.length}</strong>
                  </div>
                </div>
              </div>

              <div className="step-actions centered">
                <button className="btn-secondary" onClick={() => setStep(3)}>
                  <ChevronLeft size={18} /> Retour
                </button>

                <button
                  className="btn-success"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publication..." : "Publier le cours"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateCoursePage;
