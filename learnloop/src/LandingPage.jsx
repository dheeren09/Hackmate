
import {
    ArrowRight,
    BookOpen,
    Brain,
    Globe2,
    Mic,
    ChartNoAxesCombined,
    GraduationCap,
    CheckCircle2
  } from "lucide-react";
  
  import "./LandingPage.css";
  
  function LandingPage({ onLogin, onGetStarted }) {
    return (
      <div className="landing-page">
  
        {/* Navigation */}
        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">
              <GraduationCap size={25} />
            </div>
            <span>LearnLoop</span>
          </div>
  
          <div className="nav-links">
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </div>
  
          <div className="nav-actions">
            <button
              className="nav-login"
              onClick={onLogin}
              type="button"
            >
              Log In
            </button>
  
            <button
              className="nav-cta"
              onClick={onGetStarted}
              type="button"
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </nav>
  
        {/* Hero Section */}
        <section className="hero" id="home">
  
          <div className="hero-content">
            <div className="hero-label">
              <span></span>
              AI-POWERED ADAPTIVE LEARNING
            </div>
  
            <h1>
              Every Student Deserves
              <span> A Learning Path That Works.</span>
            </h1>
  
            <p className="hero-description">
              Personalized education, multilingual learning and
              intelligent support that helps every student learn
              at their own pace.
            </p>
  
            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={onGetStarted}
                type="button"
              >
                Explore LearnLoop <ArrowRight size={18} />
              </button>
  
              <button
                className="secondary-btn"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({
                    behavior: "smooth"
                  });
                }}
                type="button"
              >
                Discover Features
              </button>
            </div>
  
            <div className="hero-benefits">
              <span>
                <CheckCircle2 size={16} /> Personalized Learning
              </span>
              <span>
                <CheckCircle2 size={16} /> Multilingual Support
              </span>
            </div>
          </div>
  
          {/* Learning Illustration */}
          <div className="hero-visual">
            <div className="visual-circle"></div>
  
            <div className="learning-card">
              <div className="learning-card-header">
                <div>
                  <span className="small-label">
                    YOUR LEARNING JOURNEY
                  </span>
                  <h3>Learning Progress</h3>
                </div>
                <div className="progress-icon">
                  <GraduationCap size={22} />
                </div>
              </div>
  
              <div className="progress-number">78%</div>
  
              <div className="progress-track">
                <div className="progress-fill"></div>
              </div>
  
              <p className="progress-caption">
                Great progress! Keep learning.
              </p>
  
              <div className="learning-divider"></div>
  
              <div className="subject-row">
                <div className="subject-icon blue">
                  <BookOpen size={20} />
                </div>
                <div className="subject-info">
                  <strong>Mathematics</strong>
                  <span>Concept mastery</span>
                </div>
                <span className="subject-score">85%</span>
              </div>
  
              <div className="subject-row">
                <div className="subject-icon green">
                  <Brain size={20} />
                </div>
                <div className="subject-info">
                  <strong>Science</strong>
                  <span>Concept mastery</span>
                </div>
                <span className="subject-score">72%</span>
              </div>
            </div>
  
            <div className="floating-tag language-tag">
              <Globe2 size={18} />
              Learn in your language
            </div>
  
            <div className="floating-tag ai-tag">
              <Brain size={18} />
              AI-powered learning
            </div>
          </div>
        </section>
  
        {/* Features */}
        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-label">WHY LEARNLOOP</span>
            <h2>Learning Designed Around Every Student</h2>
            <p>
              Technology that makes quality education more accessible,
              personal and effective.
            </p>
          </div>
  
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-blue">
                <Brain size={25} />
              </div>
              <h3>Adaptive Learning</h3>
              <p>
                Lessons and assessments adjust to each student's
                knowledge and learning pace.
              </p>
            </div>
  
            <div className="feature-card">
              <div className="feature-icon feature-green">
                <Globe2 size={25} />
              </div>
              <h3>Multilingual Education</h3>
              <p>
                Learn comfortably with support for multiple
                Indian languages.
              </p>
            </div>
  
            <div className="feature-card">
              <div className="feature-icon feature-orange">
                <Mic size={25} />
              </div>
              <h3>Voice-First Learning</h3>
              <p>
                Make learning accessible through voice interaction
                and spoken explanations.
              </p>
            </div>
  
            <div className="feature-card">
              <div className="feature-icon feature-purple">
                <ChartNoAxesCombined size={25} />
              </div>
              <h3>Teacher Insights</h3>
              <p>
                Help teachers identify learning gaps and
                provide targeted support.
              </p>
            </div>
          </div>
        </section>
  
        {/* How it works */}
        <section className="how-section" id="how-it-works">
          <div className="section-heading">
            <span className="section-label">HOW IT WORKS</span>
            <h2>A Smarter Way to Learn</h2>
          </div>
  
          <div className="steps-grid">
            <div className="step">
              <span>01</span>
              <h3>Assess</h3>
              <p>Understand each student's current knowledge.</p>
            </div>
  
            <div className="step">
              <span>02</span>
              <h3>Adapt</h3>
              <p>Identify learning gaps and personalize lessons.</p>
            </div>
  
            <div className="step">
              <span>03</span>
              <h3>Learn</h3>
              <p>Explore explanations in a preferred language.</p>
            </div>
  
            <div className="step">
              <span>04</span>
              <h3>Improve</h3>
              <p>Track mastery and celebrate progress.</p>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="landing-footer" id="about">
          <div className="brand footer-brand">
            <GraduationCap size={25} />
            <span>LearnLoop</span>
          </div>
  
          <p>Making quality learning accessible to everyone.</p>
  
          <span className="copyright">
            © 2026 LearnLoop. All rights reserved.
          </span>
        </footer>
  
      </div>
    );
  }
  
  export default LandingPage;  