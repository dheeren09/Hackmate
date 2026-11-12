import { useEffect, useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  Search,
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Lightbulb
} from "lucide-react";

import "./TeacherDashboard.css";
import { getQuizResults } from "./quizStorage";

const initialStudents = [
  { name: "Aarav Sharma", subject: "Mathematics", score: 45, status: "Needs Support" },
  { name: "Priya Patel", subject: "Science", score: 88, status: "Excellent" },
  { name: "Rohan Kumar", subject: "Mathematics", score: 62, status: "Improving" },
  { name: "Ananya Rao", subject: "Science", score: 92, status: "Excellent" },
  { name: "Kabir Singh", subject: "Mathematics", score: 38, status: "Needs Support" }
];

function TeacherDashboard() {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const updateResults = () => {
      const results = getQuizResults();

      if (!results.length) {
        setStudents(initialStudents);
        return;
      }

      // Keep only the latest quiz result for each student and subject.
      const latestResults = new Map();

      results.forEach((result) => {
        const key = `${result.studentName}-${result.subject}`;
        const previous = latestResults.get(key);

        if (
          !previous ||
          new Date(result.submittedAt) > new Date(previous.submittedAt)
        ) {
          latestResults.set(key, result);
        }
      });

      const dynamicStudents = Array.from(latestResults.values()).map((result) => ({
        name: result.studentName,
        subject: result.subject,
        score: Number(result.score),
        status:
          Number(result.score) < 50
            ? "Needs Support"
            : Number(result.score) >= 80
              ? "Excellent"
              : "Improving"
      }));

      setStudents(dynamicStudents);
    };

    updateResults();

    window.addEventListener("storage", updateResults);
    window.addEventListener("learnloop-results-updated", updateResults);

    return () => {
      window.removeEventListener("storage", updateResults);
      window.removeEventListener("learnloop-results-updated", updateResults);
    };
  }, []);

  const averageScore = students.length
    ? Math.round(
        students.reduce((total, student) => total + student.score, 0) /
        students.length
      )
    : 0;

  const studentsNeedingHelp = students.filter(
    (student) => student.score < 50
  );

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusClass = (status) => {
    if (status === "Needs Support") return "needs-support";
    if (status === "Excellent") return "excellent";
    return "improving";
  };

  return (
    <div className="teacher-dashboard">
      <aside className="teacher-sidebar">
        <div className="teacher-brand">
          <div className="teacher-brand-icon">
            <GraduationCap size={25} />
          </div>
          <span>LearnLoop</span>
        </div>

        <p className="teacher-sidebar-label">MAIN MENU</p>

        <nav className="teacher-nav">
          <button className="teacher-nav-item active">
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </button>

          <button className="teacher-nav-item">
            <Users size={19} />
            <span>My Students</span>
          </button>

          <button className="teacher-nav-item">
            <BookOpen size={19} />
            <span>Learning Progress</span>
          </button>

          <button className="teacher-nav-item">
            <ClipboardCheck size={19} />
            <span>Assessments</span>
          </button>
        </nav>

        <div className="teacher-sidebar-bottom">
          <button className="teacher-nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button className="teacher-nav-item">
            <LogOut size={19} />
            <span>Log Out</span>
          </button>

          <div className="teacher-user">
            <div className="teacher-avatar">T</div>
            <div>
              <strong>Teacher</strong>
              <span>Educator Account</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="teacher-main">
        <header className="teacher-topbar">
          <div>
            <span className="teacher-portal-label">TEACHER PORTAL</span>
            <h2>Classroom Overview</h2>
          </div>

          <div className="teacher-topbar-actions">
            <button className="teacher-search-button" aria-label="Search">
              <Search size={19} />
            </button>

            <button className="teacher-notification-button" aria-label="Notifications">
              <Bell size={19} />
            </button>

            <div className="teacher-topbar-avatar">T</div>
          </div>
        </header>

        <section className="teacher-welcome">
          <div>
            <span className="teacher-welcome-label">YOUR CLASSROOM</span>
            <h1>Welcome back, Teacher! 👋</h1>
            <p>
              Here's what's happening with your students. Let's help every
              learner move forward.
            </p>
          </div>

          <div className="teacher-welcome-icon">
            <GraduationCap size={62} />
          </div>
        </section>

        <section className="teacher-stats">
          <div className="teacher-stat-card">
            <div className="teacher-stat-icon students-icon">
              <Users size={23} />
            </div>
            <div>
              <span>Total Students</span>
              <h3>{students.length || 0}</h3>
              <small>Students with quiz records</small>
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-icon performance-icon">
              <TrendingUp size={23} />
            </div>
            <div>
              <span>Average Performance</span>
              <h3>{averageScore}%</h3>
              <small>Based on latest quiz results</small>
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-icon lessons-icon">
              <BookOpen size={23} />
            </div>
            <div>
              <span>Quiz Attempts</span>
              <h3>{getQuizResults().length}</h3>
              <small>Total submitted attempts</small>
            </div>
          </div>

          <div className="teacher-stat-card">
            <div className="teacher-stat-icon attention-icon">
              <AlertCircle size={23} />
            </div>
            <div>
              <span>Need Attention</span>
              <h3>{studentsNeedingHelp.length}</h3>
              <small>Latest score below 50%</small>
            </div>
          </div>
        </section>

        <section className="teacher-content-grid">
          <div className="teacher-panel student-table-panel">
            <div className="teacher-panel-heading">
              <div>
                <span className="teacher-panel-eyebrow">STUDENT PERFORMANCE</span>
                <h2>Recent Student Results</h2>
              </div>
              <span className="teacher-panel-count">
                {filteredStudents.length} Students
              </span>
            </div>

            <div className="teacher-table-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="teacher-table-wrapper">
              <table className="teacher-student-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Subject</th>
                    <th>Latest Score</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
                      <tr key={`${student.name}-${student.subject}-${index}`}>
                        <td>
                          <div className="teacher-table-student">
                            <div className="teacher-table-avatar">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <strong>{student.name}</strong>
                          </div>
                        </td>

                        <td>{student.subject}</td>

                        <td>
                          <strong>{student.score}%</strong>
                        </td>

                        <td>
                          <span className={`teacher-status ${statusClass(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="teacher-empty">
                        No student results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="teacher-panel support-panel">
            <div className="teacher-panel-heading">
              <div>
                <span className="teacher-panel-eyebrow">REMEDIAL SUPPORT</span>
                <h2>Students Needing Help</h2>
              </div>
              <AlertCircle size={21} />
            </div>

            {studentsNeedingHelp.length > 0 ? (
              <div className="teacher-support-list">
                {studentsNeedingHelp.map((student, index) => (
                  <div className="teacher-support-item" key={`${student.name}-${index}`}>
                    <div className="teacher-support-avatar">
                      {student.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="teacher-support-details">
                      <strong>{student.name}</strong>
                      <span>{student.subject}</span>
                    </div>

                    <span className="teacher-support-score">{student.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="teacher-no-support">
                <CheckCircle2 size={30} />
                <strong>No students currently below 50%</strong>
                <p>Keep monitoring quiz performance.</p>
              </div>
            )}

            <div className="teacher-remedial-tip">
              <Lightbulb size={20} />
              <div>
                <strong>Teaching suggestion</strong>
                <p>
                  Give students scoring below 50% additional practice and
                  review the concepts they missed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="teacher-bottom-grid">
          <div className="teacher-panel teacher-insight-panel">
            <div className="teacher-insight-icon">
              <TrendingUp size={23} />
            </div>
            <div>
              <span className="teacher-panel-eyebrow">CLASS INSIGHT</span>
              <h2>Average quiz performance: {averageScore}%</h2>
              <p>
                This figure is calculated from the latest available result
                for each student and subject.
              </p>
            </div>
            <ArrowUpRight size={22} />
          </div>

          <div className="teacher-panel teacher-reminder-panel">
            <Clock size={23} />
            <div>
              <span className="teacher-panel-eyebrow">NEXT STEP</span>
              <h2>Review student progress</h2>
              <p>
                Check the students who need support and plan additional
                practice sessions.
              </p>
            </div>
          </div>
        </section>

        <footer className="teacher-footer">
          © 2026 LearnLoop · Helping every student learn and grow.
        </footer>
      </main>
    </div>
  );
}

export default TeacherDashboard;