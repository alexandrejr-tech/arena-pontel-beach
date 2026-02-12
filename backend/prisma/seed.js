const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@arenapontelbeach.com.br' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@arenapontelbeach.com.br',
      password: adminPassword,
      cpf: '00000000000',
      phone: '19999999999',
      role: 'ADMIN',
    },
  });
  console.log('Admin user created');

  // Plans - Futevôlei
  const futevoleiPlans = [
    { name: 'Mensal Futevôlei 1x/semana', description: 'Plano mensal futevôlei 1x na semana', price: 209.99, duration: 30, benefits: ['Futevôlei', '1x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Mensal Futevôlei 2x/semana', description: 'Plano mensal futevôlei 2x na semana', price: 299.99, duration: 30, benefits: ['Futevôlei', '2x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Mensal Futevôlei 3x/semana', description: 'Plano mensal futevôlei 3x na semana', price: 399.99, duration: 30, benefits: ['Futevôlei', '3x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Trimestral Futevôlei 1x/semana', description: 'Plano trimestral futevôlei 1x na semana', price: 63.33, duration: 90, benefits: ['Futevôlei', '1x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Trimestral Futevôlei 2x/semana', description: 'Plano trimestral futevôlei 2x na semana', price: 269.99, duration: 90, benefits: ['Futevôlei', '2x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Trimestral Futevôlei 3x/semana', description: 'Plano trimestral futevôlei 3x na semana', price: 359.99, duration: 90, benefits: ['Futevôlei', '3x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Semestral Futevôlei 1x/semana', description: 'Plano semestral futevôlei 1x na semana', price: 169.99, duration: 180, benefits: ['Futevôlei', '1x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Semestral Futevôlei 2x/semana', description: 'Plano semestral futevôlei 2x na semana', price: 239.99, duration: 180, benefits: ['Futevôlei', '2x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Semestral Futevôlei 3x/semana', description: 'Plano semestral futevôlei 3x na semana', price: 319.99, duration: 180, benefits: ['Futevôlei', '3x por semana', 'Acesso ao espaço', 'Vestiário'] },
  ];

  // Plans - Beach Tênis
  const beachTenisPlans = [
    { name: 'Mensal Beach Tênis 1x/semana', description: 'Plano mensal beach tênis 1x na semana', price: 239.99, duration: 30, benefits: ['Beach Tênis', '1x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Mensal Beach Tênis 2x/semana', description: 'Plano mensal beach tênis 2x na semana', price: 369.99, duration: 30, benefits: ['Beach Tênis', '2x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Mensal Beach Tênis 3x/semana', description: 'Plano mensal beach tênis 3x na semana', price: 529.99, duration: 30, benefits: ['Beach Tênis', '3x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Trimestral Beach Tênis 1x/semana', description: 'Plano trimestral beach tênis 1x na semana', price: 209.99, duration: 90, benefits: ['Beach Tênis', '1x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Trimestral Beach Tênis 2x/semana', description: 'Plano trimestral beach tênis 2x na semana', price: 309.99, duration: 90, benefits: ['Beach Tênis', '2x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Trimestral Beach Tênis 3x/semana', description: 'Plano trimestral beach tênis 3x na semana', price: 439.99, duration: 90, benefits: ['Beach Tênis', '3x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Semestral Beach Tênis 1x/semana', description: 'Plano semestral beach tênis 1x na semana', price: 179.99, duration: 180, benefits: ['Beach Tênis', '1x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Semestral Beach Tênis 2x/semana', description: 'Plano semestral beach tênis 2x na semana', price: 339.99, duration: 180, benefits: ['Beach Tênis', '2x por semana', 'Acesso ao espaço', 'Vestiário'] },
    { name: 'Semestral Beach Tênis 3x/semana', description: 'Plano semestral beach tênis 3x na semana', price: 389.99, duration: 180, benefits: ['Beach Tênis', '3x por semana', 'Acesso ao espaço', 'Vestiário'] },
  ];

  // Plans - Locação de Quadras
  const locacaoPlans = [
    { name: 'Locação Quadra 1h', description: 'Locação avulsa de quadra por 1 hora', price: 129.99, duration: 1, benefits: ['1 hora de quadra', 'Qualquer modalidade'] },
    { name: 'Locação Quadra 1h30', description: 'Locação avulsa de quadra por 1h30', price: 199.99, duration: 1, benefits: ['1h30 de quadra', 'Qualquer modalidade'] },
    { name: 'Locação Quadra Mensal 1h', description: 'Locação mensal de quadra por 1 hora', price: 519.99, duration: 30, benefits: ['1 hora por sessão', 'Reserva fixa mensal'] },
    { name: 'Locação Quadra Mensal 1h30', description: 'Locação mensal de quadra por 1h30', price: 759.99, duration: 30, benefits: ['1h30 por sessão', 'Reserva fixa mensal'] },
  ];

  // Plans - Personal William Trajano
  const personalPlans = [
    { name: 'Personal Individual Avulso - Trajano', description: 'Aula avulsa individual com Prof. William Trajano', price: 140.00, duration: 1, benefits: ['Aula individual', 'Prof. William Trajano'] },
    { name: 'Personal Individual Performance - Trajano', description: 'Pacote performance básico individual com Prof. William Trajano', price: 480.00, duration: 30, benefits: ['Aula individual', 'Pacote performance', 'Prof. William Trajano'] },
    { name: 'Personal Individual Elite - Trajano', description: 'Pacote elite/competição individual com Prof. William Trajano', price: 700.00, duration: 30, benefits: ['Aula individual', 'Pacote elite/competição', 'Prof. William Trajano'] },
    { name: 'Personal Dupla Avulso - Trajano', description: 'Aula avulsa em dupla com Prof. William Trajano', price: 180.00, duration: 1, benefits: ['Aula em dupla', 'Prof. William Trajano'] },
    { name: 'Personal Dupla Performance - Trajano', description: 'Pacote performance básico em dupla com Prof. William Trajano', price: 550.00, duration: 30, benefits: ['Aula em dupla', 'Pacote performance', 'Prof. William Trajano'] },
    { name: 'Personal Dupla Elite - Trajano', description: 'Pacote elite/competição em dupla com Prof. William Trajano', price: 900.00, duration: 30, benefits: ['Aula em dupla', 'Pacote elite/competição', 'Prof. William Trajano'] },
  ];

  const allPlans = [...futevoleiPlans, ...beachTenisPlans, ...locacaoPlans, ...personalPlans];

  for (const plan of allPlans) {
    await prisma.plan.create({ data: plan });
  }
  console.log(`${allPlans.length} plans created`);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
