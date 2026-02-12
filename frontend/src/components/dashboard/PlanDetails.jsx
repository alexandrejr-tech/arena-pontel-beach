import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdCheck } from 'react-icons/md';
import { toast } from 'react-toastify';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Button from '../shared/Button';
import Modal from '../shared/Modal';
import * as subscriptionService from '../../services/subscriptionService';

export default function PlanDetails({ subscription, onCancel }) {
  const [showModal, setShowModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!subscription) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500 text-lg mb-4">Você não possui um plano ativo.</p>
        <Link to="/planos" className="text-primary font-semibold hover:underline">Ver planos disponíveis →</Link>
      </div>
    );
  }

  const { plan, status, startDate, endDate } = subscription;
  const daysLeft = Math.max(0, Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24)));
  const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const progress = totalDays > 0 ? ((totalDays - daysLeft) / totalDays) * 100 : 0;

  const statusColors = { ACTIVE: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800', EXPIRED: 'bg-gray-100 text-gray-800' };
  const statusLabels = { ACTIVE: 'Ativo', CANCELLED: 'Cancelado', EXPIRED: 'Expirado' };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await subscriptionService.cancelSubscription();
      toast.success('Plano cancelado.');
      setShowModal(false);
      onCancel?.();
    } catch {
      toast.error('Erro ao cancelar plano.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-heading font-bold">{plan.name}</h3>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[status]}`}>{statusLabels[status]}</span>
        </div>
        <p className="text-3xl font-bold text-primary mb-2">{formatCurrency(plan.price)}<span className="text-sm text-gray-500 font-normal">/mês</span></p>
        <p className="text-gray-500 text-sm mb-6">{plan.description}</p>

        <ul className="space-y-2 mb-6">
          {plan.benefits?.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-sm"><MdCheck className="text-primary" />{b}</li>
          ))}
        </ul>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Início: {formatDate(startDate)}</span>
            <span>Término: {formatDate(endDate)}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-sm text-gray-500 mt-2">{daysLeft} dias restantes</p>
        </div>

        {status === 'ACTIVE' && <Button variant="danger" onClick={() => setShowModal(true)}>Cancelar plano</Button>}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Cancelar Plano">
        <p className="text-gray-600 mb-6">Tem certeza que deseja cancelar seu plano? Você perderá acesso aos benefícios.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowModal(false)} fullWidth>Voltar</Button>
          <Button variant="danger" onClick={handleCancel} loading={cancelling} fullWidth>Confirmar</Button>
        </div>
      </Modal>
    </>
  );
}
