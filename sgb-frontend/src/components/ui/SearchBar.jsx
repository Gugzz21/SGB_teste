import { useState, useEffect, useRef } from 'react'

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  debounce = 300,
  className = '',
}) {
  const [local, setLocal] = useState(value || '')
  const timerRef = useRef(null)

  // Sync external value changes
  useEffect(() => {
    setLocal(value || '')
  }, [value])

  const handleChange = (e) => {
    const val = e.target.value
    setLocal(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onChange(val)
    }, debounce)
  }

  const handleClear = () => {
    setLocal('')
    clearTimeout(timerRef.current)
    onChange('')
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Search icon */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>

      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 transition-all duration-200"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)'
          e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.15)'
          e.target.style.background = 'rgba(255, 255, 255, 0.08)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
          e.target.style.boxShadow = 'none'
          e.target.style.background = 'rgba(255, 255, 255, 0.05)'
        }}
      />

      {/* Clear button */}
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-500 hover:text-white rounded-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
