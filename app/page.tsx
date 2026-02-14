"use client";

import React, {
  useState,
  type CSSProperties,
  useEffect,
  useRef,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

// === БАЗОВЫЕ СТИЛИ / ТЁМНО‑КРАСНАЯ ТЕМА ===

const pageWrap: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#050208",
  color: "#f9fafb",
  position: "relative",
  overflow: "hidden",
};

const meshLayer: CSSProperties = {
  position: "fixed",
  inset: "-20%",
  backgroundImage:
    "radial-gradient(at 0% 0%, rgba(248,113,113,0.72) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(190,24,93,0.55) 0px, transparent 55%), radial-gradient(at 0% 100%, rgba(127,29,29,0.6) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(15,23,42,0.96) 0px, #020105 60%)",
  backgroundSize: "180% 180%",
  animation: "meshMove 22s ease-in-out infinite alternate",
  opacity: 0.9,
  pointerEvents: "none",
  zIndex: 0,
};

const noiseLayer: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='noStitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
  mixBlendMode: "soft-light",
  pointerEvents: "none",
  zIndex: 0,
};

const container: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  padding: "20px 18px 40px",
  boxSizing: "border-box",
  position: "relative",
  zIndex: 1,
};

const glassPanel: CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(248,113,113,0.45)",
  background:
    "linear-gradient(135deg, rgba(7,10,20,0.96), rgba(15,23,42,0.92))",
  padding: "22px 18px 24px",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.96), 0 0 55px rgba(127,29,29,0.8)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  position: "relative",
  overflow: "hidden",
};

const glowBorder: CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: 28,
  border: "1px solid transparent",
  background:
    "linear-gradient(120deg, rgba(248,113,113,0.9), rgba(251,191,36,0.7), rgba(248,113,113,0.95)) border-box",
  WebkitMask:
    "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  pointerEvents: "none",
  opacity: 0.5,
};

const btnPrimaryBase: CSSProperties = {
  padding: "9px 20px",
  borderRadius: 999,
  border: "1px solid rgba(248,113,113,0.95)",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#0b0f19",
  background:
    "linear-gradient(120deg, #f97373 0%, #fb923c 35%, #facc15 70%, #f97373 100%)",
  boxShadow: "0 20px 42px rgba(127,29,29,0.95)",
  transition:
    "transform 0.18s ease-out, box-shadow 0.18s ease-out, filter 0.18s ease-out",
};

const btnPrimary: CSSProperties = {
  ...btnPrimaryBase,
};

const btnSecondary: CSSProperties = {
  padding: "8px 18px",
  borderRadius: 999,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.7)",
  background:
    "radial-gradient(circle at top, rgba(148,163,184,0.24), transparent 65%), rgba(15,23,42,0.96)",
  color: "#e5e7eb",
  cursor: "pointer",
  fontSize: "0.9rem",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition:
    "transform 0.18s ease-out, box-shadow 0.18s ease-out, border-color 0.18s ease-out, background 0.18s ease-out, color 0.18s ease-out",
};

const chipBase: CSSProperties = {
  padding: "10px 16px",
  borderRadius: 12,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.45)",
  background: "rgba(15,23,42,0.98)",
  color: "#e5e7eb",
  cursor: "pointer",
  fontSize: "0.9rem",
  textAlign: "center",
  transition:
    "border-color 0.16s ease-out, box-shadow 0.16s ease-out, color 0.16s ease-out, background 0.16s ease-out, transform 0.16s ease-out",
};

const chipActive: CSSProperties = {
  ...chipBase,
  borderColor: "rgba(248,113,113,0.95)",
  boxShadow: "0 0 18px rgba(248,113,113,0.6)",
  color: "#fee2e2",
  background:
    "radial-gradient(circle at top, rgba(248,113,113,0.24), transparent 65%), rgba(15,23,42,0.98)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 10,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.5)",
  background: "rgba(15,23,42,0.98)",
  color: "#fff",
  fontSize: "0.9rem",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  fontSize: "0.8rem",
  color: "#9CA3AF",
  marginBottom: "2px",
};

// === TILT ===

const tiltWrapperBase: CSSProperties = {
  borderRadius: 28,
  transformStyle: "preserve-3d",
  transition: "transform 0.18s ease-out, box-shadow 0.18s ease-out",
};

const tiltWrapperHover: CSSProperties = {
  boxShadow:
    "0 26px 80px rgba(0,0,0,0.96), 0 0 40px rgba(248,113,113,0.55)",
};

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);
  const [transform, setTransform] =
    useState<string>("perspective(900px)");

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rX = ((y - midY) / midY) * -6;
    const rY = ((x - midX) / midX) * 6;

    setTransform(
      `perspective(900px) rotateX(${rX.toFixed(
        2,
      )}deg) rotateY(${rY.toFixed(2)}deg) scale(1.01)`,
    );
  };

  const reset = () => {
    setTransform("perspective(900px)");
  };

  return (
    <div
      ref={ref}
      style={{
        ...(tiltWrapperBase as CSSProperties),
        ...(hover ? tiltWrapperHover : {}),
        transform,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        reset();
      }}
      onMouseMove={handleMove}
    >
      {children}
    </div>
  );
}

// === HEADER + ЛИНИЯ + КАПЛЯ ===

function Header({ onSellClick }: { onSellClick: () => void }) {
  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid rgba(148,163,184,0.0)",
          background:
            "linear-gradient(90deg, rgba(5,5,11,0.96), rgba(12,10,18,0.96))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            flexWrap: "wrap",
            rowGap: 6,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#fee2e2",
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
              className="fs-btn fs-btn-primary"
            >
              Продать
            </button>

            <a href="/board" style={btnSecondary} className="fs-btn">
              Доска объявлений
            </a>

            <a
              href="/refund"
              style={{
                ...btnSecondary,
                borderColor: "rgba(248,113,113,0.85)",
                color: "#fecaca",
                boxShadow: "0 0 18px rgba(248,113,113,0.6)",
              }}
              className="fs-btn"
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
              className="fs-link-soft"
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
                border: "1px solid rgba(148,163,184,0.7)",
                padding: "6px 10px",
                background:
                  "radial-gradient(circle at top, rgba(148,163,184,0.22), transparent 60%), rgba(15,23,42,0.98)",
              }}
              className="fs-btn fs-btn-outline"
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
                border: "1px solid rgba(148,163,184,0.7)",
                padding: "6px 10px",
                background:
                  "radial-gradient(circle at top, rgba(148,163,184,0.22), transparent 60%), rgba(15,23,42,0.98)",
              }}
              className="fs-btn fs-btn-outline"
            >
              Админ‑кабинет
            </Link>
          </div>
        </div>
      </header>

      {/* линия + капля без остановок */}
      <div
        style={{
          width: "100%",
          height: 3,
          backgroundImage:
            "linear-gradient(90deg, rgba(248,113,113,0.12), rgba(248,113,113,1), rgba(251,191,36,0.9), rgba(248,113,113,1), rgba(248,113,113,0.12))",
          backgroundSize: "220% 100%",
          boxShadow:
            "0 0 22px rgba(248,113,113,0.95), 0 0 40px rgba(127,29,29,0.95)",
          animation: "fsLineFlow 4.5s linear infinite",
          position: "relative",
          overflow: "visible",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "72%",
            top: -16,
            width: 18,
            height: 26,
            borderRadius: "60% 60% 70% 70% / 80% 80% 45% 45%",
            background:
              "radial-gradient(circle at 30% 0%, #fef9c3 0, #facc15 18%, #fb923c 40%, #f97373 70%, #7f1d1d 100%)",
            boxShadow:
              "0 0 18px rgba(248,113,113,0.95), 0 0 30px rgba(127,29,29,0.9)",
            animation: "fsLavaDropSmooth 2.6s linear infinite",
            opacity: 0.96,
            willChange: "transform, opacity",
            transform: "translate3d(0,0,0)",
          }}
        />
      </div>
    </>
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
      formData.append(
        "problems_description",
        problems_description,
      );

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
        background: "rgba(5,5,11,0.94)",
        backdropFilter: "blur(22px)",
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
          border: "1px solid rgba(248,113,113,0.7)",
          padding: "18px 20px 20px",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.96), 0 0 0 1px rgba(15,23,42,0.9)",
          maxHeight: "92vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div style={glowBorder} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.15rem" }}>
            Продать вещь
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.7)",
              color: "#e5e7eb",
              cursor: "pointer",
              fontSize: "0.9rem",
              padding: "4px 9px",
              backgroundColor: "rgba(15,23,42,0.98)",
            }}
            className="fs-btn fs-btn-outline"
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
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 99,
              background: "rgba(148,163,184,0.25)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${((step + 1) / totalSteps) * 100}%`,
                borderRadius: 99,
                background:
                  "linear-gradient(90deg,#f97373,#fb923c,#facc15)",
                transition: "width 0.25s",
              }}
            />
          </div>
          <span
            style={{ fontSize: "0.75rem", color: "#9CA3AF" }}
          >
            Шаг {step + 1} из {totalSteps}
          </span>
        </div>

        {!submitted ? (
          <>
            {step === 0 && (
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3
                  style={{ fontSize: "1rem", marginBottom: 10 }}
                >
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
                      className="fs-chip"
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
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <h3
                  style={{ fontSize: "1rem", margin: 0 }}
                >
                  Базовая информация
                </h3>

                <div>
                  <div style={labelStyle}>
                    Название / модель
                  </div>
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
                      onChange={(e) =>
                        setMemory(e.target.value)
                      }
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
                      <option value="mechanical">
                        Механическая
                      </option>
                      <option value="membrane">
                        Мембранная
                      </option>
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
                      <option value="powerbank">
                        Пауэрбанк
                      </option>
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
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    <button
                      onClick={() => setCondition("new")}
                      style={
                        condition === "new"
                          ? chipActive
                          : chipBase
                      }
                      className="fs-chip"
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
                      className="fs-chip"
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
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {condition === "used" && (
                  <>
                    <h3
                      style={{ fontSize: "1rem", margin: 0 }}
                    >
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
                        const active =
                          problems.includes(p);
                        return (
                          <button
                            key={p}
                            onClick={() =>
                              toggleProblem(p)
                            }
                            style={
                              active
                                ? {
                                    ...chipBase,
                                    borderColor:
                                      "rgba(248,113,113,0.95)",
                                    color: "#fee2e2",
                                    boxShadow:
                                      "0 0 18px rgba(248,113,113,0.6)",
                                  }
                                : chipBase
                            }
                            className="fs-chip"
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
                          setProblemsDesc(
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </>
                )}

                <div>
                  <div style={labelStyle}>
                    Желаемая цена (грн)
                  </div>
                  <input
                    type="number"
                    style={inputStyle}
                    placeholder="5000"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
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
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <h3
                  style={{ fontSize: "1rem", margin: 0 }}
                >
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
                    borderColor:
                      "rgba(248,113,113,0.8)",
                    padding: "10px 16px",
                    justifyContent: "center",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  className="fs-btn"
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
                    <span>
                      Выбран: {pendingFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      style={{
                        ...btnPrimary,
                        padding: "6px 14px",
                        fontSize: "0.8rem",
                        boxShadow: "none",
                      }}
                      className="fs-btn fs-btn-primary"
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
                          borderColor:
                            "rgba(148,163,184,0.55)",
                          padding: "4px 8px",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          background: "#020105",
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
                          onClick={() =>
                            handleRemovePhoto(idx)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "#f97373",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                          }}
                          className="fs-link-soft"
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
                  Фото будут загружены на сервер вместе
                  с заявкой.
                </p>
              </div>
            )}

            {step === 4 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <h3
                  style={{ fontSize: "1rem", margin: 0 }}
                >
                  Как с вами связаться?
                </h3>
                <div>
                  <div style={labelStyle}>Город</div>
                  <input
                    style={inputStyle}
                    placeholder="Київ, Львів, Харків..."
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                  />
                </div>
                <div>
                  <div style={labelStyle}>
                    Контакт (Telegram @, телефон или
                    другое)
                  </div>
                  <input
                    style={inputStyle}
                    placeholder="@username, +380..."
                    value={contact}
                    onChange={(e) =>
                      setContact(e.target.value)
                    }
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
                position: "relative",
                zIndex: 1,
              }}
            >
              <button
                onClick={() =>
                  setStep((s) => Math.max(s - 1, 0))
                }
                disabled={step === 0}
                style={{
                  ...btnSecondary,
                  flex: 1,
                  opacity: step === 0 ? 0.4 : 1,
                }}
                className="fs-btn"
              >
                Назад
              </button>

              {step < totalSteps - 1 ? (
                <button
                  onClick={() => {
                    if (!canGoNext()) {
                      if (
                        step === 3 &&
                        files.length < 1
                      ) {
                        alert(
                          "Добавьте хотя бы 1 фото.",
                        );
                      }
                      return;
                    }
                    setStep((s) => s + 1);
                  }}
                  style={{ ...btnPrimary, flex: 1 }}
                  className="fs-btn fs-btn-primary"
                >
                  Далее
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  style={{ ...btnPrimary, flex: 1 }}
                  className="fs-btn fs-btn-primary"
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
              position: "relative",
              zIndex: 1,
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
              className="fs-btn fs-btn-primary"
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
@keyframes meshMove {
  0% {
    background-position: 0% 0%;
    transform: scale(1.06) translate3d(-2%, -2%, 0);
  }
  50% {
    background-position: 60% 40%;
    transform: scale(1.1) translate3d(2%, 3%, 0);
  }
  100% {
    background-position: 20% 80%;
    transform: scale(1.08) translate3d(-3%, 4%, 0);
  }
}
@keyframes fsLineFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* капля: чисто линейное движение, без easing на уровне animation,
   easing задаётся только самим keyframes (по сути оно тут тоже линейное) */
@keyframes fsLavaDropSmooth {
  0% {
    transform: translate3d(0, -16px, 0) scale(0.9, 1.1);
    opacity: 0;
  }
  5% {
    transform: translate3d(0, 0px, 0) scale(1.0, 1.0);
    opacity: 1;
  }
  70% {
    transform: translate3d(0, 100px, 0) scale(1.04, 0.97);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 160px, 0) scale(0.9, 1.08);
    opacity: 0;
  }
}

/* НЕОНОВЫЕ КНОПКИ */
.fs-btn {
  position: relative;
  overflow: hidden;
}
.fs-btn::before {
  content: "";
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at 10% 0%, rgba(248,113,113,0.2), transparent 55%);
  opacity: 0;
  transform: translate3d(-20%, 0, 0) rotate(8deg);
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
  pointer-events: none;
}
.fs-btn:hover::before {
  opacity: 1;
  transform: translate3d(10%, 0, 0) rotate(0deg);
}
.fs-btn:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 0 24px rgba(248,113,113,0.9);
}
.fs-btn:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 10px 22px rgba(15,23,42,0.9);
}

/* чипы */
.fs-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 12px rgba(148,163,184,0.5);
}

/* ссылки */
.fs-link-soft {
  transition: color 0.18s ease-out, text-shadow 0.18s ease-out;
}
.fs-link-soft:hover {
  color: #e5e7eb;
  text-shadow: 0 0 10px rgba(148,163,184,0.7);
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

      <main style={pageWrap}>
        <div style={meshLayer} />
        <div style={noiseLayer} />

        <Header onSellClick={() => setShowSell(true)} />

        <div style={container}>
          <section
            style={{
              minHeight: "calc(100vh - 70px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 22,
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
                    color: "#fee2e2",
                    marginBottom: 10,
                  }}
                >
                  FofanShop
                </h1>
                <p
                  style={{
                    color: "#e5e7eb",
                    fontSize: "clamp(14px, 2.6vw, 16px)",
                    maxWidth: 420,
                    margin: 0,
                  }}
                >
                  Продай технику без переписок и торга — мы сами
                  оценим и заберём.
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
                    }}
                    className="fs-btn fs-btn-primary"
                  >
                    Заполнить анкету
                  </button>

                  <a
                    href="/board"
                    style={btnSecondary}
                    className="fs-btn"
                  >
                    Смотреть выкупы
                  </a>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    fontSize: "0.85rem",
                    color: "#e5e7eb",
                    maxWidth: 420,
                  }}
                >
                  <div
                    style={{
                      opacity: 0.95,
                      marginBottom: 4,
                    }}
                  >
                    • Честная оценка по фото, без «потом ещё
                    скиньте».
                  </div>
                  <div
                    style={{
                      opacity: 0.9,
                      marginBottom: 4,
                    }}
                  >
                    • Работаем с телефонами, периферией и другой
                    техникой.
                  </div>
                  <div
                    style={{
                      opacity: 0.85,
                    }}
                  >
                    • Пишем в Telegram, не звоним без
                    предупреждения.
                  </div>
                </div>
              </div>

              <TiltCard>
                <div style={glassPanel}>
                  <div style={glowBorder} />

                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.9rem",
                          color: "#e5e7eb",
                        }}
                      >
                        Пример заявки
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "4px 9px",
                          borderRadius: 999,
                          border:
                            "1px solid rgba(248,113,113,0.75)",
                          color: "#fecaca",
                          background:
                            "rgba(15,23,42,0.98)",
                        }}
                      >
                        Клиент · Киев
                      </span>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#9CA3AF",
                          marginBottom: 2,
                        }}
                      >
                        Название
                      </div>
                      <div
                        style={{
                          fontSize: "0.95rem",
                          color: "#e5e7eb",
                        }}
                      >
                        iPhone 13 · 128 ГБ
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        fontSize: "0.78rem",
                      }}
                    >
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 999,
                          border:
                            "1px solid rgba(248,113,113,0.8)",
                          color: "#fecaca",
                          background:
                            "rgba(127,29,29,0.5)",
                        }}
                      >
                        Состояние: Б/у
                      </span>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 999,
                          border:
                            "1px solid rgba(148,163,184,0.8)",
                          color: "#e5e7eb",
                          background:
                            "rgba(15,23,42,0.96)",
                        }}
                      >
                        Проблемы: экран, батарея
                      </span>
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 999,
                          border:
                            "1px solid rgba(52,211,153,0.8)",
                          color: "#bbf7d0",
                          background:
                            "rgba(22,163,74,0.25)",
                        }}
                      >
                        Клиент хочет: 17 000 грн
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: "0.8rem",
                        color: "#9CA3AF",
                      }}
                    >
                      Комментарий: «Телефон в плёнке, не тонул.
                      Заряд держит хуже, чем раньше».
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 10,
                        fontSize: "0.8rem",
                      }}
                    >
                      <div
                        style={{
                          color: "#9CA3AF",
                        }}
                      >
                        Ожидает оценки скупщика…
                      </div>
                      <div
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          border:
                            "1px solid rgba(248,113,113,0.8)",
                          color: "#fecaca",
                          background:
                            "rgba(15,23,42,0.96)",
                        }}
                      >
                        Ответ до 24 часов
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </section>
        </div>

        {showSell && (
          <SellWizard onClose={() => setShowSell(false)} />
        )}
      </main>
    </>
  );
}
