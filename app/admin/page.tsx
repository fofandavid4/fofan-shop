"use client";

import React, {
  useEffect,
  useState,
  type CSSProperties,
  ChangeEvent,
} from "react";
import Link from "next/link";

interface AdminItem {
  id: number;
  created_at: string;
  category: string;
  title: string;
  condition: string;
  price_client: string | null;
  city: string | null;
  contact: string | null;
  deal_status: string;
  publish_status: string;
  photos?: string[] | null;
  extra_fields?: any;
  problems?: string[] | null;
  problems_description?: string | null;
  buyer_id?: number | null;
  buyer_status?: string | null;
  buyer_price?: string | null;
  buyer_comment?: string | null;
}

const categoryLabel: Record<string, string> = {
  phone: "Телефон",
  keyboard_mouse: "Клавиатура / мышь",
  other: "Другое",
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ЛОГИН/ПАРОЛЬ ДЛЯ ВХОДА В АДМИНКУ (из env, с дефолтами)
const ADMIN_LOGIN =
  process.env.NEXT_PUBLIC_ADMIN_LOGIN || "fofan";
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "5437680da";

const btnGlassSmall: CSSProperties = {
  fontSize: "0.8rem",
  color: "#e5e7eb",
  textDecoration: "none",
  borderRadius: 999,
  border: "1px solid rgba(148,163,184,0.5)",
  padding: "6px 10px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.9))",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

const inputFilter: CSSProperties = {
  padding: "6px 10px",
  borderRadius: 999,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "rgba(148,163,184,0.5)",
  background: "rgba(15,23,42,0.96)",
  color: "#e5e7eb",
  fontSize: "0.8rem",
  outline: "none",
};

const selectFilter: CSSProperties = {
  ...inputFilter,
  minWidth: 150,
};

type PublishFilter = "all" | "public" | "private";
type SortKey = "date_desc" | "price_desc" | "price_asc" | "id_asc";

export default function AdminPage() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<AdminItem | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  // состояние авторизации
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // поиск, фильтр, сортировка
  const [search, setSearch] = useState("");
  const [publishFilter, setPublishFilter] =
    useState<PublishFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");

  async function loadItems() {
    if (!API_BASE) {
      alert("API URL не настроен. Обратитесь к администратору.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/items/admin`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error(e);
      alert("Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthed) {
      loadItems();
    }
  }, [isAuthed]);

  async function updatePublish(
    id: number,
    publish_status: "private" | "public",
  ) {
    if (!API_BASE) {
      alert("API URL не настроен. Обратитесь к администратору.");
      return;
    }

    try {
      setSavingId(id);
      const res = await fetch(`${API_BASE}/api/items/${id}/admin`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish_status }),
      });
      if (!res.ok) {
        alert("Ошибка обновления статуса");
        return;
      }
      await loadItems();
    } catch (e) {
      console.error(e);
      alert("Сервер недоступен");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(id: number) {
    if (!API_BASE) {
      alert("API URL не настроен. Обратитесь к администратору.");
      return;
    }

    if (!window.confirm(`Точно удалить заявку #${id}?`)) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${API_BASE}/api/items/${id}/admin`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Ошибка удаления заявки");
        return;
      }
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e) {
      console.error(e);
      alert("Сервер недоступен");
    } finally {
      setDeletingId(null);
    }
  }

  const getFullPhotoUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (!API_BASE) return path;
    return `${API_BASE}${path}`;
  };

  const renderBuyerStatusLabel = (status?: string | null) => {
    if (!status) return "—";
    if (status === "interested") return "Интересно";
    if (status === "not_interested") return "Не интересно";
    return status;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      setIsAuthed(true);
      setAuthError("");
      setPassword("");
    } else {
      setAuthError("Неверный логин или пароль.");
    }
  };

  // фильтрация и сортировка
  const normalizedSearch = search.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    const matchesPublish =
      publishFilter === "all" ? true : item.publish_status === publishFilter;

    const title = item.title.toLowerCase();
    const city = (item.city || "").toLowerCase();

    const matchesSearch =
      !normalizedSearch ||
      title.includes(normalizedSearch) ||
      city.includes(normalizedSearch);

    return matchesPublish && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortKey === "date_desc") {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return db - da;
    }

    if (sortKey === "id_asc") {
      return a.id - b.id;
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

  // Если не авторизован — показываем форму логина
  if (!isAuthed) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top,#020617 0,#020617 35%,#020617 60%)",
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.25) 0, transparent 55%), radial-gradient(circle at 100% 0%, rgba(34,197,94,0.25) 0, transparent 55%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.22) 0, transparent 55%)",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            borderRadius: 24,
            border: "1px solid rgba(148,163,184,0.35)",
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.92), rgba(15,23,42,0.8))",
            boxShadow:
              "0 22px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(15,23,42,0.9)",
            padding: "22px 22px 24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.12) 0, transparent 55%)",
              opacity: 0.9,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Link
                href="/"
                style={{
                  fontSize: "0.78rem",
                  color: "#9CA3AF",
                  textDecoration: "none",
                }}
              >
                ← На главную
              </Link>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#6B7280",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.35)",
                  padding: "3px 9px",
                  background: "rgba(15,23,42,0.9)",
                }}
              >
                FofanShop Admin
              </span>
            </div>

            <h1
              style={{
                fontSize: "20px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#ECFEFF",
                margin: "8px 0 4px",
                textShadow: "0 0 18px rgba(45,212,191,0.45)",
              }}
            >
              Вход в кабинет
            </h1>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "0.85rem",
                marginBottom: 16,
              }}
            >
              Укажите логин и пароль для доступа к панели управления.
            </p>

            <form
              onSubmit={handleLoginSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#9CA3AF",
                    marginBottom: 4,
                  }}
                >
                  Логин
                </div>
                <div
                  style={{
                    position: "relative",
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.82))",
                    padding: 1,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 12,
                      border: "1px solid rgba(148,163,184,0.35)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 11,
                      border: "none",
                      background: "transparent",
                      color: "#fff",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                    placeholder=""
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#9CA3AF",
                    marginBottom: 4,
                  }}
                >
                  Пароль
                </div>
                <div
                  style={{
                    position: "relative",
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.82))",
                    padding: 1,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 12,
                      border: "1px solid rgba(148,163,184,0.35)",
                      pointerEvents: "none",
                    }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 34px 8px 10px",
                      borderRadius: 11,
                      border: "none",
                      background: "transparent",
                      color: "#fff",
                      fontSize: "0.9rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                    placeholder=""
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 6,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 999,
                    }}
                    aria-label={
                      showPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    <span
                      style={{
                        fontSize: "1rem",
                        color: showPassword ? "#38bdf8" : "#6B7280",
                      }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
              </div>

              {authError && (
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#fecaca",
                    marginTop: 2,
                  }}
                >
                  {authError}
                </div>
              )}

              <button
                type="submit"
                style={{
                  marginTop: 8,
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    "linear-gradient(90deg,rgba(56,189,248,1),rgba(52,211,153,1))",
                  color: "#020617",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  width: "100%",
                  boxShadow:
                    "0 0 22px rgba(56,189,248,0.55), 0 0 38px rgba(52,211,153,0.45)",
                }}
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // Авторизован — показываем кабинет
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.2) 0, transparent 55%), radial-gradient(circle at 100% 0%, rgba(52,211,153,0.18) 0, transparent 55%), radial-gradient(circle at 50% 100%, rgba(59,130,246,0.18) 0, transparent 55%)",
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                fontSize: "0.8rem",
                color: "#9CA3AF",
                textDecoration: "none",
              }}
            >
              ← На главную
            </Link>
            <h1
              style={{
                fontSize: "22px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#E0F2FE",
                margin: "8px 0 4px",
              }}
            >
              Админ‑кабинет
            </h1>
            <p
              style={{
                color: "#9CA3AF",
                fontSize: "0.84rem",
                margin: 0,
              }}
            >
              Список заявок. Клик по строке — детали, фото и действия скупщика.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <Link href="/buyer" style={btnGlassSmall}>
              Кабинет скупщика
            </Link>
            <span
              style={{
                fontSize: "0.78rem",
                color: "#6B7280",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.4)",
                padding: "4px 10px",
                background:
                  "linear-gradient(135deg, rgba(15,23,42,1), rgba(15,23,42,0.92))",
              }}
            >
              {items.length} заявок
            </span>
          </div>
        </div>

        {/* Панель поиска, фильтра и сортировки */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            alignItems: "center",
            marginBottom: 12,
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
              ...inputFilter,
              minWidth: 220,
              flex: "1 1 220px",
            }}
          />
          <select
            value={publishFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPublishFilter(e.target.value as PublishFilter)
            }
            style={selectFilter}
          >
            <option value="all">Все публикации</option>
            <option value="public">Только public</option>
            <option value="private">Только private</option>
          </select>
          <select
            value={sortKey}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSortKey(e.target.value as SortKey)
            }
            style={selectFilter}
          >
            <option value="date_desc">Новые сверху (дата)</option>
            <option value="price_desc">Цена клиента: дороже → дешевле</option>
            <option value="price_asc">Цена клиента: дешевле → дороже</option>
            <option value="id_asc">ID по возрастанию</option>
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
          <p style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>Загрузка…</p>
        )}

        {!loading && items.length === 0 && (
          <p style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
            Пока нет заявок.
          </p>
        )}

        {!loading && items.length > 0 && (
          <div
            style={{
              borderRadius: 20,
              border: "1px solid rgba(30,64,175,0.6)",
              background:
                "radial-gradient(circle at top, rgba(15,23,42,0.9) 0, rgba(15,23,42,0.96) 40%, rgba(15,23,42,1) 100%)",
              boxShadow:
                "0 18px 55px rgba(15,23,42,0.95), 0 0 0 1px rgba(15,23,42,0.9)",
              overflow: "hidden",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.84rem",
                minWidth: 820,
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(90deg,#020617,#020617,#020617)",
                    color: "#9CA3AF",
                    textAlign: "left",
                  }}
                >
                  {[
                    "ID",
                    "Фото",
                    "Категория",
                    "Название",
                    "Состояние",
                    "Цена",
                    "Город",
                    "Статус скупщика",
                    "Публикация",
                    "Действие",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 10px",
                        fontWeight: 500,
                        borderBottom: "1px solid rgba(30,64,175,0.7)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((item, idx) => {
                  const hasPhoto =
                    item.photos && item.photos.length > 0 && item.photos[0];
                  const thumb = hasPhoto
                    ? getFullPhotoUrl(item.photos![0] as string)
                    : null;

                  const isEven = idx % 2 === 0;

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderTop: "1px solid rgba(31,41,55,0.85)",
                        background: isEven
                          ? "rgba(15,23,42,0.96)"
                          : "rgba(15,23,42,0.9)",
                        cursor: "pointer",
                        transition: "background 0.18s, transform 0.18s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          "rgba(15,23,42,0.98)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background =
                          isEven
                            ? "rgba(15,23,42,0.96)"
                            : "rgba(15,23,42,0.9)";
                      }}
                      onClick={() => {
                        setSelected(item);
                        setPhotoIndex(0);
                      }}
                    >
                      <td
                        style={{ padding: "6px 10px", whiteSpace: "nowrap" }}
                      >
                        #{item.id}
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        {thumb ? (
                          <div
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: 12,
                              overflow: "hidden",
                              border: "1px solid rgba(148,163,184,0.55)",
                              backgroundColor: "#020617",
                              boxShadow: "0 0 0 1px rgba(15,23,42,1)",
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
                        ) : (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              color: "#9CA3AF",
                            }}
                          >
                            нет фото
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        {categoryLabel[item.category] ?? item.category}
                      </td>
                      <td
                        style={{
                          padding: "6px 10px",
                          maxWidth: 220,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.title}
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        <span
                          style={{
                            fontSize: "0.78rem",
                            padding: "2px 9px",
                            borderRadius: 999,
                            border:
                              item.condition === "new"
                                ? "1px solid rgba(52,211,153,0.7)"
                                : "1px solid rgba(148,163,184,0.7)",
                            color:
                              item.condition === "new"
                                ? "#bbf7d0"
                                : "#e5e7eb",
                            background:
                              item.condition === "new"
                                ? "rgba(22,163,74,0.16)"
                                : "rgba(15,23,42,0.9)",
                          }}
                        >
                          {item.condition === "new" ? "Новый" : "Б/у"}
                        </span>
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        {item.price_client ? `${item.price_client} грн` : "—"}
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        {item.city || "—"}
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        <span
                          style={{
                            fontSize: "0.78rem",
                            padding: "2px 8px",
                            borderRadius: 999,
                            border:
                              item.buyer_status === "interested"
                                ? "1px solid rgba(34,197,94,0.8)"
                                : item.buyer_status === "not_interested"
                                ? "1px solid rgba(248,113,113,0.8)"
                                : "1px solid rgba(148,163,184,0.65)",
                            color:
                              item.buyer_status === "interested"
                                ? "#bbf7d0"
                                : item.buyer_status === "not_interested"
                                ? "#fecaca"
                                : "#e5e7eb",
                            background:
                              item.buyer_status === "interested"
                                ? "rgba(22,163,74,0.16)"
                                : item.buyer_status === "not_interested"
                                ? "rgba(248,113,113,0.13)"
                                : "rgba(15,23,42,0.9)",
                          }}
                        >
                          {renderBuyerStatusLabel(item.buyer_status)}
                        </span>
                      </td>
                      <td style={{ padding: "6px 10px" }}>
                        <span
                          style={{
                            fontSize: "0.78rem",
                            padding: "2px 9px",
                            borderRadius: 999,
                            border:
                              item.publish_status === "public"
                                ? "1px solid rgba(59,130,246,0.75)"
                                : "1px solid rgba(148,163,184,0.6)",
                            color:
                              item.publish_status === "public"
                                ? "#bfdbfe"
                                : "#e5e7eb",
                            background:
                              item.publish_status === "public"
                                ? "rgba(37,99,235,0.16)"
                                : "rgba(15,23,42,0.9)",
                          }}
                        >
                          {item.publish_status}
                        </span>
                      </td>
                      <td
                        style={{ padding: "6px 10px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          {item.publish_status === "private" ? (
                            <button
                              onClick={() =>
                                updatePublish(item.id, "public")
                              }
                              disabled={savingId === item.id}
                              style={{
                                padding: "4px 11px",
                                borderRadius: 999,
                                border: "none",
                                background:
                                  "linear-gradient(90deg,#38bdf8,#22c55e)",
                                color: "#020617",
                                cursor: "pointer",
                                fontSize: "0.78rem",
                                boxShadow:
                                  savingId === item.id
                                    ? "none"
                                    : "0 0 16px rgba(56,189,248,0.4)",
                                opacity: savingId === item.id ? 0.7 : 1,
                              }}
                            >
                              {savingId === item.id
                                ? "Сохранение..."
                                : "Сделать public"}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                updatePublish(item.id, "private")
                              }
                              disabled={savingId === item.id}
                              style={{
                                padding: "4px 11px",
                                borderRadius: 999,
                                border:
                                  "1px solid rgba(148,163,184,0.7)",
                                background: "transparent",
                                color: "#e5e7eb",
                                cursor: "pointer",
                                fontSize: "0.78rem",
                                opacity: savingId === item.id ? 0.7 : 1,
                              }}
                            >
                              {savingId === item.id
                                ? "Сохранение..."
                                : "Скрыть"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => deleteItem(item.id)}
                            disabled={deletingId === item.id}
                            style={{
                              padding: "4px 9px",
                              borderRadius: 999,
                              border:
                                "1px solid rgba(248,113,113,0.8)",
                              background: "transparent",
                              color: "#fecaca",
                              cursor: "pointer",
                              fontSize: "0.78rem",
                              opacity:
                                deletingId === item.id ? 0.6 : 1,
                            }}
                          >
                            {deletingId === item.id
                              ? "Удаление..."
                              : "Удалить"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модалка деталей заявки */}
      {selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(2,6,23,0.92)",
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
              maxWidth: 780,
              width: "100%",
              maxHeight: "92vh",
              overflowY: "auto",
              borderRadius: 24,
              border: "1px solid rgba(148,163,184,0.45)",
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.94))",
              padding: "18px 20px 20px",
              boxShadow:
                "0 26px 70px rgba(0,0,0,0.9), 0 0 0 1px rgba(15,23,42,0.9)",
              fontSize: "0.85rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "#6B7280",
                    marginBottom: 2,
                  }}
                >
                  Заявка
                </div>
                <h2 style={{ margin: 0, fontSize: "1.1rem" }}>
                  #{selected.id} · {selected.title}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
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

            {/* Фото */}
            {selected.photos && selected.photos.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "4 / 3",
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid rgba(56,189,248,0.6)",
                    backgroundColor: "#020617",
                    marginBottom: 8,
                    boxShadow:
                      "0 0 24px rgba(56,189,248,0.25), 0 0 0 1px rgba(15,23,42,1)",
                  }}
                >
                  <img
                    src={getFullPhotoUrl(
                      selected.photos[photoIndex] as string,
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
                        onClick={() => setPhotoIndex(idx)}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 14,
                          overflow: "hidden",
                          border:
                            idx === photoIndex
                              ? "1px solid #31EC56"
                              : "1px solid rgba(148,163,184,0.6)",
                          padding: 0,
                          background: "transparent",
                          cursor: "pointer",
                          flex: "0 0 auto",
                        }}
                      >
                        <img
                          src={getFullPhotoUrl(p)}
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

            {/* Информация */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1.2fr)",
                gap: 14,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr)",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>
                    Категория
                  </div>
                  <div>
                    {categoryLabel[selected.category] ??
                      selected.category}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>
                    Состояние
                  </div>
                  <div>
                    {selected.condition === "new" ? "Новый" : "Б/у"}
                  </div>
                </div>
                <div>
                  <div style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>
                    Цена клиента
                  </div>
                  <div>
                    {selected.price_client
                      ? `${selected.price_client} грн`
                      : "—"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr)",
                  gap: 8,
                }}
              >
                <div>
                  <div style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>
                    Город
                  </div>
                  <div>{selected.city || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>
                    Контакт
                  </div>
                  <div>{selected.contact || "—"}</div>
                </div>
              </div>
            </div>

            {/* Проблемы */}
            {selected.problems && selected.problems.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <div style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>
                  Проблемы
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  {selected.problems.map((p, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "0.78rem",
                        padding: "2px 8px",
                        borderRadius: 999,
                        border: "1px solid rgba(168,85,247,0.8)",
                        color: "#e9d5ff",
                        background: "rgba(30,64,175,0.18)",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.problems_description && (
              <div style={{ marginTop: 8 }}>
                <div style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>
                  Описание проблем
                </div>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: "0.85rem",
                    color: "#e5e7eb",
                  }}
                >
                  {selected.problems_description}
                </p>
              </div>
            )}

            {/* Блок скупщика */}
            <div
              style={{
                marginTop: 16,
                paddingTop: 10,
                borderTop: "1px solid rgba(31,41,55,0.9)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 6px",
                  fontSize: "0.9rem",
                  color: "#e5e7eb",
                }}
              >
                Действия скупщика
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
                  gap: 12,
                  fontSize: "0.85rem",
                }}
              >
                <div>
                  <div
                    style={{ color: "#9CA3AF", fontSize: "0.78rem" }}
                  >
                    Статус
                  </div>
                  <div>{renderBuyerStatusLabel(selected.buyer_status)}</div>
                </div>
                <div>
                  <div
                    style={{ color: "#9CA3AF", fontSize: "0.78rem" }}
                  >
                    Цена скупщика
                  </div>
                  <div>
                    {selected.buyer_price
                      ? `${selected.buyer_price} грн`
                      : "—"}
                  </div>
                </div>
              </div>
              {selected.buyer_comment && (
                <div style={{ marginTop: 8 }}>
                  <div
                    style={{ color: "#9CA3AF", fontSize: "0.78rem" }}
                  >
                    Комментарий скупщика
                  </div>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: "0.85rem",
                      color: "#e5e7eb",
                    }}
                  >
                    {selected.buyer_comment}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
