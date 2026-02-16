"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { apiFetch, getApiFileUrl } from "@/lib/api";

interface PublicItem {
  id: number;
  category: "phone" | "keyboard_mouse" | "other";
  title: string;
  condition: "new" | "used";
  problems: string[] | null;
  price_client: string | null;
  city: string | null;
  deal_status: string;
  photos?: string[] | null;
}

const categoryLabels: Record<string, string> = {
  phone: "📱 Телефон",
  keyboard_mouse: "⌨️ Клавиатура / мышь",
  other: "📦 Другое",
};

const chipBase: CSSProperties = {
  padding: "6px 14px",
  borderRadius: 999,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.4)",
  background: "rgba(15,23,42,0.96)",
  color: "#9CA3AF",
  cursor: "pointer",
  fontSize: "0.85rem",
  transition:
    "border-color 0.16s ease-out, box-shadow 0.16s ease-out, color 0.16s ease-out, background 0.16s ease-out",
};

const chipActive: CSSProperties = {
  ...chipBase,
  borderColor: "rgba(248,113,113,0.95)",
  color: "#fecaca",
  boxShadow: "0 0 16px rgba(248,113,113,0.5)",
  background:
    "radial-gradient(circle at top, rgba(248,113,113,0.18), transparent 60%), rgba(15,23,42,0.98)",
};

const mainWrap: CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#050208",
  backgroundImage:
    "radial-gradient(circle at 0% 0%, rgba(248,113,113,0.22) 0, transparent 55%), radial-gradient(circle at 100% 0%, rgba(251,191,36,0.18) 0, transparent 55%), radial-gradient(circle at 50% 100%, rgba(127,29,29,0.28) 0, transparent 55%)",
  color: "#ffffff",
  padding: "20px 16px 32px",
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const outerCard: CSSProperties = {
  maxWidth: 1120,
  margin: "0 auto",
  borderRadius: 28,
  padding: "18px 18px 20px",
  border: "1px solid rgba(248,113,113,0.5)",
  background:
    "linear-gradient(135deg, rgba(7,10,20,0.98), rgba(15,23,42,0.94))",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.96), 0 0 55px rgba(15,23,42,0.9)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  position: "relative",
  overflow: "hidden",
};

const outerGlow: CSSProperties = {
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
};

export default function BoardPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [items, setItems] = useState<PublicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PublicItem | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  async function loadItems(cat: string | null) {
    setLoading(true);
    try {
      const params = cat ? `?category=${cat}` : "";
      const res = await apiFetch({
        path: `/api/items/public${params}`,
      });
      const data = (await res.json()) as PublicItem[];
      setItems(data ?? []);
    } catch (e) {
      console.error(e);
      alert("Не удалось загрузить объявления");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems(filter);
  }, [filter]);

  return (
    <main style={mainWrap}>
      <style>
        {`
@keyframes boardGlowPulse {
  0% { box-shadow: 0 30px 80px rgba(0,0,0,0.96); }
  100% { box-shadow: 0 40px 100px rgba(248,113,113,0.5); }
}
`}
      </style>

      <div style={outerCard}>
        <div style={outerGlow} />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <a
            href="/"
            style={{
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
              margin: "14px 0 4px",
            }}
          >
            Доска объявлений
          </h1>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: "0.85rem",
              marginBottom: 14,
            }}
          >
            Реальные объявления, которые выставлены в продажу.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <button
              style={filter === null ? chipActive : chipBase}
              onClick={() => setFilter(null)}
            >
              Все
            </button>
            <button
              style={filter === "phone" ? chipActive : chipBase}
              onClick={() => setFilter("phone")}
            >
              Телефоны
            </button>
            <button
              style={
                filter === "keyboard_mouse"
                  ? chipActive
                  : chipBase
              }
              onClick={() => setFilter("keyboard_mouse")}
            >
              Клавиатуры / мыши
            </button>
            <button
              style={filter === "other" ? chipActive : chipBase}
              onClick={() => setFilter("other")}
            >
              Другое
            </button>
          </div>

          {loading && (
            <p style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
              Загрузка…
            </p>
          )}

          {!loading && items.length === 0 && (
            <p style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
              Пока нет публичных объявлений. Сделайте заявки public в
              админ‑панели.
            </p>
          )}

          {!loading && items.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 14,
              }}
            >
              {items.map((item) => {
                const photos = Array.isArray(item.photos)
                  ? item.photos
                  : [];
                const hasPhotos = photos.length > 0;
                const thumbnail = hasPhotos
                  ? getApiFileUrl(photos[0])
                  : null;

                return (
                  <div
                    key={item.id}
                    style={{
                      borderRadius: 20,
                      border:
                        "1px solid rgba(148,163,184,0.32)",
                      background:
                        "radial-gradient(circle at top left, rgba(248,113,113,0.16), transparent 55%), rgba(7,10,20,0.98)",
                      padding: "11px 11px 13px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow:
                        "0 18px 40px rgba(0,0,0,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
                      transition:
                        "transform 0.18s ease-out, box-shadow 0.18s ease-out, border-color 0.18s ease-out",
                    }}
                    onMouseEnter={(e) => {
                      const el =
                        e.currentTarget as HTMLDivElement;
                      el.style.transform =
                        "translateY(-2px) scale(1.01)";
                      el.style.boxShadow =
                        "0 24px 60px rgba(0,0,0,0.96), 0 0 0 1px rgba(248,113,113,0.6)";
                      el.style.borderColor =
                        "rgba(248,113,113,0.7)";
                    }}
                    onMouseLeave={(e) => {
                      const el =
                        e.currentTarget as HTMLDivElement;
                      el.style.transform =
                        "translateY(0) scale(1)";
                      el.style.boxShadow =
                        "0 18px 40px rgba(0,0,0,0.85), 0 0 0 1px rgba(15,23,42,0.9)";
                      el.style.borderColor =
                        "rgba(148,163,184,0.32)";
                    }}
                  >
                    <div>
                      {thumbnail && (
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "4 / 3",
                            borderRadius: 14,
                            overflow: "hidden",
                            marginBottom: 8,
                            backgroundColor: "#020617",
                            border:
                              "1px solid rgba(248,113,113,0.55)",
                          }}
                        >
                          <img
                            src={thumbnail}
                            alt={item.title}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                      )}

                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 999,
                          background:
                            "rgba(127,29,29,0.32)",
                          fontSize: "0.7rem",
                          color: "#fecaca",
                          marginBottom: 4,
                        }}
                      >
                        {categoryLabels[item.category] ??
                          item.category}
                      </span>

                      <h3
                        style={{
                          margin: "4px 0",
                          fontSize: "1rem",
                          color: "#e5e7eb",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.82rem",
                          color: "#9CA3AF",
                          margin: "2px 0",
                        }}
                      >
                        {item.condition === "new"
                          ? "Новий"
                          : `Б/у${
                              item.problems &&
                              item.problems.length
                                ? ": " +
                                  item.problems.join(", ")
                                : ""
                            }`}
                      </p>
                      <p
                        style={{
                          fontSize: "0.9rem",
                          margin: "4px 0",
                        }}
                      >
                        {item.price_client ? (
                          <strong
                            style={{ color: "#22c55e" }}
                          >
                            {item.price_client} грн
                          </strong>
                        ) : (
                          "Ціна за домовленістю"
                        )}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#9CA3AF",
                          margin: "2px 0",
                        }}
                      >
                        📍 {item.city || "Город не указан"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelected(item);
                        setSelectedPhotoIndex(0);
                      }}
                      style={{
                        marginTop: 8,
                        padding: "7px 14px",
                        borderRadius: 999,
                        border:
                          "1px solid rgba(148,163,184,0.6)",
                        background:
                          "radial-gradient(circle at top, rgba(148,163,184,0.22), transparent 60%), rgba(15,23,42,0.98)",
                        color: "#e5e7eb",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        alignSelf: "flex-start",
                        transition:
                          "transform 0.16s ease-out, box-shadow 0.16s ease-out, border-color 0.16s ease-out",
                      }}
                      onMouseEnter={(e) => {
                        const el =
                          e.currentTarget as HTMLButtonElement;
                        el.style.transform =
                          "translateY(-1px)";
                        el.style.boxShadow =
                          "0 12px 30px rgba(15,23,42,0.9)";
                        el.style.borderColor =
                          "rgba(248,113,113,0.85)";
                      }}
                      onMouseLeave={(e) => {
                        const el =
                          e.currentTarget as HTMLButtonElement;
                        el.style.transform = "none";
                        el.style.boxShadow = "none";
                        el.style.borderColor =
                          "rgba(148,163,184,0.6)";
                      }}
                    >
                      Подробнее
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(5,5,11,0.94)",
            backdropFilter: "blur(18px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 620,
              width: "100%",
              borderRadius: 24,
              border: "1px solid rgba(248,113,113,0.7)",
              background:
                "linear-gradient(145deg, rgba(7,10,20,0.98), rgba(15,23,42,0.94))",
              padding: "18px 18px 20px",
              boxShadow:
                "0 26px 80px rgba(0,0,0,0.96), 0 0 0 1px rgba(15,23,42,0.96)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                border: "1px solid transparent",
                background:
                  "linear-gradient(120deg, rgba(248,113,113,0.9), rgba(251,191,36,0.7), rgba(248,113,113,0.9)) border-box",
                WebkitMask:
                  "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                pointerEvents: "none",
                opacity: 0.5,
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(127,29,29,0.32)",
                      fontSize: "0.7rem",
                      color: "#fecaca",
                    }}
                  >
                    {categoryLabels[selected.category] ??
                      selected.category}
                  </span>
                  <h2
                    style={{
                      margin: "6px 0 4px",
                      fontSize: "1.1rem",
                      color: "#e5e7eb",
                    }}
                  >
                    {selected.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "none",
                    borderRadius: 999,
                    border:
                      "1px solid rgba(148,163,184,0.7)",
                    color: "#9CA3AF",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    padding: "4px 9px",
                    backgroundColor: "rgba(15,23,42,0.96)",
                    transition:
                      "transform 0.14s ease-out, box-shadow 0.14s ease-out",
                  }}
                  onMouseEnter={(e) => {
                    const el =
                      e.currentTarget as HTMLButtonElement;
                    el.style.transform =
                      "translateY(-1px)";
                    el.style.boxShadow =
                      "0 10px 30px rgba(15,23,42,0.9)";
                  }}
                  onMouseLeave={(e) => {
                    const el =
                      e.currentTarget as HTMLButtonElement;
                    el.style.transform = "none";
                    el.style.boxShadow = "none";
                  }}
                >
                  Закрыть ✕
                </button>
              </div>

              {Array.isArray(selected.photos) &&
                selected.photos.length > 0 && (
                  <div style={{ margin: "8px 0 12px" }}>
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "4 / 3",
                        borderRadius: 16,
                        overflow: "hidden",
                        border:
                          "1px solid rgba(248,113,113,0.7)",
                        backgroundColor: "#020617",
                        marginBottom: 8,
                        boxShadow:
                          "0 0 26px rgba(248,113,113,0.3), 0 0 0 1px rgba(15,23,42,1)",
                      }}
                    >
                      <img
                        src={getApiFileUrl(
                          selected.photos[
                            selectedPhotoIndex
                          ] as string,
                        )}
                        alt={selected.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    </div>
                    {selected.photos.length > 1 && (
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          overflowX: "auto",
                          paddingBottom: 4,
                        }}
                      >
                        {selected.photos.map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setSelectedPhotoIndex(idx)
                            }
                            style={{
                              width: 62,
                              height: 62,
                              borderRadius: 12,
                              overflow: "hidden",
                              border:
                                idx === selectedPhotoIndex
                                  ? "1px solid #22c55e"
                                  : "1px solid rgba(148,163,184,0.5)",
                              padding: 0,
                              background: "transparent",
                              cursor: "pointer",
                              flex: "0 0 auto",
                            }}
                          >
                            <img
                              src={getApiFileUrl(p)}
                              alt={`photo-${idx + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#9CA3AF",
                  margin: "4px 0",
                }}
              >
                {selected.condition === "new"
                  ? "Стан: Новий"
                  : `Стан: Б/у${
                      selected.problems &&
                      selected.problems.length
                        ? " — " +
                          selected.problems.join(", ")
                        : ""
                    }`}
              </p>

              <p
                style={{
                  fontSize: "1rem",
                  margin: "6px 0",
                }}
              >
                Ціна:{" "}
                {selected.price_client ? (
                  <strong style={{ color: "#22c55e" }}>
                    {selected.price_client} грн
                  </strong>
                ) : (
                  "по домовленості"
                )}
              </p>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#9CA3AF",
                  margin: "4px 0 10px",
                }}
              >
                📍 {selected.city || "Город не указан"}
              </p>

              <div
                style={{
                  marginTop: 4,
                  padding: "10px 14px",
                  borderRadius: 14,
                  border:
                    "1px solid rgba(248,113,113,0.35)",
                  background:
                    "radial-gradient(circle at top, rgba(15,23,42,0.98), rgba(2,6,23,1))",
                }}
              >
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "#9CA3AF",
                    margin: 0,
                  }}
                >
                  Щоб купити — зверніться через сторінку{" "}
                  <a
                    href="/contact"
                    style={{
                      color: "#f97373",
                      textDecoration: "none",
                    }}
                  >
                    Зв&apos;язатися
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
