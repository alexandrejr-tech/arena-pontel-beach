import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';
import { FaInstagram } from 'react-icons/fa';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import * as contactService from '../../services/contactService';
import Button from '../shared/Button';
import Input from '../shared/Input';

export default function ContactSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await contactService.send(data);
      toast.success('Mensagem enviada com sucesso!');
      reset();
    } catch {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-secondary" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="section-title">Entre em <span className="text-primary">Contato</span></h2>
          <p className="section-subtitle">Tire suas dúvidas ou envie uma mensagem</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.form initial={{ opacity: 0, x: -30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}
            onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-8 shadow-md space-y-1">
            <Input label="Nome" name="name" register={(n) => register(n, { required: 'Nome é obrigatório' })} errors={errors} placeholder="Seu nome completo" />
            <Input label="Email" name="email" type="email" register={(n) => register(n, { required: 'Email é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } })} errors={errors} placeholder="seu@email.com" />
            <Input label="Telefone" name="phone" register={(n) => register(n)} errors={errors} placeholder="(19) 99999-9999" />
            <Input label="Mensagem" name="message" type="textarea" register={(n) => register(n, { required: 'Mensagem é obrigatória' })} errors={errors} placeholder="Digite sua mensagem..." />
            <Button type="submit" loading={loading} fullWidth>Enviar mensagem</Button>
          </motion.form>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={isVisible ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }}
            className="space-y-8">
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3"><MdEmail className="text-primary text-xl" /><span className="text-gray-600">contato@arenapontelbeach.com.br</span></div>
                <div className="flex items-center gap-3"><MdPhone className="text-primary text-xl" /><span className="text-gray-600">(19) 99999-9999</span></div>
                <div className="flex items-center gap-3"><MdLocationOn className="text-primary text-xl" /><span className="text-gray-600">Campinas - SP</span></div>
                <a href="https://instagram.com/arenapontelbeach" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors">
                  <FaInstagram className="text-xl" /> @arenapontelbeach
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-bold text-xl mb-4">Horário de Atendimento</h3>
              <div className="space-y-2 text-gray-600 text-sm">
                <p>Segunda a Sexta: 6h às 22h</p>
                <p>Sábado: 7h às 20h</p>
                <p>Domingo: 7h às 18h</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
