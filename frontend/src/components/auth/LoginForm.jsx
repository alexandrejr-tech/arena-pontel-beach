import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdEmail, MdLock } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Bem-vindo, ${user.name}!`);
      navigate(location.state?.from || (user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <Input label="Email" name="email" type="email" icon={MdEmail} placeholder="seu@email.com"
        register={(n) => register(n, { required: 'Email é obrigatório' })} errors={errors} />
      <Input label="Senha" name="password" type="password" icon={MdLock} placeholder="Sua senha"
        register={(n) => register(n, { required: 'Senha é obrigatória' })} errors={errors} />

      <div className="flex items-center justify-between text-sm mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
          <span className="text-gray-600">Lembrar-me</span>
        </label>
        <Link to="/esqueci-senha" className="text-primary hover:underline">Esqueci minha senha</Link>
      </div>

      <Button type="submit" loading={loading} fullWidth size="lg">Entrar</Button>

      <p className="text-center text-sm text-gray-600 mt-6">
        Não tem conta? <Link to="/cadastro" className="text-primary font-semibold hover:underline">Cadastre-se</Link>
      </p>
    </form>
  );
}
