import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "../services/api.js";

const QuizPage = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // Passing score: 70%
  const PASSING_SCORE = 70;

  // Hardcoded sample questions (when server is down)
  const hardcodedQuestions = [
    {
      id: 1,
      question: "Qu'est-ce que le Machine Learning ?",
      options: [
        "Un type de base de données",
        "Un sous-domaine de l'IA qui permet aux machines d'apprendre",
        "Un langage de programmation",
        "Un système d'exploitation",
      ],
      answer: "Un sous-domaine de l'IA qui permet aux machines d'apprendre",
      explanation:
        "Le Machine Learning est un sous-domaine de l'IA qui permet aux systèmes d'apprendre automatiquement à partir de données.",
    },
    {
      id: 2,
      question: "Quelle est la différence entre IA faible et IA forte ?",
      options: [
        "L'IA faible est spécialisée, l'IA forte a une intelligence générale",
        "L'IA faible est plus rapide",
        "L'IA forte est plus petite",
        "Aucune différence",
      ],
      answer:
        "L'IA faible est spécialisée, l'IA forte a une intelligence générale",
      explanation:
        "L'IA faible (narrow AI) est conçue pour une tâche spécifique, tandis que l'IA forte (general AI) aurait une intelligence humaine générale.",
    },
    {
      id: 3,
      question: "Qu'est-ce que l'apprentissage supervisé ?",
      options: [
        "Apprentissage sans données",
        "Apprentissage avec des données étiquetées",
        "Apprentissage par renforcement",
        "Apprentissage non supervisé",
      ],
      answer: "Apprentissage avec des données étiquetées",
      explanation:
        "Dans l'apprentissage supervisé, le modèle est entraîné sur des données étiquetées (entrée -> sortie souhaitée).",
    },
    {
      id: 4,
      question: "Quel est un exemple d'algorithme de classification ?",
      options: [
        "K-Means",
        "Régression Linéaire",
        "SVM (Support Vector Machine)",
        "PCA",
      ],
      answer: "SVM (Support Vector Machine)",
      explanation:
        "SVM est un algorithme de classification populaire qui sépare les données en différentes classes.",
    },
    {
      id: 5,
      question: "Que fait l'étape de prétraitement des données ?",
      options: [
        "Supprime toutes les données",
        "Nettoie et prépare les données pour l'analyse",
        "Génére des données",
        "Sauvegarde les données",
      ],
      answer: "Nettoie et prépare les données pour l'analyse",
      explanation:
        "Le prétraitement inclut le nettoyage, la normalisation, la gestion des valeurs manquantes, etc.",
    },
  ];

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        let response;
        if (courseId) {
          response = await quizService.getCourseQuiz(courseId);
        } else {
          response = await quizService.getChapterQuiz(chapterId);
        }

        if (response.data?.questions) {
          setQuestions(response.data.questions);
        } else {
          setQuestions(response.data);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching quiz, using hardcoded:", err);
        // Use hardcoded questions if server fails
        setQuestions(hardcodedQuestions);
        setError(null); // Don't show error, just use hardcoded
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId, chapterId]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isCourseQuizLocal = !!courseId && !chapterId;
    if (isCourseQuizLocal && courseId) {
      setSubmitting(true);
      try {
        // Préparer les réponses avec indication de correction
        const answersWithCorrectness = questions.map((q) => ({
          questionId: q.id,
          userAnswer: userAnswers[q.id],
          correct: userAnswers[q.id] === q.answer,
        }));

        const response = await quizService.submitQuiz(courseId, {
          answers: answersWithCorrectness,
          total_questions: questions.length,
        });

        setQuizResult(response.data);
        setShowResults(true);
      } catch (err) {
        console.error(
          "Error submitting quiz, just showing local results:",
          err,
        );
        // If server is down, still show results locally
        setShowResults(true);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Pour les quiz de chapitre, simplement afficher les résultats
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  if (loading)
    return (
      <div
        className="loader"
        style={{ padding: "40px", textAlign: "center", fontSize: "20px" }}
      >
        Chargement du QCM...
      </div>
    );
  if (error)
    return (
      <div
        className="error-message"
        style={{ padding: "40px", textAlign: "center" }}
      >
        {error}
      </div>
    );

  const score = calculateScore();
  const isCourseQuiz = !!courseId && !chapterId;
  const hasPassed = quizResult
    ? quizResult.passed
    : score.percentage >= PASSING_SCORE;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 16px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          color: "#6b7280",
        }}
      >
        ← Retour
      </button>

      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
          {isCourseQuiz ? "Examen Final du Cours" : "QCM du Chapitre"}
        </h1>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>
          {isCourseQuiz
            ? "Répondez aux questions pour valider le cours. Note minimale: 70%"
            : "Répondez aux questions pour valider le chapitre."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => {
          const options = question.options || [
            "Option A",
            "Option B",
            "Option C",
            "Option D",
          ];

          return (
            <div
              key={question.id || index}
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <span
                  style={{
                    background: "#7c3aed",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginRight: "12px",
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ fontSize: "18px", fontWeight: "500" }}>
                  {question.question}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {options.map((option, optIndex) => {
                  const isSelected = userAnswers[question.id] === option;
                  const isCorrect = showResults && option === question.answer;
                  const isWrong =
                    showResults && isSelected && option !== question.answer;

                  return (
                    <label
                      key={optIndex}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        border: `2px solid ${
                          isCorrect
                            ? "#10b981"
                            : isWrong
                              ? "#ef4444"
                              : isSelected
                                ? "#7c3aed"
                                : "#e5e7eb"
                        }`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: isCorrect
                          ? "#d1fae5"
                          : isWrong
                            ? "#fee2e2"
                            : isSelected
                              ? "#ede9fe"
                              : "white",
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(question.id, option)}
                        disabled={showResults}
                        style={{ transform: "scale(1.3)" }}
                      />
                      <span style={{ fontSize: "16px" }}>{option}</span>
                      {isCorrect && (
                        <span
                          style={{
                            color: "#10b981",
                            fontWeight: "bold",
                            marginLeft: "auto",
                          }}
                        >
                          ✓ Correct
                        </span>
                      )}
                      {isWrong && (
                        <span
                          style={{
                            color: "#ef4444",
                            fontWeight: "bold",
                            marginLeft: "auto",
                          }}
                        >
                          ✗ Incorrect
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {showResults && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: "#eff6ff",
                    borderRadius: "8px",
                    color: "#1e40af",
                  }}
                >
                  <strong>Explication:</strong>{" "}
                  {question.explanation || "Pas d'explication disponible"}
                </div>
              )}
            </div>
          );
        })}

        {!showResults && (
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              background: submitting ? "#9ca3af" : "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: submitting ? "not-allowed" : "pointer",
              marginTop: "16px",
            }}
          >
            {submitting ? "Soumission en cours..." : "Soumettre le QCM"}
          </button>
        )}

        {showResults && (
          <div
            style={{
              marginTop: "32px",
              textAlign: "center",
              padding: "40px",
              background: hasPassed ? "#f0fdf4" : "#fef2f2",
              borderRadius: "16px",
              border: `3px solid ${hasPassed ? "#10b981" : "#ef4444"}`,
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                marginBottom: "12px",
                color: hasPassed ? "#10b981" : "#ef4444",
              }}
            >
              {hasPassed ? "Félicitations !" : "Essai échoué"}
            </h2>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
            >
              {score.correct} / {score.total} réponses correctes (
              {quizResult ? quizResult.score : score.percentage}%)
            </p>
            <p style={{ marginBottom: "24px" }}>
              {hasPassed
                ? "Vous avez passé l'examen !"
                : `Note minimale requise : ${PASSING_SCORE}%. Veuillez réessayer.`}
            </p>

            {quizResult?.certificate && (
              <p style={{ color: "#10b981", marginBottom: "16px" }}>
                ✅ Certificat généré avec succès !
              </p>
            )}
            {quizResult?.badge && (
              <p style={{ color: "#f59e0b", marginBottom: "16px" }}>
                🏆 Badge obtenu : {quizResult.badge.nom} !
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: "12px 32px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  background: "white",
                  color: "#7c3aed",
                  border: "2px solid #7c3aed",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Retour au cours
              </button>
              {isCourseQuiz && hasPassed && (
                <button
                  onClick={() => navigate(`/certificate/${courseId}`)}
                  style={{
                    padding: "12px 32px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Voir le certificat
                </button>
              )}
              {isCourseQuiz && hasPassed && (
                <button
                  onClick={() => navigate(`/profile`)}
                  style={{
                    padding: "12px 32px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    background: "#f59e0b",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Voir mon profil
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default QuizPage;
