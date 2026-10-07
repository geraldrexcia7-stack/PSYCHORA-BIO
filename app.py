"""
GUIDE FOR PSYCHORA - Character Poll / Vote Backend
--------------------------------------
Server Python (Flask) sederhana yang menerima vote "karakter favorit kamu"
dari pengunjung website (Sarako vs Shiro), menyimpan setiap vote ke file log
lokal (votes_log.jsonl) sekaligus meng-update rekap jumlah vote per karakter
(votes_count.json) agar bisa dihitung sebagai leaderboard / insight karakter
paling disukai.

Cara pakai lokal (development):
    1. pip install -r requirements.txt
    2. python app.py
    3. Server jalan di http://127.0.0.1:5000

Konfigurasi notifikasi email (opsional, lewat environment variable):
    SMTP_USER            -> alamat Gmail pengirim
    SMTP_PASSWORD        -> App Password Gmail (bukan password akun biasa)
    VOTE_NOTIFICATION_TO -> alamat email tujuan notifikasi (default: SMTP_USER)

    Kalau salah satu dari SMTP_USER / SMTP_PASSWORD tidak diisi, notifikasi
    email otomatis dilewati (skip) tanpa membuat vote gagal.

Konfigurasi login Google (wajib untuk login ke website):
    FLASK_SECRET_KEY      -> secret acak untuk menandatangani session Flask
    GOOGLE_CLIENT_ID      -> OAuth Client ID dari Google Cloud Console
    GOOGLE_CLIENT_SECRET  -> OAuth Client Secret dari Google Cloud Console
    GOOGLE_REDIRECT_URI   -> URL publik /auth/google/callback yang didaftarkan di Google

Login Google pertama akan membuat sesi akun dan langsung memberi akses.
"""

import os
import json
import smtplib
import threading
import hmac
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from flask import Flask, abort, jsonify, redirect, request, send_from_directory, session, url_for
from flask_cors import CORS
from authlib.integrations.base_client.errors import OAuthError
from authlib.integrations.flask_client import OAuth
from werkzeug.security import check_password_hash

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.getenv("FLASK_SECRET_KEY"),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("SESSION_COOKIE_SECURE", "true").lower() == "true",
    PERMANENT_SESSION_LIFETIME=timedelta(hours=8),
)
oauth = OAuth(app)
google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# CORS: daftar origin yang boleh memanggil API ini.
# Sebelumnya hanya "https://psychora-bio.vercel.app" yang diizinkan, sehingga kalau
# website dibuka dari Live Server (localhost), URL preview Vercel, atau domain lain,
# browser memblokir request -> hasil vote gagal dimuat dan persentase tetap 0%.
# Tambahan domain bisa diisi lewat env var ALLOWED_ORIGINS (pisahkan dengan koma).
_default_origins = [
    "https://psychora-bio.vercel.app",
    r"https://psychora-bio-.*\.vercel\.app",   # URL preview Vercel
    "http://localhost:5500", "http://127.0.0.1:5500",  # VS Code Live Server
    "http://localhost:3000", "http://127.0.0.1:3000",
    "http://localhost:5000", "http://127.0.0.1:5000",
]
_extra_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
CORS(app, resources={r"/api/*": {"origins": _default_origins + _extra_origins}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# DATA_DIR: folder penyimpanan vote. Di Railway, filesystem biasa akan RESET setiap
# redeploy/restart (itu sebabnya angka vote bisa "hilang"). Pasang Volume di Railway,
# mount ke mis. /data, lalu set env var DATA_DIR=/data supaya vote tersimpan permanen.
DATA_DIR = os.getenv("DATA_DIR", BASE_DIR)
os.makedirs(DATA_DIR, exist_ok=True)
VOTES_LOG_FILE = os.path.join(DATA_DIR, "votes_log.jsonl")
VOTES_COUNT_FILE = os.path.join(DATA_DIR, "votes_count.json")

# Daftar karakter yang bisa divote. Tambahkan character key baru di sini
# kalau nanti ada karakter baru yang masuk ke poll.
CHARACTERS = {
    "sarako": "Sarako Kyoga",
    "shiro": "Shiro Miazaki",
    "kara": "Kara Seiro",
}

# Lock supaya aman kalau ada beberapa vote masuk bersamaan (race condition
# saat baca-tulis file votes_count.json).
_vote_lock = threading.Lock()


def load_vote_counts() -> dict:
    """Baca rekap jumlah vote dari file. Kalau belum ada, mulai dari 0."""
    counts = {key: 0 for key in CHARACTERS}
    if os.path.exists(VOTES_COUNT_FILE):
        try:
            with open(VOTES_COUNT_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
            for key in CHARACTERS:
                counts[key] = int(saved.get(key, 0))
        except (json.JSONDecodeError, ValueError):
            pass  # File korup / kosong -> mulai dari 0 lagi, tidak crash.
    return counts


def save_vote_counts(counts: dict) -> None:
    # Tulis ke file sementara lalu ganti (atomic) supaya file tidak korup
    # kalau server mati tepat saat menulis.
    tmp_path = VOTES_COUNT_FILE + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(counts, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, VOTES_COUNT_FILE)


def log_vote(character: str, request_obj) -> None:
    """Simpan setiap vote individual ke file log, buat audit trail / insight."""
    entry = {
        "character": character,
        "character_name": CHARACTERS[character],
        "voted_at": datetime.now(timezone.utc).isoformat(),
        "ip": request_obj.headers.get("X-Forwarded-For", request_obj.remote_addr),
        "user_agent": request_obj.headers.get("User-Agent", "-"),
    }
    with open(VOTES_LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def send_vote_notification(character: str, counts: dict, total: int, request_obj) -> None:
    """Kirim notifikasi Gmail kalau konfigurasi SMTP sudah diisi."""
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    notification_to = os.getenv("VOTE_NOTIFICATION_TO", smtp_user)

    if not smtp_user or not smtp_password or not notification_to:
        return

    message = EmailMessage()
    message["Subject"] = f"Psychora vote baru: {CHARACTERS[character]}"
    message["From"] = smtp_user
    message["To"] = notification_to
    message.set_content(
        "Vote baru masuk ke website Psychora.\n\n"
        f"Karakter: {CHARACTERS[character]}\n"
        f"Total vote: {total}\n"
        f"Rekap: {counts}\n"
        f"Waktu: {datetime.now(timezone.utc).isoformat()}\n"
        f"IP: {request_obj.headers.get('X-Forwarded-For', request_obj.remote_addr)}\n"
    )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as smtp:
        smtp.login(smtp_user, smtp_password)
        smtp.send_message(message)


def build_results(counts: dict) -> dict:
    total = sum(counts.values())
    percentages = {
        key: round((count / total) * 100, 1) if total else 0.0
        for key, count in counts.items()
    }
    leading = max(counts, key=counts.get) if total else None
    return {
        "counts": counts,
        "total": total,
        "percentages": percentages,
        "leading": leading,
        "leading_name": CHARACTERS.get(leading) if leading else None,
    }


@app.route("/api/vote", methods=["POST"])
def submit_vote():
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify(success=False, error="Permintaan tidak valid. Format JSON harus berupa objek."), 400

    character_value = data.get("character")
    character = character_value.strip().lower() if isinstance(character_value, str) else ""

    if character not in CHARACTERS:
        return (
            jsonify(
                success=False,
                error=f"Karakter tidak dikenal. Pilihan yang tersedia: {', '.join(CHARACTERS)}.",
            ),
            400,
        )

    with _vote_lock:
        counts = load_vote_counts()
        counts[character] += 1
        save_vote_counts(counts)

        # Simpan log detail vote. Kalau gagal (misal disk penuh), jangan sampai
        # request dianggap gagal total -> vote sudah kehitung di rekap.
        try:
            log_vote(character, request)
        except Exception as e:  # noqa: BLE001
            print("Gagal menyimpan log vote:", e)

    results = build_results(counts)

    try:
        send_vote_notification(character, counts, results["total"], request)
    except Exception as e:  # noqa: BLE001
        print("Gagal mengirim notifikasi vote ke email:", e)

    return jsonify(success=True, **results)


@app.route("/api/vote/results", methods=["GET"])
def get_vote_results():
    """Endpoint buat ambil hasil poll saat ini (dipanggil saat halaman dibuka)."""
    with _vote_lock:
        counts = load_vote_counts()
    results = build_results(counts)
    response = jsonify(success=True, **results)
    response.headers["Cache-Control"] = "no-store"  # selalu ambil angka terbaru
    return response


@app.route("/api/health", methods=["GET"])
def health():
    """Endpoint kecil buat cek server hidup atau tidak."""
    return jsonify(status="ok")


def _auth_is_configured() -> bool:
    return bool(os.getenv("FLASK_SECRET_KEY"))


def _google_oauth_is_configured() -> bool:
    return all(
        os.getenv(name)
        for name in ("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI")
    )


def _send_protected_page(filename: str):
    if not _auth_is_configured():
        abort(503, description="Authentication is not configured on the server.")
    if session.get("psychora_authenticated") is not True:
        return redirect(url_for("login"))

    response = send_from_directory(BASE_DIR, filename)
    response.headers["Cache-Control"] = "no-store"
    return response


@app.get("/")
@app.get("/index.html")
def homepage():
    return _send_protected_page("index.html")


@app.get("/portofolio.html")
def portfolio():
    return _send_protected_page("portofolio.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if not _auth_is_configured():
        abort(503, description="Authentication is not configured on the server.")

    if request.method == "POST":
        username = request.form.get("identity", "")
        password = request.form.get("password", "")
        expected_username = os.getenv("ADMIN_USERNAME", "")
        password_hash = os.getenv("ADMIN_PASSWORD_HASH", "")

        if (
            expected_username
            and password_hash
            and hmac.compare_digest(username, expected_username)
            and check_password_hash(password_hash, password)
        ):
            session.clear()
            session["psychora_authenticated"] = True
            session.permanent = True
            return redirect("/", code=303)

        error = "invalid" if expected_username and password_hash else "password-disabled"
        return redirect(url_for("login", error=error), code=303)

    if session.get("psychora_authenticated") is True:
        return redirect("/")

    response = send_from_directory(
        os.path.join(BASE_DIR, "LoginPAGE", "HTML"),
        "mainlogin.html",
    )
    response.headers["Cache-Control"] = "no-store"
    return response


@app.get("/auth/google")
def google_login():
    if not _auth_is_configured():
        abort(503, description="Authentication is not configured on the server.")
    if not _google_oauth_is_configured():
        return redirect(url_for("login", error="google-not-configured"))

    session.clear()
    return google.authorize_redirect(os.environ["GOOGLE_REDIRECT_URI"])


@app.get("/auth/google/callback")
def google_callback():
    if not _auth_is_configured():
        abort(503, description="Authentication is not configured on the server.")
    if not _google_oauth_is_configured():
        return redirect(url_for("login", error="google-not-configured"))
    if request.args.get("error"):
        return redirect(url_for("login", error="google-cancelled"))

    try:
        token = google.authorize_access_token()
    except OAuthError:
        return redirect(url_for("login", error="google-failed"))

    user_info = token.get("userinfo")
    if (
        not isinstance(user_info, dict)
        or not user_info.get("sub")
        or not user_info.get("email")
        or user_info.get("email_verified") is not True
    ):
        return redirect(url_for("login", error="google-unverified"))

    session.clear()
    session["psychora_authenticated"] = True
    session["psychora_user"] = {
        "id": user_info["sub"],
        "email": user_info["email"],
        "name": user_info.get("name", ""),
    }
    session.permanent = True
    return redirect("/")


@app.get("/LoginPAGE/HTML/mainlogin.html")
def legacy_login_page():
    return redirect(url_for("login"))


@app.get("/signup")
@app.get("/LoginPAGE/HTML/signup.html")
def signup():
    response = send_from_directory(
        os.path.join(BASE_DIR, "LoginPAGE", "HTML"),
        "signup.html",
    )
    response.headers["Cache-Control"] = "no-store"
    return response


@app.get("/logout")
def logout():
    if not _auth_is_configured():
        abort(503, description="Authentication is not configured on the server.")
    session.clear()
    return redirect(url_for("login"))


@app.get("/<path:filename>")
def public_assets(filename: str):
    parts = filename.split("/")
    if not parts or parts[0] not in {
        "CSS", "JS", "assetbio", "music-bgm", "portofolio",
        "LoginPAGE",
    }:
        abort(404)

    if parts[0] == "LoginPAGE" and (
        len(parts) < 3 or parts[1] not in {"CSS", "JS"}
    ):
        abort(404)

    return send_from_directory(BASE_DIR, filename)


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG") == "1", port=int(os.getenv("PORT", 5000)))