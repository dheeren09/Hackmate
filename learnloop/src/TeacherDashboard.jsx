
import "./TeacherDashboard.css";

import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  BarChart3, Settings, LogOut, Bell, Search,
  TrendingUp, GraduationCap, AlertCircle, Clock,
  CheckCircle, Menu
} from "lucide-react";

import { useLanguage } from "./LanguageContext";

const translations = {
  en: {
    portal: "Teacher Portal", workspace: "WORKSPACE",
    dashboard: "Dashboard", students: "My Students",
    lessons: "Lessons", quizzes: "Quizzes",
    analytics: "Analytics", settings: "Settings",
    logout: "Log Out", teacherWorkspace: "TEACHER WORKSPACE",
    welcome: "WELCOME BACK!", hello: "Hello, Teacher! 👋",
    today: "Here's what's happening with your students today.",
    totalStudents: "Total Students", across: "Across all classes",
    performance: "Average Performance", classAverage: "Class average",
    completed: "Lessons Completed", byStudents: "By all students",
    attention: "Need Attention", needSupport: "Students needing support",
    classPerformance: "Class Performance",
    subjectScores: "Subject-wise average scores",
    month: "This Month", mathematics: "Mathematics",
    science: "Science", english: "English",
    social: "Social Studies", supportTitle: "Students Needing Support",
    recommended: "Recommended teacher attention", review: "Review",
    remedialNote: "Consider assigning remedial lessons to these students.",
    overview: "Student Overview", monitor: "Monitor individual student performance",
    viewAll: "View All Students", studentName: "Student Name",
    subject: "Subject", score: "Score", status: "Status",
    excellent: "Excellent", improving: "Improving", needsSupport: "Needs Support",
    recentQuiz: "Recent Quiz Activity", latest: "Latest student assessment",
    algebra: "Basic Algebra Quiz", completed34: "34 students completed",
    fundamentals: "Science Fundamentals", completed18: "18 students completed",
    remedial: "Remedial Learning", nextSteps: "Suggested next steps",
    remedialText: "Students struggling with Mathematics may benefit from additional practice in basic algebra and number operations.",
    explore: "Explore Learning Activities",
    footer: "LearnLoop · Empowering every learner, one step at a time.",
    language: "Language"
  },
  kn: {
    portal: "ಶಿಕ್ಷಕರ ಪೋರ್ಟಲ್", workspace: "ಕಾರ್ಯಸ್ಥಳ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", students: "ನನ್ನ ವಿದ್ಯಾರ್ಥಿಗಳು",
    lessons: "ಪಾಠಗಳು", quizzes: "ರಸಪ್ರಶ್ನೆಗಳು",
    analytics: "ವಿಶ್ಲೇಷಣೆ", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    logout: "ಲಾಗ್ ಔಟ್", teacherWorkspace: "ಶಿಕ್ಷಕರ ಕಾರ್ಯಸ್ಥಳ",
    welcome: "ಮತ್ತೆ ಸ್ವಾಗತ!", hello: "ನಮಸ್ಕಾರ ಶಿಕ್ಷಕರೇ! 👋",
    today: "ಇಂದು ನಿಮ್ಮ ವಿದ್ಯಾರ್ಥಿಗಳ ಕಲಿಕೆಯ ಸ್ಥಿತಿಯ ವಿವರ ಇಲ್ಲಿದೆ.",
    totalStudents: "ಒಟ್ಟು ವಿದ್ಯಾರ್ಥಿಗಳು", across: "ಎಲ್ಲಾ ತರಗತಿಗಳಲ್ಲಿ",
    performance: "ಸರಾಸರಿ ಸಾಧನೆ", classAverage: "ತರಗತಿಯ ಸರಾಸರಿ",
    completed: "ಪೂರ್ಣಗೊಂಡ ಪಾಠಗಳು", byStudents: "ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಂದ",
    attention: "ಗಮನ ಅಗತ್ಯ", needSupport: "ಸಹಾಯದ ಅಗತ್ಯವಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳು",
    classPerformance: "ತರಗತಿಯ ಸಾಧನೆ",
    subjectScores: "ವಿಷಯವಾರು ಸರಾಸರಿ ಅಂಕಗಳು",
    month: "ಈ ತಿಂಗಳು", mathematics: "ಗಣಿತ",
    science: "ವಿಜ್ಞಾನ", english: "ಇಂಗ್ಲಿಷ್",
    social: "ಸಮಾಜ ವಿಜ್ಞಾನ", supportTitle: "ಸಹಾಯದ ಅಗತ್ಯವಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳು",
    recommended: "ಶಿಕ್ಷಕರ ಗಮನಕ್ಕೆ ಶಿಫಾರಸು", review: "ಪರಿಶೀಲಿಸಿ",
    remedialNote: "ಈ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಹೆಚ್ಚುವರಿ ಪಾಠಗಳನ್ನು ನೀಡಲು ಪರಿಗಣಿಸಿ.",
    overview: "ವಿದ್ಯಾರ್ಥಿಗಳ ವಿವರ", monitor: "ವಿದ್ಯಾರ್ಥಿಗಳ ವೈಯಕ್ತಿಕ ಸಾಧನೆಯನ್ನು ಗಮನಿಸಿ",
    viewAll: "ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ನೋಡಿ", studentName: "ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು",
    subject: "ವಿಷಯ", score: "ಅಂಕ", status: "ಸ್ಥಿತಿ",
    excellent: "ಅತ್ಯುತ್ತಮ", improving: "ಸುಧಾರಿಸುತ್ತಿದ್ದಾರೆ", needsSupport: "ಸಹಾಯ ಅಗತ್ಯ",
    recentQuiz: "ಇತ್ತೀಚಿನ ಪರೀಕ್ಷಾ ಚಟುವಟಿಕೆ", latest: "ಇತ್ತೀಚಿನ ವಿದ್ಯಾರ್ಥಿ ಮೌಲ್ಯಮಾಪನ",
    algebra: "ಮೂಲ ಬೀಜಗಣಿತ ಪರೀಕ್ಷೆ", completed34: "34 ವಿದ್ಯಾರ್ಥಿಗಳು ಪೂರ್ಣಗೊಳಿಸಿದ್ದಾರೆ",
    fundamentals: "ವಿಜ್ಞಾನದ ಮೂಲಭೂತ ಅಂಶಗಳು", completed18: "18 ವಿದ್ಯಾರ್ಥಿಗಳು ಪೂರ್ಣಗೊಳಿಸಿದ್ದಾರೆ",
    remedial: "ಪರಿಹಾರಾತ್ಮಕ ಕಲಿಕೆ", nextSteps: "ಮುಂದಿನ ಹಂತಗಳ ಸಲಹೆಗಳು",
    remedialText: "ಗಣಿತದಲ್ಲಿ ಕಷ್ಟಪಡುತ್ತಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮೂಲ ಬೀಜಗಣಿತ ಮತ್ತು ಸಂಖ್ಯೆಗಳ ಮೇಲೆ ಹೆಚ್ಚುವರಿ ಅಭ್ಯಾಸ ಸಹಾಯ ಮಾಡಬಹುದು.",
    explore: "ಕಲಿಕಾ ಚಟುವಟಿಕೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    footer: "LearnLoop · ಪ್ರತಿಯೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿಯ ಕಲಿಕೆಗೆ ನಮ್ಮ ಬೆಂಬಲ.",
    language: "ಭಾಷೆ"
  },
  hi: {
    portal: "शिक्षक पोर्टल", workspace: "कार्यस्थल",
    dashboard: "डैशबोर्ड", students: "मेरे विद्यार्थी",
    lessons: "पाठ", quizzes: "प्रश्नोत्तरी",
    analytics: "विश्लेषण", settings: "सेटिंग्स",
    logout: "लॉग आउट", teacherWorkspace: "शिक्षक कार्यस्थल",
    welcome: "आपका फिर से स्वागत है!", hello: "नमस्ते शिक्षक! 👋",
    today: "आज आपके विद्यार्थियों की प्रगति का विवरण यहाँ है।",
    totalStudents: "कुल विद्यार्थी", across: "सभी कक्षाओं में",
    performance: "औसत प्रदर्शन", classAverage: "कक्षा का औसत",
    completed: "पूरे किए गए पाठ", byStudents: "सभी विद्यार्थियों द्वारा",
    attention: "ध्यान देने की आवश्यकता", needSupport: "सहायता चाहने वाले विद्यार्थी",
    classPerformance: "कक्षा का प्रदर्शन",
    subjectScores: "विषय के अनुसार औसत अंक",
    month: "इस महीने", mathematics: "गणित",
    science: "विज्ञान", english: "अंग्रेज़ी",
    social: "सामाजिक अध्ययन", supportTitle: "सहायता चाहने वाले विद्यार्थी",
    recommended: "शिक्षक के ध्यान के लिए सुझाव", review: "समीक्षा करें",
    remedialNote: "इन विद्यार्थियों को अतिरिक्त पाठ देने पर विचार करें।",
    overview: "विद्यार्थी विवरण", monitor: "प्रत्येक विद्यार्थी के प्रदर्शन पर नज़र रखें",
    viewAll: "सभी विद्यार्थी देखें", studentName: "विद्यार्थी का नाम",
    subject: "विषय", score: "अंक", status: "स्थिति",
    excellent: "उत्कृष्ट", improving: "सुधार हो रहा है", needsSupport: "सहायता चाहिए",
    recentQuiz: "हाल की प्रश्नोत्तरी गतिविधि", latest: "नवीनतम विद्यार्थी मूल्यांकन",
    algebra: "बुनियादी बीजगणित प्रश्नोत्तरी", completed34: "34 विद्यार्थियों ने पूरा किया",
    fundamentals: "विज्ञान की मूल बातें", completed18: "18 विद्यार्थियों ने पूरा किया",
    remedial: "सुधारात्मक शिक्षा", nextSteps: "अगले चरण के सुझाव",
    remedialText: "गणित में कठिनाई वाले विद्यार्थियों को बीजगणित और संख्या संचालन का अतिरिक्त अभ्यास लाभ दे सकता है।",
    explore: "सीखने की गतिविधियाँ देखें",
    footer: "LearnLoop · हर विद्यार्थी की प्रगति में हमारा साथ।",
    language: "भाषा"
  },
  ta: {
    portal: "ஆசிரியர் தளம்", workspace: "பணியிடம்",
    dashboard: "முகப்பு பலகை", students: "எனது மாணவர்கள்",
    lessons: "பாடங்கள்", quizzes: "வினாடி வினா",
    analytics: "பகுப்பாய்வு", settings: "அமைப்புகள்",
    logout: "வெளியேறு", teacherWorkspace: "ஆசிரியர் பணியிடம்",
    welcome: "மீண்டும் வரவேற்கிறோம்!", hello: "வணக்கம் ஆசிரியரே! 👋",
    today: "இன்று உங்கள் மாணவர்களின் கற்றல் நிலை இதோ.",
    totalStudents: "மொத்த மாணவர்கள்", across: "அனைத்து வகுப்புகளிலும்",
    performance: "சராசரி செயல்திறன்", classAverage: "வகுப்பு சராசரி",
    completed: "முடிக்கப்பட்ட பாடங்கள்", byStudents: "அனைத்து மாணவர்களாலும்",
    attention: "கவனம் தேவை", needSupport: "உதவி தேவைப்படும் மாணவர்கள்",
    classPerformance: "வகுப்பு செயல்திறன்",
    subjectScores: "பாடவாரியான சராசரி மதிப்பெண்கள்",
    month: "இந்த மாதம்", mathematics: "கணிதம்",
    science: "அறிவியல்", english: "ஆங்கிலம்",
    social: "சமூக அறிவியல்", supportTitle: "உதவி தேவைப்படும் மாணவர்கள்",
    recommended: "ஆசிரியர் கவனத்திற்கு பரிந்துரை", review: "மதிப்பாய்வு",
    remedialNote: "இந்த மாணவர்களுக்கு கூடுதல் பயிற்சி வழங்கவும்.",
    overview: "மாணவர் விவரங்கள்", monitor: "மாணவர்களின் தனிப்பட்ட செயல்திறனைக் கண்காணிக்கவும்",
    viewAll: "அனைத்து மாணவர்களையும் காண்க", studentName: "மாணவர் பெயர்",
    subject: "பாடம்", score: "மதிப்பெண்", status: "நிலை",
    excellent: "சிறப்பு", improving: "முன்னேற்றம்", needsSupport: "உதவி தேவை",
    recentQuiz: "சமீபத்திய வினாடி வினா", latest: "சமீபத்திய மாணவர் மதிப்பீடு",
    algebra: "அடிப்படை இயற்கணித வினாடி வினா", completed34: "34 மாணவர்கள் முடித்தனர்",
    fundamentals: "அறிவியல் அடிப்படைகள்", completed18: "18 மாணவர்கள் முடித்தனர்",
    remedial: "கூடுதல் கற்றல்", nextSteps: "அடுத்த படிகள்",
    remedialText: "கணிதத்தில் சிரமப்படும் மாணவர்களுக்கு அடிப்படை இயற்கணிதம் மற்றும் எண்களில் கூடுதல் பயிற்சி உதவும்.",
    explore: "கற்றல் செயல்பாடுகளைப் பார்க்கவும்",
    footer: "LearnLoop · ஒவ்வொரு மாணவரின் வளர்ச்சிக்கும் துணை.",
    language: "மொழி"
  },
  te: {
    portal: "ఉపాధ్యాయ పోర్టల్", workspace: "కార్యస్థలం",
    dashboard: "డాష్‌బోర్డ్", students: "నా విద్యార్థులు",
    lessons: "పాఠాలు", quizzes: "క్విజ్‌లు",
    analytics: "విశ్లేషణ", settings: "సెట్టింగ్‌లు",
    logout: "లాగ్ అవుట్", teacherWorkspace: "ఉపాధ్యాయ కార్యస్థలం",
    welcome: "మళ్లీ స్వాగతం!", hello: "నమస్కారం ఉపాధ్యాయులారా! 👋",
    today: "ఈరోజు మీ విద్యార్థుల అభ్యాస వివరాలు ఇవి.",
    totalStudents: "మొత్తం విద్యార్థులు", across: "అన్ని తరగతులలో",
    performance: "సగటు పనితీరు", classAverage: "తరగతి సగటు",
    completed: "పూర్తయిన పాఠాలు", byStudents: "విద్యార్థులందరి ద్వారా",
    attention: "శ్రద్ధ అవసరం", needSupport: "సహాయం అవసరమైన విద్యార్థులు",
    classPerformance: "తరగతి పనితీరు",
    subjectScores: "విషయాల వారీ సగటు మార్కులు",
    month: "ఈ నెల", mathematics: "గణితం",
    science: "విజ్ఞాన శాస్త్రం", english: "ఆంగ్లం",
    social: "సాంఘిక శాస్త్రం", supportTitle: "సహాయం అవసరమైన విద్యార్థులు",
    recommended: "ఉపాధ్యాయుల శ్రద్ధకు సూచన", review: "సమీక్షించండి",
    remedialNote: "ఈ విద్యార్థులకు అదనపు పాఠాలను కేటాయించండి.",
    overview: "విద్యార్థుల వివరాలు", monitor: "విద్యార్థుల వ్యక్తిగత పనితీరును గమనించండి",
    viewAll: "విద్యార్థులందరినీ చూడండి", studentName: "విద్యార్థి పేరు",
    subject: "విషయం", score: "మార్కులు", status: "స్థితి",
    excellent: "అద్భుతం", improving: "మెరుగుపడుతోంది", needsSupport: "సహాయం అవసరం",
    recentQuiz: "ఇటీవలి క్విజ్ కార్యకలాపం", latest: "తాజా విద్యార్థి అంచనా",
    algebra: "ప్రాథమిక బీజగణిత క్విజ్", completed34: "34 మంది విద్యార్థులు పూర్తి చేశారు",
    fundamentals: "విజ్ఞాన శాస్త్ర ప్రాథమిక అంశాలు", completed18: "18 మంది విద్యార్థులు పూర్తి చేశారు",
    remedial: "పునరాభ్యాసం", nextSteps: "తదుపరి సూచనలు",
    remedialText: "గణితంలో ఇబ్బంది పడుతున్న విద్యార్థులకు ప్రాథమిక బీజగణితం మరియు సంఖ్యలపై అదనపు అభ్యాసం సహాయపడుతుంది.",
    explore: "అభ్యాస కార్యకలాపాలను చూడండి",
    footer: "LearnLoop · ప్రతి విద్యార్థి అభ్యాసానికి మా తోడ్పాటు.",
    language: "భాష"
  }
};

function TeacherDashboard() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language] || translations.en;

  const students = [
    { name: "Aarav Sharma", subject: t.mathematics, score: 45, status: "needsSupport" },
    { name: "Priya Patel", subject: t.science, score: 88, status: "excellent" },
    { name: "Rohan Kumar", subject: t.mathematics, score: 62, status: "improving" },
    { name: "Ananya Rao", subject: t.english, score: 92, status: "excellent" },
    { name: "Kabir Singh", subject: t.science, score: 38, status: "needsSupport" }
  ];

  const subjects = [
    { name: t.mathematics, score: 82 },
    { name: t.science, score: 74 },
    { name: t.english, score: 68 },
    { name: t.social, score: 79 }
  ];

  return (
    <div className="teacher-dashboard">
      <aside className="teacher-sidebar">
        <div className="teacher-brand">
          <div className="teacher-brand-icon"><GraduationCap size={27} /></div>
          <div><h2>LearnLoop</h2><span>{t.portal}</span></div>
        </div>

        <div className="teacher-menu-label">{t.workspace}</div>
        <nav className="teacher-nav">
          <a className="teacher-nav-link active" href="#overview"><LayoutDashboard size={19} /> {t.dashboard}</a>
          <a className="teacher-nav-link" href="#students"><Users size={19} /> {t.students}</a>
          <a className="teacher-nav-link" href="#lessons"><BookOpen size={19} /> {t.lessons}</a>
          <a className="teacher-nav-link" href="#quizzes"><ClipboardList size={19} /> {t.quizzes}</a>
          <a className="teacher-nav-link" href="#analytics"><BarChart3 size={19} /> {t.analytics}</a>
        </nav>

        <div className="teacher-sidebar-bottom">
          <a className="teacher-nav-link" href="#settings"><Settings size={19} /> {t.settings}</a>
          <button className="teacher-logout" onClick={() => window.location.reload()}>
            <LogOut size={19} /> {t.logout}
          </button>
          <div className="teacher-profile">
            <div className="teacher-avatar">T</div>
            <div><strong>Teacher</strong><span>{t.portal}</span></div>
          </div>
        </div>
      </aside>

      <main className="teacher-main" id="overview">
        <header className="teacher-topbar">
          <div>
            <span className="teacher-eyebrow">{t.teacherWorkspace}</span>
            <h1>{t.dashboard}</h1>
          </div>
          <div className="teacher-top-actions">
            <label style={{ display: "flex", alignItems: "center", gap: "7px", color: "#111", fontWeight: 600 }}>
              {t.language}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Choose language"
                style={{
                  padding: "9px 12px",
                  borderRadius: "9px",
                  border: "1px solid #9A86AA",
                  background: "#E5DDF1",
                  color: "#111",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
              </select>
            </label>
            <button className="teacher-icon-button" aria-label="Menu"><Menu size={21} /></button>
            <button className="teacher-icon-button" aria-label="Search"><Search size={20} /></button>
            <button className="teacher-icon-button" aria-label="Notifications"><Bell size={20} /></button>
            <div className="teacher-top-avatar">T</div>
          </div>
        </header>

        <section className="teacher-welcome">
          <div>
            <span>{t.welcome}</span>
            <h2>{t.hello}</h2>
            <p>{t.today}</p>
          </div>
          <div className="teacher-welcome-icon"><GraduationCap size={65} /></div>
        </section>

        <section className="teacher-stats">
          <div className="teacher-stat-card">
            <div className="teacher-stat-icon purple"><Users size={23} /></div>
            <span>{t.totalStudents}</span><h2>120</h2><small>{t.across}</small>
          </div>
          <div className="teacher-stat-card">
            <div className="teacher-stat-icon peach"><TrendingUp size={23} /></div>
            <span>{t.performance}</span><h2>76%</h2><small>{t.classAverage}</small>
          </div>
          <div className="teacher-stat-card">
            <div className="teacher-stat-icon green"><CheckCircle size={23} /></div>
            <span>{t.completed}</span><h2>348</h2><small>{t.byStudents}</small>
          </div>
          <div className="teacher-stat-card">
            <div className="teacher-stat-icon orange"><AlertCircle size={23} /></div>
            <span>{t.attention}</span><h2>12</h2><small>{t.needSupport}</small>
          </div>
        </section>

        <section className="teacher-content-grid">
          <div className="teacher-panel teacher-performance" id="analytics">
            <div className="teacher-panel-heading">
              <div><h3>{t.classPerformance}</h3><p>{t.subjectScores}</p></div>
              <span className="teacher-period">{t.month}</span>
            </div>
            {subjects.map((subject) => (
              <div className="teacher-performance-item" key={subject.name}>
                <div><span>{subject.name}</span><strong>{subject.score}%</strong></div>
                <div className="teacher-progress"><span style={{ width: `${subject.score}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="teacher-panel teacher-attention">
            <div className="teacher-panel-heading">
              <div><h3>{t.supportTitle}</h3><p>{t.recommended}</p></div>
              <AlertCircle size={21} />
            </div>
            {[
              ["A", "Aarav Sharma", t.mathematics, "45%"],
              ["K", "Kabir Singh", t.science, "38%"],
              ["M", "Meera Das", t.english, "49%"]
            ].map(([initial, name, subject, score]) => (
              <div className="teacher-support-item" key={name}>
                <div className="teacher-student-avatar">{initial}</div>
                <div><strong>{name}</strong><span>{subject} · {score}</span></div>
                <span className="teacher-review-badge">{t.review}</span>
              </div>
            ))}
            <p className="teacher-support-note">{t.remedialNote}</p>
          </div>
        </section>

        <section className="teacher-panel teacher-students-panel" id="students">
          <div className="teacher-panel-heading">
            <div><h3>{t.overview}</h3><p>{t.monitor}</p></div>
            <button className="teacher-view-button">{t.viewAll}</button>
          </div>
          <div className="teacher-table-wrap">
            <table className="teacher-table">
              <thead>
                <tr><th>{t.studentName}</th><th>{t.subject}</th><th>{t.score}</th><th>{t.status}</th></tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.name}>
                    <td>{student.name}</td>
                    <td>{student.subject}</td>
                    <td>{student.score}%</td>
                    <td>
                      <span className={`teacher-status ${student.status === "excellent" ? "excellent" : student.status === "improving" ? "improving" : "support"}`}>
                        {t[student.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="teacher-bottom-grid">
          <div className="teacher-panel" id="quizzes">
            <div className="teacher-panel-heading">
              <div><h3>{t.recentQuiz}</h3><p>{t.latest}</p></div>
              <ClipboardList size={22} />
            </div>
            <div className="teacher-activity">
              <CheckCircle size={19} />
              <div><strong>{t.algebra}</strong><span>{t.completed34}</span></div>
              <b>82%</b>
            </div>
            <div className="teacher-activity">
              <Clock size={19} />
              <div><strong>{t.fundamentals}</strong><span>{t.completed18}</span></div>
              <b>74%</b>
            </div>
          </div>

          <div className="teacher-panel" id="lessons">
            <div className="teacher-panel-heading">
              <div><h3>{t.remedial}</h3><p>{t.nextSteps}</p></div>
              <BookOpen size={22} />
            </div>
            <p className="teacher-remedial-text">{t.remedialText}</p>
            <button className="teacher-remedial-button">{t.explore}</button>
          </div>
        </section>

        <footer className="teacher-footer">{t.footer}</footer>
      </main>
    </div>
  );
}

export default TeacherDashboard;
