import React, { useEffect, useState } from "react";
import { Network, Lock, CheckCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { courseService } from "../services/api";

const SkillTreePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillTree();
  }, []);

  const fetchSkillTree = async () => {
    try {
      const response = await courseService.getSkillTree();

      console.log("========== SKILL TREE ==========");
      console.log("Full Response :", response);
      console.log("Response Data :", response.data);
      console.log("================================");

      // Transform data to match SkillTree expectations
      const transformedCourses = response.data.map((course, index) => ({
        ...course,
        titre: course.titre,
        locked: index > 2, // First 3 courses unlocked
        completed: index < 1, // First course completed
        enrolled: index < 2, // First 2 courses enrolled
        progression: index < 2 ? (index === 0 ? 100 : 50) : 0,
        prerequisites: [],
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error("Erreur Skill Tree :", error);

      if (error.response) {
        console.error("Status :", error.response.status);
        console.error("Data :", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshSkillTree = () => {
    fetchSkillTree();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Chargement du Skill Tree...</h2>
      </div>
    );
  }

  return (
    <div className="skill-tree-page">
      <div className="skill-tree-header">
        <div className="skill-icon">
          <Network size={52} />
        </div>

        <h1>Skill Tree AI Learning</h1>

        <p>
          Débloquez progressivement vos compétences en Intelligence
          Artificielle.
        </p>
      </div>

      <div className="roadmap-container">
        {courses.length === 0 && (
          <h3 style={{ textAlign: "center" }}>
            Aucun cours reçu depuis le backend.
          </h3>
        )}

        {courses.map((course, index) => (
          <React.Fragment key={course.id}>
            <div
              className={`roadmap-node ${
                course.locked
                  ? "locked"
                  : course.completed
                    ? "completed"
                    : "available"
              }`}
            >
              <div
                className={`roadmap-circle ${
                  course.locked
                    ? "locked-circle"
                    : course.completed
                      ? "completed-circle"
                      : "available-circle"
                }`}
              >
                {course.locked ? (
                  <Lock size={34} />
                ) : course.completed ? (
                  <CheckCircle size={34} />
                ) : (
                  <BookOpen size={34} />
                )}
              </div>

              <div
                className={`roadmap-card ${course.locked ? "locked-card" : ""}`}
              >
                <h2>{course.titre}</h2>

                <p>
                  {course.locked
                    ? "Complétez les prérequis pour débloquer celui-ci."
                    : "Cours disponible dans votre parcours IA."}
                </p>

                {course.enrolled && !course.completed && (
                  <div style={{ marginTop: "12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "#4b5563" }}>Progression</span>
                      <span style={{ fontWeight: "700", color: "#7c3aed" }}>
                        {Math.round(course.progression)}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
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

                <span
                  className={`roadmap-status ${
                    course.locked
                      ? "locked-text"
                      : course.completed
                        ? "completed-text"
                        : "available-text"
                  }`}
                >
                  {course.locked
                    ? "Verrouillé"
                    : course.completed
                      ? "Complété"
                      : "Disponible"}
                </span>

                {!course.locked && (
                  <Link to={`/courses/${course.id}`} className="roadmap-btn">
                    {course.completed ? "Revoir le cours" : "Commencer"}
                  </Link>
                )}
              </div>
            </div>

            {index !== courses.length - 1 && (
              <div className="roadmap-line"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SkillTreePage;
