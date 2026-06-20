import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { certificateService } from "../services/api.js";

const CertificatePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await certificateService.get(courseId);
        setCertificate(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching certificate:", err);
        // Fallback to demo data if no API
        setCertificate({
          user: { nom: "Nom de l'étudiant" },
          cours: { titre: "Introduction au Machine Learning" },
          issued_at: new Date().toISOString(),
          certificate_number: "FSBM-AI-2026-001",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [courseId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <div className="loader" style={{ padding: "40px", textAlign: "center" }}>
        Chargement du certificat...
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 16px" }}>
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

      <div
        id="certificate"
        style={{
          background: "#f0f5fa",
          padding: "40px",
          borderRadius: "4px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        {/* Outer decorative border */}
        <div
          style={{
            border: "8px solid #1e3a5f",
            padding: "20px",
            borderRadius: "2px",
            position: "relative",
            background: "white",
          }}
        >
          {/* Inner decorative border */}
          <div
            style={{
              border: "3px solid #2d5a87",
              padding: "40px 60px",
              position: "relative",
              minHeight: "600px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Corner decorations */}
            <div
              style={{
                position: "absolute",
                top: "15px",
                left: "15px",
                width: "60px",
                height: "60px",
                borderTop: "4px solid #1e3a5f",
                borderLeft: "4px solid #1e3a5f",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                width: "60px",
                height: "60px",
                borderTop: "4px solid #1e3a5f",
                borderRight: "4px solid #1e3a5f",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "15px",
                left: "15px",
                width: "60px",
                height: "60px",
                borderBottom: "4px solid #1e3a5f",
                borderLeft: "4px solid #1e3a5f",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "15px",
                right: "15px",
                width: "60px",
                height: "60px",
                borderBottom: "4px solid #1e3a5f",
                borderRight: "4px solid #1e3a5f",
              }}
            />

            {/* Header with logos in corners */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <img
                src="/logo-fsbm.png"
                alt="FSBM Logo"
                style={{
                  height: "90px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <img
                src="/logo-department.png"
                alt="Department Logo"
                style={{
                  height: "90px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </div>

            {/* Decorative flourish */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "32px",
                color: "#1e3a5f",
              }}
            >
              ⚜
            </div>

            {/* Main content */}
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontSize: "56px",
                  color: "#1e3a5f",
                  margin: "0 0 5px 0",
                  fontWeight: "bold",
                  letterSpacing: "8px",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                  textTransform: "uppercase",
                }}
              >
                Certificat
              </h1>
              <h2
                style={{
                  fontSize: "32px",
                  color: "#1e3a5f",
                  margin: "0 0 30px 0",
                  letterSpacing: "4px",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                  textTransform: "uppercase",
                }}
              >
                De Réussite
              </h2>

              {/* Decorative line */}
              <div
                style={{
                  width: "60px",
                  height: "3px",
                  background: "#2d5a87",
                  margin: "0 auto 30px auto",
                }}
              />

              <p
                style={{
                  fontSize: "18px",
                  color: "#3d4a5c",
                  marginBottom: "15px",
                  fontWeight: "500",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                }}
              >
                Ce certificat est décerné avec distinction à
              </p>
              <p
                style={{
                  fontSize: "44px",
                  color: "#1e3a5f",
                  fontWeight: "bold",
                  marginBottom: "25px",
                  letterSpacing: "2px",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                }}
              >
                {certificate.user?.nom || "Nom de l'étudiant"}
              </p>

              <p
                style={{
                  fontSize: "17px",
                  color: "#3d4a5c",
                  marginBottom: "10px",
                  fontWeight: "500",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                }}
              >
                Pour avoir complété avec succès le cours
              </p>
              <p
                style={{
                  fontSize: "26px",
                  color: "#1e3a5f",
                  fontWeight: "bold",
                  marginBottom: "30px",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                }}
              >
                "
                {certificate.cours?.titre || "Introduction au Machine Learning"}
                "
              </p>

              <p
                style={{
                  fontSize: "16px",
                  color: "#3d4a5c",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                }}
              >
                Délivré le
              </p>
              <p
                style={{
                  fontSize: "20px",
                  color: "#1e3a5f",
                  fontWeight: "bold",
                  fontFamily: "Georgia, 'Times New Roman', Times, serif",
                  marginBottom: "20px",
                }}
              >
                {formatDate(certificate.issued_at)}
              </p>
            </div>

            {/* Decorative flourish */}
            <div
              style={{
                textAlign: "center",
                margin: "20px 0",
                fontSize: "28px",
                color: "#1e3a5f",
              }}
            >
              ⚜
            </div>

            {/* Footer with signatures */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding: "0 60px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "180px",
                    borderTop: "2px solid #1e3a5f",
                    paddingTop: "10px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#3d4a5c",
                      fontWeight: "500",
                      fontFamily: "Georgia, 'Times New Roman', Times, serif",
                    }}
                  >
                    Signature
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                      fontFamily: "Georgia, 'Times New Roman', Times, serif",
                    }}
                  >
                    Responsable pédagogique
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "180px",
                    borderTop: "2px solid #1e3a5f",
                    paddingTop: "10px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#3d4a5c",
                      fontWeight: "500",
                      fontFamily: "Georgia, 'Times New Roman', Times, serif",
                    }}
                  >
                    FSBM
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                      fontFamily: "Georgia, 'Times New Roman', Times, serif",
                    }}
                  >
                    Université Hassan II
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "32px" }}>
        <button
          onClick={handlePrint}
          style={{
            padding: "14px 40px",
            fontSize: "16px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(30, 58, 95, 0.3)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
        >
          Imprimer le certificat
        </button>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          button {
            display: none !important;
          }
          #certificate {
            box-shadow: none;
            border: none;
            border-radius: 0;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CertificatePage;
