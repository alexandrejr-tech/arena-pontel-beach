import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '../shared/Button';
import Input from '../shared/Input';
import * as userService from '../../services/userService';

export default function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const newPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await userService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Senha alterada com sucesso!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao alterar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-heading font-bold mb-4">Alterar Senha</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <Input label="Senha atual" name="currentPassword" type="password" placeholder="Sua senha atual"
          register={(n) => register(n, { required: 'Senha atual é obrigatória' })} errors={errors} />
        <Input label="Nova senha" name="newPassword" type="password" placeholder="Mínimo 6 caracteres"
          register={(n) => register(n, { required: 'Nova senha é obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} errors={errors} />
        <Input label="Confirmar nova senha" name="confirmPassword" type="password" placeholder="Repita a nova senha"
          register={(n) => register(n, { required: 'Confirme a nova senha', validate: (v) => v === newPassword || 'Senhas não conferem' })} errors={errors} />
        <Button type="submit" loading={loading}>Alterar senha</Button>
      </form>
    </div>
  );
}
