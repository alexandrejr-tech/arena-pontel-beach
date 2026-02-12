export const COURT_TYPES = {
  FUTEVOLEI: 'Futevôlei',
  BEACH_TENNIS: 'Beach Tênis',
  LOCACAO: 'Locação de Quadra',
  EVENTO: 'Evento',
};

export const BOOKING_STATUS = {
  CONFIRMED: { label: 'Confirmado', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Concluído', color: 'bg-gray-100 text-gray-800' },
};

export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/quem-somos', label: 'Quem Somos' },
  { path: '/planos', label: 'Planos' },
  { path: '/agenda', label: 'Agenda' },
  { path: '/contato', label: 'Contato' },
];

export const DASHBOARD_LINKS = [
  { path: '/dashboard', label: 'Dashboard', icon: 'MdDashboard' },
  { path: '/meus-agendamentos', label: 'Meus Agendamentos', icon: 'MdCalendarToday' },
  { path: '/meu-plano', label: 'Meu Plano', icon: 'MdCardMembership' },
  { path: '/meu-perfil', label: 'Meu Perfil', icon: 'MdPerson' },
  { path: '/historico', label: 'Histórico', icon: 'MdHistory' },
];

export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/arenapontelbeach',
  whatsapp: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '5519999378998'}`,
};
