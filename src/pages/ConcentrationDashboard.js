import React, { useState, useEffect, useMemo } from "react";
import {
  Activity,
  Eye,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";

const ConcentrationDashboard = () => {
  // Simulated real-time concentration data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' = highest on right, 'asc' = highest on left

  // Generate initial mock data
  useEffect(() => {
    const courses = [
      "Machine Learning 101",
      "Deep Learning",
      "Computer Vision",
      "NLP Fundamentals",
    ];
    const studentNames = [
      "Ahmed Benali",
      "Sarah Chen",
      "Youssef El Amrani",
      "Maria Garcia",
      "Fatima Zaki",
      "Pierre Martin",
      "Lee Min-jun",
      "Nadia Rajae",
      "Carlos Rodriguez",
      "Emma Wilson",
      "Hiroshi Tanaka",
      "Sofia Rossi",
    ];

    const initialStudents = studentNames.map((name, i) => ({
      id: i + 1,
      name,
      course: courses[i % courses.length],
      concentration: Math.floor(Math.random() * 60) + 40, // 40-100%
      lastUpdated: Date.now() - Math.floor(Math.random() * 30000),
      avatar: name.charAt(0),
      status: "normal", // 'normal', 'distracted', 'excellent'
    }));

    setStudents(initialStudents);
    setLoading(false);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setStudents((prev) =>
        prev.map((student) => {
          const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
          let newConcentration = Math.max(
            0,
            Math.min(100, student.concentration + change),
          );
          let status = "normal";

          if (newConcentration >= 80) status = "excellent";
          else if (newConcentration < 50) status = "distracted";

          return {
            ...student,
            concentration: newConcentration,
            lastUpdated: Date.now(),
            status,
          };
        }),
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Statistics
  const totalStudents = students.length;
  const avgConcentration =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + s.concentration, 0) /
            students.length,
        )
      : 0;
  const excellentCount = students.filter(
    (s) => s.status === "excellent",
  ).length;
  const distractedCount = students.filter(
    (s) => s.status === "distracted",
  ).length;

  const courses = ["all", ...new Set(students.map((s) => s.course))];

  // Filter and sort students
  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // Filter by course
    if (selectedCourse !== "all") {
      result = result.filter((s) => s.course === selectedCourse);
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.course.toLowerCase().includes(query),
      );
    }

    // Sort
    result.sort((a, b) => {
      return sortOrder === "desc"
        ? b.concentration - a.concentration // Highest on right
        : a.concentration - b.concentration; // Lowest on right
    });

    return result;
  }, [students, selectedCourse, statusFilter, searchQuery, sortOrder]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          fontSize: "20px",
          color: "#64748b",
        }}
      >
        <Activity
          size={32}
          style={{ marginRight: "12px", animation: "spin 1s linear infinite" }}
        />
        Loading concentration dashboard...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "6px",
          }}
        >
          Concentration Monitoring
        </h1>
        <p style={{ fontSize: "0.95rem", color: "#64748b" }}>
          Real-time student engagement and focus analytics
        </p>
      </div>

      {/* Statistics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
            borderRadius: "16px",
            padding: "16px",
            color: "white",
            boxShadow: "0 4px 16px rgba(124, 58, 237, 0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <Users size={18} />
            <span
              style={{ fontSize: "0.8rem", fontWeight: "500", opacity: 0.95 }}
            >
              Total Students
            </span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800" }}>
            {filteredAndSortedStudents.length}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            borderRadius: "16px",
            padding: "16px",
            color: "white",
            boxShadow: "0 4px 16px rgba(16, 185, 129, 0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <CheckCircle size={18} />
            <span
              style={{ fontSize: "0.8rem", fontWeight: "500", opacity: 0.95 }}
            >
              Excellent Focus
            </span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800" }}>
            {excellentCount}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            borderRadius: "16px",
            padding: "16px",
            color: "white",
            boxShadow: "0 4px 16px rgba(245, 158, 11, 0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <RefreshCw size={18} />
            <span
              style={{ fontSize: "0.8rem", fontWeight: "500", opacity: 0.95 }}
            >
              Avg Concentration
            </span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800" }}>
            {avgConcentration}%
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            borderRadius: "16px",
            padding: "16px",
            color: "white",
            boxShadow: "0 4px 16px rgba(239, 68, 68, 0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <AlertCircle size={18} />
            <span
              style={{ fontSize: "0.8rem", fontWeight: "500", opacity: 0.95 }}
            >
              Distracted
            </span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "800" }}>
            {distractedCount}
          </div>
        </div>
      </div>

      {/* Filters Row */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          marginBottom: "24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Search student or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 40px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "0.875rem",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>
        </div>

        {/* Course Filter */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Filter size={16} color="#64748b" />
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              padding: "10px 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: "0.875rem",
              outline: "none",
              cursor: "pointer",
              background: "white",
            }}
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course === "all" ? "All Courses" : course}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px 12px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "0.875rem",
            outline: "none",
            cursor: "pointer",
            background: "white",
          }}
        >
          <option value="all">All Statuses</option>
          <option value="excellent">Excellent</option>
          <option value="normal">Normal</option>
          <option value="distracted">Distracted</option>
        </select>

        {/* Sort Order */}
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            background: "#f5f3ff",
            color: "#7c3aed",
            border: "none",
            borderRadius: "10px",
            fontSize: "0.875rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <ArrowUpDown size={16} />
          {sortOrder === "desc" ? "High → Low" : "Low → High"}
        </button>
      </div>

      {/* Students Grid */}
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <Eye size={20} color="#7c3aed" />
          <h2
            style={{ fontSize: "1.25rem", fontWeight: "700", color: "#0f172a" }}
          >
            Student Focus Levels
          </h2>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "0.8rem",
              color: "#94a3b8",
              fontWeight: "500",
            }}
          >
            {sortOrder === "desc"
              ? "← Lowest | Highest →"
              : "← Highest | Lowest →"}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          {filteredAndSortedStudents.map((student, index) => (
            <div
              key={student.id}
              style={{
                padding: "14px",
                borderRadius: "14px",
                border:
                  student.status === "distracted"
                    ? "2px solid #fee2e2"
                    : student.status === "excellent"
                      ? "2px solid #d1fae5"
                      : "2px solid #f1f5f9",
                background:
                  student.status === "distracted"
                    ? "linear-gradient(135deg, #fef2f2 0%, white 100%)"
                    : student.status === "excellent"
                      ? "linear-gradient(135deg, #f0fdf4 0%, white 100%)"
                      : "linear-gradient(135deg, #f8fafc 0%, white 100%)",
                transition: "all 0.3s",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background:
                      "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    fontWeight: "800",
                    color: "white",
                    flexShrink: 0,
                    boxShadow: "0 2px 10px rgba(124, 58, 237, 0.25)",
                  }}
                >
                  {student.avatar}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: "700",
                      color: "#0f172a",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {student.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "2px",
                    }}
                  >
                    <Clock size={12} />
                    {student.course}
                  </div>
                </div>
              </div>

              {/* Concentration bar */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      color: "#475569",
                    }}
                  >
                    Concentration
                  </span>
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "800",
                      color:
                        student.status === "distracted"
                          ? "#ef4444"
                          : student.status === "excellent"
                            ? "#10b981"
                            : "#f59e0b",
                    }}
                  >
                    {student.concentration}%
                  </span>
                </div>

                <div
                  style={{
                    height: "8px",
                    background: "#f1f5f9",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${student.concentration}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background:
                        student.status === "distracted"
                          ? "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)"
                          : student.status === "excellent"
                            ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                            : "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <div
                style={{
                  display: "inline-flex",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  width: "fit-content",
                  background:
                    student.status === "distracted"
                      ? "#fef2f2"
                      : student.status === "excellent"
                        ? "#d1fae5"
                        : "#fffbeb",
                  color:
                    student.status === "distracted"
                      ? "#dc2626"
                      : student.status === "excellent"
                        ? "#059669"
                        : "#d97706",
                }}
              >
                {student.status === "excellent"
                  ? "Excellent"
                  : student.status === "distracted"
                    ? "Distracted"
                    : "Normal"}
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedStudents.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px",
              color: "#94a3b8",
            }}
          >
            No students match your filters
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ConcentrationDashboard;
