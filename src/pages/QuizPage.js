import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizService } from "../services/api";

const QuizPage = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        console.error("Error fetching quiz:", err);
        setError(err.message || "Failed to load quiz");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResults(true);
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

  if (loading) return <div className="loader">Chargement du QCM...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const score = calculateScore();
  const isCourseQuiz = !!courseId && !chapterId;

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
            ? "Répondez aux 25 questions pour valider le cours."
            : "Répondez aux 5 questions pour valider le chapitre."}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((question, index) => {
          if (!question.options) {
            question.options = ["Option A", "Option B", "Option C", "Option D"];
          }

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
                {question.options.map((option, optIndex) => {
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
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              background: "#7c3aed",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            Soumettre le QCM
          </button>
        )}

        {showResults && (
          <div
            style={{
              marginTop: "32px",
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
              Résultat Final
            </h2>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
            >
              {score.correct} / {score.total} réponses correctes (
              {score.percentage}%)
            </p>
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
          </div>
        )}
      </form>
    </div>
  );
};

export default QuizPage;
