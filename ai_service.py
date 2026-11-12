
import os
import json
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types


# -----------------------------------------
# ENVIRONMENT CONFIGURATION
# -----------------------------------------

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

PRIMARY_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.8-flash"
)

FALLBACK_MODEL = os.getenv(
    "GEMINI_FALLBACK_MODEL",
    "gemini-3.5-flash-lite"
)

client = genai.Client(api_key=API_KEY) if API_KEY else None


# -----------------------------------------
# QUESTION JSON STRUCTURE
# -----------------------------------------

QUESTION_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "questions": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "question": {"type": "STRING"},
                    "option_a": {"type": "STRING"},
                    "option_b": {"type": "STRING"},
                    "option_c": {"type": "STRING"},
                    "option_d": {"type": "STRING"},
                    "correct_answer": {
                        "type": "STRING",
                        "enum": ["A", "B", "C", "D"]
                    },
                    "explanation": {"type": "STRING"},
                    "difficulty": {
                        "type": "STRING",
                        "enum": ["easy", "medium", "hard"]
                    }
                },
                "required": [
                    "question",
                    "option_a",
                    "option_b",
                    "option_c",
                    "option_d",
                    "correct_answer",
                    "explanation",
                    "difficulty"
                ]
            }
        }
    },
    "required": ["questions"]
}


# -----------------------------------------
# GEMINI API HELPER WITH FALLBACK
# -----------------------------------------

def generate_content(prompt, config=None):

    if client is None:
        raise RuntimeError(
            "Gemini API key is missing. Check your .env file."
        )

    models = [PRIMARY_MODEL]

    if FALLBACK_MODEL != PRIMARY_MODEL:
        models.append(FALLBACK_MODEL)

    last_error = None

    for model in models:

        for attempt in range(2):

            try:
                print(
                    f"Trying Gemini model: {model} "
                    f"(attempt {attempt + 1})"
                )

                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=config
                )

                if not response.text:
                    raise ValueError(
                        "Gemini returned an empty response."
                    )

                print(f"Successfully generated content using {model}")

                return response.text.strip()

            except Exception as error:

                last_error = error

                print(
                    f"Gemini error with {model}: {error}"
                )

                error_text = str(error).lower()

                temporary_error = any(
                    code in error_text
                    for code in [
                        "429",
                        "500",
                        "502",
                        "503",
                        "504",
                        "resource_exhausted",
                        "service_unavailable",
                        "deadline_exceeded",
                        "internal server error"
                    ]
                )

                if not temporary_error:
                    raise

                if attempt == 0:
                    time.sleep(1)

                else:
                    print(
                        f"Switching away from {model}."
                    )

    raise RuntimeError(
        f"All Gemini models failed. Last error: {last_error}"
    )


# -----------------------------------------
# GENERATE AI QUESTIONS
# -----------------------------------------

def generate_questions(
    grade,
    subject,
    topic,
    language="English",
    difficulty="easy",
    count=5
):

    prompt = f"""
    You are an experienced school teacher.

    Create an assessment for a Class {grade} student.

    Subject: {subject}
    Topic: {topic}
    Language: {language}
    Difficulty: {difficulty}

    Generate exactly {count} original multiple-choice questions.

    Requirements:

    1. Use age-appropriate language.
    2. Test conceptual understanding.
    3. Provide exactly four options per question.
    4. Only one option must be correct.
    5. Correct answer must be A, B, C or D.
    6. Include a clear explanation.
    7. Avoid duplicate questions.
    8. Stay relevant to the selected topic.
    9. Write everything in {language}.
    10. Match the requested difficulty.
    """

    response_text = generate_content(
        prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_json_schema=QUESTION_SCHEMA,
            temperature=0.7
        )
    )

    try:
        result = json.loads(response_text)

    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned invalid JSON."
        )

    questions = result.get("questions", [])

    if not isinstance(questions, list) or len(questions) != count:
        raise ValueError(
            f"Expected {count} questions, "
            f"but received {len(questions) if isinstance(questions, list) else 'invalid data'}."
        )

    required_fields = [
        "question",
        "option_a",
        "option_b",
        "option_c",
        "option_d",
        "correct_answer",
        "explanation",
        "difficulty"
    ]

    for question in questions:

        if not isinstance(question, dict):
            raise ValueError("Invalid question format.")

        if any(
            not isinstance(question.get(field), str)
            or not question[field].strip()
            for field in required_fields
        ):
            raise ValueError(
                "Gemini generated an incomplete question."
            )

        question["correct_answer"] = (
            question["correct_answer"].upper()
        )

        question["difficulty"] = (
            question["difficulty"].lower()
        )

        if question["correct_answer"] not in ["A", "B", "C", "D"]:
            raise ValueError(
                "Invalid correct answer generated."
            )

        if question["difficulty"] not in [
            "easy", "medium", "hard"
        ]:
            raise ValueError(
                "Invalid question difficulty."
            )

    return questions


# -----------------------------------------
# EXPLAIN STUDENT ANSWER
# -----------------------------------------

def explain_answer(
    question,
    selected_answer,
    correct_answer,
    explanation,
    language="English"
):

    prompt = f"""
    You are a friendly and patient Class 6 teacher.

    Explain this question in {language}.

    Question: {question}

    Student's answer: {selected_answer}

    Correct answer: {correct_answer}

    Original explanation: {explanation}

    Instructions:

    1. Explain why the correct answer is correct.
    2. Explain the student's mistake if incorrect.
    3. Use simple language.
    4. Give a relatable example.
    5. Never make the student feel bad.
    6. Keep the explanation concise.
    """

    return generate_content(prompt)


# -----------------------------------------
# GENERATE REMEDIAL LEARNING MODULE
# -----------------------------------------

def generate_remediation(
    grade,
    subject,
    topic,
    mistakes,
    language="English"
):

    prompt = f"""
    Act as a patient Class {grade} teacher.

    Create a personalised remedial learning module.

    Subject: {subject}
    Topic: {topic}

    Student's mistakes:
    {json.dumps(mistakes, ensure_ascii=False)}

    Language: {language}

    Include:

    1. A simple explanation of the concept.
    2. One relatable real-life example.
    3. Three short practice questions.
    4. Correct answers with explanations.

    Use age-appropriate language.
    Write everything in {language}.
    """

    return generate_content(prompt)
