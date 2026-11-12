
import sqlite3

from flask import Blueprint, request, jsonify, session

from ai_service import (
    generate_questions,
    explain_answer,
    generate_remediation
)


def create_assessment_blueprint(get_db, login_required):

    assessment = Blueprint("assessment", __name__)

    # -----------------------------------------
    # DATABASE INITIALISATION
    # -----------------------------------------

    def init_assessment_db():

        conn = get_db()

        conn.executescript("""
            CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );

            CREATE TABLE IF NOT EXISTS topics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                FOREIGN KEY(subject_id) REFERENCES subjects(id),
                UNIQUE(subject_id, name)
            );

            CREATE TABLE IF NOT EXISTS questions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic_id INTEGER NOT NULL,
                question TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                correct_answer TEXT NOT NULL,
                explanation TEXT,
                difficulty TEXT DEFAULT 'easy',
                FOREIGN KEY(topic_id) REFERENCES topics(id)
            );

            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                topic_id INTEGER NOT NULL,
                score INTEGER DEFAULT 0,
                total_questions INTEGER DEFAULT 0,
                completed INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(student_id) REFERENCES users(id),
                FOREIGN KEY(topic_id) REFERENCES topics(id)
            );

            CREATE TABLE IF NOT EXISTS student_answers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                attempt_id INTEGER NOT NULL,
                question_id INTEGER NOT NULL,
                selected_answer TEXT,
                is_correct INTEGER,
                confidence TEXT,
                FOREIGN KEY(attempt_id) REFERENCES quiz_attempts(id),
                FOREIGN KEY(question_id) REFERENCES questions(id),
                UNIQUE(attempt_id, question_id)
            );

            CREATE TABLE IF NOT EXISTS topic_mastery (
                student_id INTEGER NOT NULL,
                topic_id INTEGER NOT NULL,
                mastery_score REAL DEFAULT 0,
                attempts INTEGER DEFAULT 0,
                PRIMARY KEY(student_id, topic_id),
                FOREIGN KEY(student_id) REFERENCES users(id),
                FOREIGN KEY(topic_id) REFERENCES topics(id)
            );
        """)

        conn.commit()
        conn.close()

    # -----------------------------------------
    # SAMPLE CURRICULUM
    # -----------------------------------------

    def seed_curriculum():

        conn = get_db()

        curriculum = {
            "Mathematics": [
                "Fractions",
                "Decimals",
                "Basic Geometry"
            ],
            "Science": [
                "Components of Food",
                "Separation of Substances",
                "Changes Around Us"
            ],
            "English": [
                "Grammar",
                "Nouns",
                "Comprehension"
            ]
        }

        for subject_name, topic_names in curriculum.items():

            conn.execute(
                "INSERT OR IGNORE INTO subjects (name) VALUES (?)",
                (subject_name,)
            )

            subject = conn.execute(
                "SELECT id FROM subjects WHERE name = ?",
                (subject_name,)
            ).fetchone()

            for topic_name in topic_names:

                conn.execute("""
                    INSERT OR IGNORE INTO topics
                    (subject_id, name)
                    VALUES (?, ?)
                """, (subject["id"], topic_name))

        conn.commit()
        conn.close()

    # -----------------------------------------
    # GET SUBJECTS
    # -----------------------------------------

    @assessment.route("/api/subjects", methods=["GET"])
    @login_required("student")
    def get_subjects():

        conn = get_db()

        rows = conn.execute(
            "SELECT id, name FROM subjects ORDER BY name"
        ).fetchall()

        conn.close()

        return jsonify([dict(row) for row in rows])

    # -----------------------------------------
    # GET TOPICS
    # -----------------------------------------

    @assessment.route(
        "/api/subjects/<int:subject_id>/topics",
        methods=["GET"]
    )
    @login_required("student")
    def get_topics(subject_id):

        conn = get_db()

        rows = conn.execute("""
            SELECT id, name
            FROM topics
            WHERE subject_id = ?
            ORDER BY name
        """, (subject_id,)).fetchall()

        conn.close()

        return jsonify([dict(row) for row in rows])

    # -----------------------------------------
    # START AI-GENERATED QUIZ
    # -----------------------------------------

    @assessment.route("/api/quizzes/start", methods=["POST"])
    @login_required("student")
    def start_quiz():

        data = request.get_json() or {}

        topic_id = data.get("topic_id")
        language = data.get("language")

        if not topic_id:
            return jsonify({"error": "topic_id is required"}), 400

        conn = get_db()

        student = conn.execute("""
            SELECT grade, language
            FROM users
            WHERE id = ?
        """, (session["user_id"],)).fetchone()

        topic = conn.execute("""
            SELECT topics.id, topics.name, subjects.name AS subject_name
            FROM topics
            JOIN subjects ON topics.subject_id = subjects.id
            WHERE topics.id = ?
        """, (topic_id,)).fetchone()

        if not topic:
            conn.close()
            return jsonify({"error": "Topic not found"}), 404

        mastery = conn.execute("""
            SELECT mastery_score
            FROM topic_mastery
            WHERE student_id = ? AND topic_id = ?
        """, (session["user_id"], topic_id)).fetchone()

        # Adjust difficulty based on previous performance.
        difficulty = "easy"

        if mastery:
            if mastery["mastery_score"] >= 80:
                difficulty = "hard"
            elif mastery["mastery_score"] >= 50:
                difficulty = "medium"

        grade = student["grade"] or "6"
        language = language or student["language"] or "English"

        conn.close()

        # Ask Gemini to generate fresh questions.
        try:
            questions = generate_questions(
                grade=grade,
                subject=topic["subject_name"],
                topic=topic["name"],
                language=language,
                difficulty=difficulty,
                count=5
            )

        except Exception as error:
            print("Gemini question generation error:", error)

            return jsonify({
                "error": "Unable to generate questions right now. Please try again."
            }), 502

        conn = get_db()

        cursor = conn.execute("""
            INSERT INTO quiz_attempts
            (student_id, topic_id, total_questions)
            VALUES (?, ?, ?)
        """, (
            session["user_id"],
            topic_id,
            len(questions)
        ))

        attempt_id = cursor.lastrowid

        student_questions = []

        for question in questions:

            cursor = conn.execute("""
                INSERT INTO questions
                (
                    topic_id, question, option_a, option_b,
                    option_c, option_d, correct_answer,
                    explanation, difficulty
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                topic_id,
                question["question"],
                question["option_a"],
                question["option_b"],
                question["option_c"],
                question["option_d"],
                question["correct_answer"],
                question["explanation"],
                question["difficulty"]
            ))

            student_questions.append({
                "id": cursor.lastrowid,
                "question": question["question"],
                "option_a": question["option_a"],
                "option_b": question["option_b"],
                "option_c": question["option_c"],
                "option_d": question["option_d"],
                "difficulty": question["difficulty"]
            })

        conn.commit()
        conn.close()

        return jsonify({
            "attempt_id": attempt_id,
            "topic": topic["name"],
            "subject": topic["subject_name"],
            "language": language,
            "difficulty": difficulty,
            "questions": student_questions
        }), 201

    # -----------------------------------------
    # SUBMIT QUIZ
    # -----------------------------------------

    @assessment.route(
        "/api/quizzes/<int:attempt_id>/submit",
        methods=["POST"]
    )
    @login_required("student")
    def submit_quiz(attempt_id):

        data = request.get_json() or {}
        answers = data.get("answers", [])

        if not isinstance(answers, list) or not answers:
            return jsonify({"error": "Answers are required"}), 400

        conn = get_db()

        attempt = conn.execute("""
            SELECT *
            FROM quiz_attempts
            WHERE id = ? AND student_id = ?
        """, (attempt_id, session["user_id"])).fetchone()

        if not attempt:
            conn.close()
            return jsonify({"error": "Quiz attempt not found"}), 404

        if attempt["completed"]:
            conn.close()
            return jsonify({"error": "Quiz already submitted"}), 409

        if len(answers) != attempt["total_questions"]:
            conn.close()
            return jsonify({
                "error": "Submit an answer for every question"
            }), 400

        score = 0
        results = []
        seen = set()

        try:

            for answer in answers:

                if not isinstance(answer, dict):
                    raise ValueError("Invalid answer format")

                question_id = answer.get("question_id")

                if question_id in seen:
                    raise ValueError("Duplicate question answer")

                seen.add(question_id)

                selected = str(
                    answer.get("selected_answer", "")
                ).strip().upper()

                confidence = str(
                    answer.get("confidence", "unsure")
                ).lower()

                if selected not in ["A", "B", "C", "D"]:
                    raise ValueError("Invalid answer option")

                if confidence not in [
                    "confident", "unsure", "guessed"
                ]:
                    raise ValueError("Invalid confidence value")

                question = conn.execute("""
                    SELECT id, correct_answer, explanation, question
                    FROM questions
                    WHERE id = ? AND topic_id = ?
                """, (
                    question_id,
                    attempt["topic_id"]
                )).fetchone()

                if not question:
                    raise ValueError("Invalid question")

                correct = int(
                    selected == question["correct_answer"]
                )

                score += correct

                conn.execute("""
                    INSERT INTO student_answers
                    (
                        attempt_id, question_id,
                        selected_answer, is_correct, confidence
                    )
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    attempt_id,
                    question_id,
                    selected,
                    correct,
                    confidence
                ))

                results.append({
                    "question_id": question_id,
                    "correct": bool(correct),
                    "explanation": question["explanation"]
                })

            percentage = round(
                score / attempt["total_questions"] * 100, 2
            )

            conn.execute("""
                UPDATE quiz_attempts
                SET score = ?, completed = 1
                WHERE id = ?
            """, (score, attempt_id))

            conn.execute("""
                INSERT INTO topic_mastery
                (student_id, topic_id, mastery_score, attempts)
                VALUES (?, ?, ?, 1)

                ON CONFLICT(student_id, topic_id)
                DO UPDATE SET
                    mastery_score = (
                        (topic_mastery.mastery_score *
                        topic_mastery.attempts +
                        excluded.mastery_score) /
                        (topic_mastery.attempts + 1)
                    ),
                    attempts = topic_mastery.attempts + 1
            """, (
                session["user_id"],
                attempt["topic_id"],
                percentage
            ))

            conn.commit()

        except (ValueError, sqlite3.IntegrityError) as error:

            conn.rollback()
            conn.close()

            return jsonify({"error": str(error)}), 400

        conn.close()

        return jsonify({
            "message": "Quiz submitted successfully",
            "score": score,
            "total": attempt["total_questions"],
            "percentage": percentage,
            "results": results
        })

    # -----------------------------------------
    # GET QUIZ RESULTS
    # -----------------------------------------

    @assessment.route(
        "/api/quizzes/<int:attempt_id>/results",
        methods=["GET"]
    )
    @login_required("student")
    def get_results(attempt_id):

        conn = get_db()

        attempt = conn.execute("""
            SELECT *
            FROM quiz_attempts
            WHERE id = ? AND student_id = ?
        """, (attempt_id, session["user_id"])).fetchone()

        if not attempt:
            conn.close()
            return jsonify({"error": "Attempt not found"}), 404

        if not attempt["completed"]:
            conn.close()
            return jsonify({"error": "Quiz not completed"}), 409

        rows = conn.execute("""
            SELECT
                sa.question_id,
                sa.selected_answer,
                sa.is_correct,
                sa.confidence,
                q.question,
                q.correct_answer,
                q.explanation
            FROM student_answers sa
            JOIN questions q ON sa.question_id = q.id
            WHERE sa.attempt_id = ?
        """, (attempt_id,)).fetchall()

        conn.close()

        return jsonify({
            "attempt_id": attempt["id"],
            "score": attempt["score"],
            "total": attempt["total_questions"],
            "percentage": round(
                attempt["score"] /
                attempt["total_questions"] * 100, 2
            ),
            "answers": [dict(row) for row in rows]
        })

    # -----------------------------------------
    # AI EXPLANATION FOR A WRONG ANSWER
    # -----------------------------------------

    @assessment.route(
        "/api/quizzes/<int:attempt_id>/explain/<int:question_id>",
        methods=["GET"]
    )
    @login_required("student")
    def get_ai_explanation(attempt_id, question_id):

        conn = get_db()

        answer = conn.execute("""
            SELECT
                sa.selected_answer,
                sa.is_correct,
                q.question,
                q.correct_answer,
                q.explanation
            FROM student_answers sa
            JOIN questions q ON q.id = sa.question_id
            JOIN quiz_attempts qa ON qa.id = sa.attempt_id
            WHERE sa.attempt_id = ?
            AND sa.question_id = ?
            AND qa.student_id = ?
            AND qa.completed = 1
        """, (
            attempt_id,
            question_id,
            session["user_id"]
        )).fetchone()

        student = conn.execute("""
            SELECT language FROM users WHERE id = ?
        """, (session["user_id"],)).fetchone()

        conn.close()

        if not answer:
            return jsonify({"error": "Answer not found"}), 404

        if answer["is_correct"]:
            return jsonify({
                "explanation": answer["explanation"]
            })

        try:

            explanation = explain_answer(
                question=answer["question"],
                selected_answer=answer["selected_answer"],
                correct_answer=answer["correct_answer"],
                explanation=answer["explanation"],
                language=student["language"] or "English"
            )

            return jsonify({"explanation": explanation})

        except Exception as error:

            print("AI explanation error:", error)

            return jsonify({
                "explanation": answer["explanation"],
                "message": "Showing the saved explanation instead."
            })

    # -----------------------------------------
    # AI REMEDIAL LEARNING MODULE
    # -----------------------------------------

    @assessment.route(
        "/api/topics/<int:topic_id>/remediation",
        methods=["GET"]
    )
    @login_required("student")
    def get_remediation(topic_id):

        conn = get_db()

        topic = conn.execute("""
            SELECT topics.name, subjects.name AS subject_name
            FROM topics
            JOIN subjects ON subjects.id = topics.subject_id
            WHERE topics.id = ?
        """, (topic_id,)).fetchone()

        if not topic:
            conn.close()
            return jsonify({"error": "Topic not found"}), 404

        student = conn.execute("""
            SELECT grade, language
            FROM users
            WHERE id = ?
        """, (session["user_id"],)).fetchone()

        mistakes = conn.execute("""
            SELECT
                q.question,
                sa.selected_answer,
                q.correct_answer
            FROM student_answers sa
            JOIN questions q ON q.id = sa.question_id
            JOIN quiz_attempts qa ON qa.id = sa.attempt_id
            WHERE qa.student_id = ?
            AND qa.topic_id = ?
            AND qa.completed = 1
            AND sa.is_correct = 0
            ORDER BY qa.created_at DESC
            LIMIT 10
        """, (
            session["user_id"],
            topic_id
        )).fetchall()

        conn.close()

        if not mistakes:
            return jsonify({
                "message": "No mistakes found. Try a harder quiz instead."
            })

        mistake_details = [
            {
                "question": row["question"],
                "student_answer": row["selected_answer"],
                "correct_answer": row["correct_answer"]
            }
            for row in mistakes
        ]

        try:

            module = generate_remediation(
                grade=student["grade"] or "6",
                subject=topic["subject_name"],
                topic=topic["name"],
                mistakes=mistake_details,
                language=student["language"] or "English"
            )

            return jsonify({
                "topic": topic["name"],
                "remedial_module": module
            })

        except Exception as error:

            print("Remediation generation error:", error)

            return jsonify({
                "error": "Unable to generate remedial material right now."
            }), 502

    return assessment, init_assessment_db, seed_curriculum