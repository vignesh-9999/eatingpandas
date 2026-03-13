interface RegistrationPageOptions {
  message?: string;
  messageType?: "success" | "error" | "info";
  userName?: string;
}

interface HeaderOptions {
  userName?: string;
}

interface ResultPageOptions {
  userName?: string;
}

function renderDocument(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: light;
        --brand: #fc8019;
        --brand-deep: #f26b00;
        --brand-soft: #fff2e5;
        --hero-red: #9f120d;
        --hero-red-deep: #6f0909;
        --gold: #ffcb3d;
        --ink: #282c3f;
        --ink-soft: #686b78;
        --line: #e9e9eb;
        --surface: #ffffff;
        --surface-alt: #f8f8f8;
        --leaf: #2e8b57;
        --maroon: #8d2342;
        --success: #1ba672;
        --danger: #d73c2c;
        --shadow: 0 24px 60px rgba(40, 44, 63, 0.1);
        --radius-xl: 30px;
        --radius-lg: 24px;
        --radius-md: 16px;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: "Gilroy", "Avenir Next", "Segoe UI", sans-serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top right, rgba(252, 128, 25, 0.12), transparent 18%),
          linear-gradient(180deg, #fff4e8 0%, #ffffff 44%, #fff4e7 100%);
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .page-shell {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
      }

      .fade-in {
        opacity: 0;
        transform: translateY(20px);
        animation: fadeInUp 700ms ease-out forwards;
      }

      .fade-in-delay {
        animation-delay: 140ms;
      }

      .site-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 24px 0 14px;
        position: relative;
      }

      .site-header::after {
        content: "🌿  ✦  🌿";
        position: absolute;
        left: 0;
        bottom: -8px;
        color: rgba(141, 35, 66, 0.42);
        letter-spacing: 10px;
        font-size: 0.9rem;
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-weight: 800;
        letter-spacing: -0.04em;
      }

      .brand-mark {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 18px 18px 18px 6px;
        background: linear-gradient(180deg, var(--brand), var(--brand-deep));
        color: #ffffff;
        font-size: 1.2rem;
        box-shadow: 0 16px 28px rgba(242, 107, 0, 0.28);
        transform: rotate(8deg);
      }

      .brand-copy {
        display: grid;
        gap: 2px;
      }

      .brand-copy strong {
        font-size: 1.1rem;
      }

      .brand-copy span {
        color: var(--maroon);
        font-size: 0.88rem;
        font-weight: 700;
      }

      .user-pill {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 14px;
        border-radius: 999px;
        background: var(--brand-soft);
        color: var(--maroon);
        font-size: 0.92rem;
        font-weight: 700;
      }

      .user-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--leaf);
      }

      .site-nav {
        display: flex;
        align-items: center;
        gap: 24px;
        font-weight: 700;
      }

      .site-nav a {
        color: var(--ink-soft);
        transition: color 180ms ease;
      }

      .site-nav a:hover {
        color: var(--brand);
      }

      .hero {
        padding: 28px 0 82px;
      }

      .hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.2fr) minmax(320px, 420px);
        gap: 30px;
        align-items: stretch;
      }

      .hero-copy {
        position: relative;
        overflow: hidden;
        padding: 54px 48px;
        border-radius: var(--radius-xl);
        background:
          radial-gradient(circle at center, rgba(255, 214, 89, 0.08), transparent 34%),
          linear-gradient(135deg, var(--hero-red) 0%, var(--hero-red-deep) 100%);
        box-shadow: 0 30px 70px rgba(111, 9, 9, 0.28);
        color: #ffffff;
      }

      .hero-copy::after {
        content: "";
        position: absolute;
        right: -18px;
        top: -18px;
        width: 220px;
        height: 220px;
        border-radius: 50%;
        background:
          radial-gradient(circle, rgba(255, 203, 61, 0.9) 0 12%, rgba(255, 138, 39, 0.92) 13% 18%, transparent 19%),
          radial-gradient(circle, rgba(255, 203, 61, 0.9) 0 12%, rgba(255, 138, 39, 0.92) 13% 18%, transparent 19%);
        background-size: 72px 72px;
        background-position: 0 0, 36px 36px;
        opacity: 0.78;
        filter: blur(1px);
      }

      .hero-copy::before {
        content: "";
        position: absolute;
        inset: 16px;
        border-radius: 24px;
        border: 1px solid rgba(255, 222, 173, 0.12);
        pointer-events: none;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 9px 16px;
        border-radius: 999px;
        background: rgba(255, 230, 195, 0.14);
        color: #ffe3b3;
        font-size: 0.92rem;
        font-weight: 800;
      }

      h1 {
        margin: 20px 0 18px;
        max-width: 10ch;
        font-size: clamp(3rem, 7vw, 5.6rem);
        line-height: 0.92;
        letter-spacing: -0.07em;
      }

      .hero-copy p {
        margin: 0;
        max-width: 560px;
        color: rgba(255, 240, 227, 0.88);
        font-size: clamp(1rem, 2vw, 1.08rem);
        line-height: 1.75;
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        align-items: center;
        margin-top: 28px;
      }

      .cta-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 250px;
        padding: 17px 28px;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--brand), var(--brand-deep));
        color: #ffffff;
        font-size: 1rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        box-shadow: 0 18px 34px rgba(252, 128, 25, 0.3);
        animation: pulseGlow 2.8s ease-in-out infinite;
        transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
      }

      .cta-button:hover {
        transform: translateY(-2px);
        filter: brightness(1.03);
        box-shadow: 0 22px 40px rgba(252, 128, 25, 0.36);
      }

      .hero-note {
        color: rgba(255, 237, 214, 0.88);
        font-size: 0.95rem;
        font-weight: 700;
      }

      .hero-side {
        display: grid;
        gap: 18px;
      }

      .reward-card,
      .mini-card,
      .register-panel {
        background: var(--surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow);
      }

      .reward-card {
        position: relative;
        overflow: hidden;
        padding: 28px;
        border: 1px solid rgba(252, 128, 25, 0.12);
        transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        animation: float 5s ease-in-out infinite;
        background: linear-gradient(180deg, #fffaf4 0%, #fff2df 100%);
      }

      .reward-card:hover {
        transform: translateY(-8px);
        border-color: rgba(252, 128, 25, 0.28);
        box-shadow: 0 28px 48px rgba(252, 128, 25, 0.18);
      }

      .reward-card::before {
        content: "";
        position: absolute;
        inset: auto -22px -30px auto;
        width: 130px;
        height: 130px;
        border-radius: 32px;
        background: linear-gradient(135deg, rgba(252, 128, 25, 0.18), rgba(252, 128, 25, 0.02));
        transform: rotate(22deg);
      }

      .reward-card::after {
        content: "🪔";
        position: absolute;
        top: 18px;
        right: 18px;
        font-size: 1.3rem;
      }

      .reward-chip {
        display: inline-flex;
        align-items: center;
        padding: 8px 12px;
        border-radius: 999px;
        background: #1ba67214;
        color: var(--success);
        font-size: 0.85rem;
        font-weight: 800;
      }

      .reward-icon {
        margin-top: 20px;
        font-size: 3.4rem;
        line-height: 1;
      }

      .reward-label {
        margin: 18px 0 8px;
        font-size: 1.5rem;
        font-weight: 800;
        letter-spacing: -0.04em;
      }

      .reward-hint {
        margin: 0;
        color: var(--ink-soft);
        line-height: 1.7;
      }

      .mini-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 18px;
      }

      .mini-card {
        padding: 22px;
        background: linear-gradient(180deg, #ffffff 0%, #fff9f2 100%);
      }

      .mini-card strong {
        display: block;
        margin-top: 10px;
        font-size: 1rem;
        letter-spacing: -0.03em;
      }

      .mini-card span {
        display: block;
        margin-top: 8px;
        color: var(--ink-soft);
        font-size: 0.92rem;
        line-height: 1.6;
      }

      .register-wrap {
        padding: 20px 0 88px;
      }

      .register-panel {
        display: grid;
        grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
        overflow: hidden;
      }

      .register-aside {
        padding: 42px 34px;
        background:
          radial-gradient(circle at top right, rgba(255, 203, 61, 0.15), transparent 22%),
          linear-gradient(180deg, var(--hero-red) 0%, var(--maroon) 100%);
        color: #ffffff;
      }

      .register-aside h1 {
        margin-top: 18px;
        max-width: 8ch;
        font-size: clamp(2.4rem, 5vw, 3.6rem);
      }

      .register-aside p {
        margin: 0;
        color: rgba(255, 255, 255, 0.88);
        line-height: 1.8;
      }

      .aside-list {
        display: grid;
        gap: 14px;
        margin-top: 28px;
      }

      .aside-item {
        padding: 14px 16px;
        border-radius: 16px;
        background: rgba(255, 244, 230, 0.12);
        backdrop-filter: blur(10px);
        font-weight: 700;
      }

      .register-main {
        padding: 42px 34px;
        background: #ffffff;
      }

      .register-main h2 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 2.8rem);
        letter-spacing: -0.05em;
      }

      .register-main p {
        margin: 14px 0 0;
        color: var(--ink-soft);
        line-height: 1.75;
      }

      .success-celebration {
        position: relative;
        overflow: hidden;
        margin-top: 26px;
        padding: 26px 22px 28px;
        border-radius: 24px;
        background:
          radial-gradient(circle at center, rgba(255, 203, 61, 0.12), transparent 38%),
          linear-gradient(180deg, #a51310 0%, #760b0b 100%);
        color: #ffffff;
        box-shadow: 0 24px 46px rgba(111, 9, 9, 0.26);
      }

      .success-celebration::before {
        content: "";
        position: absolute;
        inset: 14px;
        border-radius: 20px;
        border: 1px solid rgba(255, 236, 204, 0.12);
        pointer-events: none;
      }

      .success-garland {
        position: relative;
        width: min(100%, 360px);
        margin: 4px auto 20px;
        aspect-ratio: 1 / 1;
        display: grid;
        place-items: center;
      }

      .garland-ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background:
          radial-gradient(circle, #ffd95f 0 10%, #ff9927 11% 17%, transparent 18%) 50% 0 / 70px 70px no-repeat,
          radial-gradient(circle, #ffd95f 0 10%, #ff9927 11% 17%, transparent 18%) 82% 18% / 70px 70px no-repeat,
          radial-gradient(circle, #ffd95f 0 10%, #ff9927 11% 17%, transparent 18%) 98% 48% / 70px 70px no-repeat,
          radial-gradient(circle, #ffd95f 0 10%, #ff9927 11% 17%, transparent 18%) 84% 79% / 70px 70px no-repeat,
          radial-gradient(circle, #ffd95f 0 10%, #ff9927 11% 17%, transparent 18%) 50% 100% / 70px 70px no-repeat,
          radial-gradient(circle, #ffd95f 0 10%, #ff9927 11% 17%, transparent 18%) 16% 79% / 70px 70px no-repeat,
          radial-gradient(circle, #ffd95f 0 10%, #ff9927 11% 17%, transparent 18%) 2% 48% / 70px 70px no-repeat,
          radial-gradient(circle, #ffd95f 0 10%, #ff9927 11% 17%, transparent 18%) 18% 18% / 70px 70px no-repeat;
        animation: rotateGlow 12s linear infinite;
      }

      .garland-ring::before {
        content: "";
        position: absolute;
        inset: 32px;
        border-radius: 50%;
        border: 2px solid rgba(255, 220, 153, 0.12);
      }

      .success-message {
        position: relative;
        z-index: 1;
        text-align: center;
      }

      .success-message span {
        display: block;
        color: #ffc75f;
        font-size: 1rem;
        font-weight: 800;
      }

      .success-message strong {
        display: block;
        margin-top: 6px;
        font-size: clamp(2.4rem, 5vw, 4rem);
        font-weight: 900;
        letter-spacing: -0.05em;
      }

      .festival-pot {
        position: absolute;
        left: 50%;
        bottom: 48px;
        width: 118px;
        height: 86px;
        transform: translateX(-50%);
        border-radius: 0 0 46px 46px;
        background: linear-gradient(180deg, #c98a33 0%, #9c5f1c 100%);
        box-shadow: inset 0 -10px 18px rgba(83, 42, 6, 0.16);
      }

      .festival-pot::before {
        content: "";
        position: absolute;
        left: 50%;
        top: -14px;
        width: 138px;
        height: 24px;
        transform: translateX(-50%);
        border-radius: 50%;
        background: linear-gradient(180deg, #c98a33 0%, #a36520 100%);
      }

      .festival-pot::after {
        content: "";
        position: absolute;
        inset: 18px 24px 18px;
        border-radius: 50%;
        border: 2px solid rgba(255, 215, 145, 0.18);
      }

      .mango-leaf {
        position: absolute;
        bottom: 70px;
        width: 58px;
        height: 78px;
        border-radius: 100% 0 100% 0;
        background: linear-gradient(180deg, #80c451 0%, #3d8b3f 100%);
        box-shadow: inset 0 -12px 18px rgba(27, 76, 24, 0.14);
      }

      .mango-leaf.left {
        left: calc(50% - 104px);
        transform: rotate(-20deg);
      }

      .mango-leaf.right {
        right: calc(50% - 104px);
        transform: rotate(20deg) scaleX(-1);
      }

      .diya {
        position: absolute;
        bottom: 28px;
        width: 82px;
        height: 34px;
        border-radius: 0 0 50px 50px;
        background: linear-gradient(180deg, #ffd347 0%, #f28b18 100%);
        box-shadow: 0 8px 14px rgba(0, 0, 0, 0.14);
      }

      .diya.left {
        left: 26px;
      }

      .diya.right {
        right: 26px;
      }

      .diya::before {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 24px;
        width: 16px;
        height: 28px;
        transform: translateX(-50%);
        border-radius: 50% 50% 50% 50% / 68% 68% 32% 32%;
        background: radial-gradient(circle at 50% 24%, #fff7c0 0 22%, #ffb220 40%, rgba(255, 178, 32, 0) 72%);
        animation: flicker 2.2s ease-in-out infinite;
      }

      .celebration-copy {
        position: relative;
        z-index: 1;
        text-align: center;
      }

      .celebration-copy h3 {
        margin: 0;
        font-size: 1.5rem;
        letter-spacing: -0.04em;
      }

      .celebration-copy p {
        margin: 10px auto 0;
        max-width: 420px;
        color: rgba(255, 239, 227, 0.88);
      }

      .form-grid {
        display: grid;
        gap: 16px;
        margin-top: 28px;
      }

      .field {
        display: grid;
        gap: 8px;
      }

      .field label {
        font-size: 0.94rem;
        font-weight: 700;
      }

      .field input {
        width: 100%;
        padding: 16px 18px;
        border: 1px solid var(--line);
        border-radius: 14px;
        background: var(--surface-alt);
        color: var(--ink);
        font: inherit;
        transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
      }

      .field input:focus {
        outline: none;
        background: #ffffff;
        border-color: rgba(252, 128, 25, 0.45);
        box-shadow: 0 0 0 4px rgba(252, 128, 25, 0.12);
      }

      .submit-button {
        margin-top: 6px;
        padding: 16px 20px;
        border: 0;
        border-radius: 14px;
        background: linear-gradient(135deg, var(--brand), var(--brand-deep));
        color: #ffffff;
        font: inherit;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 18px 30px rgba(252, 128, 25, 0.22);
      }

      .form-caption {
        margin-top: 18px;
        font-size: 0.95rem;
        color: var(--ink-soft);
      }

      .form-caption.is-success {
        color: var(--success);
      }

      .form-caption.is-error {
        color: var(--danger);
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 18px 34px rgba(252, 128, 25, 0.26); }
        50% { box-shadow: 0 22px 42px rgba(252, 128, 25, 0.42); }
      }

      @keyframes rotateGlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes flicker {
        0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.92; }
        50% { transform: translateX(-50%) scale(1.08, 0.94); opacity: 1; }
      }

      @keyframes fadeInUp {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      @media (max-width: 900px) {
        .hero-grid,
        .register-panel {
          grid-template-columns: 1fr;
        }

        .hero-copy,
        .register-main,
        .register-aside {
          padding: 32px 24px;
        }
      }

      @media (max-width: 720px) {
        .site-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .site-nav {
          gap: 16px;
          flex-wrap: wrap;
        }

        .mini-grid {
          grid-template-columns: 1fr;
        }

        .hero-actions {
          flex-direction: column;
          align-items: stretch;
        }

        .cta-button {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>`;
}

function renderHeader(options: HeaderOptions = {}) {
  const userPill = options.userName
    ? `<div class="user-pill"><span class="user-dot"></span><span>${options.userName}</span></div>`
    : "";

  return `<header class="site-header page-shell fade-in">
    <div class="brand-block">
      <a class="brand" href="/">
        <span class="brand-mark">W</span>
          <span class="brand-copy">
          <strong>Eating Pandas</strong>
          <span>Ugadi festive rewards</span>
        </span>
      </a>
      ${userPill}
    </div>
    <nav class="site-nav" aria-label="Primary">
      <a href="/">Home</a>
      <a href="#rewards">Rewards</a>
      <a href="/register">Login</a>
    </nav>
  </header>`;
}

export function renderLandingPage(userName?: string) {
  return renderDocument(
    "Eating Pandas",
    `${renderHeader({ userName })}
    <main class="hero page-shell">
      <section class="hero-grid">
        <div class="hero-copy fade-in fade-in-delay">
          <div class="eyebrow">Happy Ugadi Special</div>
          <h1>Claim Your Eating Pandas Rewards</h1>
          <p>Celebrate Ugadi with a festive reward reveal inspired by marigold garlands, diyas, and Telugu New Year celebrations. Complete your registration to see if you qualify for exclusive offers.</p>
          <div class="hero-actions">
            <a class="cta-button" href="/register">Register to Continue</a>
            <span class="hero-note">Tap below to reveal your Ugadi reward.</span>
          </div>
        </div>
        <div class="hero-side fade-in fade-in-delay" id="rewards">
          <article class="reward-card" aria-label="Mystery reward">
            <span class="reward-chip">Happy Ugadi special reward</span>
            <div class="reward-icon" aria-hidden="true">🎁</div>
            <p class="reward-label">Mystery Reward Box 🎁</p>
            <p class="reward-hint">A festive Telugu-inspired promotional reward is waiting for eligible members. Register now to reveal it.</p>
          </article>
          <div class="mini-grid">
            <article class="mini-card">
              <div>🌿</div>
              <strong>Ugadi celebration</strong>
              <span>Festive colors, celebratory details, and a polished reward journey.</span>
            </article>
            <article class="mini-card">
              <div>🪔</div>
              <strong>Exclusive offers</strong>
              <span>Unlock limited rewards reserved for qualified users during the campaign.</span>
            </article>
          </div>
        </div>
      </section>
    </main>`
  );
}

export function renderRegistrationPage(options: RegistrationPageOptions = {}) {
  const messageTypeClass =
    options.messageType === "success"
      ? "is-success"
      : options.messageType === "error"
        ? "is-error"
      : "";
  const message = options.message ?? "Your registration will be saved locally on this server.";

  return renderDocument(
    "Register | Eating Pandas",
    `${renderHeader({ userName: options.userName })}
    <main class="register-wrap page-shell">
      <section class="register-panel fade-in fade-in-delay">
        <aside class="register-aside">
          <div class="eyebrow">Happy Ugadi</div>
          <h1>Reveal your festive campaign reward.</h1>
          <p>Register once to continue, verify eligibility, and unlock the mystery reward curated for this Ugadi promotion with a celebratory Telugu festival look.</p>
          <div class="aside-list">
            <div class="aside-item">Telugu festive theme</div>
            <div class="aside-item">Premium reward reveal</div>
            <div class="aside-item">One-step access continuation</div>
          </div>
        </aside>
        <div class="register-main">
          <h2>Complete Your Registration</h2>
          <p>Enter your email and password below to continue and check whether your account qualifies for this reward campaign.</p>
          <form class="form-grid" method="post" action="/register">
            <div class="field">
              <label for="email">Email address</label>
              <input id="email" name="email" type="email" placeholder="alex@example.com" autocomplete="email" required />
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Enter a password" autocomplete="new-password" minlength="8" required />
            </div>
            <button class="submit-button" type="submit">Continue</button>
          </form>
          <p class="form-caption ${messageTypeClass}">${message}</p>
        </div>
      </section>
    </main>`
  );
}

export function renderResultPage(options: ResultPageOptions = {}) {
  const userName = options.userName ?? "Friend";

  return renderDocument(
    "Result | Eating Pandas",
    `${renderHeader({ userName })}
    <main class="register-wrap page-shell">
      <section class="success-celebration fade-in fade-in-delay">
        <div class="success-garland" aria-hidden="true">
          <div class="garland-ring"></div>
          <div class="success-message">
            <span>Happy</span>
            <strong>Ugadi</strong>
          </div>
          <div class="mango-leaf left"></div>
          <div class="mango-leaf right"></div>
          <div class="festival-pot"></div>
          <div class="diya left"></div>
          <div class="diya right"></div>
        </div>
        <div class="celebration-copy">
          <h3>${userName}, thank you for registering.</h3>
          <p>No reward this time. Better luck next time and best wishes for a joyful Ugadi celebration.</p>
        </div>
      </section>
    </main>`
  );
}
