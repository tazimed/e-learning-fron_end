import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Ajouter le token s'il existe dans le localStorage au démarrage
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // #region debug-point api-intercept-error
    fetch("http://127.0.0.1:7777/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session: "frontend-blank-page-v2",
        event: "api-intercept-error",
        data: {
          msg: error.message,
          url: error.config?.url,
          status: error.response?.status,
        },
      }),
    }).catch(() => {});
    // #endregion
    if (!error.response) {
      // Erreur réseau (serveur éteint ou problème CORS)
      console.error("Erreur réseau ou serveur inaccessible:", error);
      return Promise.reject({
        message:
          "Le serveur est inaccessible. Vérifiez qu'il est lancé sur " +
          API_BASE_URL,
        isNetworkError: true,
      });
    }
    return Promise.reject(error);
  },
);


export const courseService = {
  getAllCourses: () => api.get("/courses"),
  getMyCourses: () => api.get("/my-courses"),
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  toggleVisibility: (id) => api.post(`/courses/${id}/toggle-visibility`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),

  // SKILL TREE
  getSkillTree: () => api.get("/skill-tree"),
};


export const projectService = {
  getAllProjects: () => api.get("/projects"),
};

export default api;
