import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { BookOpen, Trophy, Flame, Clock, ChevronRight } from "lucide-react";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard");
        setData(response.data);
      } catch (err) {
        console.error("Dashboard: Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return <div className="loader">Chargement de votre espace...</div>;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <h1>Bonjour, {data?.user?.nom} ! 👋</h1>
        <p>Heureux de vous revoir. Voici un aperçu de votre progression.</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-violet-100 text-violet-600">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">
              {data?.enrolled_courses?.length || 0}
            </span>
            <span className="stat-label">Cours suivis</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-amber-100 text-amber-600">
            <Trophy size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{data?.badges?.length || 0}</span>
            <span className="stat-label">Badges gagnés</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-orange-100 text-orange-600">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{data?.total_points || 0}</span>
            <span className="stat-label">Points XP</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <section className="enrolled-section">
          <div className="section-header">
            <h2>Mes cours en cours</h2>
            <Link to="/courses" className="view-all">
              Voir tout <ChevronRight size={16} />
            </Link>
          </div>

          <div className="enrolled-grid">
            {data?.enrolled_courses?.length > 0 ? (
              data.enrolled_courses.map((course) => (
                <div key={course.id} className="enrolled-card">
                  <div className="enrolled-info">
                    <h3>{course.title}</h3>
                    <p>{course.module}</p>
                    <div className="progress-container">
                      <div className="progress-bar-bg">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <span>{course.progress}%</span>
                    </div>
                  </div>
                  <Link to={`/courses/${course.id}`} className="continue-btn">
                    Continuer
                  </Link>
                </div>
              ))
            ) : (
              <div className="empty-enrolled">
                <p>Vous n'êtes inscrit à aucun cours pour le moment.</p>
                <Link to="/courses" className="enroll-now-btn">
                  Découvrir les cours
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
