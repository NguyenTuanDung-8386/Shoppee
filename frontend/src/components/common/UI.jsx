export function Spinner({ size = 8 }) {
  return (
    <div className="flex justify-center items-center py-12">
      <div className={`w-${size} h-${size} border-4 border-shopee-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  )
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-gray-300 mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function PageTitle({ children }) {
  return <h1 className="text-xl font-bold text-gray-800 mb-4">{children}</h1>
}

export function Badge({ status }) {
  const map = {
    pending:    'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-600',
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
