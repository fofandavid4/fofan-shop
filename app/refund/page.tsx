"use client";

import React, {
  type CSSProperties,
  useState,
  useRef,
  type MouseEvent,
} from "react";
import Link from "next/link";

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
    "radial-gradient(at 0% 0%, rgba(248,113,113,0.55) 0px, transparent 55%), radial-gradient(at 100% 0%, rgba(59,130,246,0.45) 0px, transparent 55%), radial-gradient(at 0% 100%, rgba(239,68,68,0.5) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(15,23,42,0.9) 0px, #020105 60%)",
  backgroundSize: "180% 180%",
  animation: "meshMove 22s ease-in-out infinite alternate",
  opacity: 0.75,
  pointerEvents: "none",
  zIndex: 0,
};

const noiseLayer: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='noStitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.14'/%3E%3C/svg%3E\")",
  mixBlendMode: "soft-light",
  pointerEvents: "none",
  zIndex: 0,
};

const container: CSSProperties = {
  maxWidth: 1040,
  margin: "0 auto",
  padding: "32px 18px 56px",
  boxSizing: "border-box",
  position: "relative",
  zIndex: 1,
};

const glassCard: CSSProperties = {
  borderRadius: 28,
  border: "1px solid rgba(248,113,113,0.4)",
  background:
    "linear-gradient(135deg, rgba(7,10,20,0.96), rgba(15,23,42,0.9))",
  padding: "24px 22px 26px",
  boxShadow:
    "0 30px 80px rgba(0,0,0,0.95), 0 0 55px rgba(15,23,42,0.9)",
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
    "linear-gradient(120deg, rgba(248,113,113,0.85), rgba(251,191,36,0.7), rgba(248,113,113,0.9)) border-box",
  WebkitMask:
    "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  pointerEvents: "none",
  opacity: 0.45,
};

const sectionTitle: CSSProperties = {
  fontSize: "1.3rem",
  marginBottom: 10,
};

const smallMuted: CSSProperties = {
  fontSize: "0.86rem",
  color: "#9CA3AF",
};

const optionsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: 20,
  marginTop: 20,
};

const optionCardInner: CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(248,113,113,0.45)",
  padding: "16px 16px 18px",
  background:
    "radial-gradient(circle at top left, rgba(248,113,113,0.22), transparent 60%), radial-gradient(circle at bottom right, rgba(37,99,235,0.65), transparent 60%), rgba(15,23,42,0.98)",
};

const tiltWrapperBase: CSSProperties = {
  borderRadius: 20,
  transformStyle: "preserve-3d",
  transition: "transform 0.18s ease-out, box-shadow 0.18s ease-out",
};

const tiltWrapperHover: CSSProperties = {
  boxShadow:
    "0 22px 60px rgba(0,0,0,0.95), 0 0 36px rgba(248,113,113,0.5)",
};

const badgeFree: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 999,
  border: "1px solid rgba(34,197,94,0.9)",
  fontSize: "0.76rem",
  color: "#bbf7d0",
  background:
    "linear-gradient(120deg, rgba(21,128,61,0.4), rgba(34,197,94,0.2))",
};

const badgePaid: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  borderRadius: 999,
  border: "1px solid rgba(248,113,113,0.95)",
  fontSize: "0.76rem",
  color: "#fee2e2",
  background:
    "linear-gradient(120deg, rgba(127,29,29,0.7), rgba(248,113,113,0.22))",
};

const btnPrimary: CSSProperties = {
  padding: "10px 20px",
  borderRadius: 999,
  border: "1px solid rgba(248,113,113,0.9)",
  background:
    "linear-gradient(120deg, #f97373 0%, #fb923c 35%, #facc15 70%, #f97373 100%)",
  color: "#0b0f19",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 600,
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 18px 40px rgba(127,29,29,0.8)",
  transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out",
};

const btnGhost: CSSProperties = {
  padding: "7px 12px",
  borderRadius: 999,
  border: "1px solid rgba(148,163,184,0.8)",
  background:
    "radial-gradient(circle at top, rgba(148,163,184,0.2), transparent 60%), rgba(15,23,42,0.95)",
  color: "#e5e7eb",
  cursor: "pointer",
  fontSize: "0.8rem",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "transform 0.16s ease-out, box-shadow 0.16s ease-out",
};

const pillsRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 8,
};

const pill: CSSProperties = {
  borderRadius: 999,
  border: "1px solid rgba(248,113,113,0.6)",
  padding: "4px 10px",
  fontSize: "0.76rem",
  color: "#fecaca",
  background: "rgba(15,23,42,0.96)",
};

const keyframesStyles = `
@keyframes meshMove {
  0% {
    background-position: 0% 0%;
    transform: scale(1.05) translate3d(-2%, -2%, 0);
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
@keyframes glow-pulse {
  0% {
    box-shadow: 0 18px 40px rgba(127,29,29,0.7);
  }
  100% {
    box-shadow: 0 26px 70px rgba(248,113,113,0.95);
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
`;

export default function RefundPage() {
  const telegramUrl = "https://t.me/RefFofan";
  const reviewsUrl = "https://t.me/FofanOtziv";

  const [showFreeFull, setShowFreeFull] = useState(false);
  const [showPaidFull, setShowPaidFull] = useState(false);

  return (
    <>
      <style>{keyframesStyles}</style>
      <main style={pageWrap}>
        <div style={meshLayer} />
        <div style={noiseLayer} />
        <div style={container}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 24,
              alignItems: "center",
            }}
          >
            <Link
              href="/"
              style={{
                fontSize: "0.9rem",
                color: "#e5e7eb",
                textDecoration: "none",
              }}
            >
              ← На главную
            </Link>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#fecaca",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Рефаунд
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div style={glassCard}>
              <div style={glowBorder} />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  marginBottom: 16,
                }}
              >
                <h1
                  style={{
                    fontSize: "2rem",
                    margin: 0,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#fee2e2",
                  }}
                >
                  Что такое рефаунд
                </h1>
                <p
                  style={{
                    ...smallMuted,
                    maxWidth: 640,
                  }}
                >
                  Рефаунд — это добровольный возврат средств магазином за
                  оплаченный покупателем товар. Такой возврат делается по твоей
                  инициативе через поддержку, если есть проблема с товаром или
                  доставкой.
                </p>

                <div style={pillsRow}>
                  <div style={pill}>Без возврата товара</div>
                  <div style={pill}>Диалог с поддержкой</div>
                  <div style={pill}>Маркетплейсы и Китай</div>
                </div>
              </div>

              <div style={optionsGrid}>
                <TiltCard>
                  <div style={optionCardInner}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={badgeFree}>Бесплатно</span>
                    </div>
                    <h2
                      style={{
                        fontSize: "1.08rem",
                        margin: 0,
                        marginBottom: 6,
                        color: "#e5e7eb",
                      }}
                    >
                      🧭 Гайд: подготовка аккаунта для заказов на Temu
                    </h2>

                    {!showFreeFull && (
                      <>
                        <p style={smallMuted}>
                          Цель — сделать аккаунт максимально живым перед
                          основным заказом, чтобы система видела тебя как
                          аккуратного покупателя. Внутри два варианта прогрева:
                          надёжный с реальным заказом и бюджетный за счёт
                          активности в приложении.
                        </p>
                        <button
                          type="button"
                          style={btnGhost}
                          onClick={() => setShowFreeFull(true)}
                        >
                          Показать полный гайд
                        </button>
                      </>
                    )}

                    {showFreeFull && (
                      <>
                        <p style={smallMuted}>
                          Цель — создать реальную активность аккаунта перед
                          основным заказом, чтобы система видела вас как
                          настоящего покупателя.
                        </p>

                        <div
                          style={{
                            marginTop: 8,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            fontSize: "0.83rem",
                            color: "#e5e7eb",
                          }}
                        >
                          <div>
                            <strong>🔥 Вариант 1: “MAXIMUM” (надёжный)</strong>
                            <br />
                            Самый проверенный и эффективный способ, дающий
                            почти 100% результат.
                            <br />
                            Суть: один реальный заказ с несколькими недорогими
                            товарами.
                            <br />
                            Действия:
                            <br />
                            • выберите около 20 мелких товаров (одежда,
                            аксессуары, декор, мелочи для дома);
                            <br />
                            • оформите заказ и дождитесь получения посылки;
                            <br />
                            • перед основным заказом подождите ещё 3–4 дня.
                            <br />
                            💡 Результат: аккаунт считается прогретым, система
                            видит вас как постоянного покупателя.
                          </div>

                          <div>
                            <strong>💰 Вариант 2: “BUDGET” (экономный)</strong>
                            <br />
                            Подходит тем, кто хочет сэкономить, но готов
                            инвестировать время.
                            <br />
                            Суть: имитируем активность обычного пользователя.
                            <br />
                            Действия:
                            <br />
                            • 1–2 часа в день проводите в приложении;
                            <br />
                            • просматривайте товары, добавляйте в корзину и
                            избранное, листайте акции;
                            <br />
                            • держите это 7–10 дней подряд.
                            <br />
                            💡 Результат: аккаунт выглядит естественно активным.
                          </div>

                          <div>
                            <strong>⏱️ Этап 2: после прогрева</strong>
                            <br />
                            Не делайте новый заказ сразу после получения
                            первого:
                            <br />
                            • если оформить второй заказ в тот же день, система
                            может объединить оба в одну посылку;
                            <br />
                            • чтобы этого избежать, подождите 3–4 дня — будут
                            две отдельные отправки.
                          </div>

                          <div>
                            <strong>🎯 Основной заказ</strong>
                            <br />
                            После прогрева можно спокойно оформить заказ на
                            одежду, аксессуары и повседневные товары до 2000
                            грн.
                            <br />
                            💡 Совет: при нормальном прогреве заказы обычно
                            проходят автоматически, без лишних проверок.
                          </div>

                          <div>
                            <strong>💬 Этап 3: общение с поддержкой</strong>
                            <br />
                            1. Начало диалога:
                            <br />
                            • откройте поддержку в приложении;
                            <br />
                            • напишите: «Хочу вернуть деньги за товар без
                            возврата товара».
                            <br />
                            2. Если отвечает бот:
                            <br />
                            • отвечайте коротко и по сути;
                            <br />
                            • добивайтесь живого агента («Связь с агентом»).
                            <br />
                            3. Когда появляется агент:
                            <br />
                            • будьте максимально вежливы и дружелюбны;
                            <br />
                            • обращайтесь по имени, благодарите, показывайте,
                            что цените помощь.
                            <br />
                            Пример: «Добрый день, Мария! Очень прошу вас помочь
                            мне, это для меня важно».
                          </div>

                          <div>
                            <strong>💎 Итог</strong>
                            <br />
                            Активность + терпение + уважительное общение дают
                            почти гарантированный результат. Хорошо прогретый
                            аккаунт и нормальный диалог с поддержкой сильно
                            повышают шанс на успешный рефаунд.
                            <br />
                            <br />
                            Автор гайда:{" "}
                            <span style={{ color: "#f97373" }}>@RefFofan</span>.
                            Бесплатно для подписчиков.
                          </div>
                        </div>

                        <button
                          type="button"
                          style={{ ...btnGhost, marginTop: 10 }}
                          onClick={() => setShowFreeFull(false)}
                        >
                          Свернуть гайд
                        </button>
                      </>
                    )}
                  </div>
                </TiltCard>

                <TiltCard>
                  <div style={optionCardInner}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={badgePaid}>Платно</span>
                    </div>
                    <h2
                      style={{
                        fontSize: "1.08rem",
                        margin: 0,
                        marginBottom: 6,
                        color: "#fee2e2",
                      }}
                    >
                      Приватка по рефаунду и ресейлу
                    </h2>

                    {!showPaidFull && (
                      <>
                        <p style={smallMuted}>
                          Полный стек рабочих схем по Temu, AliExpress, iHerb,
                          Pinduoduo и китайским площадкам, плюс чёрный ресейл,
                          поставщики, доказательства и моё сопровождение. Для
                          тех, кто хочет систему, а не куски инфы.
                        </p>
                        <button
                          type="button"
                          style={btnGhost}
                          onClick={() => setShowPaidFull(true)}
                        >
                          Показать, что входит
                        </button>
                      </>
                    )}

                    {showPaidFull && (
                      <>
                        <p style={smallMuted}>
                          В приватку входит всё, что нужно, чтобы уверенно
                          заходить в рефаунд и чёрный ресейл, без угадайки и
                          устаревших схем.
                        </p>

                        <ul
                          style={{
                            margin: "10px 0 0",
                            paddingLeft: 16,
                            fontSize: "0.83rem",
                            color: "#e5e7eb",
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                          }}
                        >
                          <li>Рефаунд Temu (техника и одежда).</li>
                          <li>Рефаунд AliExpress (техника и одежда).</li>
                          <li>Рефаунд спортпита iHerb до 150 долларов.</li>
                          <li>Рефаунд Pinduoduo с лимитом 100–150 долларов.</li>
                          <li>Подробный мануал по заказам с китайских площадок.</li>
                          <li>
                            Поставщики с Pinduoduo, Taobao, 1688 и других
                            китайских платформ.
                          </li>
                          <li>Чёрный ресейл и работа с товаром после выкупа.</li>
                          <li>
                            Контакты людей для отрисовки, скупки, прокси и
                            смежных задач.
                          </li>
                          <li>Метод получения скидки до 20% в Temu.</li>
                          <li>
                            Метод рефаунда товаров в пути, при подходе к границе
                            Украины (Temu).
                          </li>
                          <li>
                            Готовые видео‑доказательства по актуальным моделям
                            телефонов и клавиатур.
                          </li>
                          <li>
                            Методы создания доказательств на телефоны и
                            клавиатуры под нужную ситуацию.
                          </li>
                          <li>Личное менторство и сопровождение по шагам.</li>
                          <li>
                            Метод обхода автоматического возврата из‑за
                            подозрительной активности (фрод).
                          </li>
                        </ul>

                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <a
                            href={telegramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={btnPrimary}
                          >
                            Связаться в Telegram (@RefFofan)
                          </a>
                          <button
                            type="button"
                            style={btnGhost}
                            onClick={() => setShowPaidFull(false)}
                          >
                            Свернуть описание
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </TiltCard>
              </div>

              <div style={{ marginTop: 26 }}>
                <h2 style={sectionTitle}>Отзывы учеников</h2>
                <p style={smallMuted}>
                  Все реальные отзывы, скрины из приватки и результаты учеников
                  я собираю в отдельном Telegram‑канале. Там можно посмотреть
                  живые примеры и историю ребят, которые уже прошли через
                  рефаунд и ресейл.
                </p>

                <a
                  href={reviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...btnPrimary,
                    marginTop: 8,
                    animation: "glow-pulse 2.6s ease-in-out infinite alternate",
                  }}
                >
                  Смотреть отзывы в Telegram
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

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
