import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { MdEdit, MdDelete } from 'react-icons/md';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import Input from '../../components/shared/Input';
import { formatCurrency } from '../../utils/formatters';
import * as planService from '../../services/planService';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchPlans = () => {
    setLoading(true);
    planService.getAll()
      .then((res) => setPlans(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, []);

  const openNew = () => { setEditing(null); reset({ name: '', description: '', price: '', duration: 30, benefits: '' }); setShowModal(true); };
  const openEdit = (plan) => { setEditing(plan); reset({ ...plan, benefits: plan.benefits?.join(', ') }); setShowModal(true); };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = { ...data, price: parseFloat(data.price), duration: parseInt(data.duration), benefits: data.benefits.split(',').map((b) => b.trim()).filter(Boolean) };
      if (editing) { await planService.update(editing.id, payload); toast.success('Plano atualizado!'); }
      else { await planService.create(payload); toast.success('Plano criado!'); }
      setShowModal(false);
      fetchPlans();
    } catch { toast.error('Erro ao salvar plano.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza?')) return;
    try { await planService.remove(id); toast.success('Plano removido!'); fetchPlans(); }
    catch { toast.error('Erro ao remover plano.'); }
  };

  return (
    <AdminLayout title="Gerenciar Planos">
      <Helmet><title>Planos | Admin Arena Pontel Beach</title></Helmet>

      <div className="flex justify-end mb-6">
        <Button onClick={openNew}>Novo Plano</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-heading font-bold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold text-primary mb-2">{formatCurrency(plan.price)}<span className="text-sm text-gray-500 font-normal">/mês</span></p>
            <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
            <div className="flex gap-2">
              <button onClick={() => openEdit(plan)} className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"><MdEdit /> Editar</button>
              <button onClick={() => handleDelete(plan.id)} className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100"><MdDelete /> Excluir</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar Plano' : 'Novo Plano'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
          <Input label="Nome" name="name" register={(n) => register(n, { required: 'Obrigatório' })} errors={errors} />
          <Input label="Descrição" name="description" type="textarea" register={(n) => register(n, { required: 'Obrigatório' })} errors={errors} />
          <Input label="Preço (R$)" name="price" type="number" register={(n) => register(n, { required: 'Obrigatório' })} errors={errors} />
          <Input label="Duração (dias)" name="duration" type="number" register={(n) => register(n, { required: 'Obrigatório' })} errors={errors} />
          <Input label="Benefícios (separados por vírgula)" name="benefits" register={(n) => register(n)} errors={errors} placeholder="Ex: 2x por semana, 1 modalidade" />
          <Button type="submit" loading={saving} fullWidth>{editing ? 'Salvar alterações' : 'Criar plano'}</Button>
        </form>
      </Modal>
    </AdminLayout>
  );
}
