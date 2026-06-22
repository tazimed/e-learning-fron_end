import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, ScrollText } from "lucide-react";
import { leaderboardService } from "../services/api";

// Static data for screenshots
const staticLeaderboardData = [
  {
    id: 999,
    name: "Admin User",
    score: 5000,
    avatar:
      "https://ui-avatars.com/api/?name=Admin&background=7c3aed&color=fff&size=128",
    badges: 10,
    is_static: true,
    has_certificate: true,
    certificate_count: 5,
    badge_list: [
      "🏆 Champion",
      "📚 Savant",
      "🎯 Perfect",
      "⭐ Star",
      "💎 Premium",
      "🔥 Streak Master",
      "🚀 First",
      "🎨 Creative",
      "💡 Innovator",
      "🏅 Legend",
    ],
    rank: 1,
  },
  {
    id: 998,
    name: "Yahia Ez-zemmouri",
    score: 4500,
    avatar:
      "https://ui-avatars.com/api/?name=Yahia+Ez-zemmouri&background=f59e0b&color=fff&size=128",
    badges: 8,
    is_static: true,
    has_certificate: false,
    certificate_count: 0,
    badge_list: [
      "🏆 Top Student",
      "📚 Bookworm",
      "🎯 Quiz Master",
      "⭐ Active",
      "🔥 Consistent",
      "🚀 Fast Learner",
      "🎨 Design Genius",
      "💡 Problem Solver",
    ],
    rank: 2,
  },
  {
    id: 1,
    name: "Nouredine Saidi",
    score: 4200,
    avatar:
      "https://ui-avatars.com/api/?name=Nouredine+Saidi&background=3b82f6&color=fff&size=128",
    badges: 7,
    is_static: false,
    has_certificate: true,
    certificate_count: 3,
    badge_list: [
      "📚 Learner",
      "🎯 Quizzer",
      "⭐ Participant",
      "🔥 Consistent",
      "🚀 Upcoming",
      "💡 Thinker",
      "🏅 Achiever",
    ],
    rank: 3,
  },
  {
    id: 2,
    name: "Fatima Zaki",
    score: 3800,
    avatar:
      "https://ui-avatars.com/api/?name=Fatima+Zaki&background=ec4899&color=fff&size=128",
    badges: 6,
    is_static: false,
    has_certificate: true,
    certificate_count: 2,
    badge_list: [
      "📚 Learner",
      "🎯 Quizzer",
      "⭐ Participant",
      "🔥 Consistent",
      "🚀 Upcoming",
      "💡 Thinker",
    ],
    rank: 4,
  },
  {
    id: 3,
    name: "Omar El Idrissi",
    score: 3500,
    avatar:
      "https://ui-avatars.com/api/?name=Omar+El+Idrissi&background=14b8a6&color=fff&size=128",
    badges: 5,
    is_static: false,
    has_certificate: false,
    certificate_count: 0,
    badge_list: [
      "📚 Learner",
      "🎯 Quizzer",
      "⭐ Participant",
      "🔥 Consistent",
      "🚀 Upcoming",
    ],
    rank: 5,
  },
  {
    id: 4,
    name: "Amina Saidi",
    score: 3100,
    avatar:
      "https://ui-avatars.com/api/?name=Amina+Saidi&background=f97316&color=fff&size=128",
    badges: 4,
    is_static: false,
    has_certificate: true,
    certificate_count: 1,
    badge_list: ["📚 Learner", "🎯 Quizzer", "⭐ Participant", "🔥 Consistent"],
    rank: 6,
  },
];

const LeaderboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardService.getLeaderboard();
        setUsers(
          response.data.length > 0 ? response.data : staticLeaderboardData,
        );
      } catch (err) {
        console.error(
          "Leaderboard: Error fetching data, using static data",
          err,
        );
        setUsers(staticLeaderboardData);
      } finally {
        setLoading(false);
      }
    };
    // Use static data immediately for screenshots
    setUsers(staticLeaderboardData);
    setLoading(false);
    // fetchLeaderboard();
  }, []);

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy size={24} className="text-yellow-500" />;
      case 2:
        return <Medal size={24} className="text-gray-400" />;
      case 3:
        return <Award size={24} className="text-amber-600" />;
      default:
        return (
          <span className={`text-xl font-bold ${getRankColor(rank)}`}>
            {rank}
          </span>
        );
    }
  };

  const renderUserCard = (user, index) => {
    const isPodium = index < 3;

    if (isPodium) {
      return null; // Podium is rendered separately
    }

    return (
      <div
        key={user.id}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 24px",
          borderBottom: "1px solid #f3f4f6",
          background: user.is_static ? "#faf5ff" : "white",
        }}
      >
        <div
          style={{ width: "60px", display: "flex", justifyContent: "center" }}
        >
          {getRankIcon(user.rank)}
        </div>

        <div style={{ position: "relative" }}>
          <img
            src={user.avatar}
            alt={user.name}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              marginRight: "16px",
              border: user.is_static
                ? "3px solid #7c3aed"
                : "2px solid #e5e7eb",
            }}
          />
          {user.has_certificate && (
            <div
              style={{
                position: "absolute",
                bottom: "-5px",
                right: "10px",
                background: "linear-gradient(135deg, #10b981, #059669)",
                borderRadius: "50%",
                padding: "6px",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
              }}
            >
              <ScrollText size={14} style={{ color: "white" }} />
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "6px",
            }}
          >
            {user.name}
            {user.is_static && (
              <span
                style={{
                  marginLeft: "8px",
                  background: "#7c3aed",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  fontSize: "12px",
                }}
              >
                ⭐ Pro
              </span>
            )}
          </div>

          {/* Badges */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginBottom: "4px",
            }}
          >
            {user.badge_list?.slice(0, 4).map((badge, i) => (
              <span
                key={i}
                style={{
                  fontSize: "11px",
                  background: "#f3f4f6",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  color: "#4b5563",
                }}
              >
                {badge}
              </span>
            ))}
            {user.badges > 4 && (
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                +{user.badges - 4}
              </span>
            )}
          </div>

          {/* Certificate info */}
          {user.has_certificate && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                color: "#10b981",
                fontWeight: "500",
              }}
            >
              <ScrollText size={14} />
              <span>
                {user.certificate_count} Certificat
                {user.certificate_count > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{ fontWeight: "bold", fontSize: "20px", color: "#7c3aed" }}
          >
            {user.score}{" "}
            <span style={{ fontSize: "14px", color: "#9ca3af" }}>XP</span>
          </div>
          <div style={{ fontSize: "13px", color: "#6b7280" }}>
            {user.badges} Badges
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loader">Chargement du classement...</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 16px" }}>
      <header style={{ marginBottom: "32px", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>🏆 Classement</h1>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>
          Les meilleurs étudiants de la plateforme
        </p>
      </header>

      {/* Top 3 Podium */}
      {users.length >= 3 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "24px",
            marginBottom: "40px",
            padding: "24px",
          }}
        >
          {/* 2nd Place */}
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  background: "#f3f4f6",
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  border: "4px solid #d1d5db",
                  overflow: "hidden",
                }}
              >
                <img
                  src={users[1].avatar}
                  alt={users[1].name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {users[1].has_certificate && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "-5px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "50%",
                    padding: "6px",
                    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  <ScrollText size={16} style={{ color: "white" }} />
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {users[1].name}
            </div>
            <div style={{ color: "#6b7280", marginBottom: "8px" }}>
              {users[1].score} XP
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "4px",
                marginBottom: "8px",
                flexWrap: "wrap",
              }}
            >
              {users[1].badge_list?.slice(0, 3).map((badge, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "10px",
                    background: "#f3f4f6",
                    padding: "2px 6px",
                    borderRadius: "999px",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
            <div
              style={{
                background: "#e5e7eb",
                padding: "20px 30px",
                borderRadius: "12px 12px 0 0",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#9ca3af",
              }}
            >
              2
            </div>
          </div>

          {/* 1st Place */}
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  borderRadius: "50%",
                  width: "130px",
                  height: "130px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  border: "4px solid #fbbf24",
                  boxShadow: "0 0 20px rgba(251, 191, 36, 0.4)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-15px",
                    background: "#fbbf24",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  👑
                </div>
                <img
                  src={users[0].avatar}
                  alt={users[0].name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {users[0].has_certificate && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "-5px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "50%",
                    padding: "8px",
                    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  <ScrollText size={18} style={{ color: "white" }} />
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "6px",
                color: "#f59e0b",
              }}
            >
              {users[0].name}
            </div>
            <div
              style={{
                color: "#6b7280",
                marginBottom: "8px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {users[0].score} XP
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "4px",
                marginBottom: "8px",
                flexWrap: "wrap",
              }}
            >
              {users[0].badge_list?.slice(0, 4).map((badge, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "10px",
                    background: "#fef3c7",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    color: "#d97706",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
            {users[0].has_certificate && (
              <div
                style={{
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "#10b981",
                  fontWeight: "bold",
                }}
              >
                📜 {users[0].certificate_count} Certificats
              </div>
            )}
            <div
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                padding: "30px 45px",
                borderRadius: "12px 12px 0 0",
                fontSize: "36px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              1
            </div>
          </div>

          {/* 3rd Place */}
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  background: "#fff7ed",
                  borderRadius: "50%",
                  width: "100px",
                  height: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                  border: "4px solid #d97706",
                  overflow: "hidden",
                }}
              >
                <img
                  src={users[2].avatar}
                  alt={users[2].name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {users[2].has_certificate && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "-5px",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    borderRadius: "50%",
                    padding: "6px",
                    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.4)",
                  }}
                >
                  <ScrollText size={16} style={{ color: "white" }} />
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              {users[2].name}
            </div>
            <div style={{ color: "#6b7280", marginBottom: "8px" }}>
              {users[2].score} XP
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "4px",
                marginBottom: "8px",
                flexWrap: "wrap",
              }}
            >
              {users[2].badge_list?.slice(0, 3).map((badge, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "10px",
                    background: "#fff7ed",
                    padding: "2px 6px",
                    borderRadius: "999px",
                    color: "#d97706",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
            <div
              style={{
                background: "#fed7aa",
                padding: "15px 30px",
                borderRadius: "12px 12px 0 0",
                fontSize: "20px",
                fontWeight: "bold",
                color: "#d97706",
              }}
            >
              3
            </div>
          </div>
        </div>
      )}

      {/* Rest of the leaderboard */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {users.map((user, index) => renderUserCard(user, index))}
      </div>
    </div>
  );
};

export default LeaderboardPage;
