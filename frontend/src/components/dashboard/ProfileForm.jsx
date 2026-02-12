import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { MdCameraAlt } from 'react-icons/md';
import Button from '../shared/Button';
import Input from '../shared/Input';
import * as userService from '../../services/userService';

export default function ProfileForm({ profile, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(profile?.avatar);
  const fileRef = useRef();
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { name: profile?.name, phone: profile?.phone } });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await userService.updateProfile(data);
      toast.success('Perfil atualizado!');
      onUpdate?.(res.data.data);
    } catch {
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await userService.uploadAvatar(formData);
      setAvatar(res.data.data.avatar);
      toast.success('Foto atualizada!');
    } catch {
      toast.error('Erro ao enviar foto.');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
            {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full object-cover" /> : profile?.name?.charAt(0).toUpperCase()}
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow">
            <MdCameraAlt />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="font-semibold">{profile?.name}</p>
          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <Input label="Nome" name="name" register={(n) => register(n, { required: 'Nome é obrigatório' })} errors={errors} />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input value={profile?.email || ''} disabled className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
          <input value={profile?.cpf || ''} disabled className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
        </div>
        <Input label="Telefone" name="phone" register={(n) => register(n)} errors={errors} placeholder="(19) 99999-9999" />
        <Button type="submit" loading={loading}>Salvar alterações</Button>
      </form>
    </div>
  );
}
