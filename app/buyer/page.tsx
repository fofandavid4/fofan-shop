"use client";

import React, {
  useEffect,
  useState,
  type CSSProperties,
  ChangeEvent,
} from "react";

type BuyerItem = {
  id: number;
  created_at: string;
  category: "phone" | "keyboard_mouse" | "other";
  title: string;
  condition: "new" | "used";
  problems: string[] | null;
  problems_description: string | null;
  price_client: string | null;
  photos: string[] | null;
  city: string | null;
  deal_status: string;
  publish_status: string;
  buyer_id: number | null;
  buyer_status: string | null;
  buyer_price: string | null;
  buyer_comment: string | null;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Код скупщика из env (с дефолтом)
const BUYER_CODE =
  process.env.NEXT_PUBLIC_BUYER_CODE || "fofan-buyer-2024";

const categoryLabels: Record<string, string> = {
  phone: "📱 Телефон",
  keyboard_mouse: "⌨️ Клавиатура / мышь",
  other: "📦 Другое",
};

const chipStatus = (
  active: boolean,
  type: "interested" | "not_interested",
): CSSProperties => {
  const isYes = type === "interested";
  const activeBorder = isYes ? "#22c55e" : "#f97373";
  const activeBg = isYes ? "rgba(34,197,94,0.15)" : "rgba(248,113,113,0.15)";
  const activeColor = isYes ? "#bbf7d0" : "#fecaca";

  return {
    padding: "4px 10px",
    borderRadius: 999,
    border: active
      ? `1px solid ${activeBorder}`
      : "1px solid rgba(148,163,184,0.6)",
    background: active ? activeBg : "transparent",
    color: active ? activeColor : "#e5e7eb",
    fontSize: "0.8rem",
    cursor: "pointer",
  };
};

const inputBase: CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 999,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.45)",
  background: "rgba(15,23,42,0.96)",
  color: "#e5e7eb",
  fontSize: "0.9rem",
  boxSizing: "border-box",
  outline: "none",
};

const btnPrimary: CSSProperties = {
  padding: "8px 18px",
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(90deg,#38bdf8,#22c55e)",
  color: "#020617",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
  boxShadow: "0 0 18px rgba(56,189,248,0.55)",
};

type StatusFilter = "all" | "interested" | "not_interested" | "none";
type SortKey = "date_desc" | "price_desc" | "price_asc";

export default function BuyerPage() {
  const [items, setItems] = useState<BuyerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const [editPrice, setEditPrice] = useState<Record<number, string>>({});
  const [editStatus, setEditStatus] = useState<Record<number, string>>({});
  const [editComment, setEditComment] = useState<Record<number, string>>({});

  // Локальный вход по коду
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");

  // Поиск / фильтр / сортировка
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/items/buyer`);
      const data: BuyerItem[] = await res.json();
      setItems(data);

      const p: Record<number, string> = {};
      const s: Record<number, string> = {};
      const c: Record<number, string> = {};
      data.forEach((it) => {
        if (it.buyer_price) p[it.id] = String(it.buyer_price);
        if (it.buyer_status) s[it.id] = it.buyer_status;
        if (it.buyer_comment) c[it.id] = it.buyer_comment;
      });
      setEditPrice(p);
      setEditStatus(s);
      setEditComment(c);
    } catch (e) {
      console.error(e);
      alert("Не удалось загрузить заявки для скупщика");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthorized) {
      loadItems();
    }
  }, [isAuthorized]);

  const getFullPhotoUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${apiBase}${path}`;
  };

  async function saveBuyer(id: number) {
    try {
      setSavingId(id);
      const status = editStatus[id] || null;

      const body = {
        buyer_id: 1,
        buyer_status: status,
        buyer_price:
          status === "interested" && editPrice[id]
            ? Number(editPrice[id])
            : null,
        buyer_comment:
          status === "interested" && editComment[id]
            ? editComment[id]
            : null,
      };

      const res = await fetch(`${apiBase}/api/items/${id}/buyer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        alert("Ошибка сохранения ставки");
        return;
      }

      const updated: BuyerItem = await res.json();
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));

      setEditPrice((prev) => ({
        ...prev,
        [id]: updated.buyer_price ? String(updated.buyer_price) : "",
      }));
      setEditStatus((prev) => ({
        ...prev,
        [id]: updated.buyer_status || "",
      }));
      setEditComment((prev) => ({
        ...prev,
        [id]: updated.buyer_comment || "",
      }));
    } catch (e) {
      console.error(e);
      alert("Сервер недоступен");
    } finally {
      setSavingId(null);
    }
  }

  const handleAuth = () => {
    if (password.trim() === BUYER_CODE) {
      setIsAuthorized(true);
      setAuthError("");
    } else {
      setAuthError("Неверный код. Проверьте и попробуйте ещё раз.");
    }
  };

  // Фильтрация и сортировка списка карточек
  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    // Статус
    const currentStatus = item.buyer_status || "";
    let matchesStatus = true;
    if (statusFilter === "interested") {
      matchesStatus = currentStatus === "interested";
    } else if (statusFilter === "not_interested") {
      matchesStatus = currentStatus === "not_interested";
    } else if (statusFilter === "none") {
      matchesStatus = currentStatus === "";
    }

    // Поиск
    const title = item.title.toLowerCase();
    const city = (item.city || "").toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      city.includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortKey === "date_desc") {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return db - da;
    }

    const priceA = a.price_client ? Number(a.price_client) : 0;
    const priceB = b.price_client ? Number(b.price_client) : 0;

    if (sortKey === "price_desc") {
      return priceB - priceA;
    }
    if (sortKey === "price_asc") {
      return priceA - priceB;
    }

    return 0;
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.22) 0, transparent 55%), radial-gradient(circle at 100% 0%, rgba(52,211,153,0.2) 0, transparent 55%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.2) 0, transparent 55%)",
        color: "#ffffff",
        padding: "20px 16px",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          borderRadius: 28,
          padding: "16px 18px 18px",
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
            margin: "14px 0 6px",
          }}
        >
          Кабинет скупщика
        </h1>

        {!isAuthorized ? (
          <div
            style={{
              marginTop: 12,
              borderRadius: 20,
              border: "1px solid rgba(148,163,184,0.4)",
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
              padding: 16,
              maxWidth: 420,
            }}
          >
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "0.9rem",
                marginBottom: 10,
              }}
            >
              Введите код доступа, который вы получили от владельца FofanShop.
            </p>

            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Код доступа"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...inputBase,
                  borderRadius: 999,
                  paddingRight: 40,
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  background: "rgba(15,23,42,0.96)",
                  color: "#9CA3AF",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  padding: "7px 10px",
                  whiteSpace: "nowrap",
                }}
              >
                {showPassword ? "Скрыть" : "Показать"}
              </button>
            </div>

            {authError && (
              <p
                style={{
                  color: "#f97373",
                  fontSize: "0.8rem",
                  margin: "4px 0 8px",
                }}
              >
                {authError}
              </p>
            )}

            <button
              type="button"
              onClick={handleAuth}
              style={btnPrimary}
            >
              Войти
            </button>
          </div>
        ) : (
          <>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "0.85rem",
                marginBottom: 12,
              }}
            >
              Здесь актуальные заявки клиентов. Отмечайте интерес и при
              необходимости указывайте свою цену и комментарий.
            </p>

            {/* Панель поиска / фильтра / сортировки */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <input
                type="text"
                placeholder="Поиск по названию или городу"
                value={search}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearch(e.target.value)
                }
                style={{
                  ...inputBase,
                  minWidth: 220,
                  borderRadius: 999,
                  flex: "1 1 220px",
                }}
              />
              <select
                value={statusFilter}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                style={{
                  ...inputBase,
                  minWidth: 150,
                  borderRadius: 999,
                }}
              >
                <option value="all">Все статусы</option>
                <option value="interested">Только «интересно»</option>
                <option value="not_interested">Только «не интересно»</option>
                <option value="none">Без статуса</option>
              </select>
              <select
                value={sortKey}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSortKey(e.target.value as SortKey)
                }
                style={{
                  ...inputBase,
                  minWidth: 170,
                  borderRadius: 999,
                }}
              >
                <option value="date_desc">Новые сверху (дата)</option>
                <option value="price_desc">
                  Цена клиента: дороже → дешевле
                </option>
                <option value="price_asc">
                  Цена клиента: дешевле → дороже
                </option>
              </select>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "#9CA3AF",
                  marginLeft: "auto",
                }}
              >
                Показано: {sortedItems.length}
              </span>
            </div>

            {loading && (
              <p style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
                Загрузка…
              </p>
            )}

            {!loading && items.length === 0 && (
              <p
                style={{ color: "#9CA3AF", fontSize: "0.9rem" }}
              >
                Пока нет заявок.
              </p>
            )}

            {!loading && items.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(290px, 1fr))",
                  gap: 16,
                }}
              >
                {sortedItems.map((item) => {
                  const hasPhoto =
                    item.photos && item.photos.length > 0;
                  const thumb = hasPhoto
                    ? getFullPhotoUrl(item.photos![0])
                    : null;
                  const status = editStatus[item.id];
                  const disabledFields = status === "not_interested";

                  return (
                    <div
                      key={item.id}
                      style={{
                        borderRadius: 20,
                        border: "1px solid rgba(148,163,184,0.35)",
                        background:
                          "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
                        padding: 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        boxShadow:
                          "0 18px 45px rgba(0,0,0,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
                        transition:
                          "transform 0.18s, box-shadow 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(-2px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 22px 55px rgba(0,0,0,0.95), 0 0 0 1px rgba(30,64,175,0.8)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 18px 45px rgba(0,0,0,0.85), 0 0 0 1px rgba(15,23,42,0.9)";
                      }}
                    >
                      {thumb && (
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "4 / 3",
                            borderRadius: 14,
                            overflow: "hidden",
                            border:
                              "1px solid rgba(56,189,248,0.45)",
                            backgroundColor: "#020617",
                          }}
                        >
                          <img
                            src={thumb}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </div>
                      )}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 999,
                            border:
                              "1px solid rgba(56,189,248,0.7)",
                            fontSize: "0.7rem",
                            color: "#38bdf8",
                          }}
                        >
                          {categoryLabels[item.category] ??
                            item.category}
                        </span>
                        <span
                          style={{
                            padding: "2px 8px",
                            borderRadius: 999,
                            border:
                              item.condition === "new"
                                ? "1px solid rgba(52,211,153,0.8)"
                                : "1px solid rgba(250,204,21,0.8)",
                            fontSize: "0.7rem",
                            color:
                              item.condition === "new"
                                ? "#bbf7d0"
                                : "#facc15",
                            background:
                              item.condition === "new"
                                ? "rgba(22,163,74,0.15)"
                                : "rgba(234,179,8,0.15)",
                          }}
                        >
                          {item.condition === "new" ? "Новый" : "Б/у"}
                        </span>
                      </div>

                      <h3
                        style={{
                          margin: "4px 0 2px",
                          fontSize: "1rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title}
                      </h3>

                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#9CA3AF",
                          margin: 0,
                        }}
                      >
                        Клиент хочет:{" "}
                        {item.price_client ? (
                          <span style={{ color: "#22c55e" }}>
                            {item.price_client} грн
                          </span>
                        ) : (
                          "не указал"
                        )}
                      </p>

                      {item.city && (
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "#9CA3AF",
                            margin: 0,
                          }}
                        >
                          📍 {item.city}
                        </p>
                      )}

                      {item.problems &&
                        item.problems.length > 0 && (
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "#9CA3AF",
                              margin: "4px 0 0",
                            }}
                          >
                            Проблемы:{" "}
                            {item.problems.join(", ")}
                          </p>
                        )}

                      <div
                        style={{
                          marginTop: 8,
                          paddingTop: 8,
                          borderTop:
                            "1px solid rgba(30,64,175,0.7)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setEditStatus((prev) => ({
                                ...prev,
                                [item.id]: "interested",
                              }))
                            }
                            style={chipStatus(
                              status === "interested",
                              "interested",
                            )}
                          >
                            Интересно
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setEditStatus((prev) => ({
                                ...prev,
                                [item.id]: "not_interested",
                              }))
                            }
                            style={chipStatus(
                              status === "not_interested",
                              "not_interested",
                            )}
                          >
                            Не интересно
                          </button>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#9CA3AF",
                              marginBottom: 2,
                            }}
                          >
                            Ваша цена (грн)
                          </div>
                          <input
                            type="number"
                            disabled={disabledFields}
                            value={editPrice[item.id] ?? ""}
                            onChange={(e) =>
                              setEditPrice((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              padding: "6px 8px",
                              borderRadius: 10,
                              border:
                                "1px solid rgba(148,163,184,0.5)",
                              background: disabledFields
                                ? "#111827"
                                : "#020617",
                              color: disabledFields
                                ? "#6b7280"
                                : "#fff",
                              fontSize: "0.85rem",
                              boxSizing: "border-box",
                              opacity: disabledFields ? 0.6 : 1,
                              outline: "none",
                            }}
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "#9CA3AF",
                              marginBottom: 2,
                            }}
                          >
                            Комментарий
                          </div>
                          <textarea
                            disabled={disabledFields}
                            value={editComment[item.id] ?? ""}
                            onChange={(e) =>
                              setEditComment((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              minHeight: 50,
                              borderRadius: 10,
                              border:
                                "1px solid rgba(148,163,184,0.5)",
                              background: disabledFields
                                ? "#111827"
                                : "#020617",
                              color: disabledFields
                                ? "#6b7280"
                                : "#fff",
                              fontSize: "0.85rem",
                              padding: "6px 8px",
                              boxSizing: "border-box",
                              resize: "vertical",
                              opacity: disabledFields ? 0.6 : 1,
                              outline: "none",
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => saveBuyer(item.id)}
                          disabled={savingId === item.id}
                          style={{
                            marginTop: 4,
                            padding: "6px 12px",
                            borderRadius: 999,
                            border: "none",
                            background:
                              "linear-gradient(90deg,#38bdf8,#22c55e)",
                            color: "#020617",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            alignSelf: "flex-start",
                            opacity:
                              savingId === item.id ? 0.7 : 1,
                            boxShadow:
                              savingId === item.id
                                ? "none"
                                : "0 0 16px rgba(56,189,248,0.4)",
                          }}
                        >
                          {savingId === item.id
                            ? "Сохранение..."
                            : "Сохранить"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
