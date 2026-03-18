import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sun, Moon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ── Luxury Loading Screen ────────────────────────────────────────────────────
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBottomRef = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const tagline = taglineRef.current;
    const bar = progressBarRef.current;
    const lineTop = lineTopRef.current;
    const lineBottom = lineBottomRef.current;
    const ornament = ornamentRef.current;
    if (!root || !logo || !tagline || !bar || !lineTop || !lineBottom || !ornament) return;

    // Entrance choreography
    const tl = gsap.timeline();

    // 1. Ornamental lines draw in from center
    tl.fromTo([lineTop, lineBottom],
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power3.inOut', stagger: 0.1 },
      0
    );

    // 2. Diamond ornament fades in
    tl.fromTo(ornament,
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
      0.4
    );

    // 3. Logo letter-spacing reveal
    tl.fromTo(logo,
      { opacity: 0, letterSpacing: '0.6em', y: 10 },
      { opacity: 1, letterSpacing: '0.35em', y: 0, duration: 1.1, ease: 'power3.out' },
      0.5
    );

    // 4. Tagline
    tl.fromTo(tagline,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
      0.9
    );

    // 5. Progress bar fills
    tl.fromTo(bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 2.2,
        ease: 'power2.inOut',
        onComplete: () => {
          // Exit: elegant upward curtain lift
          const exitTl = gsap.timeline({ onComplete });
          exitTl.to([lineTop, lineBottom, ornament], {
            opacity: 0, duration: 0.4, ease: 'power2.in'
          }, 0);
          exitTl.to([logo, tagline, bar], {
            opacity: 0, y: -20, duration: 0.5, ease: 'power2.in', stagger: 0.06
          }, 0);
          exitTl.to(root, {
            yPercent: -105,
            duration: 1.0,
            ease: 'power4.inOut'
          }, 0.35);
        }
      },
      1.4
    );

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'linear-gradient(160deg, #120e0b 0%, #1e1108 50%, #0d0906 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle noise grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        opacity: 0.55,
      }} />

      {/* Radial gold glow at centre */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vmax', height: '60vmax',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Ornamental top line */}
      <div ref={lineTopRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-7.5rem)',
        width: '220px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #C5A059, transparent)',
        transformOrigin: 'center',
        zIndex: 1,
      }} />

      {/* Diamond ornament */}
      <div ref={ornamentRef} style={{
        position: 'relative', zIndex: 1, marginBottom: '0.5rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
      }}>
        <div style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, transparent, #C5A059)' }} />
        <div style={{
          width: '6px', height: '6px',
          background: '#C5A059',
          transform: 'rotate(45deg)',
          boxShadow: '0 0 8px rgba(197,160,89,0.6)',
        }} />
        <div style={{ width: '30px', height: '1px', background: 'linear-gradient(90deg, #C5A059, transparent)' }} />
      </div>

      {/* Brand logotype */}
      <div
        ref={logoRef}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: '"Playfair Display", serif',
          fontSize: 'clamp(2.2rem, 6vw, 3.8rem)',
          fontWeight: 700,
          letterSpacing: '0.35em',
          color: '#FDFBF7',
          textTransform: 'uppercase',
          opacity: 0,
          marginBottom: '0.6rem',
        }}
      >
        Cavinior
      </div>

      {/* Tagline */}
      <div
        ref={taglineRef}
        style={{
          position: 'relative', zIndex: 1,
          fontFamily: '"Outfit", sans-serif',
          fontSize: '0.62rem',
          fontWeight: 400,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(197,160,89,0.75)',
          opacity: 0,
          marginBottom: '2.5rem',
        }}
      >
        Pure Indulgence · Est. 1924
      </div>

      {/* Progress bar track */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '160px', height: '1px',
        background: 'rgba(197,160,89,0.18)',
        overflow: 'hidden',
      }}>
        <div
          ref={progressBarRef}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #C5A059, #E2C78A)',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* Ornamental bottom line */}
      <div ref={lineBottomRef} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(8rem)',
        width: '220px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #C5A059, transparent)',
        transformOrigin: 'center',
        zIndex: 1,
      }} />
    </div>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const frameCount = 192;
    const currentFrame = (index: number) =>
      `/chocolate_imgs/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const sequence = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    handleResize();

    function render() {
      if (!canvas || !context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      const img = images[sequence.frame];
      if (!img || !img.complete) return;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (canvas.width - img.width * ratio) / 2;
      const cy = (canvas.height - img.height * ratio) / 2;
      context.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    }

    images[0].onload = render;
    window.addEventListener('resize', handleResize);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 0.5,
          pin: true,
        },
      });

      tl.to(sequence, { frame: frameCount - 1, snap: 'frame', ease: 'none', onUpdate: render, duration: 1 }, 0);
      tl.to('.hero-text-1', { opacity: 0, y: -50, duration: 0.15, ease: 'power2.inOut' }, 0.05);
      tl.fromTo('.hero-text-2', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.30);
      tl.to('.hero-text-2', { opacity: 0, y: -50, duration: 0.15, ease: 'power2.in' }, 0.60);
      tl.fromTo('.hero-text-3', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.75);
      tl.to('.hero-text-3', { opacity: 0, duration: 0.1 }, 0.95);

      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: marqueeRef.current.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      document.querySelectorAll('.animate-section').forEach((section) => {
        const elements = section.querySelectorAll('.animate-up');
        if (elements.length > 0) {
          gsap.fromTo(
            elements,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 80%' } }
          );
        }
      });

      document.querySelectorAll('.stat-counter').forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        gsap.to(counter, {
          innerHTML: target,
          duration: 2.5,
          snap: { innerHTML: 1 },
          ease: 'power2.out',
          scrollTrigger: { trigger: counter, start: 'top 85%' },
        });
      });
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <div className="selection:bg-brand-gold selection:text-brand-dark min-h-screen">

      {/* ── Loading Screen ── */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* ── Theme Toggle ── */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-brand-gold rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-none group overflow-hidden"
        aria-label="Toggle Theme"
      >
        <div className="relative w-6 h-6 text-brand-dark">
          <Moon className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
          <Sun className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}`} />
        </div>
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full" />
      </button>

      {/* ── Navigation ── */}
      {/*
        Dark mode: mix-blend-difference makes it invert over any background, always readable.
        Light mode: frosted glass panel via .nav-root class in CSS (bg-cream/80 + blur).
      */}
      <nav className="nav-root fixed w-full z-50 top-0 py-6 px-8 md:px-16 flex justify-between items-center">
        <div className="font-serif text-2xl tracking-widest uppercase">Cavinior</div>
        <div className="hidden md:flex gap-12 text-xs tracking-[0.2em] font-medium uppercase">
          <a href="#story" className="hover:opacity-60 transition-opacity">Story</a>
          <a href="#craft" className="hover:opacity-60 transition-opacity">Craft</a>
          <a href="#collections" className="hover:opacity-60 transition-opacity">Collections</a>
        </div>
        <button className="border border-current px-8 py-3 text-xs tracking-widest uppercase hover:opacity-70 transition-opacity cursor-pointer">
          Shop
        </button>
      </nav>

      {/* ── Hero Section (always dark cinematic) ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
        {/* Scrim: dark in both modes — slightly lighter in light mode */}
        <div className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${isDarkMode ? 'bg-black/55' : 'bg-black/40'}`} />

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none mt-16">

          {/* Text 1 */}
          <div className="hero-text-1 absolute w-full max-w-4xl px-8 mx-auto flex flex-col items-center text-center">
            <div className="hero-text-always-light text-[0.7rem] !text-brand-gold uppercase tracking-[0.3em] font-medium mb-8 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
              001 / Introduction
            </div>
            <h1 className="hero-text-always-light font-serif text-[clamp(2.4rem,8vw,12rem)] leading-[0.85] font-bold tracking-tight">
              PURE<br />
              <span className="italic font-normal !text-brand-gold">INDULGENCE</span>
            </h1>
            <p className="hero-subtext-always-light mt-6 md:mt-12 text-xs md:text-base max-w-md mx-auto font-light tracking-wide leading-relaxed px-2">
              Unveiling the rarest cacao. A masterpiece sculpted in chocolate, refined through 192 hours of artisanal conching.
            </p>
          </div>

          {/* Text 2 */}
          <div className="hero-text-2 absolute w-full max-w-4xl px-8 mx-auto flex flex-col items-center text-center opacity-0 translate-y-10">
            <h2 className="hero-text-always-light font-serif text-[clamp(1.9rem,6.5vw,8rem)] leading-[0.9] font-bold tracking-tight mb-6 md:mb-8">
              UNCOMPROMISING<br />QUALITY
            </h2>
            <p className="hero-subtext-always-light text-xs md:text-lg max-w-xl mx-auto font-light tracking-wide leading-relaxed px-2">
              Meticulously handcrafted from bean to bar. Every step of our process is dedicated to preserving the pristine notes of wild cacao.
            </p>
          </div>

          {/* Text 3 */}
          <div className="hero-text-3 absolute w-full max-w-4xl px-8 mx-auto flex flex-col items-center text-center opacity-0 translate-y-10">
            <h2 className="hero-text-always-light font-serif text-[clamp(2rem,7vw,8rem)] leading-[0.9] font-bold tracking-tight !text-brand-gold italic mb-6 md:mb-8">
              A Legacy of Taste
            </h2>
            <p className="hero-subtext-always-light text-xs md:text-lg max-w-xl mx-auto font-light tracking-wide leading-relaxed px-2">
              Experience the profound depth born from generations of artisanal mastery. Welcome to the world of Cavinior.
            </p>
          </div>
        </div>
      </section>

      {/* ── Craftsmanship ── */}
      <section id="craft" className="section-craft animate-section py-20 md:py-48 px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-32 items-center transition-theme">
        <div className="order-2 md:order-1 relative aspect-[3/4] overflow-hidden w-full max-w-md mx-auto md:mr-auto">
          <img
            src="/imgs/farmer.jpeg"
            alt="Single Origin Cacao"
            className="w-full h-full object-cover animate-up"
          />
        </div>
        <div className="order-1 md:order-2 flex flex-col justify-center">
          <div className="text-[0.7rem] text-brand-gold uppercase tracking-[0.3em] font-medium mb-12 animate-up">
            002 / Provenance
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold leading-[0.9] mb-8 md:mb-10 animate-up">
            Ethical<br />Sourcing
          </h2>
          <p className="text-base md:text-xl font-light opacity-75 leading-relaxed max-w-lg mb-10 md:mb-12 animate-up">
            We partner exclusively with sustainable, single-estate farms in Ecuador and Madagascar. No intermediaries — just pure honor to the land and the farmer.
          </p>
          <div className="h-px w-24 bg-brand-gold opacity-40 animate-up" />
        </div>
      </section>

      {/* ── Marquee ── */}
      <section className="section-marquee py-16 md:py-32 overflow-hidden bg-brand-accent text-brand-gold transition-theme">
        <div className="relative flex whitespace-nowrap">
          <div ref={marqueeRef} className="flex gap-16 md:gap-32 px-16 will-change-transform font-serif italic text-[12vw] leading-none opacity-90">
            <span>MASTERFUL ROASTING</span>
            <span>FINEST CACAO</span>
            <span>MASTERFUL ROASTING</span>
            <span>FINEST CACAO</span>
          </div>
        </div>
      </section>

      {/* ── Roasting ── */}
      <section className="section-roasting animate-section py-20 md:py-48 px-6 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center transition-theme">
        <div className="md:col-span-5 md:col-start-2 flex flex-col justify-center">
          <div className="text-[0.7rem] uppercase tracking-[0.3em] font-medium mb-8 md:mb-12 animate-up opacity-50">
            003 / Process
          </div>

          <div className="stat-block mb-16 animate-up">
            <div className="font-serif text-[clamp(3.5rem,12vw,5rem)] leading-none text-brand-gold mb-2">
              <span className="stat-counter" data-target="192">0</span>
              <span className="text-xl md:text-2xl ml-2 opacity-60">hrs</span>
            </div>
            <div className="text-sm uppercase tracking-widest opacity-60 mt-2">Artisanal Conching</div>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-[1.1] mb-6 md:mb-8 animate-up">
            A symphony of<br />temperature &amp; time
          </h2>
          <p className="text-base md:text-lg font-light opacity-70 leading-relaxed max-w-md animate-up">
            Small batch roasting unlocks the volatile aromatics hidden within raw cacao. Each harvest demands a unique roasting profile to reveal its innermost character.
          </p>
        </div>

        <div className="md:col-span-6 overflow-hidden aspect-[4/5] animate-up shadow-2xl">
          <img
            src="/imgs/roasting.jpeg"
            alt="Roasting Cacao Beans"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* ── Final CTA / Testimonial ── */}
      <section className="section-cta animate-section relative py-24 md:py-40 px-6 md:px-8 flex flex-col items-center justify-center text-center overflow-hidden transition-theme">
        {/* Decorative quote glyph — light mode only via CSS */}
        <div className="quote-mark" aria-hidden="true">"</div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[0.7rem] uppercase tracking-[0.3em] font-medium mb-10 md:mb-16 animate-up opacity-50">
            004 / Finale
          </div>

          <div className="font-serif text-[clamp(1.55rem,4.5vw,4rem)] font-medium leading-tight max-w-4xl mx-auto mb-12 md:mb-16 animate-up px-2">
            "A texture so ethereal it transcends chocolate. The depth of flavor is simply unparalleled in modern confectionery."
          </div>

          <div className="author-line flex flex-col items-center animate-up mb-24 w-48">
            <div className="uppercase tracking-widest text-xs font-bold mb-1">Eleanor Vance</div>
            <div className="text-[0.65rem] uppercase tracking-[0.3em] opacity-50">Culinary Critic</div>
          </div>

          <button className="relative group overflow-hidden border border-current px-12 py-5 text-sm uppercase tracking-[0.2em] animate-up cursor-pointer">
            <span className="relative z-10 transition-colors duration-500 group-hover:text-[var(--bg-color)]">Experience Cavinior</span>
            <div className="absolute inset-0 bg-current translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer-strip py-16 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center transition-theme border-t border-current border-opacity-10">
        <div className="font-serif text-3xl uppercase tracking-widest mb-8 md:mb-0">Cavinior</div>
        <div className="flex gap-8 text-[0.65rem] uppercase tracking-[0.3em] font-medium opacity-60">
          <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Journal</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
        </div>
      </footer>

    </div>
  );
}
