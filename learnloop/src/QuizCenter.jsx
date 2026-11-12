import { useState } from "react";
import { saveQuizResult } from "./quizStorage";
import { useLanguage } from "./LanguageContext";
import "./QuizCenter.css";

const quizzes = {
  Mathematics: [
    {
      question: "What is the value of x if x + 5 = 12?",
      options: ["5", "7", "8", "12"],
      answer: 1,
      topic: "Basic algebra"
    },
    {
      question: "What is 8 × 7?",
      options: ["48", "54", "56", "64"],
      answer: 2,
      topic: "Multiplication"
    },
    {
      question: "What is half of 50?",
      options: ["20", "25", "30", "35"],
      answer: 1,
      topic: "Fractions"
    },
    {
      question: "Which number is a prime number?",
      options: ["9", "15", "17", "21"],
      answer: 2,
      topic: "Prime numbers"
    },
    {
      question: "What is 100 divided by 4?",
      options: ["20", "25", "40", "50"],
      answer: 1,
      topic: "Division"
    }
  ],
  Science: [
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Venus", "Jupiter"],
      answer: 1,
      topic: "Planets"
    },
    {
      question: "What gas do plants absorb?",
      options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
      answer: 2,
      topic: "Photosynthesis"
    },
    {
      question: "What is the boiling point of water at sea level?",
      options: ["50°C", "75°C", "100°C", "150°C"],
      answer: 2,
      topic: "States of matter"
    },
    {
      question: "Which organ pumps blood around the body?",
      options: ["Brain", "Lungs", "Heart", "Kidney"],
      answer: 2,
      topic: "Human body"
    },
    {
      question: "Which is the main source of energy for Earth?",
      options: ["Moon", "Sun", "Wind", "Ocean"],
      answer: 1,
      topic: "Energy"
    }
  ]
};

const words = {
  en: {
    title: "Knowledge Check",
    subtitle: "Choose a subject and test what you have learned.",
    name: "Student name",
    namePlaceholder: "Enter your name",
    subject: "Choose subject",
    start: "Start quiz",
    question: "Question",
    next: "Next question",
    submit: "Submit answers",
    result: "Your quiz result",
    correct: "Correct answers",
    wrong: "Incorrect answers",
    score: "Your score",
    retry: "Try again",
    back: "Back to quizzes",
    explanation: "Correct answer",
    required: "Please enter your name and answer every question.",
    support: "You may need extra practice with these topics:",
    passed: "Great work! Keep learning.",
    low: "Keep practising. You can improve!"
  },
  hi: {
    title: "ज्ञान जाँच",
    subtitle: "विषय चुनें और अपना ज्ञान जाँचें।",
    name: "विद्यार्थी का नाम",
    namePlaceholder: "अपना नाम लिखें",
    subject: "विषय चुनें",
    start: "क्विज़ शुरू करें",
    question: "प्रश्न",
    next: "अगला प्रश्न",
    submit: "उत्तर जमा करें",
    result: "आपका परिणाम",
    correct: "सही उत्तर",
    wrong: "गलत उत्तर",
    score: "आपका स्कोर",
    retry: "फिर से प्रयास करें",
    back: "क्विज़ पर वापस जाएँ",
    explanation: "सही उत्तर",
    required: "कृपया नाम लिखें और सभी प्रश्नों के उत्तर दें।",
    support: "इन विषयों पर और अभ्यास करें:",
    passed: "बहुत अच्छा! सीखते रहें।",
    low: "अभ्यास जारी रखें। आप बेहतर कर सकते हैं!"
  },
  kn: {
    title: "ಜ್ಞಾನ ಪರೀಕ್ಷೆ",
    subtitle: "ವಿಷಯ ಆಯ್ಕೆ ಮಾಡಿ ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ.",
    name: "ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು",
    namePlaceholder: "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    subject: "ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ",
    start: "ಪ್ರಶ್ನೋತ್ತರ ಪ್ರಾರಂಭಿಸಿ",
    question: "ಪ್ರಶ್ನೆ",
    next: "ಮುಂದಿನ ಪ್ರಶ್ನೆ",
    submit: "ಉತ್ತರ ಸಲ್ಲಿಸಿ",
    result: "ನಿಮ್ಮ ಫಲಿತಾಂಶ",
    correct: "ಸರಿಯಾದ ಉತ್ತರಗಳು",
    wrong: "ತಪ್ಪಾದ ಉತ್ತರಗಳು",
    score: "ನಿಮ್ಮ ಅಂಕ",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    back: "ಪ್ರಶ್ನೋತ್ತರಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    explanation: "ಸರಿಯಾದ ಉತ್ತರ",
    required: "ಹೆಸರು ನಮೂದಿಸಿ ಮತ್ತು ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ.",
    support: "ಈ ವಿಷಯಗಳಲ್ಲಿ ಹೆಚ್ಚು ಅಭ್ಯಾಸ ಮಾಡಿ:",
    passed: "ಚೆನ್ನಾಗಿದೆ! ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ.",
    low: "ಅಭ್ಯಾಸ ಮುಂದುವರಿಸಿ. ನೀವು ಸುಧಾರಿಸಬಹುದು!"
  },
  ta: {
    title: "அறிவுத் தேர்வு",
    subtitle: "ஒரு பாடத்தைத் தேர்ந்தெடுத்து உங்கள் அறிவைச் சோதிக்கவும்.",
    name: "மாணவர் பெயர்",
    namePlaceholder: "உங்கள் பெயரை உள்ளிடவும்",
    subject: "பாடத்தைத் தேர்ந்தெடுக்கவும்",
    start: "வினாடி வினாவைத் தொடங்கவும்",
    question: "கேள்வி",
    next: "அடுத்த கேள்வி",
    submit: "பதில்களைச் சமர்ப்பிக்கவும்",
    result: "உங்கள் முடிவு",
    correct: "சரியான பதில்கள்",
    wrong: "தவறான பதில்கள்",
    score: "உங்கள் மதிப்பெண்",
    retry: "மீண்டும் முயற்சிக்கவும்",
    back: "வினாடி வினாவுக்குத் திரும்பவும்",
    explanation: "சரியான பதில்",
    required: "உங்கள் பெயரை உள்ளிட்டு எல்லா கேள்விகளுக்கும் பதிலளிக்கவும்.",
    support: "இந்த தலைப்புகளில் கூடுதல் பயிற்சி தேவை:",
    passed: "நன்று! தொடர்ந்து கற்றுக்கொள்ளுங்கள்.",
    low: "தொடர்ந்து பயிற்சி செய்யுங்கள். முன்னேறலாம்!"
  },
  te: {
    title: "జ్ఞాన పరీక్ష",
    subtitle: "ఒక విషయాన్ని ఎంచుకుని మీ జ్ఞానాన్ని పరీక్షించండి.",
    name: "విద్యార్థి పేరు",
    namePlaceholder: "మీ పేరు నమోదు చేయండి",
    subject: "విషయాన్ని ఎంచుకోండి",
    start: "క్విజ్ ప్రారంభించండి",
    question: "ప్రశ్న",
    next: "తదుపరి ప్రశ్న",
    submit: "సమాధానాలు సమర్పించండి",
    result: "మీ ఫలితం",
    correct: "సరైన సమాధానాలు",
    wrong: "తప్పు సమాధానాలు",
    score: "మీ స్కోరు",
    retry: "మళ్లీ ప్రయత్నించండి",
    back: "క్విజ్‌లకు తిరిగి వెళ్లండి",
    explanation: "సరైన సమాధానం",
    required: "మీ పేరు నమోదు చేసి అన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి.",
    support: "ఈ అంశాల్లో మరింత సాధన చేయండి:",
    passed: "చాలా బాగుంది! నేర్చుకోవడం కొనసాగించండి.",
    low: "సాధన కొనసాగించండి. మీరు మెరుగుపడగలరు!"
  }
};

export default function QuizCenter() {
  const { language } = useLanguage();
  const t = words[language] || words.en;

  const [studentName, setStudentName] = useState(
    localStorage.getItem("learnloop_student_name") || ""
  );
  const [subject, setSubject] = useState("Mathematics");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const questions = quizzes[subject];

  function beginQuiz() {
    if (!studentName.trim()) {
      setError(t.required);
      return;
    }

    localStorage.setItem("learnloop_student_name", studentName.trim());
    setError("");
    setAnswers({});
    setResult(null);
    setStarted(true);
  }

  function submitQuiz() {
    if (Object.keys(answers).length !== questions.length) {
      setError(t.required);
      return;
    }

    const correct = questions.filter(
      (question, index) => answers[index] === question.answer
    ).length;

    const score = Math.round((correct / questions.length) * 100);
    const weakTopics = questions
      .filter((question, index) => answers[index] !== question.answer)
      .map((question) => question.topic);

    const record = {
      studentName: studentName.trim(),
      subject,
      quizName: `${subject} Fundamentals`,
      totalQuestions: questions.length,
      correct,
      incorrect: questions.length - correct,
      score,
      weakTopics
    };

    saveQuizResult(record);
    setResult(record);
    setStarted(false);
    setError("");
  }

  function resetQuiz() {
    setAnswers({});
    setResult(null);
    setStarted(false);
    setError("");
  }

  return (
    <section className="student-panel quiz-center">
      <span className="panel-eyebrow">{t.title}</span>
      <h2>{result ? t.result : t.title}</h2>
      <p>{t.subtitle}</p>

      {!started && !result && (
        <div className="quiz-setup">
          <label>
            {t.name}
            <input
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              placeholder={t.namePlaceholder}
            />
          </label>

          <label>
            {t.subject}
            <select
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            >
              <option value="Mathematics">Mathematics / ಗಣಿತ / गणित</option>
              <option value="Science">Science / ವಿಜ್ಞಾನ / विज्ञान</option>
            </select>
          </label>

          <button className="start-quiz-button" onClick={beginQuiz}>
            {t.start}
          </button>
        </div>
      )}

      {started && (
        <div className="quiz-questions">
          {questions.map((question, index) => (
            <div className="quiz-question" key={`${subject}-${index}`}>
              <h3>{t.question} {index + 1}: {question.question}</h3>
              <div className="quiz-options">
                {question.options.map((option, optionIndex) => (
                  <label
                    className={`quiz-option ${
                      answers[index] === optionIndex ? "selected" : ""
                    }`}
                    key={option}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      checked={answers[index] === optionIndex}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [index]: optionIndex
                        }))
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button className="start-quiz-button" onClick={submitQuiz}>
            {t.submit}
          </button>
        </div>
      )}

      {result && (
        <div className="quiz-result">
          <h2>{result.score}%</h2>
          <p>{t.score}: {result.score}%</p>
          <p>{t.correct}: {result.correct} / {result.totalQuestions}</p>
          <p>{t.wrong}: {result.incorrect}</p>
          <h3>{result.score >= 50 ? t.passed : t.low}</h3>

          {result.weakTopics.length > 0 && (
            <div className="weak-topics">
              <strong>{t.support}</strong>
              <ul>
                {result.weakTopics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          <button className="start-quiz-button" onClick={resetQuiz}>
            {t.retry}
          </button>
        </div>
      )}

      {error && <p className="quiz-error">{error}</p>}
    </section>
  );
}