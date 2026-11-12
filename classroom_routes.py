"""
Classroom management Blueprint for the Hackmate Flask application.

Integration:
    1. Set app.config["DATABASE"] to the same path used by app.py.
    2. Register classroom_bp with the Flask app.
    3. After the existing init_db() creates the users table, call
       init_classroom_db(app).

This module deliberately does not modify app.py and does not import app.py,
avoiding circular imports.
"""

import secrets
import sqlite3
import string
from functools import wraps

from flask import Blueprint, current_app, jsonify, request, session


classroom_bp = Blueprint("classroom", __name__)


def _database_path():
    """Use the same SQLite file configured by the main Flask application."""
    return current_app.config.get("DATABASE", "hackmate.db")


def _get_db():
    """Open a SQLite connection with foreign-key enforcement enabled."""
    conn = sqlite3.connect(_database_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_classroom_db(app):
    """
    Verify the existing users table, then create classroom tables.

    Call this only after the existing app.init_db() has created users.
    The users table must contain an INTEGER PRIMARY KEY id and a role column.
    """
    with app.app_context():
        conn = _get_db()
        try:
            user_columns = conn.execute("PRAGMA table_info(users)").fetchall()

            if not user_columns:
                raise RuntimeError(
                    "The users table does not exist. Run the existing init_db() first."
                )

            columns_by_name = {row["name"]: row for row in user_columns}

            if "id" not in columns_by_name or "role" not in columns_by_name:
                raise RuntimeError(
                    "The users table must contain both 'id' and 'role' columns."
                )

            if columns_by_name["id"]["pk"] != 1:
                raise RuntimeError(
                    "users.id must be the primary key before classroom foreign keys "
                    "can be created."
                )

            # Ensure the existing users.id declaration is suitable for the FK.
            id_type = (columns_by_name["id"]["type"] or "").upper()
            if id_type != "INTEGER":
                raise RuntimeError(
                    "users.id must have INTEGER type for this classroom schema."
                )

            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS classrooms (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    classroom_code TEXT NOT NULL COLLATE NOCASE UNIQUE,
                    teacher_id INTEGER NOT NULL,
                    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (teacher_id) REFERENCES users(id)
                        ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS classroom_members (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    classroom_id INTEGER NOT NULL,
                    student_id INTEGER NOT NULL,
                    joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (classroom_id) REFERENCES classrooms(id)
                        ON DELETE CASCADE,
                    FOREIGN KEY (student_id) REFERENCES users(id)
                        ON DELETE CASCADE,
                    UNIQUE (classroom_id, student_id)
                );

                CREATE INDEX IF NOT EXISTS idx_classrooms_teacher
                    ON classrooms(teacher_id);

                CREATE INDEX IF NOT EXISTS idx_classroom_members_student
                    ON classroom_members(student_id);
                """
            )
            conn.commit()

            # Confirm enforcement is enabled on this connection.
            fk_status = conn.execute("PRAGMA foreign_keys").fetchone()[0]
            if fk_status != 1:
                raise RuntimeError("SQLite foreign-key enforcement could not be enabled.")
        finally:
            conn.close()


def _login_required(role=None):
    """Protect routes using the existing Flask session keys."""
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


def _generate_classroom_code(conn, length=6):
    """Generate an uppercase code and check for collisions."""
    alphabet = string.ascii_uppercase + string.digits

    for _ in range(20):
        code = "".join(secrets.choice(alphabet) for _ in range(length))
        existing = conn.execute(
            "SELECT 1 FROM classrooms WHERE classroom_code = ?",
            (code,)
        ).fetchone()

        if existing is None:
            return code

    raise RuntimeError("Could not generate a unique classroom code. Please retry.")


@classroom_bp.route("/api/classrooms", methods=["POST"])
@_login_required("teacher")
def create_classroom():
    data = request.get_json(silent=True) or {}
    name = data.get("name")

    if not isinstance(name, str) or not name.strip():
        return jsonify({"error": "Classroom name is required"}), 400

    name = name.strip()
    if len(name) > 100:
        return jsonify({"error": "Classroom name must be 100 characters or fewer"}), 400

    conn = _get_db()
    try:
        code = _generate_classroom_code(conn)
        cursor = conn.execute(
            """
            INSERT INTO classrooms (name, classroom_code, teacher_id)
            VALUES (?, ?, ?)
            """,
            (name, code, session["user_id"])
        )
        conn.commit()

        return jsonify({
            "message": "Classroom created successfully",
            "classroom": {
                "id": cursor.lastrowid,
                "name": name,
                "classroom_code": code
            }
        }), 201
    except sqlite3.Error:
        conn.rollback()
        current_app.logger.exception("Could not create classroom")
        return jsonify({"error": "Could not create classroom"}), 500
    finally:
        conn.close()


@classroom_bp.route("/api/classrooms/join", methods=["POST"])
@_login_required("student")
def join_classroom():
    data = request.get_json(silent=True) or {}
    code = data.get("classroom_code")

    if not isinstance(code, str) or not code.strip():
        return jsonify({"error": "Classroom code is required"}), 400

    code = code.strip().upper()
    conn = _get_db()

    try:
        classroom = conn.execute(
            """
            SELECT id, name, classroom_code
            FROM classrooms
            WHERE classroom_code = ?
            """,
            (code,)
        ).fetchone()

        if classroom is None:
            return jsonify({"error": "Invalid classroom code"}), 404

        try:
            conn.execute(
                """
                INSERT INTO classroom_members (classroom_id, student_id)
                VALUES (?, ?)
                """,
                (classroom["id"], session["user_id"])
            )
            conn.commit()
        except sqlite3.IntegrityError:
            conn.rollback()
            return jsonify({"error": "You have already joined this classroom"}), 409

        return jsonify({
            "message": "Successfully joined classroom",
            "classroom": {
                "id": classroom["id"],
                "name": classroom["name"],
                "classroom_code": classroom["classroom_code"]
            }
        }), 200
    except sqlite3.Error:
        conn.rollback()
        current_app.logger.exception("Could not join classroom")
        return jsonify({"error": "Could not join classroom"}), 500
    finally:
        conn.close()


@classroom_bp.route("/api/classrooms", methods=["GET"])
@_login_required("teacher")
def get_teacher_classrooms():
    conn = _get_db()
    try:
        rows = conn.execute(
            """
            SELECT c.id, c.name, c.classroom_code, c.created_at,
                   COUNT(cm.id) AS student_count
            FROM classrooms AS c
            LEFT JOIN classroom_members AS cm ON cm.classroom_id = c.id
            WHERE c.teacher_id = ?
            GROUP BY c.id
            ORDER BY c.created_at DESC, c.id DESC
            """,
            (session["user_id"],)
        ).fetchall()

        return jsonify({
            "classrooms": [dict(row) for row in rows]
        }), 200
    except sqlite3.Error:
        current_app.logger.exception("Could not retrieve teacher classrooms")
        return jsonify({"error": "Could not retrieve classrooms"}), 500
    finally:
        conn.close()


@classroom_bp.route("/api/classrooms/<int:classroom_id>/students", methods=["GET"])
@_login_required("teacher")
def get_classroom_students(classroom_id):
    conn = _get_db()
    try:
        classroom = conn.execute(
            """
            SELECT id, name, classroom_code
            FROM classrooms
            WHERE id = ? AND teacher_id = ?
            """,
            (classroom_id, session["user_id"])
        ).fetchone()

        # Return 404 for both a missing classroom and another teacher's classroom,
        # so the API does not disclose that another teacher's classroom exists.
        if classroom is None:
            return jsonify({"error": "Classroom not found"}), 404

        students = conn.execute(
            """
            SELECT u.id, u.name, u.email, u.grade, u.language, cm.joined_at
            FROM classroom_members AS cm
            JOIN users AS u ON u.id = cm.student_id
            WHERE cm.classroom_id = ?
            ORDER BY u.name COLLATE NOCASE
            """,
            (classroom_id,)
        ).fetchall()

        return jsonify({
            "classroom": {
                "id": classroom["id"],
                "name": classroom["name"],
                "classroom_code": classroom["classroom_code"]
            },
            "students": [dict(row) for row in students]
        }), 200
    except sqlite3.Error:
        current_app.logger.exception("Could not retrieve classroom students")
        return jsonify({"error": "Could not retrieve classroom students"}), 500
    finally:
        conn.close()


@classroom_bp.route("/api/classrooms/my-memberships", methods=["GET"])
@_login_required("student")
def get_my_classroom_memberships():
    """Students can retrieve only their own classroom memberships."""
    conn = _get_db()
    try:
        rows = conn.execute(
            """
            SELECT c.id, c.name, c.classroom_code, c.teacher_id,
                   u.name AS teacher_name, cm.joined_at
            FROM classroom_members AS cm
            JOIN classrooms AS c ON c.id = cm.classroom_id
            JOIN users AS u ON u.id = c.teacher_id
            WHERE cm.student_id = ?
            ORDER BY cm.joined_at DESC
            """,
            (session["user_id"],)
        ).fetchall()

        return jsonify({
            "memberships": [dict(row) for row in rows]
        }), 200
    except sqlite3.Error:
        current_app.logger.exception("Could not retrieve student memberships")
        return jsonify({"error": "Could not retrieve memberships"}), 500
    finally:
        conn.close()
