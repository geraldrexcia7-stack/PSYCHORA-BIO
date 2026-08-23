"""
PSYCHORA - Character Poll / Vote Backend
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
"""

import os
import json
import smtplib
import threading
from datetime import datetime, timezone
from email.message import EmailMessage

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Izinkan website statis (dibuka lewat Live Server / domain lain) mengakses API ini.
# Untuk produksi, ganti "*" dengan domain website kamu, misal:
CORS(app, resources={r"/api/*": {"origins": "*"}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VOTES_LOG_FILE = os.path.join(BASE_DIR, "votes_log.jsonl")
VOTES_COUNT_FILE = os.path.join(BASE_DIR, "votes_count.json")

# Daftar karakter yang bisa divote. Tambahkan character key baru di sini
# kalau nanti ada karakter baru yang masuk ke poll.
CHARACTERS = {
    "sarako": "Sarako Kyoga",
    "shiro": "Shiro Miazaki",
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
    with open(VOTES_COUNT_FILE, "w", encoding="utf-8") as f:
        json.dump(counts, f, ensure_ascii=False, indent=2)


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
    character = (data.get("character") or "").strip().lower()

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
    return jsonify(success=True, **results)


@app.route("/api/health", methods=["GET"])
def health():
    """Endpoint kecil buat cek server hidup atau tidak."""
    return jsonify(status="ok")


if __name__ == "__main__":
    app.run(debug=True, port=5000)
