import axios from "axios";

// Configuration de base Axios
const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Erreur réseau (serveur éteint ou problème CORS)
      console.error("Erreur réseau: Impossible de joindre le serveur");
    } else if (error.response.status === 401) {
      // Token invalide ou expiré
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Services API
export const courseService = {
  getAll: () => api.get("/courses"),
  getAllCourses: () => api.get("/courses"), // Alias for backward compatibility
  getCourseById: (id) => api.get(`/courses/${id}`),
  createCourse: (data) => api.post("/courses", data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  getMyCourses: () => api.get("/teacher/my-courses"),
  toggleVisibility: (id) => api.put(`/courses/${id}/toggle-visibility`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  getSkillTree: () => api.get("/courses"), // Use courses list for skill tree
  completeLesson: (lessonId) => api.post(`/lessons/${lessonId}/complete`),
  markAsCompleted: (courseId) => api.post(`/courses/${courseId}/mark-complete`),
};

export const authService = {
  login: (credentials) => api.post("/login", credentials),
  register: (data) => api.post("/register", data),
  logout: () => api.post("/logout"),
  getCurrentUser: () => api.get("/user"),
};

export const mediaService = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const projectService = {
  getAllProjects: () => api.get("/projects"),
};

export default api;
