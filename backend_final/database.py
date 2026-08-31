import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tea_diagnostics.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        credits INTEGER DEFAULT 100,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS credit_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)
    conn.commit()
    conn.close()

def create_user(email, password_hash):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (email, password_hash, credits) VALUES (?, ?, ?)",
            (email, password_hash, 100) # Give 100 credits by default on register
        )
        user_id = cursor.lastrowid
        # Log the welcome credits transaction
        cursor.execute(
            "INSERT INTO credit_transactions (user_id, amount, description) VALUES (?, ?, ?)",
            (user_id, 100, "Registration bonus credits")
        )
        conn.commit()
        return user_id
    except sqlite3.IntegrityError:
        # Email already exists
        return None
    finally:
        conn.close()

def get_user_by_email(email):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, password_hash, credits FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def get_user_by_id(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, credits FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def create_session(user_id, token):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO user_sessions (token, user_id) VALUES (?, ?)", (token, user_id))
    conn.commit()
    conn.close()

def delete_session(token):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM user_sessions WHERE token = ?", (token,))
    conn.commit()
    conn.close()

def get_user_by_token(token):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT u.id, u.email, u.credits 
        FROM users u 
        JOIN user_sessions s ON u.id = s.user_id 
        WHERE s.token = ?
    """, (token,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def add_credits(user_id, amount, description):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET credits = credits + ? WHERE id = ?", (amount, user_id))
        cursor.execute("INSERT INTO credit_transactions (user_id, amount, description) VALUES (?, ?, ?)",
                       (user_id, amount, description))
        conn.commit()
        cursor.execute("SELECT credits FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return row['credits'] if row else 0
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def deduct_credits(user_id, amount, description):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT credits FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row or row['credits'] < amount:
            return False, row['credits'] if row else 0
        
        cursor.execute("UPDATE users SET credits = credits - ? WHERE id = ?", (amount, user_id))
        cursor.execute("INSERT INTO credit_transactions (user_id, amount, description) VALUES (?, -?, ?)",
                       (user_id, amount, description))
        conn.commit()
        cursor.execute("SELECT credits FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        return True, row['credits'] if row else 0
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()
