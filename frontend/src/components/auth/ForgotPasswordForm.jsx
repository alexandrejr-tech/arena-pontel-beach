import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdEmail, MdCheckCircle } from 'react-icons/md';
import * as authService from '../../services/authService';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error('Erro ao processar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <MdCheckCircle className="text-green-500 text-6xl mx-auto" />
        <h3 className="text-xl font-heading font-bold">Email enviado!</h3>
        <p className="text-gray-600">Verifique sua caixa de entrada para redefinir sua senha.</p>
        <Link to="/login" className="text-primary font-semibold hover:underline block mt-4">Voltar ao login</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      <p className="text-gray-600 mb-6">Informe seu email para receber o link de recuperação.</p>
      <Input label="Email" name="email" type="email" icon={MdEmail} placeholder="seu@email.com"
        register={(n) => register(n, { required: 'Email é obrigatório' })} errors={errors} />
      <Button type="submit" loading={loading} fullWidth size="lg">Enviar link de recuperação</Button>
      <p className="text-center text-sm text-gray-600 mt-4">
        <Link to="/login" className="text-primary hover:underline">Voltar ao login</Link>
      </p>
    </form>
  );
}
