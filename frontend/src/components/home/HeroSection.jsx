import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';
import heroBg from '../../assets/hero-pontel.jpg';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm mb-6 border border-white/20">
          <span>🏐</span> Bem-vindo à Arena Pontel Beach
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
          A nova referência em{' '}
          <span className="text-primary">esportes de areia</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-white/70 mb-4 font-medium">
          Futevôlei &bull; Beach Tênis &bull; Eventos
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-base text-white/50 mb-10 max-w-2xl mx-auto">
          Quadras de alto padrão, estrutura moderna e um ambiente vibrante em Campinas. Jogue, treine, compita e relaxe.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/planos" className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Conhecer Planos
          </Link>
          <Link to="/agenda" className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Agendar Horário
          </Link>
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <HiChevronDown className="text-3xl text-white/50" />
      </motion.div>
    </section>
  );
}
