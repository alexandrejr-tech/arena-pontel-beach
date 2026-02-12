import { motion } from 'framer-motion';
import { MdSportsSoccer, MdSportsTennis, MdEvent } from 'react-icons/md';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const sports = [
  { icon: MdSportsSoccer, title: 'Futevôlei', description: 'A combinação perfeita de futebol e vôlei, praticada na areia. Diversão e preparo físico garantidos.', color: 'bg-blue-50 text-blue-500' },
  { icon: MdSportsTennis, title: 'Beach Tênis', description: 'O esporte que mais cresce no Brasil. Venha praticar nas nossas quadras de alto padrão.', color: 'bg-green-50 text-green-500' },
  { icon: MdEvent, title: 'Eventos', description: 'Organize seu evento, torneio ou confraternização com a melhor estrutura da região.', color: 'bg-purple-50 text-purple-500' },
];

export default function SportsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-secondary" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="section-title">Nossas <span className="text-primary">Modalidades</span></h2>
          <p className="section-subtitle">Escolha sua modalidade favorita e venha se divertir</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {sports.map((sport, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow border-t-4 border-transparent hover:border-primary group">
              <div className={`w-16 h-16 ${sport.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <sport.icon className="text-3xl" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{sport.title}</h3>
              <p className="text-gray-600 leading-relaxed">{sport.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
