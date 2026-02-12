import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdSportsSoccer, MdSportsTennis, MdEvent } from 'react-icons/md';
import { COURT_TYPES, BOOKING_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import * as bookingService from '../../services/bookingService';

const courtIcons = { FUTEVOLEI: MdSportsSoccer, BEACH_TENNIS: MdSportsTennis, EVENTO: MdEvent };

export default function BookingCard({ booking, onCancel }) {
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const Icon = courtIcons[booking.courtType] || MdSportsSoccer;
  const status = BOOKING_STATUS[booking.status];
  const canCancel = booking.status === 'CONFIRMED' && new Date(booking.date) >= new Date();

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await bookingService.cancel(booking.id);
      toast.success('Agendamento cancelado.');
      setShowModal(false);
      onCancel?.(booking.id);
    } catch {
      toast.error('Erro ao cancelar agendamento.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <motion.div whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Icon className="text-primary text-2xl" />
          </div>
          <div>
            <p className="font-semibold">{COURT_TYPES[booking.courtType]}</p>
            <p className="text-sm text-gray-500">{formatDate(booking.date)} &bull; {booking.startTime} - {booking.endTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.color}`}>{status.label}</span>
          {canCancel && <Button variant="danger" size="sm" onClick={() => setShowModal(true)}>Cancelar</Button>}
        </div>
      </motion.div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Cancelar Agendamento">
        <p className="text-gray-600 mb-6">Tem certeza que deseja cancelar este agendamento?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>Voltar</Button>
          <Button variant="danger" onClick={handleCancel} loading={cancelling} fullWidth>Confirmar cancelamento</Button>
        </div>
      </Modal>
    </>
  );
}
