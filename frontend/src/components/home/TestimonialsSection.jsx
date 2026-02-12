import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import 'swiper/css';
import 'swiper/css/pagination';

const swiperStyles = `
  .testimonials-swiper .swiper-pagination {
    position: relative !important;
    margin-top: 2rem !important;
    bottom: 0 !important;
  }
`;

const testimonials = [
  { text: 'Melhor arena de beach da região! Estrutura impecável e atendimento nota 10.', name: 'Carlos Silva', sport: 'Futevôlei' },
  { text: 'Desde que comecei a treinar aqui, meu jogo evoluiu muito. Recomendo!', name: 'Ana Oliveira', sport: 'Beach Tênis' },
  { text: 'O ambiente é incrível e a equipe é muito atenciosa. Me sinto em casa!', name: 'Pedro Santos', sport: 'Futevôlei' },
  { text: 'Organizamos nosso torneio corporativo aqui e foi perfeito!', name: 'Mariana Costa', sport: 'Eventos' },
  { text: 'As quadras são de altíssima qualidade. Vale cada centavo.', name: 'Lucas Ferreira', sport: 'Beach Tênis' },
];

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-secondary" ref={ref}>
      <style>{swiperStyles}</style>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="section-title">O que dizem nossos <span className="text-primary">alunos</span></h2>
          <p className="section-subtitle">Depoimentos reais de quem vive a Arena Pontel Beach</p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="testimonials-swiper"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white rounded-xl p-8 shadow-md h-full">
                <p className="text-gray-600 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-sm text-primary">{t.sport}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
