import { useEffect } from "react";
import { apiRequest } from "./api";
import { useState } from "react";
import {
  GraduationCap, LayoutDashboard, BookOpen, ClipboardCheck,
  Trophy, User, Settings, LogOut, Bell, Flame, Target,
  Clock, ArrowRight, Play, Globe, Mic, Brain, CheckCircle2
} from "lucide-react";

import "./StudentDashboard.css";
import { useLanguage } from "./LanguageContext";

const translations = {
  en: {
    mainMenu: "MAIN MENU", dashboard: "Dashboard", learning: "My Learning",
    quizzes: "Quizzes", achievements: "Achievements", profile: "My Profile",
    settings: "Settings", logout: "Log Out", account: "Learning Account",
    portal: "STUDENT PORTAL", space: "My Learning Space",
    journey: "YOUR LEARNING JOURNEY", hello: "Hello, Student! 👋",
    encouragement: "Every small step takes you closer to your goals. Let's make today count!",
    progress: "Overall Progress", keepGoing: "Keep going!",
    completed: "Lessons Completed", outOf: "Out of 35 lessons",
    streak: "Learning Streak", days: "5 Days", fire: "You're on fire!",
    time: "Learning Time", hours: "12 Hrs", week: "This week",
    subjects: "YOUR SUBJECTS", continue: "Continue Learning",
    viewAll: "View All", mathematics: "Mathematics", algebra: "Algebra and Numbers",
    science: "Science", physics: "Physics and Biology",
    english: "English", grammar: "Reading and Grammar",
    performance: "YOUR PERFORMANCE", mastery: "Knowledge Mastery",
    mastered: "Mastered", progressText: "You're making great progress across your subjects. Keep practicing to improve your mastery!",
    masteredConcepts: "Mastered concepts", improve: "Concepts to improve",
    test: "TEST YOUR KNOWLEDGE", recommended: "Recommended Quiz",
    basicAlgebra: "Mathematics: Basic Algebra",
    practice: "Practice what you've learned and strengthen your understanding.",
    questions: "10 Questions", minutes: "15 Minutes", start: "Start Quiz",
    learnYourWay: "LEARN YOUR WAY", languageLearning: "Learning in Your Language",
    selected: "Your selected learning language is",
    change: "Change it anytime to learn comfortably.",
    voice: "Voice learning experience",
    mySubjects: "YOUR SUBJECTS", choose: "Choose a subject and continue your lessons.",
    completedPercent: "completed", practiceImprove: "PRACTICE AND IMPROVE",
    myQuizzes: "My Quizzes", activities: "Your recommended practice activities.",
    scienceQuiz: "Science Fundamentals", celebrate: "CELEBRATE YOUR PROGRESS",
    myAchievements: "My Achievements", champion: "Learning Champion",
    firstLessons: "Completed your first 20 lessons.",
    fiveStreak: "Five Day Streak", fiveDays: "Learned for five days in a row.",
    accountTitle: "YOUR ACCOUNT", studentAccount: "Student Account",
    backend: "Personal account details will be connected to the backend.",
    preferences: "PREFERENCES", chooseLanguage: "Choose your preferred learning language.",
    return: "Return to Dashboard", footer: "Learn at your own pace.",
    logoutTitle: "Logout", logoutText: "Account logout will be connected when authentication is integrated with the backend."
  },
  kn: {
    mainMenu: "ಮುಖ್ಯ ಮೆನು", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", learning: "ನನ್ನ ಕಲಿಕೆ",
    quizzes: "ರಸಪ್ರಶ್ನೆಗಳು", achievements: "ಸಾಧನೆಗಳು", profile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು", logout: "ಲಾಗ್ ಔಟ್", account: "ಕಲಿಕಾ ಖಾತೆ",
    portal: "ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್", space: "ನನ್ನ ಕಲಿಕಾ ಸ್ಥಳ",
    journey: "ನಿಮ್ಮ ಕಲಿಕಾ ಪ್ರಯಾಣ", hello: "ನಮಸ್ಕಾರ ವಿದ್ಯಾರ್ಥಿಯೇ! 👋",
    encouragement: "ಪ್ರತಿಯೊಂದು ಸಣ್ಣ ಹೆಜ್ಜೆಯೂ ನಿಮ್ಮ ಗುರಿಯತ್ತ ಕರೆದೊಯ್ಯುತ್ತದೆ. ಇಂದಿನ ದಿನವನ್ನು ಸಾರ್ಥಕಗೊಳಿಸೋಣ!",
    progress: "ಒಟ್ಟು ಪ್ರಗತಿ", keepGoing: "ಮುಂದುವರಿಯಿರಿ!",
    completed: "ಪೂರ್ಣಗೊಂಡ ಪಾಠಗಳು", outOf: "35 ಪಾಠಗಳಲ್ಲಿ",
    streak: "ಕಲಿಕೆಯ ನಿರಂತರತೆ", days: "5 ದಿನಗಳು", fire: "ಅದ್ಭುತವಾಗಿ ಕಲಿಯುತ್ತಿದ್ದೀರಿ!",
    time: "ಕಲಿಕೆಯ ಸಮಯ", hours: "12 ಗಂಟೆ", week: "ಈ ವಾರ",
    subjects: "ನಿಮ್ಮ ವಿಷಯಗಳು", continue: "ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ",
    viewAll: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ", mathematics: "ಗಣಿತ", algebra: "ಬೀಜಗಣಿತ ಮತ್ತು ಸಂಖ್ಯೆಗಳು",
    science: "ವಿಜ್ಞಾನ", physics: "ಭೌತಶಾಸ್ತ್ರ ಮತ್ತು ಜೀವಶಾಸ್ತ್ರ",
    english: "ಇಂಗ್ಲಿಷ್", grammar: "ಓದು ಮತ್ತು ವ್ಯಾಕರಣ",
    performance: "ನಿಮ್ಮ ಸಾಧನೆ", mastery: "ವಿಷಯಗಳಲ್ಲಿನ ಪ್ರಾವೀಣ್ಯತೆ",
    mastered: "ಕರಗತವಾಗಿದೆ", progressText: "ನೀವು ವಿಷಯಗಳಲ್ಲಿ ಉತ್ತಮ ಪ್ರಗತಿ ಸಾಧಿಸುತ್ತಿದ್ದೀರಿ. ಇನ್ನಷ್ಟು ಅಭ್ಯಾಸ ಮಾಡಿ!",
    masteredConcepts: "ಕರಗತವಾದ ವಿಷಯಗಳು", improve: "ಸುಧಾರಿಸಬೇಕಾದ ವಿಷಯಗಳು",
    test: "ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ", recommended: "ಶಿಫಾರಸು ಮಾಡಿದ ರಸಪ್ರಶ್ನೆ",
    basicAlgebra: "ಗಣಿತ: ಮೂಲ ಬೀಜಗಣಿತ",
    practice: "ಕಲಿತ ವಿಷಯಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ತಿಳುವಳಿಕೆಯನ್ನು ಹೆಚ್ಚಿಸಿಕೊಳ್ಳಿ.",
    questions: "10 ಪ್ರಶ್ನೆಗಳು", minutes: "15 ನಿಮಿಷಗಳು", start: "ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ",
    learnYourWay: "ನಿಮ್ಮ ರೀತಿಯಲ್ಲಿ ಕಲಿಯಿರಿ", languageLearning: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕಲಿಕೆ",
    selected: "ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ ಕಲಿಕಾ ಭಾಷೆ",
    change: "ಆರಾಮವಾಗಿ ಕಲಿಯಲು ಯಾವಾಗ ಬೇಕಾದರೂ ಭಾಷೆ ಬದಲಾಯಿಸಿ.",
    voice: "ಧ್ವನಿ ಮೂಲಕ ಕಲಿಕೆ",
    mySubjects: "ನನ್ನ ವಿಷಯಗಳು", choose: "ವಿಷಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಪಾಠಗಳನ್ನು ಮುಂದುವರಿಸಿ.",
    completedPercent: "ಪೂರ್ಣಗೊಂಡಿದೆ", practiceImprove: "ಅಭ್ಯಾಸ ಮಾಡಿ ಸುಧಾರಿಸಿ",
    myQuizzes: "ನನ್ನ ರಸಪ್ರಶ್ನೆಗಳು", activities: "ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಿದ ಅಭ್ಯಾಸಗಳು.",
    scienceQuiz: "ವಿಜ್ಞಾನದ ಮೂಲಭೂತ ಅಂಶಗಳು", celebrate: "ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಆಚರಿಸಿ",
    myAchievements: "ನನ್ನ ಸಾಧನೆಗಳು", champion: "ಕಲಿಕಾ ಚಾಂಪಿಯನ್",
    firstLessons: "ನಿಮ್ಮ ಮೊದಲ 20 ಪಾಠಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.",
    fiveStreak: "ಐದು ದಿನಗಳ ನಿರಂತರ ಕಲಿಕೆ", fiveDays: "ಸತತ ಐದು ದಿನ ಕಲಿತಿದ್ದೀರಿ.",
    accountTitle: "ನಿಮ್ಮ ಖಾತೆ", studentAccount: "ವಿದ್ಯಾರ್ಥಿ ಖಾತೆ",
    backend: "ವೈಯಕ್ತಿಕ ಖಾತೆಯ ವಿವರಗಳನ್ನು ಬ್ಯಾಕೆಂಡ್‌ಗೆ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತದೆ.",
    preferences: "ಆದ್ಯತೆಗಳು", chooseLanguage: "ನಿಮ್ಮ ಇಷ್ಟದ ಕಲಿಕಾ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    return: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ", footer: "ನಿಮ್ಮ ವೇಗದಲ್ಲಿ ಕಲಿಯಿರಿ.",
    logoutTitle: "ಲಾಗ್ ಔಟ್", logoutText: "ಬ್ಯಾಕೆಂಡ್ ಸಂಪರ್ಕಿಸಿದ ನಂತರ ಖಾತೆಯಿಂದ ನಿರ್ಗಮಿಸುವ ವ್ಯವಸ್ಥೆ ಸಕ್ರಿಯಗೊಳ್ಳುತ್ತದೆ."
  },
  hi: {
    mainMenu: "मुख्य मेनू", dashboard: "डैशबोर्ड", learning: "मेरी पढ़ाई",
    quizzes: "प्रश्नोत्तरी", achievements: "उपलब्धियाँ", profile: "मेरी प्रोफ़ाइल",
    settings: "सेटिंग्स", logout: "लॉग आउट", account: "शिक्षण खाता",
    portal: "विद्यार्थी पोर्टल", space: "मेरा शिक्षण स्थान",
    journey: "आपकी सीखने की यात्रा", hello: "नमस्ते विद्यार्थी! 👋",
    encouragement: "हर छोटा कदम आपको आपके लक्ष्य के करीब ले जाता है। आज का दिन शानदार बनाएं!",
    progress: "कुल प्रगति", keepGoing: "आगे बढ़ते रहें!",
    completed: "पूरे किए गए पाठ", outOf: "35 पाठों में से",
    streak: "सीखने की निरंतरता", days: "5 दिन", fire: "बहुत बढ़िया!",
    time: "सीखने का समय", hours: "12 घंटे", week: "इस सप्ताह",
    subjects: "आपके विषय", continue: "सीखना जारी रखें",
    viewAll: "सभी देखें", mathematics: "गणित", algebra: "बीजगणित और संख्याएँ",
    science: "विज्ञान", physics: "भौतिकी और जीवविज्ञान",
    english: "अंग्रेज़ी", grammar: "पढ़ना और व्याकरण",
    performance: "आपका प्रदर्शन", mastery: "ज्ञान में महारत",
    mastered: "सीखा गया", progressText: "आप अपने विषयों में अच्छी प्रगति कर रहे हैं। अभ्यास जारी रखें!",
    masteredConcepts: "सीखी गई अवधारणाएँ", improve: "सुधार के विषय",
    test: "अपने ज्ञान की जाँच करें", recommended: "अनुशंसित प्रश्नोत्तरी",
    basicAlgebra: "गणित: बुनियादी बीजगणित",
    practice: "सीखी गई बातों का अभ्यास करें और अपनी समझ बढ़ाएँ।",
    questions: "10 प्रश्न", minutes: "15 मिनट", start: "प्रश्नोत्तरी शुरू करें",
    learnYourWay: "अपने तरीके से सीखें", languageLearning: "अपनी भाषा में सीखें",
    selected: "आपकी चुनी हुई सीखने की भाषा है",
    change: "आराम से सीखने के लिए कभी भी भाषा बदलें।",
    voice: "आवाज़ के माध्यम से सीखना",
    mySubjects: "मेरे विषय", choose: "विषय चुनें और अपने पाठ जारी रखें।",
    completedPercent: "पूरा हुआ", practiceImprove: "अभ्यास करें और सुधारें",
    myQuizzes: "मेरी प्रश्नोत्तरी", activities: "आपके लिए सुझाई गई अभ्यास गतिविधियाँ।",
    scienceQuiz: "विज्ञान की मूल बातें", celebrate: "अपनी प्रगति का जश्न मनाएँ",
    myAchievements: "मेरी उपलब्धियाँ", champion: "शिक्षण चैंपियन",
    firstLessons: "आपने अपने पहले 20 पाठ पूरे किए।",
    fiveStreak: "पाँच दिन की निरंतरता", fiveDays: "लगातार पाँच दिनों तक सीखा।",
    accountTitle: "आपका खाता", studentAccount: "विद्यार्थी खाता",
    backend: "व्यक्तिगत खाते का विवरण बैकएंड से जोड़ा जाएगा।",
    preferences: "प्राथमिकताएँ", chooseLanguage: "अपनी पसंदीदा सीखने की भाषा चुनें।",
    return: "डैशबोर्ड पर लौटें", footer: "अपनी गति से सीखें।",
    logoutTitle: "लॉग आउट", logoutText: "बैकएंड प्रमाणीकरण जुड़ने पर लॉगआउट सुविधा सक्रिय होगी।"
  },
  ta: {
    mainMenu: "முக்கிய மெனு", dashboard: "முகப்பு பலகை", learning: "எனது கற்றல்",
    quizzes: "வினாடி வினா", achievements: "சாதனைகள்", profile: "எனது சுயவிவரம்",
    settings: "அமைப்புகள்", logout: "வெளியேறு", account: "கற்றல் கணக்கு",
    portal: "மாணவர் தளம்", space: "எனது கற்றல் இடம்",
    journey: "உங்கள் கற்றல் பயணம்", hello: "வணக்கம் மாணவரே! 👋",
    encouragement: "ஒவ்வொரு சிறிய அடியும் உங்கள் இலக்கை நெருங்கச் செய்கிறது. இன்றைய நாளை சிறப்பாக்குவோம்!",
    progress: "மொத்த முன்னேற்றம்", keepGoing: "தொடர்ந்து முயற்சி செய்யுங்கள்!",
    completed: "முடிக்கப்பட்ட பாடங்கள்", outOf: "35 பாடங்களில்",
    streak: "தொடர் கற்றல்", days: "5 நாட்கள்", fire: "அருமையாக கற்கிறீர்கள்!",
    time: "கற்றல் நேரம்", hours: "12 மணி", week: "இந்த வாரம்",
    subjects: "உங்கள் பாடங்கள்", continue: "கற்றலைத் தொடரவும்",
    viewAll: "அனைத்தையும் காண்க", mathematics: "கணிதம்", algebra: "இயற்கணிதம் மற்றும் எண்கள்",
    science: "அறிவியல்", physics: "இயற்பியல் மற்றும் உயிரியல்",
    english: "ஆங்கிலம்", grammar: "வாசிப்பு மற்றும் இலக்கணம்",
    performance: "உங்கள் செயல்திறன்", mastery: "அறிவு திறன்",
    mastered: "தேர்ச்சி", progressText: "உங்கள் பாடங்களில் நல்ல முன்னேற்றம் அடைகிறீர்கள். தொடர்ந்து பயிற்சி செய்யுங்கள்!",
    masteredConcepts: "தேர்ச்சி பெற்ற கருத்துகள்", improve: "மேம்படுத்த வேண்டியவை",
    test: "உங்கள் அறிவைச் சோதிக்கவும்", recommended: "பரிந்துரைக்கப்பட்ட வினாடி வினா",
    basicAlgebra: "கணிதம்: அடிப்படை இயற்கணிதம்",
    practice: "கற்றவற்றைப் பயிற்சி செய்து உங்கள் புரிதலை மேம்படுத்துங்கள்.",
    questions: "10 கேள்விகள்", minutes: "15 நிமிடங்கள்", start: "வினாடி வினாவைத் தொடங்கவும்",
    learnYourWay: "உங்கள் வழியில் கற்கவும்", languageLearning: "உங்கள் மொழியில் கற்றல்",
    selected: "நீங்கள் தேர்ந்தெடுத்த கற்றல் மொழி",
    change: "வசதியாகக் கற்க எப்போது வேண்டுமானாலும் மொழியை மாற்றலாம்.",
    voice: "குரல் வழிக் கற்றல்",
    mySubjects: "எனது பாடங்கள்", choose: "ஒரு பாடத்தைத் தேர்ந்தெடுத்து பாடங்களைத் தொடரவும்.",
    completedPercent: "முடிந்தது", practiceImprove: "பயிற்சி செய்து மேம்படுத்துங்கள்",
    myQuizzes: "எனது வினாடி வினா", activities: "உங்களுக்கான பயிற்சிகள்.",
    scienceQuiz: "அறிவியல் அடிப்படைகள்", celebrate: "உங்கள் முன்னேற்றத்தைக் கொண்டாடுங்கள்",
    myAchievements: "எனது சாதனைகள்", champion: "கற்றல் வெற்றியாளர்",
    firstLessons: "உங்கள் முதல் 20 பாடங்களை முடித்துவிட்டீர்கள்.",
    fiveStreak: "ஐந்து நாள் தொடர்", fiveDays: "தொடர்ந்து ஐந்து நாட்கள் கற்றீர்கள்.",
    accountTitle: "உங்கள் கணக்கு", studentAccount: "மாணவர் கணக்கு",
    backend: "தனிப்பட்ட கணக்கு விவரங்கள் பின்னணியுடன் இணைக்கப்படும்.",
    preferences: "விருப்பங்கள்", chooseLanguage: "உங்களுக்கு விருப்பமான கற்றல் மொழியைத் தேர்ந்தெடுக்கவும்.",
    return: "முகப்பு பலகைக்குத் திரும்பவும்", footer: "உங்கள் வேகத்தில் கற்கவும்.",
    logoutTitle: "வெளியேறு", logoutText: "பின்னணி அங்கீகாரம் இணைக்கப்பட்டதும் வெளியேறும் வசதி செயல்படும்."
  },
  te: {
    mainMenu: "ప్రధాన మెను", dashboard: "డాష్‌బోర్డ్", learning: "నా అభ్యాసం",
    quizzes: "క్విజ్‌లు", achievements: "విజయాలు", profile: "నా ప్రొఫైల్",
    settings: "సెట్టింగ్‌లు", logout: "లాగ్ అవుట్", account: "అభ్యాస ఖాతా",
    portal: "విద్యార్థి పోర్టల్", space: "నా అభ్యాస స్థలం",
    journey: "మీ అభ్యాస ప్రయాణం", hello: "నమస్కారం విద్యార్థి! 👋",
    encouragement: "ప్రతి చిన్న అడుగు మీ లక్ష్యానికి దగ్గర చేస్తుంది. ఈ రోజును విజయవంతం చేద్దాం!",
    progress: "మొత్తం పురోగతి", keepGoing: "కొనసాగించండి!",
    completed: "పూర్తయిన పాఠాలు", outOf: "35 పాఠాలలో",
    streak: "అభ్యాస పరంపర", days: "5 రోజులు", fire: "చాలా బాగా చేస్తున్నారు!",
    time: "అభ్యాస సమయం", hours: "12 గంటలు", week: "ఈ వారం",
    subjects: "మీ విషయాలు", continue: "అభ్యాసం కొనసాగించండి",
    viewAll: "అన్నీ చూడండి", mathematics: "గణితం", algebra: "బీజగణితం మరియు సంఖ్యలు",
    science: "విజ్ఞాన శాస్త్రం", physics: "భౌతిక శాస్త్రం మరియు జీవశాస్త్రం",
    english: "ఆంగ్లం", grammar: "చదవడం మరియు వ్యాకరణం",
    performance: "మీ పనితీరు", mastery: "విషయ పరిజ్ఞానం",
    mastered: "నేర్చుకున్నారు", progressText: "మీరు విషయాలలో మంచి పురోగతి సాధిస్తున్నారు. సాధన కొనసాగించండి!",
    masteredConcepts: "నేర్చుకున్న అంశాలు", improve: "మెరుగుపరచాల్సిన అంశాలు",
    test: "మీ జ్ఞానాన్ని పరీక్షించుకోండి", recommended: "సిఫార్సు చేసిన క్విజ్",
    basicAlgebra: "గణితం: ప్రాథమిక బీజగణితం",
    practice: "మీరు నేర్చుకున్న వాటిని సాధన చేసి అవగాహన పెంచుకోండి.",
    questions: "10 ప్రశ్నలు", minutes: "15 నిమిషాలు", start: "క్విజ్ ప్రారంభించండి",
    learnYourWay: "మీకు నచ్చిన విధంగా నేర్చుకోండి", languageLearning: "మీ భాషలో అభ్యాసం",
    selected: "మీరు ఎంచుకున్న అభ్యాస భాష",
    change: "సౌకర్యంగా నేర్చుకోవడానికి ఎప్పుడైనా భాషను మార్చవచ్చు.",
    voice: "వాయిస్ ద్వారా అభ్యాసం",
    mySubjects: "నా విషయాలు", choose: "ఒక విషయాన్ని ఎంచుకుని పాఠాలను కొనసాగించండి.",
    completedPercent: "పూర్తయింది", practiceImprove: "సాధన చేసి మెరుగుపరచండి",
    myQuizzes: "నా క్విజ్‌లు", activities: "మీ కోసం సిఫార్సు చేసిన సాధనలు.",
    scienceQuiz: "విజ్ఞాన శాస్త్ర ప్రాథమిక అంశాలు", celebrate: "మీ పురోగతిని జరుపుకోండి",
    myAchievements: "నా విజయాలు", champion: "అభ్యాస విజేత",
    firstLessons: "మీ మొదటి 20 పాఠాలను పూర్తి చేశారు.",
    fiveStreak: "ఐదు రోజుల పరంపర", fiveDays: "వరుసగా ఐదు రోజులు నేర్చుకున్నారు.",
    accountTitle: "మీ ఖాతా", studentAccount: "విద్యార్థి ఖాతా",
    backend: "వ్యక్తిగత ఖాతా వివరాలు బ్యాకెండ్‌కు అనుసంధానించబడతాయి.",
    preferences: "ప్రాధాన్యతలు", chooseLanguage: "మీకు నచ్చిన అభ్యాస భాషను ఎంచుకోండి.",
    return: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి", footer: "మీ వేగంతో నేర్చుకోండి.",
    logoutTitle: "లాగ్ అవుట్", logoutText: "బ్యాకెండ్ ధృవీకరణ అనుసంధానించినప్పుడు లాగ్ అవుట్ సదుపాయం అందుబాటులోకి వస్తుంది."
  }
};

const languageNames = {
  en: "English",
  kn: "ಕನ್ನಡ",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు"
};

function StudentDashboard({ onLogout }) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language] || translations.en;

  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [remediation, setRemediation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const languageNames = {
    en: "English",
    kn: "Kannada",
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
  };

  const apiLanguage = languageNames[language] || "English";

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [profile, subjectData] = await Promise.all([
        apiRequest("/me"),
        apiRequest("/subjects"),
      ]);

      setUser(profile);
      setSubjects(subjectData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function selectSubject(subjectId) {
    setSelectedSubject(String(subjectId));
    setSelectedTopic("");
    setTopics([]);
    setQuiz(null);
    setResult(null);
    setError("");

    try {
      setLoading(true);
      const data = await apiRequest(`/subjects/${subjectId}/topics`);
      setTopics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function startQuiz() {
    if (!selectedTopic) {
      setError("Please select a topic first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setQuiz(null);
      setResult(null);
      setAnswers({});
      setRemediation("");

      const data = await apiRequest("/quizzes/start", {
        method: "POST",
        body: JSON.stringify({
          topic_id: Number(selectedTopic),
          language: apiLanguage,
        }),
      });

      setQuiz(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function submitQuiz() {
    if (!quiz) return;

    const unanswered = quiz.questions.filter(
      (question) => !answers[question.id]?.selected_answer
    );

    if (unanswered.length > 0) {
      setError(`Please answer all ${quiz.questions.length} questions.`);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        answers: quiz.questions.map((question) => ({
          question_id: question.id,
          selected_answer: answers[question.id].selected_answer,
          confidence: answers[question.id].confidence || "unsure",
        })),
      };

      const data = await apiRequest(
        `/quizzes/${quiz.attempt_id}/submit`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      setResult(data);
      setQuiz(null);

      // Ask the backend for a remedial module after assessment.
      try {
        const remedial = await apiRequest(
          `/topics/${selectedTopic}/remediation`
        );

        setRemediation(
          typeof remedial === "string"
            ? remedial
            : remedial.remediation || remedial.content ||
              remedial.message || JSON.stringify(remedial, null, 2)
        );
      } catch (remedialError) {
        setRemediation(
          "Your quiz has been evaluated. Remedial content could not be loaded: " +
          remedialError.message
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await apiRequest("/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    }

    if (onLogout) onLogout();
  }

  const languageSelector = (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label="Select learning language"
    >
      {Object.entries({
        en: "English",
        kn: "ಕನ್ನಡ",
        hi: "हिन्दी",
        ta: "தமிழ்",
        te: "తెలుగు",
      }).map(([code, name]) => (
        <option value={code} key={code}>{name}</option>
      ))}
    </select>
  );

  const selectedSubjectName =
    subjects.find((s) => String(s.id) === selectedSubject)?.name || "";

  const selectedTopicName =
    topics.find((topic) => String(topic.id) === selectedTopic)?.name || "";

  return (
    <div className="student-dashboard">
      <aside className="student-sidebar">
        <div className="student-brand">
          <div className="student-brand-icon">
            <GraduationCap size={25} />
          </div>
          <span>LearnLoop</span>
        </div>

        <p className="sidebar-label">{t.mainMenu}</p>

        <nav className="student-nav">
          {[
            ["Dashboard", t.dashboard, LayoutDashboard],
            ["My Learning", t.learning, BookOpen],
            ["Quizzes", t.quizzes, ClipboardCheck],
            ["Achievements", t.achievements, Trophy],
            ["My Profile", t.profile, User],
          ].map(([name, label, Icon]) => (
            <button
              key={name}
              className={
                activeMenu === name
                  ? "student-nav-item active"
                  : "student-nav-item"
              }
              onClick={() => setActiveMenu(name)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="student-nav-item"
            onClick={() => setActiveMenu("Settings")}
          >
            <Settings size={19} />
            <span>{t.settings}</span>
          </button>

          <button className="student-nav-item" onClick={logout}>
            <LogOut size={19} />
            <span>{t.logout}</span>
          </button>

          <div className="sidebar-user">
            <div className="avatar">
              {(user?.name || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.name || "Student"}</strong>
              <span>{t.account}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="student-main">
        <header className="student-topbar">
          <div>
            <span className="portal-label">{t.portal}</span>
            <h2>{t.space}</h2>
          </div>

          <div className="topbar-actions">
            {languageSelector}
            <div className="topbar-avatar">
              {(user?.name || "S").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px 16px",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {error}
            <button
              onClick={() => setError("")}
              style={{ float: "right", cursor: "pointer" }}
            >
              ×
            </button>
          </div>
        )}

        {loading && (
          <p style={{ padding: 12 }}>Loading... Please wait.</p>
        )}

        {activeMenu === "Dashboard" && (
          <>
            <section className="student-welcome">
              <div>
                <span className="welcome-date">{t.journey}</span>
                <h1>Hello, {user?.name || "Student"}! 👋</h1>
                <p>{t.encouragement}</p>
              </div>
              <div className="welcome-decoration">
                <GraduationCap size={65} />
              </div>
            </section>

            <section className="student-content-grid">
              <div className="student-panel subjects-panel">
                <div className="panel-heading">
                  <div>
                    <span className="panel-eyebrow">{t.subjects}</span>
                    <h2>{t.continue}</h2>
                  </div>
                </div>

                {subjects.length === 0 && !loading && (
                  <p>No subjects are available yet.</p>
                )}

                <div className="subject-list">
                  {subjects.map((subject) => (
                    <div className="student-subject" key={subject.id}>
                      <div className="student-subject-icon math">
                        <BookOpen size={22} />
                      </div>
                      <div className="student-subject-details">
                        <strong>{subject.name}</strong>
                        <span>Choose this subject to see its topics.</span>
                      </div>
                      <button
                        className="subject-play"
                        onClick={() => {
                          selectSubject(subject.id);
                          setActiveMenu("Quizzes");
                        }}
                        aria-label={`Select ${subject.name}`}
                      >
                        <Play size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="student-panel language-panel">
                <div className="language-icon"><Globe size={25} /></div>
                <span className="panel-eyebrow">{t.learnYourWay}</span>
                <h2>{t.languageLearning}</h2>
                <p>
                  {t.selected} <strong>{apiLanguage}</strong>. {t.change}
                </p>
                <div className="voice-learning">
                  <Mic size={19} />
                  <span>{t.voice}</span>
                  <CheckCircle2 size={17} />
                </div>
              </div>
            </section>

            <section className="student-panel quiz-panel">
              <span className="panel-eyebrow">{t.test}</span>
              <h2>Start an AI-powered assessment</h2>
              <p>Select a subject and topic to generate your quiz.</p>
              <button
                className="start-quiz-button"
                onClick={() => setActiveMenu("Quizzes")}
              >
                Go to Quizzes <ArrowRight size={17} />
              </button>
            </section>
          </>
        )}

        {activeMenu === "Quizzes" && (
          <section className="student-panel alternate-panel">
            <span className="panel-eyebrow">{t.practiceImprove}</span>
            <h2>{t.myQuizzes}</h2>
            <p>Select a subject, choose a topic, and start your AI-generated quiz.</p>

            <div style={{ display: "grid", gap: 14, maxWidth: 520 }}>
              <label>
                **Subject**
                <select
                  value={selectedSubject}
                  onChange={(e) => selectSubject(e.target.value)}
                  style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                **Topic**
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={!topics.length}
                  style={{ display: "block", width: "100%", padding: 12, marginTop: 6 }}
                >
                  <option value="">Select a topic</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </label>

              <button
                className="start-quiz-button"
                onClick={startQuiz}
                disabled={loading || !selectedTopic}
              >
                Generate AI Quiz <ArrowRight size={17} />
              </button>
            </div>

            {quiz && (
              <div style={{ marginTop: 28 }}>
                <h2>{quiz.topic || selectedTopicName}</h2>
                <p>Answer every question before submitting.</p>

                {quiz.questions.map((question, index) => (
                  <div
                    key={question.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 10,
                      padding: 18,
                      marginBottom: 18,
                    }}
                  >
                    <h3>{index + 1}. {question.question}</h3>

                    {["A", "B", "C", "D"].map((letter) => (
                      <label
                        key={letter}
                        style={{
                          display: "block",
                          padding: 8,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={
                            answers[question.id]?.selected_answer === letter
                          }
                          onChange={() =>
                            setAnswers((previous) => ({
                              ...previous,
                              [question.id]: {
                                ...previous[question.id],
                                selected_answer: letter,
                              },
                            }))
                          }
                        />
                        {" "}
                        {letter}. {question[`option_${letter.toLowerCase()}`]}
                      </label>
                    ))}

                    <label style={{ display: "block", marginTop: 12 }}>
                      How confident are you?
                      <select
                        value={answers[question.id]?.confidence || "unsure"}
                        onChange={(e) =>
                          setAnswers((previous) => ({
                            ...previous,
                            [question.id]: {
                              ...previous[question.id],
                              confidence: e.target.value,
                            },
                          }))
                        }
                        style={{ display: "block", padding: 8, marginTop: 6 }}
                      >
                        <option value="confident">Confident</option>
                        <option value="unsure">Unsure</option>
                        <option value="guessed">I guessed</option>
                      </select>
                    </label>
                  </div>
                ))}

                <button
                  className="start-quiz-button"
                  onClick={submitQuiz}
                  disabled={loading}
                >
                  Submit Quiz
                </button>
              </div>
            )}

            {result && (
              <div style={{ marginTop: 28 }}>
                <h2>Quiz Results</h2>
                <h1>{result.score} / {result.total}</h1>
                <h3>{result.percentage}%</h3>
                <p>
                  {result.message || "Your assessment has been evaluated."}
                </p>

                {result.results?.map((item, index) => (
                  <div
                    key={item.question_id}
                    style={{
                      padding: 12,
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <strong>
                      Question {index + 1}: {item.correct ? "Correct" : "Incorrect"}
                    </strong>
                    <p>{item.explanation}</p>
                  </div>
                ))}

                <h2 style={{ marginTop: 24 }}>Personalised Remedial Learning</h2>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                  }}
                >
                  {remediation || "Preparing your remedial learning module..."}
                </pre>

                <button
                  className="start-quiz-button"
                  onClick={() => {
                    setResult(null);
                    setQuiz(null);
                    setRemediation("");
                    setAnswers({});
                  }}
                >
                  Try Another Quiz
                </button>
              </div>
            )}
          </section>
        )}

        {activeMenu === "My Learning" && (
          <section className="student-panel alternate-panel">
            <h2>{t.learning}</h2>
            <p>Choose a subject to explore its available topics and quizzes.</p>
            {subjects.map((subject) => (
              <div className="alternate-row" key={subject.id}>
                <strong>{subject.name}</strong>
                <button onClick={() => {
                  selectSubject(subject.id);
                  setActiveMenu("Quizzes");
                }}>
                  Explore topics
                </button>
              </div>
            ))}
          </section>
        )}

        {activeMenu === "Achievements" && (
          <section className="student-panel alternate-panel">
            <h2>{t.myAchievements}</h2>
            <p>Complete quizzes and improve your topic mastery to build achievements.</p>
          </section>
        )}

        {activeMenu === "My Profile" && (
          <section className="student-panel alternate-panel">
            <h2>{t.profile}</h2>
            {user && (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Grade:</strong> {user.grade}</p>
                <p><strong>Language:</strong> {user.language}</p>
              </>
            )}
          </section>
        )}

        {activeMenu === "Settings" && (
          <section className="student-panel alternate-panel">
            <h2>{t.settings}</h2>
            <p>{t.chooseLanguage}</p>
            {languageSelector}
          </section>
        )}

        <footer className="student-footer">
          © 2026 LearnLoop · {t.footer}
        </footer>
      </main>
    </div>
  );
}

export default StudentDashboard;

