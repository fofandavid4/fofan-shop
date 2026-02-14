/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async headers() {
    // OWASP Secure Headers + расширенный CSP
    // ВАЖНО: если добавишь внешние скрипты/шрифты/аналитику —
    // нужно будет дописать их хосты в CSP (script-src / img-src / font-src).
    const securityHeaders = [
      // 1) Жёсткое требование https
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload", // 2 года
      },
      // 2) Запрещаем встраивание в iframe
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      // 3) Отключаем MIME-sniffing
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      // 4) Базовая защита от XSS (для старых браузеров)
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      // 5) Политика реферера
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      // 6) Дополнительные кросс‑оригин защиты
      {
        key: "Permissions-Policy",
        // всё выключено, включишь по мере необходимости
        value:
          "geolocation=(), microphone=(), camera=(), browsing-topics=(), interest-cohort=(), fullscreen=(self)",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin",
      },
      {
        key: "Cross-Origin-Resource-Policy",
        value: "same-origin",
      },
      {
        key: "Cross-Origin-Embedder-Policy",
        // если потом будешь грузить чужие iframes/видео – возможно, придётся ослабить
        value: "require-corp",
      },
      // 7) Серьёзная, но не убийственная CSP под твой текущий стек
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self';",
          // скрипты только свои + inline от React/Next (они и так генерируются безопасно)
          // если добавишь аналитику (например, Google), сюда впишешь её домены
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
          // стили только свои + inline (у тебя много inline‑стилей)
          "style-src 'self' 'unsafe-inline';",
          // картинки: свои, https и data: (для base64)
          "img-src 'self' https: data: blob:;",
          // шрифты только свои/https
          "font-src 'self' https: data:;",
          // запросы к API (в т.ч. твой backend домен, если он отдельный)
          "connect-src 'self' https:;",
          // запрет на старые опасные типы
          "object-src 'none';",
          // формы шлём только на свой домен
          "form-action 'self';",
          // запрет подмены base url
          "base-uri 'self';",
          // запрет встраивания кем‑то ещё
          "frame-ancestors 'none';",
          // автоматический апгрейд http→https
          "upgrade-insecure-requests;",
        ].join(" "),
      },
    ];

    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
