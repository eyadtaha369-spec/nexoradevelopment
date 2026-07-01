import { createFileRoute } from "@tanstack/react-router";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  Gauge,
  Globe,
  Instagram,
  Layers,
  Mail,
  Menu,
  PhoneCall,
  Rocket,
  Search,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Video,
  Zap,
  Palette,
  Wrench,
  Calendar,
  Database,
  LineChart,
  Users,
  Building2,
  Utensils,
  Scale,
  Home as HomeIcon,
  Hotel,
  HardHat,
  GraduationCap,
  Landmark,
  Store,
  Cpu,
  User,
  Stethoscope,
  Send,
  MapPin,
  Loader2,
  X,
} from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { toast } from "sonner";

import nexoraLogoAsset from "@/assets/nexora-logo.asset.json";
import candorBoostImg from "@/assets/candor-boost.png";
import { supabase } from "@/integrations/supabase/client";

const CAL_LINK = "nexora-web-ahgcbm/website-consultation";
const CAL_NAMESPACE = "website-consultation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXORA — Premium Web Development Agency" },
      {
        name: "description",
        content:
          "NEXORA builds premium websites that turn visitors into customers. Design, development, SEO, and growth for businesses worldwide.",
      },
      { property: "og:title", content: "NEXORA — Websites That Grow Businesses" },
      {
        property: "og:description",
        content:
          "Premium websites engineered for trust, speed, and conversion. Work with NEXORA to grow your business online.",
      },
    ],
  }),
  component: NexoraLanding,
});

/* ---------- Utilities ---------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCountUp(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

/* ---------- Building blocks ---------- */

function AmbientBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px] animate-float" />
      <div className="absolute top-[30%] -right-40 h-[420px] w-[420px] rounded-full bg-secondary/25 blur-[130px] animate-float-alt" />
      <div className="absolute bottom-0 left-0 h-[380px] w-[380px] rounded-full bg-highlight/15 blur-[130px] animate-float" />
      <div className="absolute inset-0 bg-grid opacity-[0.35]" />
    </div>
  );
}

function LoadingOverlay() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-700 ${
        gone ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <img src={nexoraLogoAsset.url} alt="NEXORA" className="h-16 w-auto animate-pulse-glow rounded-full" />
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-[shimmer_1.2s_linear_infinite] bg-gradient-to-r from-transparent via-primary to-transparent [background-size:200%_100%]" />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    ["Home", "#home"],
    ["About", "#about"],
    ["Services", "#services"],
    ["Portfolio", "#portfolio"],
    ["Process", "#process"],
    ["Industries", "#industries"],
    ["Pricing", "#pricing"],
    ["Why Us", "#why"],
    ["FAQ", "#faq"],
    ["Contact", "#contact"],
  ] as const;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-elegant" : "bg-transparent"
          }`}
        >
          <a href="#home" className="flex items-center gap-2.5">
            <img src={nexoraLogoAsset.url} alt="NEXORA logo" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-display text-lg font-semibold tracking-widest">NEXORA</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#book"
              className="hidden rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-[1.02] sm:inline-flex"
            >
              Get a Free Quote
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full border border-white/10 p-2 lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="glass-strong mt-2 rounded-2xl p-3 lg:hidden">
            <div className="grid grid-cols-2 gap-1">
              {links.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function Btn({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300";
  if (variant === "primary") {
    return (
      <a
        href={href}
        className={`${base} bg-gradient-to-r from-primary via-primary to-secondary text-white shadow-glow hover:shadow-[0_0_50px_-8px_oklch(0.65_0.19_255/0.7)] hover:-translate-y-0.5 ${className}`}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </a>
    );
  }
  return (
    <a
      href={href}
      className={`${base} glass text-foreground hover:border-white/20 hover:bg-white/[0.06] ${className}`}
    >
      {children}
    </a>
  );
}

/* ---------- Sections ---------- */

function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const on = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 20;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    el.addEventListener("mousemove", on);
    return () => el.removeEventListener("mousemove", on);
  }, []);

  const badges = [
    { label: "Modern Design", icon: Sparkles, delay: "0s", pos: "-top-3 -left-6" },
    { label: "Lightning Fast", icon: Zap, delay: "0.3s", pos: "-top-4 right-6" },
    { label: "SEO Optimized", icon: Search, delay: "0.6s", pos: "top-1/3 -left-10" },
    { label: "Mobile Responsive", icon: Smartphone, delay: "0.9s", pos: "bottom-6 -right-8" },
    { label: "Secure", icon: Shield, delay: "1.2s", pos: "-bottom-4 left-6" },
    { label: "Conversion Focused", icon: LineChart, delay: "1.5s", pos: "bottom-1/3 -right-10" },
  ] as const;

  return (
    <section id="home" className="relative pt-32 pb-24 sm:pt-36 sm:pb-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-reveal">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs text-muted-foreground">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Premium web development agency
            </span>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,6.2vw,4.6rem)] font-semibold leading-[1.02] tracking-tight">
              Websites That Turn <br className="hidden sm:block" />
              <span className="text-gradient-brand animate-gradient bg-clip-text">Visitors Into Customers.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              At <span className="text-foreground">NEXORA</span>, we craft premium websites that help businesses build trust,
              generate leads, and grow faster — engineered for speed, SEO, and conversion.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Btn href="#book">Get a Free Quote</Btn>
              <Btn href="#book" variant="ghost">Book a Discovery Call</Btn>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>Design-award-caliber craft</span>
              </div>
              <div className="hidden h-4 w-px bg-white/10 sm:block" />
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span>Trusted worldwide</span>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div
            ref={wrapRef}
            className="relative mx-auto w-full max-w-[620px] animate-reveal [--mx:0px] [--my:0px]"
            style={{ animationDelay: "0.15s" }}
          >
            <div
              className="relative"
              style={{ transform: "translate3d(var(--mx), var(--my), 0)", transition: "transform 0.3s ease-out" }}
            >
              {/* Laptop */}
              <div className="relative">
                <div className="glass-strong rounded-t-2xl border-b-0 p-3 shadow-elegant">
                  <div className="flex items-center gap-1.5 pb-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg ring-1 ring-white/10">
                    <img
                      src={candorBoostImg}
                      alt="Premium website concept — Candor Boost"
                      className="h-full w-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                  </div>
                </div>
                <div className="mx-auto h-3 w-[110%] -translate-x-[4.5%] rounded-b-[14px] bg-gradient-to-b from-white/10 to-white/5" />
                <div className="mx-auto h-1 w-[70%] rounded-b-lg bg-white/5" />
              </div>

              {/* Floating badges */}
              {badges.map(({ label, icon: Icon, delay, pos }) => (
                <div
                  key={label}
                  className={`glass absolute ${pos} hidden items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium shadow-elegant sm:inline-flex`}
                  style={{ animation: `float-slow 6s ease-in-out infinite`, animationDelay: delay }}
                >
                  <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  const items = [
    ["Premium UI/UX", Palette],
    ["Fast Delivery", Rocket],
    ["SEO-Friendly Code", Search],
    ["Responsive on All Devices", Smartphone],
    ["High Performance", Gauge],
    ["Clean Code", Code2],
    ["Scalable Architecture", Layers],
    ["Business-Oriented", LineChart],
  ] as const;
  return (
    <section id="about" className="relative py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="reveal glass rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {items.map(([label, Icon]) => (
              <div key={label} className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-secondary/25 ring-1 ring-white/10">
                  <Icon className="h-4.5 w-4.5 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground/90">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: ReactNode;
  desc?: ReactNode;
}) {
  return (
    <div className="reveal mx-auto max-w-2xl text-center">
      <span className="glass inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {desc && <p className="mt-4 text-muted-foreground sm:text-lg">{desc}</p>}
    </div>
  );
}

function Services() {
  const services: [string, string, ComponentType<{ className?: string }>][] = [
    ["Business Websites", "Convert visitors with a site engineered for growth.", Building2],
    ["Corporate Websites", "Enterprise-grade presence that scales with you.", Landmark],
    ["Landing Pages", "High-converting pages optimized for a single goal.", Rocket],
    ["E-commerce Stores", "Beautiful, fast storefronts that sell more.", ShoppingBag],
    ["Portfolio Websites", "Showcase work with cinematic storytelling.", Layers],
    ["Website Redesign", "Rebuild your brand's online presence, elevated.", Palette],
    ["Website Maintenance", "Ongoing care so your site stays flawless.", Wrench],
    ["Speed Optimization", "Sub-second loads. Lighthouse 95+ guaranteed.", Gauge],
    ["SEO Optimization", "Rank higher. Get found. Grow organically.", Search],
    ["Custom Web Apps", "Bespoke apps built for your workflows.", Code2],
    ["Booking Systems", "Automated scheduling that fills your calendar.", Calendar],
    ["Appointment Websites", "Turn clicks into confirmed appointments.", Calendar],
    ["CMS Integration", "Own your content with elegant editing.", Database],
    ["API Integrations", "Connect anything. Everything works together.", Globe],
  ];
  return (
    <section id="services" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Services"
          title={<>Everything you need to <span className="text-gradient-brand">win online</span>.</>}
          desc="From strategy to launch and beyond — one team, every capability, obsessively crafted."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map(([title, desc, Icon], i) => (
            <div
              key={title}
              className="reveal group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/15"
              style={{ transitionDelay: `${(i % 4) * 40}ms` }}
            >
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                   style={{ background: "radial-gradient(400px circle at var(--x,50%) var(--y,50%), oklch(0.65 0.19 255 / 0.15), transparent 40%)" }} />
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 ring-1 ring-white/10">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-muted-foreground/50 transition-all group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const val = useCountUp(target, 1600, inView);
  return (
    <div ref={ref} className="reveal glass rounded-2xl p-6 text-center">
      <div className="font-display text-5xl font-semibold text-gradient-brand">
        {val}
        {suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function WhyUs() {
  const reasons = [
    ["Client-Focused", "We operate as an extension of your team.", Users],
    ["Fast Delivery", "Launch weeks — not months.", Rocket],
    ["Premium Quality", "Craft is not optional. It's our standard.", Sparkles],
    ["Modern Technologies", "React, TypeScript, edge-first architecture.", Code2],
    ["Scalable Solutions", "Built to grow from launch to enterprise.", Layers],
    ["Conversion-Oriented", "Every pixel is measured against results.", LineChart],
  ] as const;
  return (
    <section id="why" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={<>Built for businesses that <span className="text-gradient-brand">refuse to look ordinary</span>.</>}
          desc="Numbers matter. So does the way we work."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Counter target={100} suffix="%" label="Client-focused delivery" />
          <Counter target={95} suffix="+" label="Lighthouse performance score" />
          <Counter target={100} suffix="%" label="Mobile responsive" />
          <Counter target={24} suffix="/7" label="Ongoing support" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(([t, d, Icon]) => (
            <div key={t} className="reveal glass rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 ring-1 ring-white/10">
                  <Icon className="h-4.5 w-4.5 text-white" />
                </div>
                <h3 className="font-display text-lg font-semibold">{t}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    ["Discovery Call", "We learn your business, goals, and audience."],
    ["Planning", "Strategy, sitemap, and success metrics — signed off."],
    ["UI/UX Design", "Award-caliber design, tailored to your brand."],
    ["Development", "Fast, clean, scalable code — built to last."],
    ["Testing", "QA across devices, browsers, and edge cases."],
    ["Launch", "White-glove deployment. Zero-downtime cutover."],
    ["Ongoing Support", "We stay on — refining, growing, iterating."],
  ] as const;
  return (
    <section id="process" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Our Process"
          title={<>A proven path from idea to <span className="text-gradient-brand">launch</span>.</>}
          desc="A calm, transparent process. You'll always know what's next."
        />
        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-transparent md:left-1/2 md:block" />
          <div className="space-y-6">
            {steps.map(([t, d], i) => {
              const left = i % 2 === 0;
              return (
                <div key={t} className="reveal grid gap-4 md:grid-cols-2 md:gap-12">
                  <div className={`${left ? "md:pr-12 md:text-right" : "md:order-2 md:pl-12"}`}>
                    <div className="glass inline-block rounded-2xl p-6">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Step {i + 1}</div>
                      <h3 className="mt-1 font-display text-xl font-semibold">{t}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                    </div>
                  </div>
                  <div className={`hidden items-center md:flex ${left ? "" : "md:order-1 md:justify-end"}`}>
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary ring-4 ring-background">
                      <span className="text-sm font-semibold">{i + 1}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const upcoming = ["Restaurant", "Real Estate", "Medical Clinic", "Law Firm", "E-commerce", "Travel", "Fitness", "Corporate"];
  return (
    <section id="portfolio" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Featured Projects"
          title={<>Work that <span className="text-gradient-brand">wins attention</span>.</>}
          desc="A live look at our craft — plus concept work coming soon."
        />

        {/* Real project: Candor Boost */}
        <div className="reveal mt-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01]">
          <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
            <div className="relative p-4 sm:p-6">
              {/* MacBook mockup */}
              <div className="glass-strong rounded-t-2xl p-3">
                <div className="flex items-center gap-1.5 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 truncate text-[11px] text-muted-foreground">candor-boost-web.vercel.app</span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg ring-1 ring-white/10">
                  <img src={candorBoostImg} alt="Candor Boost live website preview" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-[14px] bg-white/10" />

              {/* iPhone mockup */}
              <div className="absolute -bottom-4 right-6 hidden w-[130px] rotate-3 sm:block">
                <div className="glass-strong rounded-[28px] p-1.5 shadow-elegant">
                  <div className="relative aspect-[9/19.5] overflow-hidden rounded-[22px] ring-1 ring-white/10">
                    <img src={candorBoostImg} alt="Candor Boost mobile preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-10">
              <span className="glass inline-flex w-fit rounded-full px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                Business Website
              </span>
              <h3 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">Candor Boost</h3>
              <p className="mt-3 text-muted-foreground">
                A modern, high-performance business website with clean UI, responsive design, fast loading, premium animations,
                SEO optimization, and a conversion-focused user experience.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Responsive",
                  "Premium UI",
                  "Fast Performance",
                  "SEO Optimized",
                  "Modern Design",
                  "Smooth Animations",
                ].map((b) => (
                  <span key={b} className="glass rounded-full px-3 py-1 text-xs text-foreground/90">
                    {b}
                  </span>
                ))}
              </div>
              <div className="mt-7">
                <a
                  href="https://candor-boost-web.vercel.app/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:-translate-y-0.5"
                >
                  View Live Website
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="reveal mt-16">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="font-display text-2xl font-semibold">More Projects Coming Soon</h3>
            <span className="text-sm text-muted-foreground">Concept slots reserved</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {upcoming.map((c) => (
              <div
                key={c}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-transform hover:-translate-y-1"
              >
                <div className="aspect-[4/3] rounded-xl bg-[conic-gradient(from_200deg,oklch(0.65_0.19_255_/_0.35),oklch(0.63_0.22_295_/_0.25),oklch(0.78_0.13_210_/_0.25),oklch(0.65_0.19_255_/_0.35))] opacity-70 blur-[1px] transition-opacity group-hover:opacity-100" />
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">{c}</div>
                    <div className="font-display text-lg font-semibold">Upcoming Project</div>
                  </div>
                  <span className="glass rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Soon
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Industries() {
  const items: [string, ComponentType<{ className?: string }>][] = [
    ["Healthcare", Stethoscope],
    ["Restaurants", Utensils],
    ["Law Firms", Scale],
    ["Real Estate", HomeIcon],
    ["Hotels", Hotel],
    ["Construction", HardHat],
    ["Education", GraduationCap],
    ["Finance", Landmark],
    ["Retail", Store],
    ["E-commerce", ShoppingBag],
    ["Technology", Cpu],
    ["Personal Brands", User],
  ];
  return (
    <section id="industries" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Industries"
          title={<>We build for <span className="text-gradient-brand">every ambition</span>.</>}
          desc="Tailored solutions for the industries we know best — and the ones we're excited to learn."
        />
        <div className="mt-14 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(([label, Icon]) => (
            <div
              key={label}
              className="reveal glass group flex items-center gap-3 rounded-2xl p-5 transition-all hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 ring-1 ring-white/10">
                <Icon className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-medium">{label}</span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Launch",
      price: "Starter",
      desc: "For businesses ready to look professional online.",
      features: ["Up to 5 pages", "Premium UI design", "Mobile responsive", "Basic SEO", "Contact form"],
      cta: "Get a Quote",
      featured: false,
    },
    {
      name: "Growth",
      price: "Most Popular",
      desc: "For businesses ready to convert visitors into customers.",
      features: [
        "Up to 12 pages",
        "Custom UI/UX design",
        "Advanced SEO",
        "CMS integration",
        "Analytics & tracking",
        "Speed optimization",
      ],
      cta: "Start Your Project",
      featured: true,
    },
    {
      name: "Scale",
      price: "Enterprise",
      desc: "For teams needing custom apps, integrations, and scale.",
      features: [
        "Unlimited pages",
        "Custom web application",
        "API integrations",
        "Booking / e-commerce",
        "Priority support",
        "Ongoing partnership",
      ],
      cta: "Talk to Us",
      featured: false,
    },
  ];
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Investment tailored to <span className="text-gradient-brand">your goals</span>.</>}
          desc="Every project is unique. Choose a starting point — we'll tailor the scope, timeline, and quote to fit."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`reveal relative overflow-hidden rounded-3xl p-8 ${
                t.featured
                  ? "border border-white/15 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent ring-glow"
                  : "glass"
              }`}
            >
              {t.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                  Popular
                </span>
              )}
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.price}</div>
              <h3 className="mt-2 font-display text-3xl font-semibold">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-success" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#book"
                className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all ${
                  t.featured
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:-translate-y-0.5"
                    : "glass hover:bg-white/[0.06]"
                }`}
              >
                {t.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Custom quotes tailored to your scope — request yours in under 24 hours.
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          eyebrow="Client Success Stories"
          title={<><span className="text-gradient-brand">Coming Soon</span> — and it might be yours.</>}
          desc="We believe in earning genuine client feedback through exceptional work."
        />
        <div className="reveal mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Every successful project starts with a conversation.",
            "Your business could be our next success story.",
            "Real results. Real feedback. Coming soon.",
          ].map((quote, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="flex -space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="mt-4 text-lg text-foreground/90">"{quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 ring-1 ring-white/10" />
                <div>
                  <div className="text-sm font-medium">Your Business Here</div>
                  <div className="text-xs text-muted-foreground">Verified client — coming soon</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items: [string, string][] = [
    ["How long does a website take?", "Most business websites launch in 3–6 weeks. Complex apps or e-commerce projects typically ship in 6–12 weeks. We share a clear timeline after your discovery call."],
    ["How much does it cost?", "Every project is unique. Starter sites, growth builds, and custom web apps all have different scopes. Request a free quote and we'll tailor a proposal within 24 hours."],
    ["Do you redesign websites?", "Yes. We regularly redesign existing sites to modernize the brand, improve performance, and increase conversion — often with dramatic before-and-after results."],
    ["Can I update my website later?", "Absolutely. We build sites with easy-to-use CMS options so you can edit content, images, and pages without touching code."],
    ["Will it work on mobile?", "Every NEXORA website is fully responsive and tested across phones, tablets, and desktops — with mobile-first performance baked in."],
    ["Do you provide support?", "Yes. We offer maintenance, monitoring, and iteration plans so your site keeps performing long after launch."],
    ["Can you improve my SEO?", "Yes. Clean semantic code, fast performance, structured metadata, and content strategy — SEO is built into everything we ship."],
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading
          eyebrow="FAQ"
          title={<>Answers before you <span className="text-gradient-brand">ask</span>.</>}
        />
        <div className="reveal mt-12 space-y-3">
          {items.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="glass overflow-hidden rounded-2xl">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium">{q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-muted-foreground">{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BookForm() {
  const [sent, setSent] = useState(false);
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    e.currentTarget.reset();
  }
  const Input = ({
    label,
    name,
    type = "text",
    required = true,
    placeholder,
  }: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
  }) => (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );

  return (
    <section id="book" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="reveal overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="glass inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
                Book a Call
              </span>
              <h2 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
                Let's build something <span className="text-gradient-brand">unforgettable</span>.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tell us about your business. Within 24 hours, we'll send a tailored plan, timeline, and quote — free.
              </p>
              <div className="mt-8 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-success" /> Free discovery call
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-success" /> Response within 24 hours
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-success" /> No obligation, ever
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <Input label="Full Name" name="name" placeholder="Jane Doe" />
              <Input label="Business Name" name="business" placeholder="Acme Inc." />
              <Input label="Email" name="email" type="email" placeholder="you@company.com" />
              <Input label="Phone Number" name="phone" type="tel" placeholder="+1 555 000 0000" />
              <Input label="Country" name="country" placeholder="United States" />
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Project Type</span>
                <select
                  name="projectType"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select...</option>
                  <option>Business Website</option>
                  <option>Landing Page</option>
                  <option>E-commerce</option>
                  <option>Custom Web App</option>
                  <option>Redesign</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Estimated Budget</span>
                <select
                  name="budget"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select...</option>
                  <option>Under $2k</option>
                  <option>$2k – $5k</option>
                  <option>$5k – $10k</option>
                  <option>$10k – $25k</option>
                  <option>$25k+</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Timeline</span>
                <select
                  name="timeline"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select...</option>
                  <option>ASAP</option>
                  <option>1–3 months</option>
                  <option>3–6 months</option>
                  <option>Just exploring</option>
                </select>
              </label>
              <Input label="Preferred Meeting Date" name="date" type="date" />
              <Input label="Preferred Meeting Time" name="time" type="time" />
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Project Description</span>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Tell us about your business, goals, and what you'd like to build..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary via-primary to-secondary px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5"
                >
                  Book My Free Consultation
                  <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                {sent && (
                  <p className="mt-3 text-center text-sm text-success">
                    Thanks — we'll reach out within 24 hours.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const items = [
    {
      label: "Email",
      value: "nexoraweb220@gmail.com",
      href: "mailto:nexoraweb220@gmail.com",
      Icon: Mail,
    },
    {
      label: "Instagram",
      value: "@_nexora_00",
      href: "https://www.instagram.com/_nexora_00",
      Icon: Instagram,
    },
    {
      label: "TikTok",
      value: "@nexora_._",
      href: "https://www.tiktok.com/@nexora_._",
      // No TikTok icon in lucide, use MapPin swap → keep MapPin? use a custom svg
      Icon: MapPin,
    },
  ];
  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Contact"
          title={<>Let's <span className="text-gradient-brand">talk</span>.</>}
          desc="Prefer to reach out directly? We're one message away."
        />
        <div className="reveal mt-12 grid gap-4 sm:grid-cols-3">
          {items.map(({ label, value, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer noopener"
              className="glass group flex items-center gap-4 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.06]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 ring-1 ring-white/10">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
                <div className="truncate font-medium">{value}</div>
              </div>
              <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/10 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={nexoraLogoAsset.url} alt="NEXORA" className="h-9 w-9 rounded-lg object-cover" />
              <span className="font-display text-lg font-semibold tracking-widest">NEXORA</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Premium web development agency building websites that grow businesses.
            </p>
          </div>
          <div>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Navigation</div>
            <ul className="space-y-2 text-sm">
              {["Home", "About", "Services", "Portfolio", "Process", "Pricing", "FAQ"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase()}`} className="text-foreground/80 hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Services</div>
            <ul className="space-y-2 text-sm">
              {["Business Websites", "Landing Pages", "E-commerce", "Custom Web Apps", "SEO Optimization", "Maintenance"].map((l) => (
                <li key={l}>
                  <a href="#services" className="text-foreground/80 hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Contact</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:nexoraweb220@gmail.com" className="text-foreground/80 hover:text-foreground">
                  nexoraweb220@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/_nexora_00"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-foreground/80 hover:text-foreground"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@nexora_._"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-foreground/80 hover:text-foreground"
                >
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} NEXORA. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function NexoraLanding() {
  useReveal();
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <LoadingOverlay />
      <AmbientBg />
      <Nav />
      <main>
        <Hero />
        <Trust />
        <Services />
        <WhyUs />
        <Process />
        <Portfolio />
        <Industries />
        <Pricing />
        <Testimonials />
        <FAQ />
        <BookForm />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
