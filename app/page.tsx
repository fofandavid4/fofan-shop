"use client";

import React, {
  useState,
  type CSSProperties,
  useEffect,
} from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

// === БАЗОВЫЕ СТИЛИ КНОПОК / ЭЛЕМЕНТОВ ===

const btnPrimaryBase: CSSProperties = {
  padding: "9px 20px",
  borderRadius: 999,
  border: "none",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#020617",
  background: "linear-gradient(90deg,#38bdf8,#22c55e)",
  boxShadow: "0 0 18px rgba(56,189,248,0.55)",
  transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out",
};

const btnPrimary: CSSProperties = {
  ...btnPrimaryBase,
};

const btnSecondary: CSSProperties = {
  padding: "8px 18px",
  borderRadius: 999,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.5)",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(15,23,42,0.86))",
  color: "#e5e7eb",
  cursor: "pointer",
  fontSize: "0.9rem",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out",
};

const chipBase: CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.3)",
  background: "rgba(15,23,42,0.96)",
  color: "#e5e7eb",
  cursor: "pointer",
  fontSize: "0.9rem",
  textAlign: "center",
  transition: "border-color 0.16s ease-out, box-shadow 0.16s ease-out, color 0.16s ease-out",
};

const chipActive: CSSProperties = {
  ...chipBase,
  borderColor: "#22c55e",
  boxShadow: "0 0 18px rgba(34,197,94,0.45)",
  color: "#bbf7d0",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 10,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.35)",
  background: "rgba(15,23,42,0.96)",
  color: "#fff",
  fontSize: "0.9rem",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  fontSize: "0.8rem",
  color: "#9CA3AF",
  marginBottom: "2px",
};

// === HEADER ===

function Header({ onSellClick }: { onSellClick: () => void }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        padding: "10px 16px",
        backgroundColor: "rgba(2,6,23,0.96)",
        borderBottom: "1px solid rgba(148,163,184,0.35)",
        backdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 20,
        flexWrap: "wrap",
        rowGap: 6,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#E0F2FE",
          fontSize: "0.9rem",
        }}
      >
        FofanShop
      </div>

      <nav
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onSellClick}
          style={btnPrimary}
        >
          Продать
        </button>

        <a href="/board" style={btnSecondary}>
          Доска объявлений
        </a>

        <a
          href="/refund"
          style={{
            ...btnSecondary,
            borderColor: "rgba(248,113,113,0.7)",
            color: "#fecaca",
            boxShadow: "0 0 18px rgba(248,113,113,0.45)",
          }}
        >
          Рефаунд
        </a>
      </nav>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <a
          href="/contact"
          style={{
            fontSize: "0.85rem",
            color: "#9CA3AF",
            textDecoration: "none",
          }}
        >
          Связаться
        </a>

        <Link
          href="/buyer"
          style={{
            fontSize: "0.8rem",
            color: "#e5e7eb",
            textDecoration: "none",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.5)",
            padding: "6px 10px",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
          }}
        >
          Кабинет скупщика
        </Link>

        <Link
          href="/admin"
          style={{
            fontSize: "0.8rem",
            color: "#e5e7eb",
            textDecoration: "none",
            borderRadius: 999,
            border: "1px solid rgba(148,163,184,0.5)",
            padding: "6px 10px",
            background:
              "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
          }}
        >
          Админ‑кабинет
        </Link>
      </div>
    </header>
  );
}

// === SELL WIZARD ===

type Category = "phone" | "keyboard_mouse" | "other";
type Condition = "new" | "used";

function SellWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category | "">("");
  const [title, setTitle] = useState("");
  const [condition, setCondition] = useState<Condition | "">("");
  const [memory, setMemory] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [otherCategory, setOtherCategory] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [problemsDesc, setProblemsDesc] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const totalSteps = 5;

  const toggleProblem = (p: string) =>
    setProblems((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );

  const handleAddPhoto = () => {
    if (!pendingFile) return;
    if (files.length >= 10) {
      alert("Максимум 10 фото.");
      return;
    }
    setFiles((prev) => [...prev, pendingFile]);
    setPendingFile(null);
  };

  const handleRemovePhoto = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const canGoNext = () => {
    if (step === 0) return !!category;
    if (step === 1) return !!title && !!condition;
    if (step === 2) return !!price;
    if (step === 3) return files.length >= 1;
    if (step === 4) return !!city && !!contact;
    return true;
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("category", category);
      formData.append("title", title);
      formData.append("condition", condition);

      const extra = {
        memory: memory || null,
        deviceType: deviceType || null,
        otherCategory: otherCategory || null,
      };
      formData.append("extra_fields", JSON.stringify(extra));

      const probs = condition === "used" ? problems : [];
      formData.append("problems", JSON.stringify(probs));

      const problems_description =
        condition === "used" ? problemsDesc || "" : "";
      formData.append("problems_description", problems_description);

      formData.append(
        "price_client",
        price ? String(Number(price)) : "",
      );
      formData.append("city", city);
      formData.append("contact", contact);

      files.forEach((file) => {
        formData.append("images", file);
      });

      await apiFetch({
        path: "/api/items",
        method: "POST",
        body: formData,
      });

      setSubmitted(true);
    } catch (e) {
      console.error(e);
      alert(
        "Ошибка отправки или сервер недоступен. Попробуйте ещё раз.",
      );
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        background: "rgba(2,6,23,0.9)",
        backdropFilter: "blur(18px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 580,
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.94))",
          borderRadius: 24,
          border: "1px solid rgba(148,163,184,0.45)",
          padding: "18px 20px 20px",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(15,23,42,0.9)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.15rem" }}>Продать вещь</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.5)",
              color: "#9CA3AF",
              cursor: "pointer",
              fontSize: "0.9rem",
              padding: "4px 9px",
              backgroundColor: "rgba(15,23,42,0.9)",
            }}
          >
            Закрыть ✕
          </button>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 99,
              background: "rgba(148,163,184,0.22)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((step + 1) / totalSteps) * 100}%`,
                borderRadius: 99,
                background: "linear-gradient(90deg,#38bdf8,#22c55e)",
                transition: "width 0.25s",
              }}
            />
          </div>
          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
            Шаг {step + 1} из {totalSteps}
          </span>
        </div>

        {!submitted ? (
          <>
            {step === 0 && (
              <div>
                <h3 style={{ fontSize: "1rem", marginBottom: 10 }}>
                  Что вы хотите продать?
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(150px,1fr))",
                    gap: 10,
                  }}
                >
                  {(
                    [
                      ["phone", "📱 Телефон"],
                      ["keyboard_mouse", "⌨️ Клавиатура / мышь"],
                      ["other", "📦 Другое"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      style={
                        category === key ? chipActive : chipBase
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <h3 style={{ fontSize: "1rem", margin: 0 }}>
                  Базовая информация
                </h3>

                <div>
                  <div style={labelStyle}>Название / модель</div>
                  <input
                    style={inputStyle}
                    placeholder="iPhone 13, Logitech G Pro..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {category === "phone" && (
                  <div>
                    <div style={labelStyle}>Объём памяти</div>
                    <select
                      style={inputStyle}
                      value={memory}
                      onChange={(e) => setMemory(e.target.value)}
                    >
                      <option value="">Выберите</option>
                      <option value="64">64 ГБ</option>
                      <option value="128">128 ГБ</option>
                      <option value="256">256 ГБ</option>
                      <option value="512">512 ГБ+</option>
                    </select>
                  </div>
                )}

                {category === "keyboard_mouse" && (
                  <div>
                    <div style={labelStyle}>Тип устройства</div>
                    <select
                      style={inputStyle}
                      value={deviceType}
                      onChange={(e) =>
                        setDeviceType(e.target.value)
                      }
                    >
                      <option value="">Выберите</option>
                      <option value="mechanical">Механическая</option>
                      <option value="membrane">Мембранная</option>
                      <option value="gaming">Игровая</option>
                      <option value="office">Офисная</option>
                    </select>
                  </div>
                )}

                {category === "other" && (
                  <div>
                    <div style={labelStyle}>
                      К какой категории ближе
                    </div>
                    <select
                      style={inputStyle}
                      value={otherCategory}
                      onChange={(e) =>
                        setOtherCategory(e.target.value)
                      }
                    >
                      <option value="">Выберите</option>
                      <option value="powerbank">Пауэрбанк</option>
                      <option value="charging">
                        Зарядная станция
                      </option>
                      <option value="clothes">Одежда</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                )}

                <div>
                  <div style={labelStyle}>Состояние</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setCondition("new")}
                      style={
                        condition === "new"
                          ? chipActive
                          : chipBase
                      }
                    >
                      Новый
                    </button>
                    <button
                      onClick={() => setCondition("used")}
                      style={
                        condition === "used"
                          ? chipActive
                          : chipBase
                      }
                    >
                      Б/у
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {condition === "used" && (
                  <>
                    <h3 style={{ fontSize: "1rem", margin: 0 }}>
                      Проблемы с товаром
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      {[
                        "Экран",
                        "Батарея",
                        "Корпус",
                        "Камера/звук/микрофон",
                        "Другое",
                      ].map((p) => {
                        const active = problems.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() => toggleProblem(p)}
                            style={
                              active
                                ? {
                                    ...chipBase,
                                    borderColor: "#A855FF",
                                    color: "#e9d5ff",
                                    boxShadow:
                                      "0 0 18px rgba(168,85,247,0.4)",
                                  }
                                : chipBase
                            }
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    <div>
                      <div style={labelStyle}>
                        Опишите проблемы подробнее
                      </div>
                      <textarea
                        style={{
                          ...inputStyle,
                          minHeight: 60,
                          resize: "vertical",
                        }}
                        placeholder="Царапины, не держит батарея..."
                        value={problemsDesc}
                        onChange={(e) =>
                          setProblemsDesc(e.target.value)
                        }
                      />
                    </div>
                  </>
                )}

                <div>
                  <div style={labelStyle}>Желаемая цена (грн)</div>
                  <input
                    type="number"
                    style={inputStyle}
                    placeholder="5000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <h3 style={{ fontSize: "1rem", margin: 0 }}>
                  Фотографии товара
                </h3>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#9CA3AF",
                    margin: 0,
                  }}
                >
                  Загрузите от 1 до 10 фото.
                </p>

                <label
                  style={{
                    ...btnSecondary,
                    borderStyle: "dashed",
                    borderColor: "rgba(148,163,184,0.7)",
                    padding: "10px 16px",
                    justifyContent: "center",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  Выбрать файл
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setPendingFile(file);
                    }}
                  />
                </label>

                {pendingFile && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#9CA3AF",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>Выбран: {pendingFile.name}</span>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      style={{
                        ...btnPrimary,
                        padding: "6px 14px",
                        fontSize: "0.8rem",
                        boxShadow: "none",
                      }}
                    >
                      Добавить фото
                    </button>
                  </div>
                )}

                {files.length > 0 && (
                  <div
                    style={{
                      marginTop: 6,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        style={{
                          borderRadius: 10,
                          borderWidth: 1,
                          borderStyle: "solid",
                          borderColor: "rgba(148,163,184,0.4)",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#020617",
                        }}
                      >
                        <span
                          style={{
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#f97373",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#9CA3AF",
                  }}
                >
                  Фото будут загружены на сервер вместе с заявкой.
                </p>
              </div>
            )}

            {step === 4 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <h3 style={{ fontSize: "1rem", margin: 0 }}>
                  Как с вами связаться?
                </h3>
                <div>
                  <div style={labelStyle}>Город</div>
                  <input
                    style={inputStyle}
                    placeholder="Київ, Львів, Харків..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <div style={labelStyle}>
                    Контакт (Telegram @, телефон или другое)
                  </div>
                  <input
                    style={inputStyle}
                    placeholder="@username, +380..."
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                marginTop: 16,
              }}
            >
              <button
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                style={{
                  ...btnSecondary,
                  flex: 1,
                  opacity: step === 0 ? 0.4 : 1,
                }}
              >
                Назад
              </button>

              {step < totalSteps - 1 ? (
                <button
                  onClick={() => {
                    if (!canGoNext()) {
                      if (step === 3 && files.length < 1) {
                        alert("Добавьте хотя бы 1 фото.");
                      }
                      return;
                    }
                    setStep((s) => s + 1);
                  }}
                  style={{ ...btnPrimary, flex: 1 }}
                >
                  Далее
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  style={{ ...btnPrimary, flex: 1 }}
                >
                  Отправить заявку
                </button>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "24px 0 6px",
            }}
          >
            <h3
              style={{
                color: "#22c55e",
                marginBottom: 6,
              }}
            >
              ✅ Заявка отправлена!
            </h3>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              Мы свяжемся с вами после оценки.
            </p>
            <button
              onClick={onClose}
              style={{ ...btnPrimary, marginTop: 14 }}
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// === ГЛАВНАЯ СТРАНИЦА ===

export default function Home() {
  const [showSell, setShowSell] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <style>
        {`
@keyframes fsNeonPulse {
  0% {
    text-shadow: 0 0 10px rgba(56,189,248,0.9), 0 0 30px rgba(56,189,248,0.4);
  }
  100% {
    text-shadow: 0 0 18px rgba(56,189,248,1), 0 0 40px rgba(34,197,94,0.8);
  }
}
@keyframes fsCardGlow {
  0% {
    transform: translate3d(-4%, -3%, 0) scale(1.05);
  }
  100% {
    transform: translate3d(4%, 3%, 0) scale(1.08);
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
`}
      </style>
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#020617",
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.22) 0, transparent 55%), radial-gradient(circle at 100% 0%, rgba(52,211,153,0.2) 0, transparent 55%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.2) 0, transparent 55%)",
          color: "#ffffff",
        }}
      >
        <Header onSellClick={() => setShowSell(true)} />

        <section
          style={{
            minHeight: "calc(100vh - 70px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22,
            padding: isMobile
              ? "24px 14px 32px"
              : "40px 24px",
            maxWidth: 1120,
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "minmax(0,1fr)"
                : "minmax(0,1.3fr) minmax(0,1fr)",
              gap: isMobile ? 18 : 24,
              alignItems: "center",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "clamp(30px, 5vw, 40px)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#E0F2FE",
                  marginBottom: 10,
                  textShadow:
                    "0 0 18px rgba(56,189,248,0.9), 0 0 36px rgba(56,189,248,0.8)",
                  animation: "fsNeonPulse 5s ease-in-out infinite alternate",
                }}
              >
                FofanShop
              </h1>
              <p
                style={{
                  color: "#9CA3AF",
                  fontSize: "clamp(14px, 2.6vw, 16px)",
                  maxWidth: 420,
                  margin: 0,
                }}
              >
                Продай технику без переписок и торга — мы сами оценим и заберём.
              </p>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => setShowSell(true)}
                  style={{
                    ...btnPrimary,
                    boxShadow:
                      "0 0 18px rgba(56,189,248,0.9), 0 0 34px rgba(34,197,94,0.7)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  Заполнить анкету
                </button>

                <a href="/board" style={btnSecondary}>
                  Смотреть выкупы
                </a>
              </div>

              <div
                style={{
                  marginTop: 16,
                  fontSize: "0.85rem",
                  color: "#9CA3AF",
                  maxWidth: 420,
                }}
              >
                <div
                  style={{
                    opacity: 0.9,
                    marginBottom: 6,
                  }}
                >
                  Как это работает:
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <li>1. Заполняешь короткую анкету за 1–2 минуты.</li>
                  <li>2. Мы быстро оцениваем вещь и даём цену.</li>
                  <li>3. Договариваемся о выкупе и оплате.</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                borderRadius: 24,
                border: "1px solid rgba(148,163,184,0.35)",
                background:
                  "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 60%), radial-gradient(circle at bottom right, rgba(34,197,94,0.12), transparent 60%), linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
                boxShadow:
                  "0 24px 70px rgba(15,23,42,0.95), 0 0 40px rgba(56,189,248,0.18)",
                padding: "18px 20px 20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-30%",
                  background:
                    "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.16), transparent 60%), radial-gradient(circle at 100% 100%, rgba(34,197,94,0.18), transparent 60%)",
                  opacity: 0.7,
                  pointerEvents: "none",
                  mixBlendMode: "screen",
                  animation: "fsCardGlow 8s ease-in-out infinite alternate",
                }}
              />
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#9CA3AF",
                    marginBottom: 8,
                  }}
                >
                  Пример сделки
                </div>
                <div
                  style={{
                    borderRadius: 16,
                    border: "1px solid rgba(30,64,175,0.7)",
                    padding: "10px 12px",
                    background:
                      "radial-gradient(circle at top, rgba(15,23,42,0.9) 0, rgba(15,23,42,1) 60%)",
                    fontSize: "0.84rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <div>
                      <div style={{ color: "#e5e7eb" }}>
                        iPhone 12, 128 ГБ
                      </div>
                      <div
                        style={{
                          color: "#9CA3AF",
                          fontSize: "0.78rem",
                        }}
                      >
                        Б/у, мелкие царапины
                      </div>
                    </div>
                    <div
                      style={{
                        textAlign: "right",
                        fontSize: "0.78rem",
                        color: "#bbf7d0",
                      }}
                    >
                      Выкуп: 14 000 грн
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: "0.78rem",
                      color: "#9CA3AF",
                    }}
                  >
                    Клиент заполнил анкету, отправил фото — мы оценили и
                    забрали в тот же день.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {showSell && <SellWizard onClose={() => setShowSell(false)} />}
      </main>
    </>
  );
}
