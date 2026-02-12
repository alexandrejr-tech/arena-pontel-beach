export const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('pt-BR');

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('pt-BR');

export const formatCPF = (cpf) => {
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone) => {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export const truncateText = (text, maxLength = 100) =>
  text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
