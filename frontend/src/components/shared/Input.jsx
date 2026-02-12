export default function Input({ label, name, register, errors, type = 'text', placeholder, icon: Icon, ...rest }) {
  const error = errors?.[name];
  return (
    <div className="mb-4">
      {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />}
        {type === 'textarea' ? (
          <textarea
            id={name}
            placeholder={placeholder}
            className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none ${error ? 'border-red-500' : 'border-gray-300'}`}
            rows={4}
            {...(register ? register(name) : {})}
            {...rest}
          />
        ) : (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            className={`w-full px-4 py-3 ${Icon ? 'pl-10' : ''} border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none ${error ? 'border-red-500' : 'border-gray-300'}`}
            {...(register ? register(name) : {})}
            {...rest}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
