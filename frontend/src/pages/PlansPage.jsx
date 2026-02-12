import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import PublicLayout from '../components/layout/PublicLayout';
import { PLAN_CATEGORIES } from '../data/plans';
import { formatCurrency } from '../utils/formatters';

export default function PlansPage() {
  const [activeCategory, setActiveCategory] = useState('futevolei');
  const [activeDuration, setActiveDuration] = useState('all');

  const category = PLAN_CATEGORIES.find((c) => c.id === activeCategory);
  const durations = [...new Set(category.plans.map((p) => p.duration))];

  const filteredPlans = activeDuration === 'all'
    ? category.plans
    : category.plans.filter((p) => p.duration === activeDuration);

  return (
    <PublicLayout>
      <Helmet><title>Planos | Arena Pontel Beach</title></Helmet>
      <div className="bg-gradient-to-r from-dark to-primary/80 py-20 text-center text-white">
        <h1 className="text-4xl font-heading font-bold">Nossos Planos</h1>
        <p className="text-white/70 mt-2">Escolha o plano ideal para você</p>
      </div>

      <section className="py-16">
        <div className="section-container">
          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {PLAN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setActiveDuration('all'); }}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
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

          {/* Duration filter */}
          {durations.length > 1 && (
            <div className="flex justify-center gap-2 mb-10">
              <button
                onClick={() => setActiveDuration('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeDuration === 'all' ? 'bg-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDuration(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeDuration === d ? 'bg-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {/* Plans grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + activeDuration}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {filteredPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {plan.duration}
                    </span>
                    {plan.frequency && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {plan.frequency}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-dark mb-4">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-dark">{formatCurrency(plan.price)}</span>
                    {plan.period && <span className="text-gray-500 text-sm">/{plan.period}</span>}
                  </div>
                  <a
                    href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5519999378998'}?text=${encodeURIComponent(`Olá! Tenho interesse no plano ${category.name} - ${plan.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Quero esse plano
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <div className="text-center mt-12 p-8 bg-gray-50 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-xl font-heading font-bold mb-2">Dúvidas sobre qual plano escolher?</h3>
            <p className="text-gray-500 mb-4">Entre em contato conosco pelo WhatsApp e tire suas dúvidas!</p>
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5519999378998'}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os planos da Arena Pontel Beach.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
