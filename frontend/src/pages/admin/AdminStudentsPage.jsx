import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { MdSearch, MdAdd, MdEdit, MdDelete, MdCardMembership } from 'react-icons/md';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import Input from '../../components/shared/Input';
import { formatCPF, formatPhone } from '../../utils/formatters';
import * as userService from '../../services/userService';
import * as planService from '../../services/planService';

export default function AdminStudentsPage() {
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: errorsEdit } } = useForm();

  const fetchUsers = (page = 1) => {
    setLoading(true);
    const params = { page, limit: 20 };
    if (search) params.search = search;

    userService.getAllUsers(params)
      .then((res) => {
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchPlans = () => {
    planService.getAll()
      .then((res) => setPlans(res.data.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  // Create user
  const openCreate = () => {
    reset({ name: '', email: '', cpf: '', phone: '', password: '' });
    setShowCreateModal(true);
  };

  const onSubmitCreate = async (data) => {
    setSaving(true);
    try {
      await userService.createUser(data);
      toast.success('Aluno cadastrado com sucesso!');
      setShowCreateModal(false);
      fetchUsers(1);
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao cadastrar aluno.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Edit user
  const openEdit = (user) => {
    setSelectedUser(user);
    resetEdit({ name: user.name, email: user.email, cpf: user.cpf, phone: user.phone || '', password: '' });
    setShowEditModal(true);
  };

  const onSubmitEdit = async (data) => {
    setSaving(true);
    try {
      const payload = { ...data };
      if (!payload.password) delete payload.password;
      await userService.updateUser(selectedUser.id, payload);
      toast.success('Aluno atualizado com sucesso!');
      setShowEditModal(false);
      fetchUsers(pagination.page);
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao atualizar aluno.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Delete user
  const handleDelete = async (user) => {
    if (!window.confirm(`Tem certeza que deseja excluir ${user.name}? Esta ação não pode ser desfeita.`)) return;
    try {
      await userService.deleteUser(user.id);
      toast.success('Aluno excluído com sucesso!');
      fetchUsers(pagination.page);
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao excluir aluno.';
      toast.error(message);
    }
  };

  // Plan management
  const openPlanModal = (user) => {
    setSelectedUser(user);
    setSelectedPlanId(user.subscription?.planId || '');
    setShowPlanModal(true);
  };

  const handleAssignPlan = async () => {
    if (!selectedPlanId) {
      toast.error('Selecione um plano.');
      return;
    }
    setSaving(true);
    try {
      await userService.assignPlan(selectedUser.id, selectedPlanId);
      toast.success('Plano atribuído com sucesso!');
      setShowPlanModal(false);
      fetchUsers(pagination.page);
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao atribuir plano.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePlan = async () => {
    if (!window.confirm('Tem certeza que deseja remover o plano deste aluno?')) return;
    setSaving(true);
    try {
      await userService.removePlan(selectedUser.id);
      toast.success('Plano removido com sucesso!');
      setShowPlanModal(false);
      fetchUsers(pagination.page);
    } catch (err) {
      const message = err.response?.data?.error || 'Erro ao remover plano.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <AdminLayout title="Gerenciar Alunos">
      <Helmet><title>Alunos | Admin Arena Pontel Beach</title></Helmet>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex items-center gap-4 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou CPF..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              Buscar
            </button>
          </form>
          <Button onClick={openCreate} className="flex items-center gap-2">
            <MdAdd className="text-xl" /> Novo Aluno
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-400 py-12">Nenhum aluno encontrado</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Nome</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">CPF</th>
                    <th className="pb-3 font-medium">Telefone</th>
                    <th className="pb-3 font-medium">Plano</th>
                    <th className="pb-3 font-medium">Cadastro</th>
                    <th className="pb-3 font-medium text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{user.name}</td>
                      <td className="py-3 text-gray-600">{user.email}</td>
                      <td className="py-3 text-gray-600">{formatCPF(user.cpf)}</td>
                      <td className="py-3 text-gray-600">{user.phone ? formatPhone(user.phone) : '-'}</td>
                      <td className="py-3">
                        {user.subscription?.plan?.name ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {user.subscription.plan.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">Sem plano</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-500">{formatDate(user.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEdit(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <MdEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => openPlanModal(user)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Gerenciar Plano"
                          >
                            <MdCardMembership className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Mostrando {users.length} de {pagination.total} alunos
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchUsers(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1">
                    {pagination.page} / {pagination.pages}
                  </span>
                  <button
                    onClick={() => fetchUsers(pagination.page + 1)}
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

      {/* Modal: Novo Aluno */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Novo Aluno">
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <Input
            label="Nome completo"
            name="name"
            register={(n) => register(n, { required: 'Nome é obrigatório' })}
            errors={errors}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={(n) => register(n, {
              required: 'Email é obrigatório',
              pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
            })}
            errors={errors}
          />
          <Input
            label="CPF"
            name="cpf"
            register={(n) => register(n, { required: 'CPF é obrigatório' })}
            errors={errors}
            placeholder="00000000000"
          />
          <Input
            label="Telefone"
            name="phone"
            register={(n) => register(n)}
            errors={errors}
            placeholder="(19) 99999-9999"
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            register={(n) => register(n, {
              required: 'Senha é obrigatória',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' }
            })}
            errors={errors}
          />
          <Button type="submit" loading={saving} fullWidth>
            Cadastrar Aluno
          </Button>
        </form>
      </Modal>

      {/* Modal: Editar Aluno */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Aluno">
        <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="space-y-4">
          <Input
            label="Nome completo"
            name="name"
            register={(n) => registerEdit(n, { required: 'Nome é obrigatório' })}
            errors={errorsEdit}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            register={(n) => registerEdit(n, {
              required: 'Email é obrigatório',
              pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
            })}
            errors={errorsEdit}
          />
          <Input
            label="CPF"
            name="cpf"
            register={(n) => registerEdit(n, { required: 'CPF é obrigatório' })}
            errors={errorsEdit}
          />
          <Input
            label="Telefone"
            name="phone"
            register={(n) => registerEdit(n)}
            errors={errorsEdit}
          />
          <Input
            label="Nova Senha (deixe em branco para manter)"
            name="password"
            type="password"
            register={(n) => registerEdit(n, {
              minLength: { value: 6, message: 'Mínimo 6 caracteres' }
            })}
            errors={errorsEdit}
          />
          <Button type="submit" loading={saving} fullWidth>
            Salvar Alterações
          </Button>
        </form>
      </Modal>

      {/* Modal: Gerenciar Plano */}
      <Modal isOpen={showPlanModal} onClose={() => setShowPlanModal(false)} title="Gerenciar Plano">
        <div className="space-y-4">
          <p className="text-gray-600">
            Aluno: <strong>{selectedUser?.name}</strong>
          </p>

          {selectedUser?.subscription?.plan?.name && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Plano atual: <strong>{selectedUser.subscription.plan.name}</strong>
              </p>
              <p className="text-xs text-green-600 mt-1">
                Válido até: {formatDate(selectedUser.subscription.endDate)}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecionar Plano
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">Selecione um plano...</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - R$ {plan.price.toFixed(2)} ({plan.duration} dias)
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleAssignPlan} loading={saving} fullWidth>
              {selectedUser?.subscription ? 'Trocar Plano' : 'Atribuir Plano'}
            </Button>
            {selectedUser?.subscription && (
              <Button onClick={handleRemovePlan} variant="outline" loading={saving} className="border-red-300 text-red-600 hover:bg-red-50">
                Remover
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
