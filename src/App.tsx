import { motion } from 'motion/react';
import { ChevronRight, Star } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream font-sans selection:bg-brand-gold selection:text-brand-dark">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 py-6 px-8 md:px-16 flex justify-between items-center bg-brand-dark/80 backdrop-blur-md border-b border-brand-gold/10">
        <div className="font-serif text-2xl tracking-widest text-brand-gold uppercase">Cavinior</div>
        <div className="hidden md:flex gap-8 text-sm tracking-widest uppercase text-brand-cream-muted">
          <a href="#story" className="hover:text-brand-gold transition-colors">Our Story</a>
          <a href="#craft" className="hover:text-brand-gold transition-colors">Craftsmanship</a>
          <a href="#collections" className="hover:text-brand-gold transition-colors">Collections</a>
        </div>
        <button className="border border-brand-gold text-brand-gold px-6 py-2 text-sm tracking-widest uppercase hover:bg-brand-gold hover:text-brand-dark transition-colors">
          Shop Now
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-8 pt-24 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/chocolate-dark/1920/1080?blur=2" 
            alt="Dark chocolate background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 via-brand-dark/80 to-brand-dark"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-6"
          >
            The Art of <br/>
            <span className="text-brand-gold italic">Pure Indulgence</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl text-brand-cream-muted max-w-2xl mx-auto mb-10 font-light tracking-wide leading-relaxed"
          >
            Handcrafted artisan chocolate made from the world's rarest cacao beans. A symphony of flavor in every bite.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <button className="bg-brand-gold text-brand-dark px-10 py-4 text-sm tracking-widest uppercase hover:bg-brand-gold-light transition-colors flex items-center gap-2 mx-auto">
              Discover the Collection <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features / Craftsmanship */}
      <section id="craft" className="py-32 px-8 md:px-16 bg-brand-brown relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-gold mb-6">Masterful Craftsmanship</h2>
            <div className="w-12 h-px bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                title: "Ethical Sourcing",
                desc: "We partner directly with small-scale farmers in Ecuador and Madagascar, ensuring fair wages and sustainable practices.",
                img: "https://picsum.photos/seed/cacao/800/1200"
              },
              {
                title: "Small Batch Roasting",
                desc: "Each batch is meticulously roasted to bring out the unique flavor profile and delicate notes of the specific cacao origin.",
                img: "https://picsum.photos/seed/roast/800/1200"
              },
              {
                title: "Artisan Tempering",
                desc: "Our master chocolatiers hand-temper every bar to achieve the perfect snap, glossy finish, and smooth melt.",
                img: "https://picsum.photos/seed/temper/800/1200"
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden aspect-[3/4] mb-8">
                  <img 
                    src={feature.img} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 border border-brand-gold/20 m-4 pointer-events-none"></div>
                </div>
                <h3 className="font-serif text-2xl text-brand-gold mb-4">{feature.title}</h3>
                <p className="text-brand-cream-muted font-light leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-8 md:px-16 bg-brand-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-brand-gold mb-20">A Taste of Perfection</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                quote: "The most exquisite chocolate I have ever tasted. The depth of flavor in the 85% dark is simply unparalleled.",
                author: "Eleanor V.",
                role: "Culinary Critic"
              },
              {
                quote: "Cavinior has redefined luxury chocolate. From the elegant packaging to the flawless snap, it's a masterpiece.",
                author: "James M.",
                role: "Connoisseur"
              }
            ].map((testimonial, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="p-10 border border-brand-gold/10 bg-brand-brown/30 relative"
              >
                <div className="flex justify-center gap-1 mb-6 text-brand-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="font-serif text-xl md:text-2xl text-brand-cream-muted italic mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="text-brand-gold tracking-widest uppercase text-sm mb-1">{testimonial.author}</div>
                  <div className="text-brand-cream-muted/50 text-xs uppercase tracking-wider">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 md:px-16 bg-brand-brown relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/luxury-box/1920/1080" 
            alt="Chocolate box" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-5xl md:text-6xl text-brand-gold mb-8">Elevate Your Senses</h2>
          <p className="text-brand-cream-muted text-lg mb-12 font-light">
            Join our exclusive list to receive early access to limited edition seasonal collections and private tasting events.
          </p>
          <form className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="bg-transparent border border-brand-gold/30 px-6 py-4 text-brand-cream focus:outline-none focus:border-brand-gold w-full placeholder:text-brand-cream-muted/50"
            />
            <button type="button" className="bg-brand-gold text-brand-dark px-8 py-4 text-sm tracking-widest uppercase hover:bg-brand-gold-light transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 bg-brand-dark border-t border-brand-gold/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="font-serif text-xl tracking-widest text-brand-gold uppercase">Cavinior</div>
        <div className="text-brand-cream-muted/50 text-xs tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Cavinior Artisan Chocolate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
