
import { useState } from "react";

import LandingPage from "./LandingPage";
import AuthPage from "./AuthPage";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import { LanguageProvider } from "./LanguageContext";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [authMode, setAuthMode] = useState("register");

  function openLogin() {
    setAuthMode("login");
    setCurrentPage("auth");
  }

  function openRegister() {
    setAuthMode("register");
    setCurrentPage("auth");
  }

  function goHome() {
    setCurrentPage("home");
  }

  function handleAuthSuccess(role) {
    if (role === "student") {
      setCurrentPage("student");
    } else if (role === "teacher") {
      setCurrentPage("teacher");
    }
  }

  function handleLogout() {
    setAuthMode("login");
    setCurrentPage("auth");
  }

  return (
    <>
      {currentPage === "home" && (
        <LandingPage
          onLogin={openLogin}
          onGetStarted={openRegister}
        />
      )}

      {currentPage === "auth" && (
        <AuthPage
          key={authMode}
          initialMode={authMode}
          onBack={goHome}
          onSuccess={handleAuthSuccess}
        />
      )}

      {currentPage === "student" && (
        <StudentDashboard onLogout={handleLogout} />
      )}

      {currentPage === "teacher" && (
        <TeacherDashboard />
      )}
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
