<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vereda La Garrapata | Gestión Comunitaria</title>
  <link rel="icon" type="image/png" href="imagenes/logo-jac-transparente.png">
  <style>
    @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Manrope:wght@400;500;700;800&display=swap");

    :root {
      --ink: #122842;
      --muted: #4e6075;
      --paper: #fffdf7;
      --line: #d9ccb1;
      --primary: #1a2f79;
      --primary-2: #27539d;
      --accent: #ac7424;
      --accent-soft: rgba(172, 116, 36, 0.18);
      --ok-soft: rgba(36, 112, 64, 0.14);
      --radius: 18px;
      --shadow: 0 16px 34px rgba(20, 35, 67, 0.12);
    }

    * {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      color: var(--ink);
      font-family: "Manrope", sans-serif;
      background:
        radial-gradient(circle at 0% 0%, rgba(26, 47, 121, 0.24), transparent 40%),
        radial-gradient(circle at 96% 15%, rgba(172, 116, 36, 0.26), transparent 34%),
        linear-gradient(180deg, #f8f3e7 0%, #f0e5cf 100%);
      min-height: 100vh;
    }

    .skip-link {
      position: absolute;
      left: 12px;
      top: -42px;
      z-index: 120;
      background: var(--primary);
      color: #fff;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 10px;
      font-weight: 700;
      transition: top 120ms ease;
    }

    .skip-link:focus-visible {
      top: 10px;
    }

    .container {
      width: min(1180px, 92%);
      margin: 0 auto;
    }

    header {
      position: sticky;
      top: 0;
      z-index: 60;
      background: rgba(248, 243, 231, 0.9);
      border-bottom: 1px solid rgba(217, 204, 177, 0.9);
      backdrop-filter: blur(12px);
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      flex-wrap: wrap;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-badge {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: block;
      overflow: hidden;
      border: 2px solid rgba(26, 47, 121, 0.2);
      background: #fff;
      box-shadow: 0 10px 22px rgba(18, 40, 66, 0.2);
      flex-shrink: 0;
    }

    .brand-badge img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .brand strong {
      display: block;
      font-size: 1rem;
      line-height: 1.2;
      letter-spacing: 0.01em;
    }

    .brand span {
      color: var(--muted);
      font-size: 0.83rem;
      font-weight: 500;
    }

    nav {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: end;
      align-items: center;
    }

    nav a {
      text-decoration: none;
      color: var(--ink);
      font-size: 0.9rem;
      font-weight: 700;
      opacity: 0.9;
    }

    nav a.nav-link {
      border-radius: 999px;
      padding: 8px 12px;
      transition: background-color 150ms ease, color 150ms ease;
    }

    nav a.nav-link:hover {
      background: #e8dcc3;
    }

    nav a.nav-link.is-active {
      background: #e2d2b1;
      color: #1a2f79;
    }

    .menu-toggle {
      display: none;
      border: 1px solid var(--line);
      background: #fff6e5;
      color: var(--ink);
      border-radius: 999px;
      padding: 9px 13px;
      font-weight: 800;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .btn {
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 11px 17px;
      border-radius: 999px;
      border: 0;
      font-weight: 800;
      font-size: 0.9rem;
      transition: transform 150ms ease, filter 150ms ease, box-shadow 150ms ease;
      cursor: pointer;
    }

    .btn:hover {
      transform: translateY(-2px);
      filter: brightness(0.98);
    }

    a:focus-visible,
    button:focus-visible {
      outline: 3px solid rgba(26, 47, 121, 0.35);
      outline-offset: 2px;
    }

    .btn-primary {
      color: #fff;
      background: linear-gradient(140deg, var(--primary), var(--primary-2));
      box-shadow: 0 10px 24px rgba(26, 47, 121, 0.3);
    }

    .btn-soft {
      color: var(--ink);
      background: #eee0c5;
      border: 1px solid var(--line);
    }

    .btn-outline {
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.4);
      background: transparent;
    }

    .hero {
      padding: 74px 0 56px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 18px;
    }

    @media (min-width: 980px) {
      .hero {
        grid-template-columns: 1.08fr 0.92fr;
        align-items: center;
      }
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--accent-soft);
      color: #6f4e17;
      border-radius: 999px;
      padding: 8px 12px;
      font-size: 0.82rem;
      font-weight: 800;
      width: fit-content;
    }

    .hero h1 {
      margin: 13px 0 12px;
      font-family: "Fraunces", serif;
      line-height: 1.04;
      font-size: clamp(2.15rem, 5vw, 3.8rem);
      letter-spacing: -0.015em;
      max-width: 19ch;
    }

    .hero p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
      max-width: 64ch;
    }

    .hero-actions {
      margin-top: 24px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .hero-tags {
      margin-top: 16px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .hero-tags span {
      border-radius: 999px;
      border: 1px solid #dccfb8;
      background: rgba(255, 255, 255, 0.7);
      padding: 7px 11px;
      font-size: 0.77rem;
      color: #3a4a40;
      font-weight: 700;
    }

    .hero-panel {
      background: linear-gradient(160deg, #fffcf5, #f4e7ce);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 22px;
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
      min-height: 338px;
    }

    .hero-panel::after {
      content: "";
      position: absolute;
      width: 214px;
      height: 214px;
      border-radius: 50%;
      top: -74px;
      right: -76px;
      background: radial-gradient(circle, rgba(26, 47, 121, 0.22), transparent 70%);
    }

    .hero-panel h2 {
      margin: 0 0 10px;
      font-family: "Fraunces", serif;
      font-size: 1.45rem;
      position: relative;
      z-index: 1;
    }

    .hero-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 10px;
      position: relative;
      z-index: 1;
    }

    .hero-list li {
      background: rgba(255, 255, 255, 0.88);
      border: 1px solid rgba(226, 215, 194, 0.85);
      border-radius: 12px;
      padding: 11px 12px;
      color: #3d4a40;
      line-height: 1.5;
    }

    .hero-foot {
      margin-top: 14px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      position: relative;
      z-index: 1;
    }

    .hero-foot div {
      background: rgba(26, 47, 121, 0.08);
      border: 1px solid rgba(26, 47, 121, 0.2);
      border-radius: 10px;
      padding: 8px;
      text-align: center;
    }

    .hero-foot strong {
      display: block;
      color: var(--primary);
      font-family: "Fraunces", serif;
      font-size: 1.12rem;
    }

    .hero-foot span {
      font-size: 0.76rem;
      color: #3f4f45;
      font-weight: 700;
    }

    .section {
      padding: 18px 0 12px;
    }

    .section h3 {
      margin: 0;
      font-family: "Fraunces", serif;
      font-size: clamp(1.45rem, 3vw, 2.08rem);
    }

    .section-top {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 14px;
      flex-wrap: wrap;
      align-items: end;
    }

    .section-top p {
      margin: 0;
      color: var(--muted);
      max-width: 70ch;
      line-height: 1.62;
    }

    .metrics {
      display: grid;
      gap: 13px;
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    @media (min-width: 700px) {
      .metrics {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (min-width: 1020px) {
      .metrics {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }

    .metric {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 16px;
      box-shadow: 0 8px 24px rgba(28, 44, 35, 0.08);
      transform: translateY(8px);
      opacity: 0;
      animation: rise 600ms ease forwards;
    }

    .metric:nth-child(2) {
      animation-delay: 90ms;
    }

    .metric:nth-child(3) {
      animation-delay: 160ms;
    }

    .metric:nth-child(4) {
      animation-delay: 230ms;
    }

    .metric strong {
      display: block;
      color: var(--primary);
      font-family: "Fraunces", serif;
      font-size: 1.82rem;
      margin-bottom: 4px;
    }

    .metric span {
      color: #36453b;
      font-weight: 800;
      font-size: 0.95rem;
    }

    .metric p {
      margin: 7px 0 0;
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .services {
      margin-top: 14px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 880px) {
      .services {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .service {
      background: linear-gradient(180deg, #fffef9, #f7efdf);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 15px;
      display: grid;
      gap: 10px;
      align-content: space-between;
      min-height: 210px;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .service:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 26px rgba(28, 44, 35, 0.12);
    }

    .service .tag {
      width: fit-content;
      font-size: 0.74rem;
      font-weight: 800;
      color: #6f4d18;
      background: #e9dcc4;
      border-radius: 999px;
      padding: 6px 10px;
    }

    .service h4 {
      margin: 0;
      font-size: 1.03rem;
    }

    .service p {
      margin: 0;
      color: var(--muted);
      line-height: 1.56;
      font-size: 0.92rem;
    }

    .service .btn {
      width: fit-content;
      padding: 9px 13px;
      font-size: 0.84rem;
    }

    .projects {
      margin-top: 14px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 880px) {
      .projects {
        grid-template-columns: 1fr 1fr;
      }
    }

    .project {
      background: linear-gradient(180deg, #fffdf8, #f7efdf);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 16px;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .project:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 26px rgba(28, 44, 35, 0.12);
    }

    .project .tag {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 800;
      color: #6f4d18;
      background: #e9dcc4;
      border-radius: 999px;
      padding: 6px 10px;
      margin-bottom: 9px;
    }

    .project h4 {
      margin: 0 0 8px;
      font-size: 1.06rem;
    }

    .project p {
      margin: 0;
      color: var(--muted);
      line-height: 1.58;
    }

    .gallery {
      margin-top: 14px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 760px) {
      .gallery {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (min-width: 1120px) {
      .gallery {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .gallery-item {
      margin: 0;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(30, 44, 35, 0.09);
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .gallery-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 26px rgba(28, 44, 35, 0.12);
    }

    .gallery-item img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      display: block;
    }

    .gallery-item figcaption {
      padding: 10px 12px;
      font-size: 0.88rem;
      color: #435045;
      line-height: 1.45;
    }

    .transparency {
      margin-top: 14px;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 900px) {
      .transparency {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .doc-card {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 14px;
      padding: 14px;
      box-shadow: 0 8px 20px rgba(30, 44, 35, 0.07);
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .doc-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 14px 26px rgba(30, 44, 35, 0.12);
    }

    .doc-card strong {
      display: block;
      font-size: 0.9rem;
      color: #31443a;
      margin-bottom: 8px;
      letter-spacing: 0.01em;
    }

    .doc-card h4 {
      margin: 0 0 7px;
      font-size: 1rem;
    }

    .doc-card p {
      margin: 0 0 10px;
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.55;
    }

    .doc-card a {
      text-decoration: none;
      color: var(--primary);
      font-weight: 800;
      font-size: 0.86rem;
    }

    .dual {
      margin-top: 14px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    @media (min-width: 980px) {
      .dual {
        grid-template-columns: 1fr 1fr;
      }
    }

    .agenda,
    .team {
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: var(--radius);
      padding: 16px;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .agenda:hover,
    .team:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 25px rgba(23, 39, 31, 0.1);
    }

    .agenda-list {
      margin: 10px 0 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 9px;
    }

    .agenda-list li {
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 11px;
      padding: 10px 11px;
      line-height: 1.5;
      color: #425047;
      display: grid;
      gap: 3px;
    }

    .agenda-list strong {
      color: var(--ink);
      font-size: 0.92rem;
    }

    .agenda-list span {
      color: var(--muted);
      font-size: 0.84rem;
    }

    .team-grid {
      margin-top: 10px;
      display: grid;
      gap: 10px;
      grid-template-columns: 1fr;
    }

    @media (min-width: 740px) {
      .team-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .member {
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 12px;
      padding: 10px 11px;
    }

    .member strong {
      display: block;
      font-size: 0.95rem;
      margin-bottom: 3px;
    }

    .member span {
      display: block;
      color: var(--muted);
      font-size: 0.84rem;
      margin-bottom: 5px;
    }

    .member p {
      margin: 0;
      color: #435047;
      font-size: 0.86rem;
      line-height: 1.45;
    }

    .roadmap {
      margin-top: 14px;
      list-style: none;
      padding: 0;
      display: grid;
      gap: 10px;
    }

    .roadmap li {
      border: 1px solid var(--line);
      border-left: 6px solid var(--primary);
      border-radius: 12px;
      padding: 12px;
      background: rgba(255, 251, 242, 0.8);
      color: #425047;
      line-height: 1.52;
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .roadmap li:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 22px rgba(23, 39, 31, 0.08);
    }

    .roadmap strong {
      color: var(--ink);
    }

    .cta {
      margin: 30px 0 8px;
      background: linear-gradient(130deg, #1a2f79, #2a4d9d);
      color: #fff;
      border-radius: 24px;
      padding: 28px;
      display: grid;
      gap: 16px;
      grid-template-columns: 1fr;
      align-items: center;
    }

    @media (min-width: 860px) {
      .cta {
        grid-template-columns: 1fr auto;
      }
    }

    .cta h4 {
      margin: 0;
      font-family: "Fraunces", serif;
      font-size: clamp(1.45rem, 3vw, 2rem);
    }

    .cta p {
      margin: 7px 0 0;
      line-height: 1.62;
      color: rgba(255, 255, 255, 0.9);
      max-width: 66ch;
    }

    .cta-actions {
      display: flex;
      gap: 9px;
      flex-wrap: wrap;
      justify-content: end;
    }

    footer {
      margin-top: 38px;
      padding: 22px 0 30px;
      border-top: 1px solid var(--line);
      color: var(--muted);
      font-size: 0.9rem;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }

    .reveal {
      transition: opacity 460ms ease, transform 460ms ease;
    }

    .enhanced .reveal {
      opacity: 0;
      transform: translateY(14px);
    }

    .enhanced .reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    @media (max-width: 900px) {
      .menu-toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .topbar {
        align-items: start;
      }

      .enhanced nav {
        width: 100%;
        display: none;
        flex-direction: column;
        align-items: stretch;
        padding: 8px 0 2px;
      }

      .enhanced nav.is-open {
        display: flex;
      }

      nav a.nav-link {
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.72);
      }

      nav .btn {
        width: 100%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }

      *,
      *::before,
      *::after {
        animation: none !important;
        transition: none !important;
      }
    }

    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#inicio">Saltar al contenido</a>
  <header>
    <div class="container topbar">
      <div class="brand">
        <div class="brand-badge" aria-hidden="true">
          <img src="imagenes/logo-jac-transparente.png" alt="" loading="eager" decoding="async">
        </div>
        <div>
          <strong>Vereda La Garrapata</strong>
          <span>Organización Comunitaria</span>
        </div>
      </div>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mainNav">Menu</button>
      <nav id="mainNav" aria-label="Navegacion principal">
        <a class="nav-link" href="#inicio">Inicio</a>
        <a class="nav-link" href="#impacto">Impacto</a>
        <a class="nav-link" href="#servicios">Servicios</a>
        <a class="nav-link" href="institucional.html">Institucional</a>
        <a class="nav-link" href="#galeria">Galería</a>
        <a class="nav-link" href="#transparencia">Transparencia</a>
        <a class="nav-link" href="#ruta">Ruta</a>
        <a class="btn btn-primary" href="emitir-certificados.html">Emitir</a>
      </nav>
    </div>
  </header>

  <main id="inicio" class="container">
    <section class="hero">
      <div>
        <span class="eyebrow">Gestión comunitaria con trazabilidad</span>
        <h1>Mostramos el trabajo de la vereda y formalizamos cada certificado</h1>
        <p>
          Este home concentra el trabajo territorial de La Garrapata, visibiliza programas y conecta
          los módulos digitales para emisión y consulta de certificados de residencia.
        </p>
        <div class="hero-tags">
          <span>Documentos verificables</span>
          <span>Transparencia comunitaria</span>
          <span>Gestión con trazabilidad</span>
        </div>
        <div class="hero-actions">
          <a class="btn btn-primary" href="emitir-certificados.html">Ir a emitir certificados</a>
          <a class="btn btn-soft" href="consultar-certificados.html">Ir a consulta pública</a>
          <a class="btn btn-soft" href="institucional.html">Ver perfil institucional</a>
        </div>
      </div>
      <aside class="hero-panel">
        <h2>Tablero institucional</h2>
        <ul class="hero-list">
          <li>Seguimiento del trabajo social, productivo y ambiental en la vereda.</li>
          <li>Estándar para documentos oficiales con identidad local y código verificable.</li>
          <li>Transparencia de procesos comunitarios con trazabilidad de actas y acuerdos.</li>
          <li>Ruta digital para servicios de certificación y validación documental.</li>
        </ul>
        <div class="hero-foot">
          <div><strong>126</strong><span>Familias</span></div>
          <div><strong>19</strong><span>Jornadas</span></div>
          <div><strong>8</strong><span>Programas</span></div>
        </div>
      </aside>
    </section>

    <section id="impacto" class="section">
      <div class="section-top">
        <h3>Impacto comunitario</h3>
        <p>
          Indicadores de referencia para mostrar resultados y fortalecer confianza en la gestión social.
        </p>
      </div>
      <div class="metrics">
        <article class="metric">
          <strong>126</strong>
          <span>Familias articuladas</span>
          <p>Participación activa en juntas, mingas y actividades de organización barrial.</p>
        </article>
        <article class="metric">
          <strong>19</strong>
          <span>Jornadas colectivas</span>
          <p>Trabajo colaborativo en vías, entorno escolar y gestión de espacios comunes.</p>
        </article>
        <article class="metric">
          <strong>8</strong>
          <span>Programas en curso</span>
          <p>Líneas activas de ambiente, juventud, emprendimiento y apoyo comunitario.</p>
        </article>
        <article class="metric">
          <strong>92%</strong>
          <span>Actas digitalizadas</span>
          <p>Respaldo documental para decisiones, acuerdos y seguimiento del plan veredal.</p>
        </article>
      </div>
    </section>

    <section id="servicios" class="section">
      <div class="section-top">
        <h3>Servicios del sistema</h3>
        <p>
          Accesos operativos para la gestión documental de la vereda. Cada módulo responde a una tarea concreta.
        </p>
      </div>
      <div class="services">
        <article class="service reveal">
          <span class="tag">Módulo activo</span>
          <h4>Emisión de certificados</h4>
          <p>
            Registro de residente, generación de consecutivo, código de verificación y formato listo para imprimir.
          </p>
          <a class="btn btn-primary" href="emitir-certificados.html">Entrar al módulo</a>
        </article>
        <article class="service reveal">
          <span class="tag">Módulo activo</span>
          <h4>Consulta pública</h4>
          <p>
            Validación de autenticidad por código para confirmar estado y datos principales del certificado emitido.
          </p>
          <a class="btn btn-soft" href="consultar-certificados.html">Ir a consulta</a>
        </article>
        <article class="service reveal">
          <span class="tag">Siguiente mejora</span>
          <h4>Reportes de gestión</h4>
          <p>
            Consolidado mensual de certificados emitidos y avance de actividades para presentaciones institucionales.
          </p>
          <a class="btn btn-soft" href="#ruta">Ver ruta</a>
        </article>
      </div>
    </section>

    <section id="proyectos" class="section">
      <div class="section-top">
        <h3>Trabajo comunitario en marcha</h3>
        <p>
          Frentes activos que muestran resultados en convivencia, desarrollo local y cuidado del territorio.
        </p>
      </div>
      <div class="projects">
        <article class="project reveal">
          <span class="tag">Infraestructura</span>
          <h4>Mejoramiento de vías rurales</h4>
          <p>
            Mantenimiento por tramos críticos para movilidad de estudiantes, productores y transporte veredal,
            con apoyo de jornadas comunitarias.
          </p>
        </article>
        <article class="project reveal">
          <span class="tag">Agua y saneamiento</span>
          <h4>Fortalecimiento del acueducto</h4>
          <p>
            Limpieza de líneas, control de puntos de riesgo y esquema de turnos para cuidado preventivo del servicio.
          </p>
        </article>
        <article class="project reveal">
          <span class="tag">Educación y familia</span>
          <h4>Acompañamiento escolar comunitario</h4>
          <p>
            Refuerzo académico y red de apoyo para estudiantes con articulación entre padres y líderes locales.
          </p>
        </article>
        <article class="project reveal">
          <span class="tag">Ambiente</span>
          <h4>Jornadas de limpieza y reforestación</h4>
          <p>
            Recuperación de zonas comunes y protección de nacederos con grupos de voluntariado juvenil.
          </p>
        </article>
      </div>
    </section>

    <section id="galeria" class="section">
      <div class="section-top">
        <h3>Galería Comunitaria</h3>
        <p>
          Registros fotográficos recientes de actividades y espacios de la vereda La Garrapata.
        </p>
      </div>
      <div class="gallery">
        <figure class="gallery-item reveal">
          <img src="imagenes/WhatsApp Image 2026-03-08 at 19.01.07.jpeg" alt="Registro comunitario de la vereda La Garrapata 1" loading="lazy" decoding="async">
          <figcaption>Jornada comunitaria en territorio.</figcaption>
        </figure>
        <figure class="gallery-item reveal">
          <img src="imagenes/WhatsApp Image 2026-03-08 at 19.02.43.jpeg" alt="Registro comunitario de la vereda La Garrapata 2" loading="lazy" decoding="async">
          <figcaption>Encuentro y participación de la comunidad.</figcaption>
        </figure>
        <figure class="gallery-item reveal">
          <img src="imagenes/WhatsApp Image 2026-03-08 at 19.03.38.jpeg" alt="Registro comunitario de la vereda La Garrapata 3" loading="lazy" decoding="async">
          <figcaption>Proceso organizativo en actividades locales.</figcaption>
        </figure>
        <figure class="gallery-item reveal">
          <img src="imagenes/WhatsApp Image 2026-03-08 at 19.03.39.jpeg" alt="Registro comunitario de la vereda La Garrapata 4" loading="lazy" decoding="async">
          <figcaption>Trabajo colaborativo para la vereda.</figcaption>
        </figure>
        <figure class="gallery-item reveal">
          <img src="imagenes/WhatsApp Image 2026-03-08 at 19.03.40.jpeg" alt="Registro comunitario de la vereda La Garrapata 5" loading="lazy" decoding="async">
          <figcaption>Actividad comunitaria y fortalecimiento local.</figcaption>
        </figure>
      </div>
    </section>

    <section id="transparencia" class="section">
      <div class="section-top">
        <h3>Transparencia y documentos</h3>
        <p>
          Espacio para publicar los documentos de control comunitario y garantizar acceso a información relevante.
        </p>
      </div>
      <div class="transparency">
        <article class="doc-card reveal">
          <strong>Control institucional</strong>
          <h4>Actas de asambleas</h4>
          <p>Repositorio de actas aprobadas y compromisos acordados por la comunidad.</p>
          <a href="#">Abrir carpeta de actas</a>
        </article>
        <article class="doc-card reveal">
          <strong>Gestión documental</strong>
          <h4>Formato de certificaciones</h4>
          <p>Modelo oficial del certificado de residencia con datos del firmante autorizado.</p>
          <a href="emitir-certificados.html">Ir al formato digital</a>
        </article>
        <article class="doc-card reveal">
          <strong>Rendición social</strong>
          <h4>Informe de avances</h4>
          <p>Resumen de metas, actividades y estado de proyectos comunitarios por periodo.</p>
          <a href="#">Ver informe de gestión</a>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-top">
        <h3>Agenda y equipo comunitario</h3>
        <p>
          Planeación operativa y responsables de liderazgo para sostener los procesos de la vereda.
        </p>
      </div>
      <div class="dual">
        <article class="agenda reveal">
          <h4>Agenda de próximas actividades</h4>
          <ul class="agenda-list">
            <li>
              <strong>Asamblea general de seguimiento</strong>
              <span>Sábado 14 - 9:00 am</span>
              <span>Salón comunal, verificación de compromisos y nuevos acuerdos.</span>
            </li>
            <li>
              <strong>Jornada de mantenimiento vial</strong>
              <span>Domingo 22 - 7:30 am</span>
              <span>Intervención en dos tramos priorizados por movilidad escolar.</span>
            </li>
            <li>
              <strong>Capacitación documental</strong>
              <span>Miércoles 25 - 5:00 pm</span>
              <span>Uso del sistema de certificados y buenas prácticas de archivo.</span>
            </li>
          </ul>
        </article>
        <article class="team reveal">
          <h4>Equipo comunitario de referencia</h4>
          <div class="team-grid">
            <div class="member">
              <strong>María Elena Pérez</strong>
              <span>Presidencia Junta Veredal</span>
              <p>Coordina asambleas, firma certificaciones y seguimiento de compromisos comunitarios.</p>
            </div>
            <div class="member">
              <strong>Carlos Alberto Rojas</strong>
              <span>Comité de infraestructura</span>
              <p>Articula jornadas de mejora vial y control de mantenimientos preventivos.</p>
            </div>
            <div class="member">
              <strong>Luisa Fernanda Torres</strong>
              <span>Comité social y educativo</span>
              <p>Gestiona apoyo a familias, actividades juveniles y acompañamiento escolar.</p>
            </div>
            <div class="member">
              <strong>Jorge Andrés Molina</strong>
              <span>Gestor documental</span>
              <p>Consolida actas, archivos de respaldo y apoyo técnico del sistema digital.</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="ruta" class="section">
      <div class="section-top">
        <h3>Ruta digital del sistema</h3>
        <p>
          Hoja de ruta para consolidar la plataforma de certificados y mejorar trazabilidad institucional.
        </p>
      </div>
      <ul class="roadmap">
        <li class="reveal"><strong>Fase 1:</strong> Home institucional para mostrar trabajo comunitario y objetivos.</li>
        <li class="reveal"><strong>Fase 2:</strong> Módulo de emisión con consecutivo y formato de impresión.</li>
        <li class="reveal"><strong>Fase 3:</strong> Módulo público de consulta por código de verificación.</li>
        <li class="reveal"><strong>Fase 4:</strong> Reportes mensuales para rendición y seguimiento de gestión.</li>
      </ul>
    </section>

    <section class="cta">
      <div>
        <h4>Operación documental lista para la comunidad</h4>
        <p>
          Continúa con la emisión de certificados o valida documentos ya emitidos desde la consulta pública.
        </p>
      </div>
      <div class="cta-actions">
        <a class="btn btn-soft" href="consultar-certificados.html">Consultar</a>
        <a class="btn btn-outline" href="emitir-certificados.html">Emitir certificado</a>
      </div>
    </section>

    <footer>
      <span>Organización Comunitaria Vereda La Garrapata | Plataforma de gestión y certificados</span>
      <span id="yearLabel"></span>
    </footer>
  </main>

  <script>
    (function () {
      document.body.classList.add("enhanced");

      var now = new Date();
      var yearLabel = document.getElementById("yearLabel");
      if (yearLabel) {
        var formattedDate = new Intl.DateTimeFormat("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        }).format(now);
        yearLabel.textContent = "Actualizado " + formattedDate;
      }

      var menuToggle = document.querySelector(".menu-toggle");
      var nav = document.getElementById("mainNav");
      if (menuToggle && nav) {
        var setMenuState = function (open) {
          nav.classList.toggle("is-open", open);
          menuToggle.setAttribute("aria-expanded", String(open));
        };

        menuToggle.addEventListener("click", function () {
          setMenuState(!nav.classList.contains("is-open"));
        });

        nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
          link.addEventListener("click", function () {
            setMenuState(false);
          });
        });
      }

      var sectionLinks = Array.from(document.querySelectorAll('#mainNav a.nav-link[href^="#"]'));
      var sections = sectionLinks
        .map(function (link) {
          return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

      if ("IntersectionObserver" in window && sectionLinks.length && sections.length) {
        var linksBySectionId = new Map(
          sectionLinks.map(function (link) {
            return [link.getAttribute("href").slice(1), link];
          })
        );

        var navObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              sectionLinks.forEach(function (link) {
                link.classList.remove("is-active");
              });
              var activeLink = linksBySectionId.get(entry.target.id);
              if (activeLink) activeLink.classList.add("is-active");
            });
          },
          {
            threshold: 0.1,
            rootMargin: "-44% 0px -44% 0px"
          }
        );

        sections.forEach(function (section) {
          navObserver.observe(section);
        });
      } else if (sectionLinks.length) {
        sectionLinks[0].classList.add("is-active");
      }

      var revealItems = Array.from(document.querySelectorAll(".reveal"));
      if ("IntersectionObserver" in window && revealItems.length) {
        var revealObserver = new IntersectionObserver(
          function (entries, obs) {
            entries.forEach(function (entry) {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            });
          },
          {
            threshold: 0.2,
            rootMargin: "0px 0px -8% 0px"
          }
        );

        revealItems.forEach(function (item) {
          revealObserver.observe(item);
        });
      } else {
        revealItems.forEach(function (item) {
          item.classList.add("is-visible");
        });
      }
    })();
  </script>
</body>
</html>


