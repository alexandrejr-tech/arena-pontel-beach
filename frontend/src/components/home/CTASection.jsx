import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark" ref={ref}>
      <div className="section-container text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          Pronto para elevar seu jogo?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
          className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Comece hoje mesmo e faça parte da melhor arena de esportes de areia de Campinas
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/cadastro" className="bg-white hover:bg-gray-100 text-primary px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Começar agora
          </Link>
          <Link to="/contato" className="border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Fale conosco
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
