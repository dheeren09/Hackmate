from flask import Flask, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
from functools import wraps

from assessment_routes import create_assessment_blueprint
from classroom_routes import classroom_bp, init_classroom_db



# FLASK APPLICATION CONFIGURATION


app = Flask(__name__)
app.secret_key = "hackmate-demo-secret-key"

DATABASE = "hackmate.db"
app.config["DATABASE"] = DATABASE



# DATABASE INITIALISATION

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            grade TEXT,
            language TEXT DEFAULT 'English'
        )
    """)

    conn.commit()
    conn.close()


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn



# LOGIN PROTECTION


def login_required(role=None):

    def decorator(func):

        @wraps(func)
        def wrapper(*args, **kwargs):

            if "user_id" not in session:
                return jsonify({"error": "Login required"}), 401

            if role and session.get("role") != role:
                return jsonify({"error": "Access denied"}), 403

            return func(*args, **kwargs)

        return wrapper

    return decorator


# -----------------------------------------
# ASSESSMENT BLUEPRINT
# -----------------------------------------

assessment_bp, init_assessment_db, seed_curriculum = (
    create_assessment_blueprint(
        get_db,
        login_required
    )
)


# -----------------------------------------
# REGISTER BOTH BLUEPRINTS
# -----------------------------------------

app.register_blueprint(assessment_bp)
app.register_blueprint(classroom_bp)


# -----------------------------------------
# REGISTER
# -----------------------------------------

@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "").lower()
    grade = data.get("grade")
    language = data.get("language", "English")

    if not name or not email or not password:
        return jsonify({
            "error": "All required fields must be filled"
        }), 400

    if role not in ["student", "teacher"]:
        return jsonify({"error": "Invalid role"}), 400

    if len(password) < 6:
        return jsonify({
            "error": "Password must have at least 6 characters"
        }), 400

    conn = get_db()

    try:

        conn.execute("""
            INSERT INTO users
            (name, email, password, role, grade, language)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            name,
            email,
            generate_password_hash(password),
            role,
            grade,
            language
        ))

        conn.commit()

        return jsonify({
            "message": "Registration successful"
        }), 201

    except sqlite3.IntegrityError:

        return jsonify({
            "error": "Email already registered"
        }), 409

    finally:
        conn.close()


# -----------------------------------------
# LOGIN
# -----------------------------------------

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    conn = get_db()

    user = conn.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()

    conn.close()

    if not user or not check_password_hash(
        user["password"], password
    ):
        return jsonify({
            "error": "Invalid email or password"
        }), 401

    session.clear()

    session["user_id"] = user["id"]
    session["role"] = user["role"]

    return jsonify({
        "message": "Login successful",
        "role": user["role"],
        "name": user["name"]
    })


# -----------------------------------------
# CURRENT USER PROFILE
# -----------------------------------------

@app.route("/api/me", methods=["GET"])
@login_required()
def current_user():

    conn = get_db()

    user = conn.execute("""
        SELECT id, name, email, role, grade, language
        FROM users
        WHERE id = ?
    """, (session["user_id"],)).fetchone()

    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(dict(user))


# -----------------------------------------
# TEACHER CREATES STUDENT ACCOUNT
# -----------------------------------------

@app.route("/api/students", methods=["POST"])
@login_required("teacher")
def create_student():

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    grade = data.get("grade", "6")
    language = data.get("language", "English")

    if not name or not email or len(password) < 6:
        return jsonify({
            "error": "Provide name, email and a password of at least 6 characters"
        }), 400

    conn = get_db()

    try:

        conn.execute("""
            INSERT INTO users
            (name, email, password, role, grade, language)
            VALUES (?, ?, ?, 'student', ?, ?)
        """, (
            name,
            email,
            generate_password_hash(password),
            grade,
            language
        ))

        conn.commit()

        return jsonify({
            "message": "Student account created"
        }), 201

    except sqlite3.IntegrityError:

        return jsonify({
            "error": "Email already registered"
        }), 409

    finally:
        conn.close()


# -----------------------------------------
# LOGOUT
# -----------------------------------------

@app.route("/api/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "message": "Logged out successfully"
    })


# APPLICATION STARTUP


if __name__ == "__main__":

    init_db()

    init_assessment_db()
    seed_curriculum()

    init_classroom_db(app)

    app.run(debug=True)
