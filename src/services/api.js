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
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!error.response) {
      console.error("Erreur réseau: Impossible de joindre le serveur");
    } else if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Services API
export const courseService = {
  getAll: function (params) {
    var url = params ? "/courses?" + params.toString() : "/courses";
    return api.get(url);
  },
  getAllCourses: function (params) {
    var url = params ? "/courses?" + params.toString() : "/courses";
    return api.get(url);
  },
  getCourseById: function (id) {
    return api.get("/courses/" + id);
  },
  createCourse: function (data) {
    return api.post("/courses", data);
  },
  updateCourse: function (id, data) {
    return api.put("/courses/" + id, data);
  },
  getMyCourses: function () {
    return api.get("/teacher/my-courses");
  },
  toggleVisibility: function (id) {
    return api.put("/courses/" + id + "/toggle-visibility");
  },
  enroll: function (id) {
    return api.post("/courses/" + id + "/enroll");
  },
  getSkillTree: function () {
    return api.get("/courses");
  },
  completeLesson: function (lessonId) {
    return api.post("/lessons/" + lessonId + "/complete");
  },
  markAsCompleted: function (courseId) {
    return api.post("/courses/" + courseId + "/mark-complete");
  },
};

export const quizService = {
  getChapterQuiz: function (chapterId) {
    return api.get("/chapters/" + chapterId + "/quiz");
  },
  getCourseQuiz: function (courseId) {
    return api.get("/courses/" + courseId + "/quiz");
  },
  submitQuiz: function (courseId, data) {
    return api.post("/courses/" + courseId + "/quiz/submit", data);
  },
};

export const authService = {
  login: function (credentials) {
    return api.post("/login", credentials);
  },
  register: function (data) {
    return api.post("/register", data);
  },
  logout: function () {
    return api.post("/logout");
  },
  getCurrentUser: function () {
    return api.get("/user");
  },
};

export const mediaService = {
  upload: function (file) {
    var formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const projectService = {
  getAllProjects: function () {
    return api.get("/projects");
  },
};

export const certificateService = {
  generate: function (courseId) {
    return api.post("/courses/" + courseId + "/certificate/generate");
  },
  get: function (courseId) {
    return api.get("/courses/" + courseId + "/certificate");
  },
  getAll: function () {
    return api.get("/certificates");
  },
};

export const profileService = {
  getProfile: function () {
    return api.get("/profile");
  },
};

export const concentrationService = {
  getStudents: function (courseId) {
    var url = courseId
      ? "/teacher/concentration?course=" + courseId
      : "/teacher/concentration";
    return api.get(url);
  },
};

export default api;
