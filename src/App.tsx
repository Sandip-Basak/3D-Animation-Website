import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sun, Moon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply theme class to body
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // --- Canvas Sequence Logic ---
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const frameCount = 192;
    const currentFrame = (index: number) => (
      `/chocolate_imgs/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
    );

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
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;  
      
      context.drawImage(
        img, 
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    }
    
    images[0].onload = render;
    window.addEventListener('resize', handleResize);

    // --- Animations ---
    const ctx = gsap.context(() => {
      // 1. Master Timeline for Canvas Scrub & Hero Texts
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=300%', 
          scrub: 0.5, 
          pin: true,
        }
      });

      tl.to(sequence, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: render,
        duration: 1
      }, 0);

      tl.to('.hero-text-1', { opacity: 0, y: -50, duration: 0.15, ease: 'power2.inOut' }, 0.05);
      
      tl.fromTo('.hero-text-2', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 
        0.30
      );
      tl.to('.hero-text-2', { opacity: 0, y: -50, duration: 0.15, ease: 'power2.in' }, 0.60);

      tl.fromTo('.hero-text-3', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 
        0.75
      );
      tl.to('.hero-text-3', { opacity: 0, duration: 0.1 }, 0.95);

      // 2. Marquee Text
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: marqueeRef.current.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }

      // 3. Section Entrances (No color switching here anymore)
      const animatedSections = document.querySelectorAll('.animate-section');
      animatedSections.forEach((section) => {
        const elements = section.querySelectorAll('.animate-up');
        if (elements.length > 0) {
          gsap.fromTo(elements, 
            { y: 60, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 1, 
              stagger: 0.15, 
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
              }
            }
          );
        }
      });
      
      // 4. Stat Counter
      const counters = document.querySelectorAll('.stat-counter');
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        gsap.to(counter, {
          innerHTML: target,
          duration: 2.5,
          snap: { innerHTML: 1 },
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%'
          }
        });
      });

    });

    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, []);

  return (
    <div className="selection:bg-brand-gold selection:text-brand-dark min-h-screen transition-theme">
      {/* Theme Toggle Button */}
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-brand-gold text-brand-cream rounded-full flex items-center justify-center shadow-2xl scale-100 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-none group overflow-hidden"
        aria-label="Toggle Theme"
      >
        <div className="relative w-6 h-6">
          <Moon className={`absolute inset-0 transition-all duration-500 transform ${isDarkMode ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} />
          <Sun className={`absolute inset-0 transition-all duration-500 transform ${isDarkMode ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}`} />
        </div>
        <div className="absolute inset-0 bg-brand-cream/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
      </button>

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 py-6 px-8 md:px-16 flex justify-between items-center text-[var(--text-color)]" style={{ mixBlendMode: 'var(--nav-blend)' as any }}>
        <div className="font-serif text-2xl tracking-widest uppercase transition-theme">Cavinior</div>
        <div className="hidden md:flex gap-12 text-xs tracking-[0.2em] font-medium uppercase transition-theme z-20">
          <a href="#story" className="hover:opacity-60 transition-opacity">Story</a>
          <a href="#craft" className="hover:opacity-60 transition-opacity">Craft</a>
          <a href="#collections" className="hover:opacity-60 transition-opacity">Collections</a>
        </div>
        <button className="border border-current px-8 py-3 text-xs tracking-widest uppercase hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all duration-500 z-20 cursor-pointer">
          Shop
        </button>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className={`absolute inset-0 z-0 pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-black/60' : 'bg-white/30'}`}></div>

        <div className="absolute inset-0 z-10 w-full px-8 md:px-16 flex items-center justify-center pointer-events-none mt-16 text-[var(--text-color)]">
          <div className="hero-text-1 absolute w-full max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="text-[0.7rem] text-brand-gold uppercase tracking-[0.3em] font-medium mb-8">001 / Introduction</div>
            <h1 className="font-serif text-[clamp(4rem,10vw,12rem)] leading-[0.85] font-bold tracking-tight drop-shadow-2xl">
              PURE<br />
              <span className="italic font-normal text-brand-gold">INDULGENCE</span>
            </h1>
            <p className="mt-12 text-sm md:text-base max-w-md mx-auto font-light tracking-wide leading-relaxed opacity-90 drop-shadow-md">
              Unveiling the rarest cacao. A masterpiece sculpted in chocolate, refined through 192 hours of artisanal conching.
            </p>
          </div>

          <div className="hero-text-2 absolute w-full max-w-4xl mx-auto flex flex-col items-center text-center opacity-0 translate-y-10">
            <h2 className="font-serif text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-bold tracking-tight drop-shadow-2xl mb-8">
              UNCOMPROMISING<br/>QUALITY
            </h2>
            <p className="text-sm md:text-lg max-w-xl mx-auto font-light tracking-wide leading-relaxed opacity-90 drop-shadow-md">
              Meticulously handcrafted from bean to bar. Every step of our process is dedicated to preserving the pristine notes of wild cacao, bringing you an unadulterated sensory experience.
            </p>
          </div>

          <div className="hero-text-3 absolute w-full max-w-4xl mx-auto flex flex-col items-center text-center opacity-0 translate-y-10">
            <h2 className="font-serif text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-bold tracking-tight text-brand-gold drop-shadow-2xl mb-8 italic">
              A Legacy of Taste
            </h2>
            <p className="text-sm md:text-lg max-w-xl mx-auto font-light tracking-wide leading-relaxed opacity-90 drop-shadow-md">
              Experience the profound depth and complexity born from generations of artisanal mastery. Welcome to the world of Cavinior.
            </p>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section id="craft" className="animate-section py-32 md:py-48 px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
        <div className="order-2 md:order-1 relative aspect-[3/4] overflow-hidden w-full max-w-md mx-auto md:mr-auto transition-theme">
          <div className="absolute inset-0 bg-brand-brown/10 z-10 mix-blend-multiply pointer-events-none"></div>
          <img 
            src="https://picsum.photos/seed/cacao-pod/800/1200" 
            alt="Single Origin Cacao" 
            className="w-full h-full object-cover animate-up"
          />
        </div>
        <div className="order-1 md:order-2 flex flex-col justify-center">
          <div className="text-[0.7rem] uppercase tracking-[0.3em] font-medium mb-12 animate-up text-brand-gold">002 / Provenance</div>
          <h2 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] mb-10 animate-up">
            Ethical <br/>Sourcing
          </h2>
          <p className="text-lg md:text-xl font-light opacity-80 leading-relaxed max-w-lg mb-12 animate-up">
            We partner exclusively with sustainable, single-estate farms in Ecuador and Madagascar. No intermediaries, just pure honor to the land and the farmer.
          </p>
          <div className="h-px w-24 bg-current opacity-20 animate-up"></div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-32 overflow-hidden border-y border-current border-opacity-10 bg-[var(--accent-color)] text-brand-cream">
        <div className="relative flex whitespace-nowrap">
          <div ref={marqueeRef} className="flex gap-16 md:gap-32 px-16 will-change-transform font-serif italic text-[12vw] leading-none opacity-90">
             <span>MASTERFUL ROASTING</span>
             <span>FINEST CACAO</span>
             <span>MASTERFUL ROASTING</span>
             <span>FINEST CACAO</span>
          </div>
        </div>
      </section>

      {/* Roasting */}
      <section className="animate-section py-32 md:py-48 px-8 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-5 md:col-start-2 flex flex-col justify-center">
          <div className="text-[0.7rem] uppercase tracking-[0.3em] font-medium mb-12 animate-up opacity-50">003 / Process</div>
          
          <div className="mb-16 animate-up">
            <div className="font-serif text-[5rem] leading-none text-brand-gold mb-2 transition-theme">
              <span className="stat-counter" data-target="192">0</span><span className="text-2xl ml-2 opacity-60">hrs</span>
            </div>
            <div className="text-sm uppercase tracking-widest opacity-60 mt-2">Artisanal Conching</div>
          </div>
          
          <h2 className="font-serif text-5xl font-bold leading-[1.1] mb-8 animate-up">
            A symphony of <br/>temperature & time
          </h2>
          <p className="text-lg font-light opacity-70 leading-relaxed max-w-md animate-up">
            Small batch roasting unlocks the volatile aromatics hidden within raw cacao. Each harvest requires a unique roasting profile to reveal its innermost character.
          </p>
        </div>
        
        <div className="md:col-span-6 overflow-hidden aspect-[4/5] animate-up shadow-2xl transition-theme">
          <img 
            src="https://picsum.photos/seed/roast-beans/1200/1500" 
            alt="Roasting Cacao Beans" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="animate-section min-h-screen py-32 px-8 flex flex-col items-center justify-center text-center">
        <div className="text-[0.7rem] uppercase tracking-[0.3em] font-medium mb-16 animate-up opacity-50">004 / Finale</div>
        
        <div className="font-serif text-[clamp(2rem,5vw,4rem)] lg:text-6xl font-medium leading-tight max-w-4xl mx-auto mb-16 animate-up">
          "A texture so ethereal it transcends chocolate. The depth of flavor is simply unparalleled in modern confectionery."
        </div>
        
        <div className="flex flex-col items-center animate-up mb-24">
          <div className="uppercase tracking-widest text-xs font-bold mb-2">Eleanor Vance</div>
          <div className="text-[0.65rem] uppercase tracking-[0.3em] opacity-50">Culinary Critic</div>
        </div>
        
        <button className="relative group overflow-hidden border border-current px-12 py-5 text-sm uppercase tracking-[0.2em] animate-up cursor-pointer transition-theme">
          <span className="relative z-10 transition-colors duration-500 group-hover:text-[var(--bg-color)]">Experience Cavinior</span>
          <div className="absolute inset-0 bg-current translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0"></div>
        </button>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center border-t border-current border-opacity-10 transition-theme">
        <div className="font-serif text-2xl uppercase tracking-widest mb-8 md:mb-0 transition-theme">Cavinior</div>
        <div className="flex gap-8 text-[0.65rem] uppercase tracking-[0.3em] font-medium opacity-60">
          <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Journal</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
        </div>
      </footer>
    </div>
  );
}
