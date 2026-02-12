import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import heroBg from '../../assets/hero-pontel.jpg';

const stats = [
  { value: '6', label: 'Quadras' },
  { value: '500+', label: 'Alunos' },
  { value: '3', label: 'Modalidades' },
];

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="quem-somos" className="py-20 bg-white" ref={ref}>
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={isVisible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Quem Somos</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mt-2 mb-6">
              Mais do que uma arena, um <span className="text-primary">estilo de vida</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Localizada em Campinas, a Arena Pontel Beach nasceu para redefinir o conceito de arena esportiva. Com estrutura moderna, quadras de alto padrão e um ambiente vibrante.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Unimos qualidade, conforto e lifestyle em um espaço completo — o lugar ideal para você jogar, treinar, competir e relaxar. Seja no futevôlei, beach tênis, eventos e momentos de lazer, cada detalhe foi pensado para elevar sua experiência.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center">
                  <div className="text-3xl md:text-4xl font-heading font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={isVisible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <img src={heroBg} alt="Arena Pontel Beach" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
