import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  BookOpen,
  Code2,
  Network,
  Trophy,
  Settings,
  LayoutDashboard,
  Zap,
  LogOut,
  PlusCircle,
  GraduationCap,
  User,
  Eye,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  console.log("User data in Sidebar:", user);

  const isProf =
    user?.role?.nom === "prof" || user?.role?.name === "prof" || user?.isProf;
  const isAdmin =
    user?.role?.nom === "admin" ||
    user?.role?.name === "admin" ||
    user?.isAdmin;

  // For testing: show teacher menu if no user or if user is teacher/admin
  const showTeacherMenu = isProf || isAdmin || true;

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Courses", icon: BookOpen, path: "/courses" },
    { name: "Projects", icon: Code2, path: "/projects" },
    { name: "Skill Tree", icon: Network, path: "/skill-tree" },
    { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  const teacherItems = [
    { name: "Create Course", icon: PlusCircle, path: "/teacher/create-course" },
    { name: "My Courses", icon: GraduationCap, path: "/teacher/my-courses" },
  ];

  const adminItems = [
    { name: "User Management", icon: Settings, path: "/admin/users" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img
            src="/logo-idrak.png"
            alt="Idrak AI"
            style={{
              width: "220px",
              height: "auto",
              objectFit: "contain",
              margin: "10px 0",
            }}
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path === "/" && location.pathname === "/courses");
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {showTeacherMenu && (
          <>
            <div className="nav-section-label teacher-label">Teacher Space</div>
            {teacherItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </>
        )}

        {isAdmin && (
          <>
            <div className="nav-section-label admin-label">Admin Space</div>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.nom?.charAt(0) || "U"}</div>
          <div className="user-details">
            <span className="user-name">{user?.nom}</span>
            <span className="user-role">
              {isAdmin ? "Administrateur" : isProf ? "Professeur" : "Étudiant"}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
