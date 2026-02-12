import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '../components/layout/DashboardLayout';
import BookingCard from '../components/dashboard/BookingCard';
import { SkeletonCard } from '../components/shared/SkeletonLoader';
import * as bookingService from '../services/bookingService';

export default function HistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getUserBookings({ limit: 50 })
      .then((res) => {
        const past = res.data.data.filter((b) => b.status !== 'CONFIRMED' || new Date(b.date) < new Date());
        setBookings(past);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Histórico">
      <Helmet><title>Histórico | Arena Pontel Beach</title></Helmet>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-500">Nenhum registro no histórico.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}
    </DashboardLayout>
  );
}
