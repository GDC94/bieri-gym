import { useState, useEffect, useRef, useCallback } from "react";
import logoHead from "./assets/logo head.svg";
import paraQuien from "./assets/para-quien.webp";
import whiteLogo from "./assets/white logo.svg";
import originalLogo from "./assets/logo completo texto abajo blanco.svg";
import alejoImg from "./assets/ale blur.svg";
import mateoImg from "./assets/mat blur.svg";
import heroImg from "./assets/hero.jpg";
import gym1Img from "./assets/gym1.jpg";
import gym2Img from "./assets/gym2.jpg";
import gym3Img from "./assets/gym3.jpg";
import gym4Img from "./assets/gym4.jpg";
import gym5Img from "./assets/gym5.jpg";
import coach1Img from "./assets/coach1.webp";

/* ─────────────────────────────────────────────
   BIERI ENTRENAMIENTO — Landing Page
   Inspired by coachsportifecublens.com aesthetic
   Dark premium · Immersive photos · Large type
   React + Tailwind · Mobile-first
   ───────────────────────────────────────────── */

// ── Constants ──────────────────────────────────
const WA = "5492494015101";
const WA_MSG = encodeURIComponent("Hola! Quiero consultar por cupos y evaluación inicial en Bieri.");
const WA_URL = `https://wa.me/${WA}?text=${WA_MSG}`;
const OPENING = new Date("2026-04-06T08:00:00-03:00");
const IG = "https://www.instagram.com/bieri.entrenamiento";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Rodriguez+1214+Tandil+Buenos+Aires";

// Placeholder images (replace with real photos)
const IMG = {
  hero: heroImg,
  gym1: gym1Img,
  gym2: gym2Img,
  gym3: gym3Img,
  gym4: gym4Img,
  gym5: gym5Img,
  coach1: coach1Img,
  coach2: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=600&q=80",
  training: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&q=80",
  community: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80",
};

// ── Hooks ──────────────────────────────────────
function useCountdown(target) {
  const calc = useCallback(() => {
    const d = Math.max(0, target - Date.now());
    return {
      days: Math.floor(d / 864e5),
      hours: Math.floor((d % 864e5) / 36e5),
      minutes: Math.floor((d % 36e5) / 6e4),
      seconds: Math.floor((d % 6e4) / 1e3),
      done: d === 0,
    };
  }, [target]);
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); o.unobserve(el); } },
      { threshold: 0.12 }
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return [ref, vis];
}

// ── Reveal wrapper ────────────────────────────
function R({ children, className = "", delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ease-out ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── SVG Icons ─────────────────────────────────
const I = ({ d, c = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 ${c}`} aria-hidden="true"><path d={d} /></svg>
);
const ic = {
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  target: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  clipboard: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  check: "M20 6L9 17l-5-5",
  mapPin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  ig: "M16 4H8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17.5 6.5h.01",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  msg: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  arrow: "M5 12h14M12 5l7 7-7 7",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
};

// ── WhatsApp SVG ──────────────────────────────
const WaIcon = ({ c = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={c} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

// ── NavLink with pure CSS hover (no useState re-renders) ──
function NavLink({ href, label, onClick }) {
  return (
    <a href={href} onClick={onClick}
      className="group relative px-4 py-2 rounded-full transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/10 whitespace-nowrap">
      {label}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-1/2 rounded-full bg-blue-500 transition-all duration-300" />
    </a>
  );
}

// ── Hoisted constants (avoid re-creation each render) ──
const NAV_LINKS = [
  ["#hero", "Inicio"],
  ["#nosotros", "Nosotros"],
  ["#profes", "Profes"],
  ["#para-quien", "Para quién"],
  ["#como-funciona", "Cómo funciona"],
  ["#ubicacion", "Contacto"],
];

const FEATURES = [
  { icon: ic.users, title: "Cupos de 10 por turno", desc: "Atención individual real en cada sesión de 90 minutos." },
  { icon: ic.target, title: "Evaluación inicial", desc: "Evaluamos tu estado para diseñar el estímulo óptimo." },
  { icon: ic.clipboard, title: "Seguimiento preciso", desc: "Registro de cargas, volumen y progresión constante." },
  { icon: ic.zap, title: "Equipamiento de calidad", desc: "Todo nuevo y seleccionado para entrenar en serio." },
  { icon: ic.heart, title: "Comunidad real", desc: "Todos entrenan en igualdad. Nadie por encima de nadie." },
  { icon: ic.shield, title: "Fuerza para la salud", desc: "Orientado a salud y rendimiento deportivo." },
];

const TRAINERS = [
  { name: "Alejo Barbieri", ig: "@pf.barbieriale", igUrl: "https://www.instagram.com/pf.barbieriale", img: alejoImg },
  { name: "Mateo Barbieri", ig: "@mateobarbieripf", igUrl: "https://www.instagram.com/mateobarbieripf", img: mateoImg },
];

const AUDIENCE = [
  { title: "Empezás de cero", desc: "Querés arrancar bien, con técnica correcta y un plan real desde el día uno." },
  { title: "Buscás resultados", desc: "Entrenás hace tiempo pero sentís que estancaste sin seguimiento profesional." },
  { title: "Deportista", desc: "Necesitás mejorar tu rendimiento físico con un trabajo de fuerza estructurado." },
  { title: "Querés constancia", desc: "Sabés que necesitás compromiso y un lugar que te acompañe de verdad." },
];

const STEPS = [
  { n: "1", title: "Consultá por WhatsApp", desc: "Escribinos y coordinamos tu evaluación inicial sin compromiso." },
  { n: "2", title: "Evaluación inicial", desc: "Analizamos tu estado físico, objetivos, experiencia e historial de lesiones para diseñar tu estímulo óptimo." },
  { n: "3", title: "Entrenás con tu plan", desc: "Sesiones de 90 minutos con planificación personalizada, corrección técnica y acompañamiento constante." },
  { n: "4", title: "Seguimiento y ajuste", desc: "Registramos cada sesión. Ajustamos cargas, volumen e intensidad para que progreses semana a semana." },
];

const GALLERY_IMAGES = [gym1Img, gym2Img, gym3Img, gym4Img, gym5Img];

const CONFETTI_COLORS = ['#CBFF5F', '#2563eb', '#3b82f6', '#ffffff', '#60a5fa', '#a3e635'];
const CONFETTI_PIECES = Array.from({ length: 40 }, (_, i) => ({
  x: `${(i * 2.5 + (i * 7.3 % 10)) % 100}%`,
  delay: `${(i * 0.37) % 3}s`,
  duration: `${2.5 + (i * 0.53) % 2}s`,
  rotation: `${(i * 47) % 360}deg`,
  color: CONFETTI_COLORS[i % 6],
}));

// ══════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════
export default function BieriLanding() {
  const cd = useCountdown(OPENING.getTime());
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Detect touch devices to skip custom cursor (checked once, safe as lazy init)
  const [isTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches);
  const cursorTarget = useRef({ x: -100, y: -100 });
  const cursorPos    = useRef({ x: -100, y: -100 });
  const cursorEl     = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Custom cursor animation (skipped on touch devices)
  useEffect(() => {
    if (isTouch) return;

    let raf;
    let moving = false;

    const tick = () => {
      const dx = cursorTarget.current.x - cursorPos.current.x;
      const dy = cursorTarget.current.y - cursorPos.current.y;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        cursorPos.current.x += dx * 0.4;
        cursorPos.current.y += dy * 0.4;
        if (cursorEl.current) {
          cursorEl.current.style.left = cursorPos.current.x + "px";
          cursorEl.current.style.top  = cursorPos.current.y + "px";
        }
        raf = requestAnimationFrame(tick);
      } else {
        moving = false;
      }
    };

    const onMove = (e) => {
      cursorTarget.current = { x: e.clientX, y: e.clientY };
      if (!moving) {
        moving = true;
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menu]);

  const scrollTo = useCallback((e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenu(false);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white antialiased scroll-smooth" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ── ANIMATED BACKGROUND ───────────────── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Grid lines */}
        <div className="bg-grid absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }} />
        {/* Orbs */}
        <div className="bg-orb1 absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 70%)" }} />
        <div className="bg-orb2 absolute top-1/2 -right-60 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(203,255,95,0.12) 0%, transparent 70%)" }} />
        <div className="bg-orb3 absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 70%)" }} />
      </div>
      {!isTouch && (
        <div
          ref={cursorEl}
          aria-hidden="true"
          style={{
            position: "fixed",
            left: -100,
            top: -100,
            transform: "translate(-50%, -50%)",
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "rgba(203,255,95,0.85)",
            pointerEvents: "none",
            zIndex: 9998,
            filter: "blur(8px)",
          }}
        />
      )}

      {/* ── NAV ───────────────────────────────── */}
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 backdrop-blur-xl ${scrolled ? "bg-neutral-950/70 border-b border-white/5 shadow-lg shadow-black/20" : "bg-neutral-950/40"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4">
          <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} aria-label="Bieri — Inicio" className="relative z-10">
            <img src={logoHead} alt="Bieri Entrenamiento" className="h-10 sm:h-12 w-auto brightness-0 invert" />
          </a>

          <nav className="hidden md:flex items-center gap-1 text-[13px] tracking-wide text-neutral-400">
            {NAV_LINKS.map(([h, l]) => (
              <NavLink key={h} href={h} label={l} onClick={(e) => scrollTo(e, h)} />
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href={IG} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="Instagram">
              <I d={ic.ig} c="w-6 h-6" />
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5">
              <WaIcon c="w-4 h-4" /> Consultar
            </a>
          </div>

          <button onClick={() => setMenu(true)} className="md:hidden relative z-[60] p-2 -mr-2 text-neutral-400 hover:text-white transition-colors" aria-label="Menú">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

      </header>

      {/* Mobile menu — fuera del header para evitar stacking context del backdrop-blur */}
      <nav className={`md:hidden fixed inset-0 z-[55] flex flex-col transition-all duration-300 ease-in-out ${menu ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-2'}`}
        style={{ background: "rgb(10,10,10)" }}>
        {/* Header row con logo y cruz de cierre */}
        <div className="h-[68px] shrink-0 flex items-center justify-between px-5">
          <a href="#hero" onClick={(e) => scrollTo(e, '#hero')} aria-label="Bieri — Inicio">
            <img src={logoHead} alt="Bieri" className="h-10 w-auto brightness-0 invert" />
          </a>
          <button onClick={() => setMenu(false)} className="p-2 text-neutral-400 hover:text-white transition-colors" aria-label="Cerrar menú">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="border-t border-neutral-800/60 mx-5" />

        {/* Links */}
        <div className="flex flex-col px-5 py-4 gap-1 flex-1">
          {NAV_LINKS.map(([h, l], i) => (
            <a key={h} href={h} onClick={(e) => scrollTo(e, h)}
              className="text-xl font-light text-neutral-300 hover:text-white py-4 px-4 rounded-xl hover:bg-white/5 transition-all duration-200 border-b border-neutral-900"
              style={{ transitionDelay: menu ? `${50 + i * 35}ms` : '0ms' }}>
              {l}
            </a>
          ))}
        </div>

        {/* CTA — bottom */}
        <div className="px-5 pb-8 flex items-center gap-3">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMenu(false)}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold tracking-wider py-3.5 rounded-full transition-all duration-300">
            <WaIcon c="w-4 h-4" /> Consultar por WhatsApp
          </a>
          <a href={IG} target="_blank" rel="noopener noreferrer" onClick={() => setMenu(false)}
            className="shrink-0 w-[50px] h-[50px] rounded-full border border-neutral-700/50 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300" aria-label="Instagram">
            <I d={ic.ig} c="w-5 h-5" />
          </a>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ═══════════════════════════════════════
            1. HERO — Full-screen immersive
        ═══════════════════════════════════════ */}
        <section id="hero" aria-label="Bieri Entrenamiento Personalizado — Gimnasio en Tandil" className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <img src={IMG.hero} alt="Gimnasio Bieri Entrenamiento Personalizado en Tandil — espacio de entrenamiento de fuerza con equipamiento profesional" fetchpriority="high" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 text-center pt-24 pb-16">
            <div className="backdrop-blur-sm rounded-3xl px-8 sm:px-12 py-8 sm:py-12 border border-white/10" style={{ background: "rgba(200,200,200,0.08)", borderColor: "rgba(255,255,255,0.12)" }}>
            <R delay={0}>
              <img src={originalLogo} alt="Logo de Bieri Entrenamiento Personalizado — Gimnasio en Tandil" className="w-auto max-w-[220px] sm:max-w-[280px] h-auto mx-auto mb-8" style={{ objectFit: "contain" }} />
            </R>
            <R delay={100}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
                <span className="block">El gimnasio en Tandil</span>
                <span className="block">que te ayuda a entender</span>
                <span className="block">tu cuerpo y entrenar mejor</span>
              </h1>
              <p className="sr-only">Bieri Entrenamiento Personalizado — gimnasio en Tandil con entrenamiento de fuerza, cupos limitados de 10 personas por turno, evaluación física inicial y seguimiento profesional. Rodriguez 1214, Tandil, Buenos Aires.</p>
            </R>
            <R delay={200}>
              <p className="mt-6 text-neutral-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
                Tu plan, tu ritmo, tu progreso.
              </p>
            </R>
            <R delay={300}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25">
                  <WaIcon /> Reservá tu lugar
                </a>
              </div>
            </R>
            </div>
            {!cd.done ? (
              <R delay={400}>
                <div className="mt-10 inline-flex items-center justify-center gap-6 sm:gap-8">
                  {[[cd.days, "Días"], [cd.hours, "Hs"], [cd.minutes, "Min"], [cd.seconds, "Seg"]].map(([v, l]) => (
                    <div key={l} className="flex flex-col items-center">
                      <span className="text-3xl sm:text-4xl font-bold tabular-nums">{String(v).padStart(2, "0")}</span>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 mt-1">{l}</span>
                    </div>
                  ))}
                </div>
              </R>
            ) : (
              <R delay={400}>
                <div className="mt-10 relative">
                  {/* Confetti */}
                  <div className="confetti-container absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    {CONFETTI_PIECES.map((p, i) => (
                      <span key={i} className="confetti-piece" style={{
                        '--x': p.x,
                        '--delay': p.delay,
                        '--duration': p.duration,
                        '--rotation': p.rotation,
                        '--color': p.color,
                      }} />
                    ))}
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-center" style={{ color: '#CBFF5F' }}>
                    Estamos listos, veni a entrenar!
                  </p>
                </div>
              </R>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            3. LA DIFERENCIA BIERI
        ═══════════════════════════════════════ */}
        <section id="nosotros" className="relative">

          <div className="bg-neutral-950/60 py-20 sm:py-20 pb-10 sm:pb-12">
            <div className="max-w-7xl mx-auto px-5 sm:px-8">
              <R>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-medium mb-4 flex items-center gap-3"><span className="w-8 h-px bg-blue-600" /> Nuestra propuesta</p>
                <h2 className="text-3xl sm:text-5xl font-bold leading-tight max-w-2xl">La diferencia Bieri — Entrenamiento personalizado</h2>
                <p className="mt-5 text-neutral-400 text-lg leading-relaxed">Cada detalle está pensado para que tu entrenamiento funcione de verdad.</p>
              </R>
              {/* Mobile: grid 2-col / Tablet: horizontal scroll / Desktop: 6-col grid */}
              <div className="mt-16 grid grid-cols-2 gap-3 sm:flex sm:overflow-x-auto sm:pb-4 sm:snap-x sm:snap-mandatory lg:grid lg:grid-cols-3 xl:grid-cols-6 lg:overflow-visible lg:pb-0"
                style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {FEATURES.map(({ icon, title, desc }, i) => (
                  <div key={i} className="sm:shrink-0 sm:w-[200px] sm:h-[200px] sm:snap-start lg:w-auto lg:h-auto lg:shrink">
                    <R className="h-full">
                      <div className="group h-full p-5 rounded-xl border border-neutral-800/50 bg-neutral-900/30 hover:bg-neutral-900/60 hover:border-blue-900/40 transition-all duration-500 flex flex-col">
                        <div className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-400 flex items-center justify-center mb-3 shrink-0 group-hover:bg-blue-600/20 transition-colors duration-500"><I d={icon} /></div>
                        <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
                        <p className="text-xs text-neutral-400 leading-relaxed">{desc}</p>
                      </div>
                    </R>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════
            6. LOS PROFES
        ═══════════════════════════════════════ */}
        <section id="profes" className="py-12 sm:py-16 bg-neutral-950/60">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <R>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-medium mb-4 flex items-center gap-3"><span className="w-8 h-px bg-blue-600" /> Quiénes somos</p>
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight">Entrenadores personales</h2>
              <p className="mt-5 text-neutral-400 text-lg leading-relaxed">Profesionales con formación y experiencia real en entrenamiento de fuerza, salud y rendimiento deportivo en Tandil.</p>
            </R>
            <div className="mt-16 grid sm:grid-cols-2 gap-8">
              {TRAINERS.map(({ name, ig, igUrl, img }, i) => (
                <R key={i} delay={i * 150}>
                  <div className="relative rounded-3xl overflow-hidden border border-neutral-800/40 bg-neutral-900/20 hover:border-neutral-700/50 transition-all duration-500 group">
                    {/* Image with darkened bg */}
                    <div className="relative flex items-end justify-center pt-8 px-8" style={{ background: "rgba(10,10,10,0.55)" }}>
                      <img src={img} alt={`${name} — Entrenador personal en Bieri Tandil`} loading="lazy" className="w-auto max-h-[360px] object-contain relative z-10" style={{ filter: "brightness(0.88)" }} />
                    </div>
                    {/* Info strip */}
                    <div className="px-7 py-6 flex items-center justify-between border-t border-neutral-800/40">
                      <div>
                        <h3 className="text-xl font-bold text-white">{name}</h3>
                        <a href={igUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors mt-1"
                          aria-label={`Instagram de ${name}`}>
                          <I d={ic.ig} c="w-3.5 h-3.5" /> {ig}
                        </a>
                      </div>
                      <a href={igUrl} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full border border-neutral-700/50 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300"
                        aria-label={`Instagram de ${name}`}>
                        <I d={ic.ig} c="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY STRIP — infinite carousel ── */}
        <div className="overflow-hidden h-48 sm:h-72">
          <div className="flex h-full animate-marquee" style={{ width: "max-content" }}>
            {[...Array(2)].map((_, pass) =>
              GALLERY_IMAGES.map((src, i) => (
                <div key={`${pass}-${i}`} className="h-full w-[40vw] sm:w-[28vw] shrink-0">
                  <img src={src} alt={`Instalaciones del gimnasio Bieri en Tandil — espacio de entrenamiento ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))
            )}
          </div>
        </div>


        {/* ═══════════════════════════════════════
            4. PARA QUIÉN ES
        ═══════════════════════════════════════ */}
        <section id="para-quien" className="py-24 sm:py-32 bg-neutral-950/60">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <R>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-medium mb-4 flex items-center gap-3"><span className="w-8 h-px bg-blue-600" /> ¿Es para vos?</p>
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-10">¿Para quién es Bieri?</h2>
            </R>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Checks */}
              <div className="flex flex-col gap-5">
                {AUDIENCE.map(({ title, desc }, i) => (
                  <R key={i} delay={i * 80}>
                    <div className="flex gap-4 items-start p-5 rounded-xl border border-neutral-800/40 hover:border-blue-900/40 bg-neutral-900/20 hover:bg-neutral-900/40 transition-all duration-500">
                      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5" style={{ background: "rgba(203,255,95,0.15)", color: "rgb(203,255,95)" }}>
                        <I d={ic.check} c="w-4 h-4" />
                      </div>
                      <div><h3 className="font-semibold text-white mb-1">{title}</h3><p className="text-sm text-neutral-400 leading-relaxed">{desc}</p></div>
                    </div>
                  </R>
                ))}
              </div>

              {/* Right: Image */}
              <R delay={200}>
                <img src={paraQuien} alt="Entrenamiento personalizado en el gimnasio Bieri de Tandil — para todos los niveles" loading="lazy" className="w-auto rounded-3xl object-contain mx-auto max-h-[500px]" />
              </R>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            5. CÓMO FUNCIONA
        ═══════════════════════════════════════ */}
        <section id="como-funciona" className="py-24 sm:py-32 bg-neutral-950/60">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <R>
              <div className="mb-20">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-medium mb-4 inline-flex items-center gap-3"><span className="w-8 h-px bg-blue-600" /> Simple y claro</p>
                <h2 className="text-3xl sm:text-5xl font-bold leading-tight">Como funciona</h2>
              </div>
            </R>

            {/* Responsive timeline: vertical on mobile, horizontal on sm+ */}
            <div className="relative">
              {/* Mobile: vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-neutral-800 sm:hidden" />
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-blue-600/50 via-blue-400/30 to-blue-600/50 sm:hidden" />
              {/* Desktop: horizontal line */}
              <div className="hidden sm:block absolute top-5 left-5 right-5 h-px bg-neutral-800" />
              <div className="hidden sm:block absolute top-5 left-5 right-5 h-px bg-gradient-to-r from-blue-600/50 via-blue-400/30 to-blue-600/50" />

              <div className="flex flex-col sm:flex-row gap-10 sm:gap-0">
                {STEPS.map(({ n, title, desc }, i) => (
                  <R key={i} delay={i * 150} className="sm:flex-1">
                    <div className="group flex flex-row sm:flex-col items-start gap-5 sm:gap-0 sm:px-5">
                      {/* Dot */}
                      <div className="relative z-10 sm:mb-6 shrink-0">
                        <div className="w-10 h-10 rounded-full bg-neutral-950 border-2 border-neutral-700 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-600 transition-all duration-500">
                          <span className="text-sm font-bold text-neutral-400 group-hover:text-white transition-colors duration-500">{n}</span>
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500/0 group-hover:border-blue-500/30 group-hover:scale-[1.8] transition-all duration-700 opacity-0 group-hover:opacity-100" />
                      </div>
                      {/* Text */}
                      <div>
                        <h3 className="font-semibold text-white text-[15px] mb-2 group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed sm:pr-4">{desc}</p>
                      </div>
                    </div>
                  </R>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* ═══════════════════════════════════════
            7. TESTIMONIOS
        ═══════════════════════════════════════ */}

        {/* ═══════════════════════════════════════
            8. UBICACIÓN + HORARIOS
        ═══════════════════════════════════════ */}
        <section id="ubicacion" className="py-24 sm:py-32 bg-neutral-900/40">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <R>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-medium mb-4 flex items-center gap-3"><span className="w-8 h-px bg-blue-600" /> Vení a conocernos</p>
              <h2 className="text-3xl sm:text-5xl font-bold leading-tight">Dónde estamos</h2>
            </R>
            <div className="mt-16 grid md:grid-cols-2 gap-6">
              <R>
                <div className="rounded-2xl overflow-hidden border border-neutral-800/50 h-full min-h-[340px]">
                  <iframe
                    title="Ubicación de Bieri Entrenamiento Personalizado — Rodriguez 1214, Tandil"
                    src="https://maps.google.com/maps?q=Rodriguez+1214,Tandil,Buenos+Aires,Argentina&output=embed&z=16"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: 340 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </R>
              <div className="flex flex-col gap-5">
                <R delay={100}>
                  <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center"><I d={ic.clock} /></div>
                      <h3 className="font-semibold text-white">Horarios</h3>
                    </div>
                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1"><span className="text-neutral-400">Lunes a Viernes</span><span className="text-white font-medium">7:00 – 13:00 / 14:00 – 21:30</span></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1"><span className="text-neutral-400">Sábados y Domingos</span><span className="text-neutral-600">Cerrado</span></div>
                    </div>
                  </div>
                </R>
                <R delay={200}>
                  <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-2xl p-7">
                    <h3 className="font-semibold text-white mb-4">Contacto</h3>
                    <div className="flex flex-col gap-3 text-sm">
                      <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"><I d={ic.msg} c="w-4 h-4 text-green-500 shrink-0" /> 249 401-5101 (Alejo)</a>
                      <a href="https://wa.me/5492494360254" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"><I d={ic.msg} c="w-4 h-4 text-green-500 shrink-0" /> 249 436-0254 (Mateo)</a>
                      <a href={IG} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors"><I d={ic.ig} c="w-4 h-4 text-pink-400 shrink-0" /> @bieri.entrenamiento</a>
                    </div>
                  </div>
                </R>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            9. CTA FINAL
        ═══════════════════════════════════════ */}
        <section className="relative py-32 sm:py-40 overflow-hidden">
          <div className="absolute inset-0">
            <img src={IMG.gym2} alt="" loading="lazy" className="w-full h-full object-cover" aria-hidden="true" />
            <div className="absolute inset-0 bg-neutral-950/85 backdrop-blur-sm" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <R delay={100}>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">Tu lugar te está<br /><span style={{ color: "rgb(203,255,95)" }}>esperando</span></h2>
            </R>
            <R delay={200}>
              <img src={whiteLogo} alt="Bieri Entrenamiento" className="h-24 sm:h-32 w-auto mx-auto mt-8" />
            </R>
            <R delay={300}>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/25">
                <WaIcon /> Quiero mi lugar en Bieri
              </a>
            </R>
          </div>
        </section>
      </main>

      {/* ── FOOTER ────────────────────────────── */}
      <footer className="relative z-10 border-t border-neutral-800/50 bg-neutral-950 py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <img src={whiteLogo} alt="Bieri Entrenamiento" className="h-16 w-auto" />
              <address className="text-xs text-neutral-500 mt-1 not-italic">Entrenamiento Personalizado · Rodriguez 1214, Tandil, Buenos Aires, Argentina</address>
            </div>
            <div className="flex items-center gap-5">
              <a href={IG} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-colors" aria-label="Instagram"><I d={ic.ig} /></a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-white transition-colors" aria-label="WhatsApp"><I d={ic.msg} /></a>
            </div>
          </div>
          <p className="text-center text-xs text-neutral-700 mt-10">© {new Date().getFullYear()} Bieri Entrenamiento Personalizado. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* ── FLOATING WA ──────────────────────── */}
      <a href={WA_URL} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-600/30 hover:bg-green-500 hover:scale-110 active:scale-95 transition-all duration-200"
        aria-label="Enviar mensaje por WhatsApp">
        <WaIcon c="w-7 h-7 text-white" />
      </a>
    </div>
  );
}
