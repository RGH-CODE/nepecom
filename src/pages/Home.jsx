import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Crown, Flame, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import ProductGrid from '../components/ProductGrid'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8F8F7] text-[#1a1a1a] selection:bg-black selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-12 items-center z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-black/5">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Early Access: Summer Membership Open</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.85] font-sans">
              The Art of <br /> 
              <span className="italic font-serif text-stone-500">Living Well.</span>
            </h1>

            <p className="max-w-md text-lg text-stone-600 leading-relaxed">
              A curated ecosystem of objects designed for the modern professional. From technical apparel to architectural home essentials.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate('/new-arrivals')}
                className="h-16 px-10 rounded-full bg-black text-white hover:bg-stone-800 text-lg transition-all"
              >
                Shop New Arrivals
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/membership')}
                className="h-16 px-10 rounded-full border-stone-300 hover:bg-stone-100 text-lg group"
              >
                Join Membership <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual - Large Rounded Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block h-[700px] rounded-[40px] overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
              alt="High-end lifestyle"
              className="w-full h-full object-cover"
            />
            {/* Membership Badge Overlay */}
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl max-w-[200px] border border-white">
              <CheckCircle2 className="w-8 h-8 text-black mb-2" />
              <p className="font-bold text-sm">Verified Quality</p>
              <p className="text-xs text-stone-500">Every item is inspected by our studio for 100% authenticity.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- VIRAL PRODUCTS HORIZONTAL TICKER --- */}
      <div className="bg-black py-4 overflow-hidden border-y border-white/10">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 text-white/80 uppercase text-xs font-bold tracking-[0.2em]">
              <Flame className="w-4 h-4 text-orange-500" />
              Viral Now: Sculptural Ceramic Vase
              <span className="opacity-30">—</span>
              <Flame className="w-4 h-4 text-orange-500" />
              Sold Out 4x: Merino Tech-Knit
            </div>
          ))}
        </div>
      </div>

      {/* --- CURATED CATEGORIES (LIFESTYLE MIX) --- */}
      <section className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {/* Tech/Objects */}
          <div className="relative group cursor-pointer overflow-hidden rounded-[32px] bg-stone-200">
            <img 
              src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              alt="Workstation Tech"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-bold tracking-widest uppercase mb-1">01. Studio Tools</p>
              <h3 className="text-2xl font-medium">Refined Tech</h3>
            </div>
          </div>

          {/* Interior/Home */}
          <div className="relative group cursor-pointer overflow-hidden rounded-[32px] bg-stone-200 md:mb-12">
            <img 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2116&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              alt="Modern Living"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-bold tracking-widest uppercase mb-1">02. Sanctuary</p>
              <h3 className="text-2xl font-medium">Modern Living</h3>
            </div>
          </div>

          {/* Minimal Fashion */}
          <div className="relative group cursor-pointer overflow-hidden rounded-[32px] bg-stone-200">
            <img 
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              alt="Apparel"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-bold tracking-widest uppercase mb-1">03. Uniform</p>
              <h3 className="text-2xl font-medium">Core Apparel</h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- THE VIRAL PRODUCT GRID --- */}
      <main className="container mx-auto px-4 py-24 border-t border-stone-200">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-sans font-medium tracking-tight">The Viral List</h2>
            <p className="text-stone-500 mt-2">Highly requested, limited availability.</p>
          </div>
          <button onClick={() => navigate('/collections')} className="hidden md:block text-sm font-bold border-b-2 border-black pb-1 hover:text-stone-500 hover:border-stone-500 transition-all">
            BROWSE ALL
          </button>
        </div>
        
        <ProductGrid />
      </main>

      {/* --- MEMBERSHIP CARD (REALISTIC UI) --- */}
      <section className="container mx-auto px-4 pb-24">
        <div className="bg-[#1a1a1a] rounded-[40px] p-8 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-stone-800/50 to-transparent" />
          
          <div className="max-w-xl relative z-10">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-8 rotate-12">
              <Crown className="text-black w-6 h-6" />
            </div>
            <h2 className="text-4xl md:text-6xl font-medium leading-none mb-6 italic font-serif">
              Join the <br /> Inner Circle.
            </h2>
            <ul className="space-y-4 mb-10 text-stone-400">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500" /> Free priority shipping on all orders
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500" /> Early access to limited "Viral" drops
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-500" /> Exclusive 15% member-only pricing
              </li>
            </ul>
            <Button size="lg" className="bg-white text-black hover:bg-stone-200 rounded-full px-8 h-14">
              Apply for Membership
            </Button>
          </div>
        </div>
      </section>

      {/* Footer info - simple */}
      <footer className="py-12 border-t border-stone-200 text-center">
        <p className="text-xs text-stone-400 uppercase tracking-widest">© 2024 Modern Studio. All Rights Reserved.</p>
      </footer>

      {/* Marquee Animation CSS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}