import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '../components/layout/DashboardLayout';
import BookingCard from '../components/dashboard/BookingCard';
import { SkeletonCard } from '../components/shared/SkeletonLoader';
import Button from '../components/shared/Button';
import * as bookingService from '../services/bookingService';

const tabs = [
  { key: '', label: 'Todos' },
  { key: 'CONFIRMED', label: 'Confirmados' },
  { key: 'CANCELLED', label: 'Cancelados' },
  { key: 'COMPLETED', label: 'Concluídos' },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchBookings = (status, p = 1) => {
    setLoading(true);
    bookingService.getUserBookings({ status: status || undefined, page: p, limit: 10 })
      .then((res) => {
        setBookings(p === 1 ? res.data.data : (prev) => [...prev, ...res.data.data]);
        setHasMore(res.data.pagination?.page < res.data.pagination?.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); fetchBookings(activeTab, 1); }, [activeTab]);

  const handleCancel = (id) => setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' } : b));

  return (
    <DashboardLayout title="Meus Agendamentos">
      <Helmet><title>Meus Agendamentos | Arena Pontel Beach</title></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <Link to="/agenda"><Button size="sm">Novo agendamento</Button></Link>
      </div>

      {loading && bookings.length === 0 ? (
        <div className="space-y-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">Nenhum agendamento encontrado.</p>
          <Link to="/agenda" className="text-primary font-semibold hover:underline">Agendar horário →</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map((b) => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
          </div>
          {hasMore && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => { const next = page + 1; setPage(next); fetchBookings(activeTab, next); }}>Carregar mais</Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
