import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

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
      // 1. Canvas frame scrub
      gsap.to(sequence, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 0,
          pin: true,
        },
        onUpdate: render
      });

      // 2. Hero Text fades out as we scroll deep
      gsap.to(heroTextRef.current, {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
        }
      });

      // 3. Marquee Text
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

      // Add hero section to refs tracking color zones
      if (heroRef.current && !sectionRefs.current.includes(heroRef.current)) {
        // We prepend since it's the first section
        sectionRefs.current = [heroRef.current, ...sectionRefs.current];
      }

      // 4. Section Entrances & Color Zones
      sectionRefs.current.forEach((section) => {
        if (!section) return;
        
        const bgColor = section.getAttribute('data-bgcolor');
        const textColor = section.getAttribute('data-textcolor');

        if (bgColor && textColor) {
          ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => gsap.to('body', { backgroundColor: bgColor, color: textColor, duration: 0.8 }),
            onEnterBack: () => gsap.to('body', { backgroundColor: bgColor, color: textColor, duration: 0.8 }),
          });
        }

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
      
      // 5. Stat Counter
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

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="selection:bg-brand-gold selection:text-brand-dark min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 py-6 px-8 md:px-16 flex justify-between items-center mix-blend-difference text-brand-cream">
        <div className="font-serif text-2xl tracking-widest uppercase">Cavinior</div>
        <div className="hidden md:flex gap-12 text-xs tracking-[0.2em] font-medium uppercase mix-blend-difference">
          <a href="#story" className="hover:opacity-60 transition-opacity">Story</a>
          <a href="#craft" className="hover:opacity-60 transition-opacity">Craft</a>
          <a href="#collections" className="hover:opacity-60 transition-opacity">Collections</a>
        </div>
        <button className="border border-current px-8 py-3 text-xs tracking-widest uppercase hover:bg-brand-cream hover:text-brand-dark transition-colors mix-blend-difference cursor-pointer">
          Shop
        </button>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden" data-bgcolor="var(--bg-dark)" data-textcolor="var(--text-on-dark)">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        <div ref={heroTextRef} className="relative z-10 w-full px-8 md:px-16 flex flex-col items-center justify-center text-center mt-20">
          <div className="text-[0.7rem] text-brand-gold uppercase tracking-[0.3em] font-medium mb-8">001 / Introduction</div>
          <h1 className="font-serif text-[clamp(4rem,10vw,12rem)] leading-[0.85] font-bold tracking-tight text-brand-cream drop-shadow-2xl">
            PURE<br />
            <span className="italic font-normal">INDULGENCE</span>
          </h1>
          <p className="mt-12 text-sm md:text-base max-w-md mx-auto font-light tracking-wide leading-relaxed text-brand-cream/90 drop-shadow-md">
            Unveiling the rarest cacao. A masterpiece sculpted in chocolate, refined through 192 hours of artisanal conching.
          </p>
        </div>
      </section>

      {/* spacer to handle the pin end */}
      <div className="h-[400vh]"></div>

      {/* Craftsmanship: Left-Aligned Split */}
      <section ref={addToRefs} id="craft" className="py-32 md:py-48 px-8 md:px-16 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center" data-bgcolor="var(--bg-light)" data-textcolor="var(--text-on-light)">
        <div className="order-2 md:order-1 relative aspect-[3/4] overflow-hidden w-full max-w-md mx-auto md:mr-auto">
          <div className="absolute inset-0 bg-brand-brown/10 z-10 mix-blend-multiply border border-transparent"></div>
          <img 
            src="https://picsum.photos/seed/cacao-pod/800/1200" 
            alt="Single Origin Cacao" 
            className="w-full h-full object-cover animate-up"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="order-1 md:order-2 flex flex-col justify-center">
          <div className="text-[0.7rem] text-brand-accent uppercase tracking-[0.3em] font-medium mb-12 animate-up">002 / Provenance</div>
          <h2 className="font-serif text-5xl md:text-7xl font-bold leading-[0.9] text-brand-dark mb-10 animate-up">
            Ethical <br/>Sourcing
          </h2>
          <p className="text-lg md:text-xl font-light text-brand-dark/80 leading-relaxed max-w-lg mb-12 animate-up">
            We partner exclusively with sustainable, single-estate farms in Ecuador and Madagascar. No intermediaries, just pure honor to the land and the farmer.
          </p>
          <div className="h-px w-24 bg-brand-dark/20 animate-up"></div>
        </div>
      </section>

      {/* Marquee Full-Width */}
      <section className="py-32 overflow-hidden bg-brand-accent text-brand-gold border-y border-brand-dark border-opacity-20" data-bgcolor="var(--bg-accent)" data-textcolor="var(--text-on-dark)" ref={addToRefs}>
        <div className="relative flex whitespace-nowrap">
          <div ref={marqueeRef} className="flex gap-16 md:gap-32 px-16 will-change-transform font-serif italic text-[12vw] leading-none opacity-90">
             <span>MASTERFUL ROASTING</span>
             <span>FINEST CACAO</span>
             <span>MASTERFUL ROASTING</span>
             <span>FINEST CACAO</span>
          </div>
        </div>
      </section>

      {/* Roasting: Right-Aligned Split with Stats */}
      <section ref={addToRefs} className="py-32 md:py-48 px-8 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-16 items-center" data-bgcolor="var(--bg-dark)" data-textcolor="var(--text-on-dark)">
        <div className="md:col-span-5 md:col-start-2 flex flex-col justify-center">
          <div className="text-[0.7rem] text-brand-cream/50 uppercase tracking-[0.3em] font-medium mb-12 animate-up">003 / Process</div>
          
          <div className="mb-16 animate-up">
            <div className="font-serif text-[5rem] leading-none text-brand-gold mb-2">
              <span className="stat-counter" data-target="192">0</span><span className="text-2xl ml-2 text-brand-cream">hrs</span>
            </div>
            <div className="text-sm uppercase tracking-widest text-brand-cream/60 mt-2">Artisanal Conching</div>
          </div>
          
          <h2 className="font-serif text-5xl font-bold leading-[1.1] text-brand-cream mb-8 animate-up">
            A symphony of <br/>temperature & time
          </h2>
          <p className="text-lg font-light text-brand-cream/70 leading-relaxed max-w-md animate-up">
            Small batch roasting unlocks the volatile aromatics hidden within raw cacao. Each harvest requires a unique roasting profile to reveal its innermost character.
          </p>
        </div>
        
        <div className="md:col-span-6 overflow-hidden aspect-[4/5] animate-up shadow-2xl">
          <img 
            src="https://picsum.photos/seed/roast-beans/1200/1500" 
            alt="Roasting Cacao Beans" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Centered Final CTA / Testimonial */}
      <section ref={addToRefs} className="min-h-screen py-32 px-8 flex flex-col items-center justify-center text-center bg-brand-light" data-bgcolor="var(--bg-light)" data-textcolor="var(--text-on-light)">
        <div className="text-[0.7rem] text-brand-dark/50 uppercase tracking-[0.3em] font-medium mb-16 animate-up">004 / Finale</div>
        
        <div className="font-serif text-[clamp(2rem,5vw,4rem)] lg:text-6xl font-medium leading-tight max-w-4xl mx-auto text-brand-dark mb-16 animate-up">
          "A texture so ethereal it transcends chocolate. The depth of flavor is simply unparalleled in modern confectionery."
        </div>
        
        <div className="flex flex-col items-center animate-up mb-24">
          <div className="uppercase tracking-widest text-xs font-bold text-brand-dark mb-2">Eleanor Vance</div>
          <div className="text-[0.65rem] uppercase tracking-[0.3em] text-brand-dark/50">Culinary Critic</div>
        </div>
        
        <button className="relative group overflow-hidden border border-brand-dark text-brand-dark px-12 py-5 text-sm uppercase tracking-[0.2em] animate-up cursor-pointer">
          <span className="relative z-10 transition-colors duration-500 group-hover:text-brand-cream">Experience Cavinior</span>
          <div className="absolute inset-0 bg-brand-dark translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-0"></div>
        </button>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center border-t border-brand-dark/10" style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-on-light)' }}>
        <div className="font-serif text-2xl uppercase tracking-widest mb-8 md:mb-0 text-brand-dark">Cavinior</div>
        <div className="flex gap-8 text-[0.65rem] uppercase tracking-[0.3em] font-medium text-brand-dark/60">
          <a href="#" className="hover:text-brand-dark transition-colors">Instagram</a>
          <a href="#" className="hover:text-brand-dark transition-colors">Journal</a>
          <a href="#" className="hover:text-brand-dark transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}
