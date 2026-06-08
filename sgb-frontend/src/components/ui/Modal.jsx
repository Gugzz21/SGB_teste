import { useEffect, useCallback } from 'react'

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  onConfirm,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'primary',
  loading = false,
  hideFooter = false,
}) {
  const maxW = SIZE_CLASSES[size] || SIZE_CLASSES.md

  // Close on Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && !loading) onClose()
  }, [onClose, loading])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  const confirmClass = {
    primary: 'btn-primary',
    danger: 'btn-danger',
    success: 'btn-success',
  }[confirmVariant] || 'btn-primary'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => !loading && onClose()}
      />

      {/* Modal */}
      <div className={`relative w-full ${maxW} animate-slideIn`}
        style={{
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1.5rem',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)',
        }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button
            onClick={() => !loading && onClose()}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[calc(90vh-10rem)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {!hideFooter && (
          <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
            {footer ?? (
              <>
                <button onClick={() => !loading && onClose()} className="btn-secondary" disabled={loading}>
                  {cancelLabel}
                </button>
                {onConfirm && (
                  <button onClick={onConfirm} className={confirmClass} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Processando...
                      </span>
                    ) : confirmLabel}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
