import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdZoomIn } from 'react-icons/md';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const images = [
  { gradient: 'from-primary/30 to-blue-400/30', label: 'Quadra de Futevôlei' },
  { gradient: 'from-green-400/30 to-teal-400/30', label: 'Beach Tênis' },
  { gradient: 'from-purple-400/30 to-pink-400/30', label: 'Área de Eventos' },
  { gradient: 'from-orange-400/30 to-yellow-400/30', label: 'Estrutura' },
  { gradient: 'from-blue-400/30 to-indigo-400/30', label: 'Vestiários' },
  { gradient: 'from-teal-400/30 to-emerald-400/30', label: 'Espaço de Convivência' },
];

export default function GallerySection() {
  const { ref, isVisible } = useScrollAnimation();
  const [selected, setSelected] = useState(null);

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="section-title"><span className="text-primary">Galeria</span></h2>
          <p className="section-subtitle">Conheça nossa estrutura</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={isVisible ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.1 }}
              onClick={() => setSelected(i)}
              className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group relative">
              <div className={`w-full h-full bg-gradient-to-br ${img.gradient} flex items-center justify-center`}>
                <span className="text-gray-700 font-heading font-semibold">{img.label}</span>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <MdZoomIn className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <button className="absolute top-4 right-4 text-white p-2"><MdClose className="text-3xl" /></button>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className={`w-full max-w-3xl aspect-video rounded-xl bg-gradient-to-br ${images[selected].gradient} flex items-center justify-center`}>
              <span className="text-2xl font-heading font-bold text-gray-700">{images[selected].label}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
