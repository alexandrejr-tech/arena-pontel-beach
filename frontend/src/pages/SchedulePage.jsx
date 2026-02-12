import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PublicLayout from '../components/layout/PublicLayout';
import Button from '../components/shared/Button';
import Modal from '../components/shared/Modal';
import { useAuth } from '../hooks/useAuth';
import { COURT_TYPES } from '../utils/constants';
import * as bookingService from '../services/bookingService';

const COURT_TYPE_COLORS = {
  FUTEVOLEI: { bg: 'bg-orange-500', text: 'text-orange-500', label: 'Futevôlei' },
  BEACH_TENNIS: { bg: 'bg-green-500', text: 'text-green-500', label: 'Beach Tênis' },
  LOCACAO: { bg: 'bg-blue-500', text: 'text-blue-500', label: 'Locação (1h30)' },
  EVENTO: { bg: 'bg-purple-500', text: 'text-purple-500', label: 'Evento' },
};

export default function SchedulePage() {
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [courtType, setCourtType] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [confirming, setConfirming] = useState(false);

  // Gera os próximos 7 dias
  const getWeekDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const dateStr = selectedDate.toISOString().split('T')[0];

  useEffect(() => {
    setLoading(true);
    const params = { date: dateStr };
    if (courtType) params.courtType = courtType;

    bookingService.getPublicSchedule(params)
      .then((res) => setSlots(res.data.data))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [dateStr, courtType]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.info('Faça login para agendar.');
      return;
    }
    if (!courtType) {
      toast.warning('Selecione uma modalidade para agendar.');
      return;
    }
    setConfirming(true);
    try {
      await bookingService.create({ courtType, date: dateStr, startTime: booking.startTime, endTime: booking.endTime });
      toast.success('Agendamento confirmado!');
      setBooking(null);
      // Atualiza slots
      const params = { date: dateStr };
      if (courtType) params.courtType = courtType;
      const res = await bookingService.getPublicSchedule(params);
      setSlots(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao agendar.');
    } finally {
      setConfirming(false);
    }
  };

  const formatDayName = (date) => {
    const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return names[date.getDay()];
  };

  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

  return (
    <PublicLayout>
      <Helmet><title>Agenda | Arena Pontel Beach</title></Helmet>
      <div className="bg-gradient-to-r from-dark to-primary/80 py-20 text-center text-white">
        <h1 className="text-4xl font-heading font-bold">Agenda</h1>
        <p className="text-white/70 mt-2">Veja os horários disponíveis e faça sua reserva</p>
      </div>

      <section className="py-8 sm:py-16">
        <div className="section-container max-w-5xl">
          {/* Seletor de dias */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {weekDays.map((day) => (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl transition-all ${
                    isSameDay(day, selectedDate)
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xs font-medium">{formatDayName(day)}</span>
                  <span className="text-2xl font-bold">{day.getDate()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filtro de modalidade */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por modalidade</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCourtType('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !courtType ? 'bg-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              {Object.entries(COURT_TYPES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setCourtType(k)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    courtType === k ? `${COURT_TYPE_COLORS[k].bg} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-white border-2 border-primary"></div>
              <span className="text-gray-600">Disponível</span>
            </div>
            {Object.entries(COURT_TYPE_COLORS).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${v.bg}`}></div>
                <span className="text-gray-600">{v.label}</span>
              </div>
            ))}
          </div>

          {/* Grade de horários */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-500 mt-4">Carregando horários...</p>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Nenhum horário disponível para esta data.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {slots.map((slot) => {
                const isBooked = slot.bookedFor && slot.bookedFor.length > 0;
                const bookedType = isBooked ? slot.bookedFor[0] : null;
                const colorClass = bookedType ? COURT_TYPE_COLORS[bookedType] : null;

                return (
                  <motion.button
                    key={slot.startTime}
                    whileHover={{ scale: slot.available ? 1.03 : 1 }}
                    disabled={!slot.available}
                    onClick={() => slot.available && setBooking(slot)}
                    className={`p-4 rounded-xl text-center font-medium transition-all relative ${
                      slot.available
                        ? 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-sm'
                        : `${colorClass?.bg || 'bg-gray-200'} text-white cursor-not-allowed`
                    }`}
                  >
                    <span className="text-lg">{slot.startTime}</span>
                    <span className="block text-xs opacity-75">até {slot.endTime}</span>
                    {isBooked && (
                      <span className="block text-xs mt-1 font-normal opacity-90">
                        {colorClass?.label || 'Reservado'}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* CTA para login */}
          {!isAuthenticated && (
            <div className="mt-10 text-center p-6 bg-gray-50 rounded-2xl">
              <p className="text-gray-600 mb-4">Para fazer um agendamento, faça login ou crie sua conta.</p>
              <div className="flex justify-center gap-4">
                <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Fazer login
                </Link>
                <Link to="/cadastro" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Criar conta
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal de confirmação */}
      <Modal isOpen={!!booking} onClose={() => setBooking(null)} title="Confirmar Agendamento">
        {booking && (
          <div>
            {!isAuthenticated ? (
              <div className="text-center">
                <p className="text-gray-600 mb-6">Você precisa estar logado para fazer um agendamento.</p>
                <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold inline-block">
                  Fazer login
                </Link>
              </div>
            ) : !courtType ? (
              <div>
                <p className="text-gray-600 mb-4">Selecione a modalidade para este horário:</p>
                <div className="space-y-2 mb-6">
                  {Object.entries(COURT_TYPES).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setCourtType(k)}
                      className={`w-full p-3 rounded-lg text-left font-medium border-2 transition-colors ${COURT_TYPE_COLORS[k].text} border-current hover:${COURT_TYPE_COLORS[k].bg} hover:text-white`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <Button variant="secondary" onClick={() => setBooking(null)} fullWidth>Cancelar</Button>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">Deseja confirmar o agendamento?</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
                  <p><strong>Modalidade:</strong> {COURT_TYPES[courtType]}</p>
                  <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <p><strong>Horário:</strong> {booking.startTime} - {booking.endTime}</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setBooking(null)} fullWidth>Cancelar</Button>
                  <Button onClick={handleBook} loading={confirming} fullWidth>Confirmar</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PublicLayout>
  );
}
