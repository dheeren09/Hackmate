
import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Trophy,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Flame,
  Target,
  Clock,
  ArrowRight,
  Play,
  Globe,
  Mic,
  Brain,
  CheckCircle2
} from "lucide-react";

import "./StudentDashboard.css";

function StudentDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [language, setLanguage] = useState("English");

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Learning", icon: BookOpen },
    { name: "Quizzes", icon: ClipboardCheck },
    { name: "Achievements", icon: Trophy },
    { name: "My Profile", icon: User }
  ];

  const subjects = [
    {
      name: "Mathematics",
      topic: "Algebra and Numbers",
      progress: 85,
      color: "math",
      icon: "∑"
    },
    {
      name: "Science",
      topic: "Physics and Biology",
      progress: 72,
      color: "science",
      icon: "⚛"
    },
    {
      name: "English",
      topic: "Reading and Grammar",
      progress: 64,
      color: "english",
      icon: "A"
    }
  ];

  return (
    <div className="student-dashboard">

      {/* Sidebar */}
      <aside className="student-sidebar">
        <div className="student-brand">
          <div className="student-brand-icon">
            <GraduationCap size={25} />
          </div>
          <span>LearnLoop</span>
        </div>

        <p className="sidebar-label">MAIN MENU</p>

        <nav className="student-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={
                  activeMenu === item.name
                    ? "student-nav-item active"
                    : "student-nav-item"
                }
                onClick={() => setActiveMenu(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="student-nav-item"
            onClick={() => setActiveMenu("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className="student-nav-item"
            onClick={() => setActiveMenu("Logout")}
          >
            <LogOut size={19} />
            <span>Log Out</span>
          </button>

          <div className="sidebar-user">
            <div className="avatar">S</div>
            <div>
              <strong>Student</strong>
              <span>Learning Account</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="student-main">

        {/* Top Navigation */}
        <header className="student-topbar">
          <div>
            <span className="portal-label">STUDENT PORTAL</span>
            <h2>My Learning Space</h2>
          </div>

          <div className="topbar-actions">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select learning language"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Kannada</option>
              <option>Tamil</option>
              <option>Telugu</option>
            </select>

            <button className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              <span></span>
            </button>

            <div className="topbar-avatar">S</div>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="student-welcome">
          <div>
            <span className="welcome-date">YOUR LEARNING JOURNEY</span>
            <h1>Hello, Student! 👋</h1>
            <p>
              Every small step takes you closer to your goals.
              Let's make today count!
            </p>
          </div>

          <div className="welcome-decoration">
            <GraduationCap size={65} />
          </div>
        </section>

        {/* Statistics */}
        <section className="student-stats">
          <div className="stat-card">
            <div className="stat-icon progress-stat">
              <Target size={23} />
            </div>
            <div>
              <span>Overall Progress</span>
              <h3>78%</h3>
              <small>Keep going!</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon lessons-stat">
              <BookOpen size={23} />
            </div>
            <div>
              <span>Lessons Completed</span>
              <h3>24</h3>
              <small>Out of 35 lessons</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon streak-stat">
              <Flame size={23} />
            </div>
            <div>
              <span>Learning Streak</span>
              <h3>5 Days</h3>
              <small>You're on fire!</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon time-stat">
              <Clock size={23} />
            </div>
            <div>
              <span>Learning Time</span>
              <h3>12 Hrs</h3>
              <small>This week</small>
            </div>
          </div>
        </section>

        {/* Learning Content */}
        {activeMenu === "Dashboard" && (
          <>
            <section className="student-content-grid">

              {/* Subjects */}
              <div className="student-panel subjects-panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-eyebrow">YOUR SUBJECTS</span>
                    <h2>Continue Learning</h2>
                  </div>
                  <button
                    className="text-action"
                    onClick={() => setActiveMenu("My Learning")}
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>

                <div className="subject-list">
                  {subjects.map((subject) => (
                    <div className="student-subject" key={subject.name}>
                      <div className={`student-subject-icon ${subject.color}`}>
                        {subject.icon}
                      </div>

                      <div className="student-subject-details">
                        <strong>{subject.name}</strong>
                        <span>{subject.topic}</span>

                        <div className="student-progress-track">
                          <div
                            className={`student-progress-fill ${subject.color}`}
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <strong className="subject-percentage">
                        {subject.progress}%
                      </strong>

                      <button
                        className="subject-play"
                        onClick={() => setActiveMenu("My Learning")}
                        aria-label={`Continue ${subject.name}`}
                      >
                        <Play size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mastery */}
              <div className="student-panel mastery-panel">
                <span className="panel-eyebrow">YOUR PERFORMANCE</span>
                <h2>Knowledge Mastery</h2>

                <div className="mastery-circle">
                  <div className="mastery-inner">
                    <strong>78%</strong>
                    <span>Mastered</span>
                  </div>
                </div>

                <p>
                  You're making great progress across your subjects.
                  Keep practicing to improve your mastery!
                </p>

                <div className="mastery-legend">
                  <span><i></i> Mastered concepts</span>
                  <span><i></i> Concepts to improve</span>
                </div>
              </div>
            </section>

            {/* Bottom Sections */}
            <section className="student-bottom-grid">

              <div className="student-panel quiz-panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-eyebrow">TEST YOUR KNOWLEDGE</span>
                    <h2>Recommended Quiz</h2>
                  </div>
                  <div className="quiz-icon">
                    <Brain size={24} />
                  </div>
                </div>

                <h3>Mathematics: Basic Algebra</h3>
                <p>
                  Practice what you've learned and strengthen
                  your understanding.
                </p>

                <div className="quiz-details">
                  <span><ClipboardCheck size={16} /> 10 Questions</span>
                  <span><Clock size={16} /> 15 Minutes</span>
                </div>

                <button
                  className="start-quiz-button"
                  onClick={() => setActiveMenu("Quizzes")}
                >
                  Start Quiz <ArrowRight size={17} />
                </button>
              </div>

              <div className="student-panel language-panel">
                <div className="language-icon">
                  <Globe size={25} />
                </div>

                <span className="panel-eyebrow">LEARN YOUR WAY</span>
                <h2>Learning in Your Language</h2>

                <p>
                  Your selected learning language is
                  <strong> {language}</strong>.
                  Change it anytime to learn comfortably.
                </p>

                <div className="voice-learning">
                  <Mic size={19} />
                  <span>Voice learning experience</span>
                  <CheckCircle2 size={17} />
                </div>
              </div>

            </section>
          </>
        )}

        {activeMenu === "My Learning" && (
          <section className="student-panel alternate-panel">
            <span className="panel-eyebrow">YOUR SUBJECTS</span>
            <h2>My Learning</h2>
            <p>Choose a subject and continue your lessons.</p>

            {subjects.map((subject) => (
              <div className="alternate-row" key={subject.name}>
                <strong>{subject.name}</strong>
                <span>{subject.progress}% completed</span>
              </div>
            ))}
          </section>
        )}

        {activeMenu === "Quizzes" && (
          <section className="student-panel alternate-panel">
            <span className="panel-eyebrow">PRACTICE AND IMPROVE</span>
            <h2>My Quizzes</h2>
            <p>Your recommended practice activities.</p>

            <div className="alternate-row">
              <strong>Basic Algebra</strong>
              <span>10 Questions · 15 Minutes</span>
            </div>
            <div className="alternate-row">
              <strong>Science Fundamentals</strong>
              <span>10 Questions · 15 Minutes</span>
            </div>
          </section>
        )}

        {activeMenu === "Achievements" && (
          <section className="student-panel alternate-panel">
            <span className="panel-eyebrow">CELEBRATE YOUR PROGRESS</span>
            <h2>My Achievements</h2>
            <div className="achievement-item">
              <Trophy size={28} />
              <div>
                <strong>Learning Champion</strong>
                <p>Completed your first 20 lessons.</p>
              </div>
            </div>
            <div className="achievement-item">
              <Flame size={28} />
              <div>
                <strong>Five Day Streak</strong>
                <p>Learned for five days in a row.</p>
              </div>
            </div>
          </section>
        )}

        {activeMenu === "My Profile" && (
          <section className="student-panel alternate-panel">
            <span className="panel-eyebrow">YOUR ACCOUNT</span>
            <h2>My Profile</h2>
            <div className="profile-placeholder">
              <div className="profile-avatar">S</div>
              <strong>Student</strong>
              <span>Student Account</span>
              <p>Personal account details will be connected to the backend.</p>
            </div>
          </section>
        )}

        {activeMenu === "Settings" && (
          <section className="student-panel alternate-panel">
            <span className="panel-eyebrow">PREFERENCES</span>
            <h2>Settings</h2>
            <p>Choose your preferred learning language.</p>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Kannada</option>
              <option>Tamil</option>
              <option>Telugu</option>
            </select>
          </section>
        )}

        {activeMenu === "Logout" && (
          <section className="student-panel alternate-panel">
            <h2>Logout</h2>
            <p>
              Account logout will be connected when authentication
              is integrated with the backend.
            </p>
            <button
              className="start-quiz-button"
              onClick={() => setActiveMenu("Dashboard")}
            >
              Return to Dashboard
            </button>
          </section>
        )}

        <footer className="student-footer">
          © 2026 LearnLoop · Learn at your own pace.
        </footer>

      </main>
    </div>
  );
}

export default StudentDashboard;