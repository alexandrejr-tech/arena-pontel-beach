import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdLock } from 'react-icons/md';
import * as authService from '../../services/authService';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    } catch {
      toast.error('Token inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <p className="text-gray-600 mb-6">Crie sua nova senha.</p>
      <Input label="Nova senha" name="password" type="password" icon={MdLock} placeholder="Mínimo 6 caracteres"
        register={(n) => register(n, { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} errors={errors} />
      <Input label="Confirmar senha" name="confirmPassword" type="password" icon={MdLock} placeholder="Repita a senha"
        register={(n) => register(n, { required: 'Confirme a senha', validate: (v) => v === password || 'Senhas não conferem' })} errors={errors} />
      <Button type="submit" loading={loading} fullWidth size="lg">Redefinir senha</Button>
    </form>
  );
}
