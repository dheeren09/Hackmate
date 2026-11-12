
import { useState } from "react";
import { GraduationCap, User, Mail, Lock, ArrowRight, BookOpen, Globe, Mic } from "lucide-react";
import "./AuthPage.css";

function AuthPage({ initialMode = "register", onBack, onSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  function handleSubmit(event) {
    event.preventDefault();

    if (onSuccess) {
      onSuccess(role);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="auth-logo">
          <span className="auth-logo-icon">
            <GraduationCap size={24} />
          </span>
          LearnLoop
        </div>

        <button className="back-home" onClick={onBack} type="button">
          ← Back to Home
        </button>
      </header>

      <main className="auth-container">
        <section className="auth-intro">
          <span className="auth-eyebrow">WELCOME TO LEARNLOOP</span>

          <h1>
            Learning Made
            <br />
            Personal for
            <br />
            Every Student.
          </h1>

          <p>
            Join a smarter learning experience with personalized lessons,
            multilingual education and AI-powered support.
          </p>

          <div className="auth-benefits">
            <div>
              <BookOpen size={20} />
              <span>Personalized learning paths</span>
            </div>

            <div>
              <Globe size={20} />
              <span>Learn in your own language</span>
            </div>

            <div>
              <Mic size={20} />
              <span>Voice-first learning support</span>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card-heading">
            <h2>{isRegister ? "Create Your Account" : "Welcome Back"}</h2>
            <p>
              {isRegister
                ? "Start your personalized learning journey."
                : "Log in to continue your learning journey."}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              className={isRegister ? "active" : ""}
              onClick={() => setMode("register")}
              type="button"
            >
              Sign Up
            </button>

            <button
              className={!isRegister ? "active" : ""}
              onClick={() => setMode("login")}
              type="button"
            >
              Log In
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="auth-label">I am a</label>

            <div className="role-options">
              <button
                type="button"
                className={role === "student" ? "selected" : ""}
                onClick={() => setRole("student")}
              >
                <GraduationCap size={18} />
                Student
              </button>

              <button
                type="button"
                className={role === "teacher" ? "selected" : ""}
                onClick={() => setRole("teacher")}
              >
                <User size={18} />
                Teacher
              </button>
            </div>

            {isRegister && (
              <div className="auth-field">
                <label htmlFor="fullName">Full Name</label>
                <div className="auth-input-wrap">
                  <User size={18} />
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button className="auth-submit" type="submit">
              {isRegister ? "Create Account" : "Log In"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-note">
            By continuing, you agree to LearnLoop's Terms and Privacy Policy.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AuthPage;
