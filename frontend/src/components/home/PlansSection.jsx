import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { PLAN_CATEGORIES } from '../../data/plans';

export default function PlansSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeCategory, setActiveCategory] = useState('futevolei');

  const category = PLAN_CATEGORIES.find((c) => c.id === activeCategory);

  // Show only the "Mensal" plans as highlights on the home page
  const highlightPlans = category.plans.filter((p) => p.duration === 'Mensal' || p.duration === 'Avulso').slice(0, 3);

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="section-title">Nossos <span className="text-primary">Planos</span></h2>
          <p className="section-subtitle">Escolha o plano ideal para você</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {PLAN_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {highlightPlans.map((plan, i) => (
            <motion.div
              key={activeCategory + plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className={`rounded-2xl p-8 relative ${
                i === 1
                  ? 'bg-primary text-white shadow-xl scale-105 border-2 border-primary'
                  : 'bg-white border border-gray-200 shadow-md'
              }`}
            >
              {i === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-dark text-xs font-bold px-4 py-1 rounded-full">Mais popular</span>
              )}
              {plan.frequency && (
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${i === 1 ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                  {plan.frequency}
                </span>
              )}
              <h3 className="text-xl font-heading font-bold mt-3 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-sm">R$</span>
                <span className="text-4xl font-bold">{plan.price.toFixed(2).replace('.', ',')}</span>
                {plan.period && <span className="text-sm">/{plan.period}</span>}
              </div>
              <a
                href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5519999378998'}?text=${encodeURIComponent(`Olá! Tenho interesse no plano ${category.name} - ${plan.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block text-center py-3 rounded-lg font-semibold transition-colors ${
                  i === 1 ? 'bg-white text-primary hover:bg-gray-100' : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                Quero esse plano
              </a>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/planos" className="text-primary font-semibold hover:underline">Ver todos os planos →</Link>
        </div>
      </div>
    </section>
  );
}
