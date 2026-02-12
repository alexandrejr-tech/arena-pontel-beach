import { MdCalendarToday, MdCardMembership, MdTimer, MdSportsScore } from 'react-icons/md';
import { motion } from 'framer-motion';

const icons = [
  { icon: MdCalendarToday, color: 'bg-blue-100 text-blue-600' },
  { icon: MdCardMembership, color: 'bg-green-100 text-green-600' },
  { icon: MdTimer, color: 'bg-orange-100 text-orange-600' },
  { icon: MdSportsScore, color: 'bg-purple-100 text-purple-600' },
];

export default function DashboardCards({ data = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((card, i) => {
        const { icon: Icon, color } = icons[i] || icons[0];
        return (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}><Icon className="text-2xl" /></div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
