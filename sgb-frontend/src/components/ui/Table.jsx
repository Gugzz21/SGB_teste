import Spinner from './Spinner'

export default function Table({
  columns = [],
  data = [],
  loading = false,
  pagination,
  keyField = 'id',
  emptyMessage = 'Nenhum registro encontrado',
}) {
  // ── Loading skeleton ──────────────────────────────────────
  if (loading) {
    return (
      <div className="table-container">
        <table className="w-full min-w-max">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-header">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-white/[0.03]">
                {columns.map((col) => (
                  <td key={col.key} className="table-cell">
                    <div className="skeleton h-4 rounded-md" style={{ width: `${60 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // ── Empty state ───────────────────────────────────────────
  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <table className="w-full min-w-max">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-header">{col.label}</th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px dashed rgba(139, 92, 246, 0.3)' }}>
            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">{emptyMessage}</p>
          <p className="text-slate-600 text-sm mt-1">Tente ajustar os filtros de busca</p>
        </div>
      </div>
    )
  }

  // ── Main table ────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="table-container overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-header whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={row[keyField] ?? rowIdx} className="table-row group">
                {columns.map((col) => (
                  <td key={col.key} className="table-cell whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-slate-500">
            Mostrando{' '}
            <span className="text-slate-300 font-medium">
              {(pagination.page - 1) * pagination.limit + 1}–
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            de <span className="text-slate-300 font-medium">{pagination.total}</span> registros
          </p>

          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={() => pagination.onChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
              let page = i + 1
              if (pagination.totalPages > 5) {
                if (pagination.page <= 3) {
                  page = i + 1
                } else if (pagination.page >= pagination.totalPages - 2) {
                  page = pagination.totalPages - 4 + i
                } else {
                  page = pagination.page - 2 + i
                }
              }
              return (
                <button
                  key={page}
                  onClick={() => pagination.onChange(page)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    page === pagination.page
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                  style={page === pagination.page ? {
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))',
                    border: '1px solid rgba(139,92,246,0.4)',
                  } : {}}
                >
                  {page}
                </button>
              )
            })}

            {/* Next */}
            <button
              onClick={() => pagination.onChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
