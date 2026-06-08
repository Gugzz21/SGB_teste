const STATUS_MAP = {
  // Book statuses
  DISPONIVEL:      { label: 'Disponível',   classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  EMPRESTADO:      { label: 'Emprestado',   classes: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  RESERVADO:       { label: 'Reservado',    classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25' },
  MANUTENCAO:      { label: 'Manutenção',   classes: 'bg-slate-500/15 text-slate-400 border-slate-500/25' },
  // Loan statuses
  ATIVO:           { label: 'Ativo',        classes: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  DEVOLVIDO:       { label: 'Devolvido',    classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  ATRASADO:        { label: 'Atrasado',     classes: 'bg-rose-500/15 text-rose-400 border-rose-500/25' },
  // Fine statuses
  PENDENTE:        { label: 'Pendente',     classes: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  PAGA:            { label: 'Paga',         classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  // Reservation statuses
  CANCELADA:       { label: 'Cancelada',    classes: 'bg-slate-500/15 text-slate-400 border-slate-500/25' },
  ATENDIDA:        { label: 'Atendida',     classes: 'bg-teal-500/15 text-teal-400 border-teal-500/25' },
  // User types
  LEITOR:          { label: 'Leitor',       classes: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
  BIBLIOTECARIO:   { label: 'Bibliotecário', classes: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25' },
  // Generic
  ATIVO_USER:      { label: 'Ativo',        classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  INATIVO:         { label: 'Inativo',      classes: 'bg-slate-500/15 text-slate-400 border-slate-500/25' },
  // Tags
  'Literatura Indígena':          { label: 'Literatura Indígena',         classes: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  'Autores Afro-brasileiros':     { label: 'Autores Afro-brasileiros',    classes: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  'Pensamento Latino-americano':  { label: 'Pensamento Latino-americano', classes: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
  'Feminismo Decolonial':         { label: 'Feminismo Decolonial',        classes: 'bg-pink-500/15 text-pink-400 border-pink-500/25' },
  'Saberes Populares':            { label: 'Saberes Populares',           classes: 'bg-lime-500/15 text-lime-400 border-lime-500/25' },
  'Quilombola':                   { label: 'Quilombola',                  classes: 'bg-red-500/15 text-red-400 border-red-500/25' },
  'Periférico':                   { label: 'Periférico',                  classes: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
}

export default function Badge({ status, label: labelOverride, size = 'sm' }) {
  const config = STATUS_MAP[status] || {
    label: status || '—',
    classes: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  }

  const sizeClass = size === 'xs'
    ? 'px-1.5 py-0.5 text-xs'
    : 'px-2.5 py-0.5 text-xs'

  return (
    <span className={`inline-flex items-center font-medium rounded-lg border ${sizeClass} ${config.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
        style={{ background: 'currentColor', opacity: 0.7 }}
      />
      {labelOverride ?? config.label}
    </span>
  )
}
