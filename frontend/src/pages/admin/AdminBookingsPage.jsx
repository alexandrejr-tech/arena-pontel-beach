import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { MdCancel } from 'react-icons/md';
import AdminLayout from '../../components/layout/AdminLayout';
import { COURT_TYPES, BOOKING_STATUS } from '../../utils/constants';
import * as bookingService from '../../services/bookingService';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', courtType: '', status: '' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchBookings = (page = 1) => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (filters.date) params.date = filters.date;
    if (filters.courtType) params.courtType = filters.courtType;
    if (filters.status) params.status = filters.status;

    bookingService.getAll(params)
      .then((res) => {
        setBookings(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleFilter = () => {
    fetchBookings(1);
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    try {
      await bookingService.cancel(id);
      toast.success('Agendamento cancelado!');
      fetchBookings(pagination.page);
    } catch {
      toast.error('Erro ao cancelar agendamento.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <AdminLayout title="Gerenciar Agendamentos">
      <Helmet><title>Agendamentos | Admin Arena Pontel Beach</title></Helmet>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          />
          <select
            value={filters.courtType}
            onChange={(e) => setFilters({ ...filters, courtType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">Todas modalidades</option>
            {Object.entries(COURT_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">Todos status</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="CANCELLED">Cancelado</option>
            <option value="COMPLETED">Concluído</option>
          </select>
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Filtrar
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center text-gray-400 py-12">Nenhum agendamento encontrado</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Aluno</th>
                    <th className="pb-3 font-medium">Modalidade</th>
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Horário</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const statusInfo = BOOKING_STATUS[booking.status] || { label: booking.status, color: 'bg-gray-100 text-gray-800' };
                    return (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{booking.user?.name || 'Usuário'}</p>
                            <p className="text-xs text-gray-500">{booking.user?.email}</p>
                          </div>
                        </td>
                        <td className="py-3">{COURT_TYPES[booking.courtType]}</td>
                        <td className="py-3">{formatDate(booking.date)}</td>
                        <td className="py-3">{booking.startTime} - {booking.endTime}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="py-3">
                          {booking.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleCancel(booking.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs hover:bg-red-100"
                            >
                              <MdCancel /> Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Mostrando {bookings.length} de {pagination.total} agendamentos
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchBookings(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1">
                    {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchBookings(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
