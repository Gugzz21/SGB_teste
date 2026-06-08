const SIZE_CLASSES = {
  xs:  'w-4 h-4 border-2',
  sm:  'w-6 h-6 border-2',
  md:  'w-8 h-8 border-[3px]',
  lg:  'w-12 h-12 border-4',
  xl:  'w-16 h-16 border-4',
}

export default function Spinner({ size = 'md', className = '', color = 'violet' }) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md

  const colorStyle = {
    violet: { borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6' },
    emerald: { borderColor: 'rgba(16,185,129,0.2)', borderTopColor: '#10b981' },
    white:   { borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#ffffff' },
    rose:    { borderColor: 'rgba(244,63,94,0.2)', borderTopColor: '#f43f5e' },
  }[color] || { borderColor: 'rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6' }

  return (
    <div
      className={`${sizeClass} rounded-full animate-spin ${className}`}
      style={{
        borderStyle: 'solid',
        ...colorStyle,
      }}
      role="status"
      aria-label="Carregando..."
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0f0f1a' }}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" />
        <p className="text-slate-400 text-sm animate-pulse">Carregando...</p>
      </div>
    </div>
  )
}
