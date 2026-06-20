import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../services/api.js";
import { Award, FileText, Calendar, User } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback profile data for when server is down
  const fallbackProfile = {
    user: {
      name: "John Doe",
      email: "john.doe@example.com",
      title: "Machine Learning Apprentice",
      bio: "Passionate about data science and building intelligent systems.",
    },
    stats: {
      xp: 150,
      courses_completed: 2,
      certificates_count: 1,
      badges_count: 1,
    },
    certificates: [
      {
        id: 1,
        title: "Introduction au Machine Learning",
        date: "Juin 2026",
        certificate_number: "ML2026-001",
        cours_id: 1,
      },
    ],
    badges: [
      {
        id: 1,
        nom: "Badge - Machine Learning",
        description: "Obtenu après avoir réussi le quiz final du cours.",
        date_obtention: "Juin 2026",
      },
    ],
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile();
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile, using fallback:", err);
        setProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="loader" style={{ padding: "40px", textAlign: "center" }}>
        Chargement du profil...
      </div>
    );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px" }}>
      {/* En-tête du profil */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {profile.user.name.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>
              {profile.user.name}
            </h1>
            <p
              style={{
                color: "#7c3aed",
                fontSize: "18px",
                marginBottom: "8px",
              }}
            >
              {profile.user.title}
            </p>
            <p style={{ color: "#6b7280" }}>{profile.user.email}</p>
          </div>
        </div>
        <p style={{ color: "#4b5563", lineHeight: "1.6" }}>
          {profile.user.bio}
        </p>
      </div>

      {/* Statistiques */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#7c3aed",
            }}
          >
            {profile.stats.xp}
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>XP</div>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#10b981",
            }}
          >
            {profile.stats.courses_completed}
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>
            Cours complétés
          </div>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#f59e0b",
            }}
          >
            {profile.stats.certificates_count}
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>Certificats</div>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "#ec4899",
            }}
          >
            {profile.stats.badges_count}
          </div>
          <div style={{ color: "#6b7280", fontSize: "14px" }}>Badges</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
        }}
      >
        {/* Badges */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <Award size={24} color="#f59e0b" />
            <h2 style={{ fontSize: "24px" }}>Mes Badges</h2>
          </div>

          {profile.badges.length > 0 ? (
            <div style={{ display: "grid", gap: "16px" }}>
              {profile.badges.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                    }}
                  >
                    🏆
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>
                      {badge.nom}
                    </h3>
                    <p
                      style={{
                        color: "#6b7280",
                        fontSize: "14px",
                        marginBottom: "4px",
                      }}
                    >
                      {badge.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#9ca3af",
                        fontSize: "12px",
                      }}
                    >
                      <Calendar size={14} />
                      <span>{badge.date_obtention}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "40px",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              <Award size={48} style={{ marginBottom: "16px", opacity: 0.3 }} />
              <p>Aucun badge obtenu pour l'instant</p>
            </div>
          )}
        </div>

        {/* Certificats */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <FileText size={24} color="#10b981" />
            <h2 style={{ fontSize: "24px" }}>Mes Certificats</h2>
          </div>

          {profile.certificates.length > 0 ? (
            <div style={{ display: "grid", gap: "16px" }}>
              {profile.certificates.map((cert) => (
                <div
                  key={cert.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    ":hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => navigate(`/certificate/${cert.cours_id}`)}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "18px", marginBottom: "4px" }}>
                        {cert.title}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: "#9ca3af",
                          fontSize: "12px",
                        }}
                      >
                        <Calendar size={14} />
                        <span>{cert.date}</span>
                      </div>
                      <p
                        style={{
                          color: "#7c3aed",
                          fontSize: "12px",
                          marginTop: "8px",
                          fontFamily: "monospace",
                        }}
                      >
                        {cert.certificate_number}
                      </p>
                    </div>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        background:
                          "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <FileText size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "40px",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >
              <FileText
                size={48}
                style={{ marginBottom: "16px", opacity: 0.3 }}
              />
              <p>Aucun certificat obtenu pour l'instant</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
