import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { validateCPF } from '../../utils/validators';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  const getPasswordStrength = () => {
    if (!password) return { width: '0%', color: 'bg-gray-200', label: '' };
    if (password.length < 6) return { width: '33%', color: 'bg-red-500', label: 'Fraca' };
    if (password.length < 10) return { width: '66%', color: 'bg-yellow-500', label: 'Média' };
    return { width: '100%', color: 'bg-green-500', label: 'Forte' };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authRegister({ name: data.name, email: data.email, password: data.password, cpf: data.cpf, phone: data.phone });
      toast.success('Conta criada com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <Input label="Nome completo" name="name" placeholder="Seu nome"
        register={(n) => register(n, { required: 'Nome é obrigatório' })} errors={errors} />
      <Input label="Email" name="email" type="email" placeholder="seu@email.com"
        register={(n) => register(n, { required: 'Email é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } })} errors={errors} />
      <Input label="CPF" name="cpf" placeholder="000.000.000-00"
        register={(n) => register(n, { required: 'CPF é obrigatório', validate: (v) => validateCPF(v) || 'CPF inválido' })} errors={errors} />
      <Input label="Telefone" name="phone" placeholder="(19) 99999-9999"
        register={(n) => register(n)} errors={errors} />
      <Input label="Senha" name="password" type="password" placeholder="Mínimo 6 caracteres"
        register={(n) => register(n, { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} errors={errors} />

      {password && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Força: {strength.label}</p>
        </div>
      )}

      <Input label="Confirmar senha" name="confirmPassword" type="password" placeholder="Repita a senha"
        register={(n) => register(n, { required: 'Confirme a senha', validate: (v) => v === password || 'Senhas não conferem' })} errors={errors} />

      <Button type="submit" loading={loading} fullWidth size="lg">Criar conta</Button>

      <p className="text-center text-sm text-gray-600 mt-6">
        Já tem conta? <Link to="/login" className="text-primary font-semibold hover:underline">Faça login</Link>
      </p>
    </form>
  );
}
