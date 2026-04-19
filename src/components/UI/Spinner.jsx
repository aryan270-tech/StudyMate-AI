// src/components/UI/Spinner.jsx
export default function Spinner({ size = 'md', className = '' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7'
  return (
    <div className={`${s} border-2 border-acid border-t-transparent rounded-full animate-spin ${className}`} />
  )
}
