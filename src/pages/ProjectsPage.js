import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';
import { Trophy, Clock, Lock } from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await projectService.getAllProjects();
        setProjects(response.data);
      } catch (err) {
        console.error("ProjectsPage: Error fetching projects:", err);
        setError("Impossible de charger les projets.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <header className="page-header">
        <h1>Projets Pratiques</h1>
        <p>Appliquez vos connaissances sur des cas réels et gagnez de l'XP.</p>
      </header>

      {loading && <div className="loader">Chargement des projets...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="project-grid">
        {projects.map((project) => (
          <div key={project.id} className={`project-card ${project.status === 'Locked' ? 'locked' : ''}`}>
            <div className={`project-accent bg-gradient-to-br ${project.color}`}></div>
            <div className="project-content">
              <div className="project-header">
                <span className={`difficulty-badge ${project.difficulty.toLowerCase()}`}>
                  {project.difficulty}
                </span>
                <span className="xp-badge">
                  <Trophy size={14} />
                  {project.xp} XP
                </span>
              </div>

              <h3>{project.title}</h3>
              <p className="description">{project.description}</p>

              <div className="tags">
                {project.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div className="project-footer">
                {project.status === 'Locked' ? (
                  <div className="status locked">
                    <Lock size={16} />
                    <span>Débloquer au niveau suivant</span>
                  </div>
                ) : (
                  <button className="start-btn">
                    {project.status === 'Completed' ? 'Revoir' : project.status === 'In Progress' ? 'Continuer' : 'Commencer'}
                  </button>
                )}
                {project.progress && (
                  <div className="progress-mini">
                    <div className="progress-bar" style={{ width: `${project.progress}%` }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
