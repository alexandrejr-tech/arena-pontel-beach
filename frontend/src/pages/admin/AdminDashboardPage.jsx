import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MdPeople, MdCalendarToday, MdCardMembership } from 'react-icons/md';
import AdminLayout from '../../components/layout/AdminLayout';
import { COURT_TYPES } from '../../utils/constants';
import * as userService from '../../services/userService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getAdminStats()
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics = stats ? [
    { icon: MdPeople, label: 'Total Alunos', value: stats.totalUsers, color: 'bg-blue-100 text-blue-600' },
    { icon: MdCalendarToday, label: 'Agendamentos Hoje', value: stats.todayBookings, color: 'bg-green-100 text-green-600' },
    { icon: MdCardMembership, label: 'Planos Ativos', value: stats.activeSubscriptions, color: 'bg-purple-100 text-purple-600' },
  ] : [];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <AdminLayout title="Dashboard Admin">
      <Helmet><title>Admin Dashboard | Arena Pontel Beach</title></Helmet>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metrics.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${m.color} rounded-xl flex items-center justify-center`}><m.icon className="text-2xl" /></div>
                  <div>
                    <p className="text-sm text-gray-500">{m.label}</p>
                    <p className="text-2xl font-bold">{m.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-heading font-bold mb-4">Agendamentos Recentes</h3>
              {stats?.recentBookings?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{booking.user?.name || 'Usuário'}</p>
                        <p className="text-sm text-gray-500">{COURT_TYPES[booking.courtType]} - {booking.startTime}</p>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(booking.date)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">Nenhum agendamento recente</div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-heading font-bold mb-4">Novos Cadastros</h3>
              {stats?.recentUsers?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">Nenhum cadastro recente</div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
