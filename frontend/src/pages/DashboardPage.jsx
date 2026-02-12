import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardCards from '../components/dashboard/DashboardCards';
import BookingCard from '../components/dashboard/BookingCard';
import { SkeletonCard } from '../components/shared/SkeletonLoader';
import { useAuth } from '../hooks/useAuth';
import * as bookingService from '../services/bookingService';
import * as subscriptionService from '../services/subscriptionService';

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      bookingService.getUserBookings({ status: 'CONFIRMED', limit: 3 }),
      subscriptionService.getMySubscription(),
    ])
      .then(([bRes, sRes]) => {
        setBookings(bRes.data.data);
        setSubscription(sRes.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const daysLeft = subscription?.endDate ? Math.max(0, Math.ceil((new Date(subscription.endDate) - new Date()) / 86400000)) : 0;

  const cards = [
    { label: 'Próximos Agendamentos', value: bookings.length },
    { label: 'Plano Ativo', value: subscription?.plan?.name || 'Sem plano' },
    { label: 'Dias Restantes', value: subscription ? daysLeft : '-' },
    { label: 'Total de Aulas', value: '-' },
  ];

  const handleCancel = (id) => setBookings((prev) => prev.filter((b) => b.id !== id));

  return (
    <DashboardLayout title="Dashboard">
      <Helmet><title>Dashboard | Arena Pontel Beach</title></Helmet>
      <p className="text-gray-600 mb-6">Olá, <strong>{user?.name}</strong>! Bem-vindo de volta.</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <DashboardCards data={cards} />

          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-bold">Próximos Agendamentos</h2>
              <Link to="/meus-agendamentos" className="text-primary text-sm font-semibold hover:underline">Ver todos</Link>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500 mb-4">Nenhum agendamento próximo.</p>
                <Link to="/agenda" className="text-primary font-semibold hover:underline">Agendar horário →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
