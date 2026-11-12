
import { useState } from "react";

import LandingPage from "./LandingPage";
import AuthPage from "./AuthPage";
import StudentDashboard from "./StudentDashboard";

function App() {
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
    } else {
      alert("Teacher dashboard will be added next.");
    }
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
        <StudentDashboard />
      )}
    </>
  );
}

export default App;
