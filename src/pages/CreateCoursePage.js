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
  Check,
  ExternalLink,
} from "lucide-react";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);

  // Course State
  const [courseData, setCourseData] = useState({
    titre: "",
    description: "",
    niveau: "Débutant",
    image_url: "",
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
    if (isEditMode) {
      fetchCourseForEdit();
    }
  }, [id]);

  const fetchCourseForEdit = async () => {
    try {
      const response = await courseService.getCourseById(id);
      const data = response.data;

      // Map backend data to frontend state structure
      setCourseData({
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
      });
    } catch (error) {
      console.error("Failed to fetch course:", error);
      alert("Impossible de charger les données du cours.");
      navigate("/teacher/my-courses");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload
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
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Erreur lors de l'upload du fichier.");
    }
  };

  // Chapter Management
  const addChapter = () => {
    setCourseData({
      ...courseData,
      chapitres: [
        ...courseData.chapitres,
        {
          id: "temp-" + Date.now(),
          titre: "",
          ordre: courseData.chapitres.length + 1,
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
  };

  const removeChapter = (chapterId) => {
    setCourseData({
      ...courseData,
      chapitres: courseData.chapitres.filter((c) => c.id !== chapterId),
    });
  };

  // Lesson Management
  const addLesson = (chapterId) => {
    setCourseData({
      ...courseData,
      chapitres: courseData.chapitres.map((c) =>
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
    });
  };

  const removeLesson = (chapterId, lessonId) => {
    setCourseData({
      ...courseData,
      chapitres: courseData.chapitres.map((c) =>
        c.id === chapterId
          ? { ...c, lecons: c.lecons.filter((l) => l.id !== lessonId) }
          : c,
      ),
    });
  };

  // Resource Management
  const addResource = (chapterId, lessonId, url, nom, type = null) => {
    if (!type) {
      type = url.endsWith(".pdf") ? "pdf" : "image";
    }

    setCourseData({
      ...courseData,
      chapitres: courseData.chapitres.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              lecons: c.lecons.map((l) =>
                l.id === lessonId
                  ? { ...l, ressources: [...l.ressources, { nom, type, url }] }
                  : l,
              ),
            }
          : c,
      ),
    });
  };

  const addExternalLink = (chapterId, lessonId) => {
    const url = prompt("Entrez l'URL du lien :");
    if (!url) return;
    const nom = prompt("Entrez le nom du lien :", "Lien externe");
    if (!nom) return;
    addResource(chapterId, lessonId, url, nom, "link");
  };

  const removeResource = (chapterId, lessonId, resIndex) => {
    setCourseData({
      ...courseData,
      chapitres: courseData.chapitres.map((c) =>
        c.id === chapterId
          ? {
              ...c,
              lecons: c.lecons.map((l) =>
                l.id === lessonId
                  ? {
                      ...l,
                      ressources: l.ressources.filter(
                        (_, index) => index !== resIndex,
                      ),
                    }
                  : l,
              ),
            }
          : c,
      ),
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await courseService.updateCourse(id, courseData);
        alert("Cours mis à jour avec succès !");
      } else {
        await courseService.createCourse(courseData);
        alert("Cours créé avec succès !");
      }
      navigate("/teacher/my-courses");
    } catch (error) {
      console.error("Submission failed:", error);
      alert(
        `Erreur lors de la ${isEditMode ? "modification" : "création"} du cours.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loader">Chargement...</div>;

  return (
    <div className="create-course-container">
      <header className="page-header">
        <h1>{isEditMode ? "Modifier le cours" : "Créer un nouveau cours"}</h1>
        <p>
          {isEditMode
            ? "Mettez à jour vos contenus pédagogiques."
            : "Partagez votre expertise avec la communauté ML Mastery."}
        </p>
      </header>

      {/* Steps Indicator */}
      <div className="steps-indicator">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          1. Informations générales
        </div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          2. Programme du cours
        </div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          3. Finalisation
        </div>
      </div>

      <div className="form-card glass-card">
        {step === 1 && (
          <div className="form-step animate-in">
            <div className="form-group">
              <label>Titre du cours</label>
              <input
                type="text"
                placeholder="ex: K-Means Clustering Masterclass"
                value={courseData.titre}
                onChange={(e) =>
                  setCourseData({ ...courseData, titre: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Décrivez ce que les étudiants vont apprendre..."
                rows="4"
                value={courseData.description}
                onChange={(e) =>
                  setCourseData({ ...courseData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Niveau</label>
                <select
                  value={courseData.niveau}
                  onChange={(e) =>
                    setCourseData({ ...courseData, niveau: e.target.value })
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
                      <img src={courseData.image_url} alt="Course preview" />
                      <button
                        className="remove-file"
                        onClick={() =>
                          setCourseData({ ...courseData, image_url: "" })
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
                        onChange={(e) =>
                          handleFileUpload(e, "course_image", (url) =>
                            setCourseData({ ...courseData, image_url: url }),
                          )
                        }
                        hidden
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

        {step === 2 && (
          <div className="form-step animate-in">
            <div className="chapters-editor">
              {courseData.chapitres.map((chap, chapIndex) => (
                <div key={chap.id} className="chapter-form-item">
                  <div className="chapter-form-header">
                    <input
                      type="text"
                      placeholder={`Chapitre ${chapIndex + 1}: Titre`}
                      value={chap.titre}
                      onChange={(e) => {
                        const newChaps = [...courseData.chapitres];
                        newChaps[chapIndex].titre = e.target.value;
                        setCourseData({ ...courseData, chapitres: newChaps });
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
                            placeholder={`Leçon ${lecIndex + 1}: Titre`}
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
                          placeholder="Contenu pédagogique (Markdown supporté)..."
                          rows="3"
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
                        ></textarea>

                        <div className="lesson-assets">
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

                          <div className="resources-manager">
                            <div className="resources-list-mini">
                              {lec.ressources.map((res, resIndex) => (
                                <div key={resIndex} className="resource-chip">
                                  {res.type === "pdf" ? (
                                    <FileText size={12} />
                                  ) : res.type === "link" ? (
                                    <ExternalLink size={12} />
                                  ) : (
                                    <ImageIcon size={12} />
                                  )}
                                  <span>{res.nom}</span>
                                  <button
                                    className="remove-res"
                                    onClick={() =>
                                      removeResource(chap.id, lec.id, resIndex)
                                    }
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="resource-actions">
                              <label className="btn-secondary-sm">
                                <Plus size={14} /> Fichier
                                <input
                                  type="file"
                                  accept="application/pdf,image/*"
                                  onChange={(e) =>
                                    handleFileUpload(
                                      e,
                                      "lesson_resource",
                                      (url, name) =>
                                        addResource(chap.id, lec.id, url, name),
                                    )
                                  }
                                  hidden
                                />
                              </label>
                              <button
                                className="btn-secondary-sm"
                                onClick={() => addExternalLink(chap.id, lec.id)}
                              >
                                <ExternalLink size={14} /> Lien
                              </button>
                            </div>
                          </div>
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
            </div>

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                <ChevronLeft size={18} /> Précédent
              </button>
              <button className="btn-primary" onClick={() => setStep(3)}>
                Récapitulatif <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step animate-in text-center">
            <div className="summary-card">
              <div className="summary-icon">
                <Save size={48} />
              </div>
              <h2>Prêt à publier ?</h2>
              <p>
                Votre cours "{courseData.titre}" contient{" "}
                {courseData.chapitres.length} chapitres et plusieurs leçons.
                Vérifiez bien tout avant de valider.
              </p>

              <div className="summary-details">
                <div className="detail">
                  <span>Chapitres</span>
                  <strong>{courseData.chapitres.length}</strong>
                </div>
                <div className="detail">
                  <span>Total Leçons</span>
                  <strong>
                    {courseData.chapitres.reduce(
                      (acc, c) => acc + c.lecons.length,
                      0,
                    )}
                  </strong>
                </div>
              </div>
            </div>

            <div className="step-actions centered">
              <button
                className="btn-secondary"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
              >
                <ChevronLeft size={18} /> Corriger
              </button>
              <button
                className="btn-success"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Publication en cours..."
                  : "Publier le cours maintenant"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCoursePage;
