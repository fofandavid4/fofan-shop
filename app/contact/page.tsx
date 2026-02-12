"use client";

export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.22) 0, transparent 55%), radial-gradient(circle at 100% 0%, rgba(52,211,153,0.2) 0, transparent 55%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.2) 0, transparent 55%)",
        color: "#ffffff",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 640,
          width: "100%",
          borderRadius: 28,
          padding: "18px 20px 20px",
          border: "1px solid rgba(148,163,184,0.28)",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
          boxShadow:
            "0 24px 70px rgba(0,0,0,0.9), 0 0 0 1px rgba(15,23,42,0.9)",
          backdropFilter: "blur(18px)",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-block",
            marginBottom: 16,
            fontSize: "0.85rem",
            color: "#9CA3AF",
            textDecoration: "none",
          }}
        >
          ← На главную
        </a>

        <h1
          style={{
            fontSize: "24px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#E0F2FE",
            marginBottom: 8,
          }}
        >
          Связаться
        </h1>
        <p
          style={{
            color: "#9CA3AF",
            fontSize: "0.9rem",
            marginBottom: 18,
          }}
        >
          Если остались вопросы по выкупу или объявлениям — напишите мне любым
          удобным способом.
        </p>

        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(148,163,184,0.35)",
            padding: "14px 14px 16px",
            marginBottom: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            background:
              "radial-gradient(circle at top, rgba(56,189,248,0.08), transparent), rgba(15,23,42,0.96)",
          }}
        >
          <div
            style={{ fontSize: "0.82rem", color: "#9CA3AF", marginBottom: 2 }}
          >
            Прямые контакты
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span>📱</span>
            <span
              style={{ color: "#9CA3AF", fontSize: "0.85rem" }}
            >
              Telegram:
            </span>
            <a
              href="https://t.me/your_nick"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#38bdf8",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              @your_nick
            </a>
          </div>

          <div
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span>📧</span>
            <span
              style={{ color: "#9CA3AF", fontSize: "0.85rem" }}
            >
              Email:
            </span>
            <a
              href="mailto:you@example.com"
              style={{
                color: "#38bdf8",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              you@example.com
            </a>
          </div>
        </div>

        <div
          style={{
            borderRadius: 20,
            border: "1px solid rgba(148,163,184,0.35)",
            padding: "16px 14px 14px",
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.94))",
          }}
        >
          <h3
            style={{
              fontSize: "0.95rem",
              marginTop: 0,
              marginBottom: 10,
            }}
          >
            Написать сообщение
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#9CA3AF",
                  marginBottom: 2,
                }}
              >
                Имя
              </div>
              <input
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(148,163,184,0.35)",
                  background: "rgba(15,23,42,0.96)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                placeholder="Ваше имя"
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#9CA3AF",
                  marginBottom: 2,
                }}
              >
                Сообщение
              </div>
              <textarea
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid rgba(148,163,184,0.35)",
                  background: "rgba(15,23,42,0.96)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  minHeight: 80,
                  resize: "vertical",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                placeholder="Напишите ваш вопрос..."
              />
            </div>
            <button
              onClick={() =>
                alert("Форма-заглушка: позже подключим отправку!")
              }
              style={{
                padding: "9px 18px",
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(90deg,#38bdf8,#22c55e)",
                color: "#020617",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 600,
                alignSelf: "flex-start",
                boxShadow:
                  "0 0 18px rgba(56,189,248,0.55), 0 0 28px rgba(34,197,94,0.45)",
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
