"use client";

export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#050208",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(248,113,113,0.22) 0, transparent 55%), radial-gradient(circle at 100% 0%, rgba(251,191,36,0.18) 0, transparent 55%), radial-gradient(circle at 50% 100%, rgba(127,29,29,0.28) 0, transparent 55%)",
        color: "#ffffff",
        padding: "20px 16px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 720,
          width: "100%",
          borderRadius: 28,
          padding: "18px 20px 22px",
          border: "1px solid rgba(248,113,113,0.5)",
          background:
            "linear-gradient(135deg, rgba(7,10,20,0.98), rgba(15,23,42,0.94))",
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.96), 0 0 55px rgba(15,23,42,0.9)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 28,
            border: "1px solid transparent",
            background:
              "linear-gradient(120deg, rgba(248,113,113,0.9), rgba(251,191,36,0.65), rgba(248,113,113,0.9)) border-box",
            WebkitMask:
              "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            pointerEvents: "none",
            opacity: 0.45,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
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
              fontSize: "22px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#fee2e2",
              marginBottom: 6,
            }}
          >
            Связаться
          </h1>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: "0.9rem",
              marginBottom: 18,
              maxWidth: 520,
            }}
          >
            Если остались вопросы по выкупу, рефаунду или объявлениям —
            напишите мне в Telegram.
          </p>

          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(248,113,113,0.5)",
              padding: "14px 14px 16px",
              marginBottom: 18,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              background:
                "radial-gradient(circle at top, rgba(248,113,113,0.14), transparent 60%), rgba(7,10,20,0.98)",
            }}
          >
            <div
              style={{
                fontSize: "0.82rem",
                color: "#9CA3AF",
                marginBottom: 2,
              }}
            >
              Прямые контакты
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.9rem",
              }}
            >
              <span>📱</span>
              <span
                style={{ color: "#9CA3AF", fontSize: "0.85rem" }}
              >
                Telegram:
              </span>
              <a
                href="https://t.me/RefFofan"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#f97373",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                @RefFofan
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
                color: "#e5e7eb",
              }}
            >
              Написать сообщение
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
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
                    border:
                      "1px solid rgba(148,163,184,0.5)",
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
                    border:
                      "1px solid rgba(148,163,184,0.5)",
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
                  alert(
                    "Форма-заглушка: напишите мне напрямую в Telegram @RefFofan",
                  )
                }
                style={{
                  padding: "9px 20px",
                  borderRadius: 999,
                  border: "1px solid rgba(248,113,113,0.9)",
                  background:
                    "linear-gradient(120deg, #f97373 0%, #fb923c 35%, #facc15 70%, #f97373 100%)",
                  color: "#020617",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  alignSelf: "flex-start",
                  boxShadow:
                    "0 18px 40px rgba(127,29,29,0.8)",
                  transition:
                    "transform 0.16s ease-out, box-shadow 0.16s ease-out",
                }}
                onMouseEnter={(e) => {
                  const el =
                    e.currentTarget as HTMLButtonElement;
                  el.style.transform =
                    "translateY(-1px) scale(1.01)";
                  el.style.boxShadow =
                    "0 22px 55px rgba(127,29,29,0.95)";
                }}
                onMouseLeave={(e) => {
                  const el =
                    e.currentTarget as HTMLButtonElement;
                  el.style.transform = "none";
                  el.style.boxShadow =
                    "0 18px 40px rgba(127,29,29,0.8)";
                }}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
