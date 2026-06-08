import { useState, useEffect } from 'react'
import { booksAPI } from '../../api/client'
import Spinner from '../../components/ui/Spinner'

const DECOLONIZED_TAGS = [
  'Literatura Indígena',
  'Autores Afro-brasileiros',
  'Pensamento Latino-americano',
  'Feminismo Decolonial',
  'Saberes Populares',
  'Quilombola',
  'Periférico',
]

const EMPTY_FORM = {
  titulo: '',
  isbn: '',
  anoPublicacao: '',
  autorId: '',
  generoId: '',
  isDecolonized: false,
  tags: [],
}

export default function BookForm({ initial, authors, genres, onSuccess, onCancel }) {
  const [form, setForm]       = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [toast, setToast]     = useState('')

  useEffect(() => {
    if (initial) {
      setForm({
        titulo:        initial.titulo        || '',
        isbn:          initial.isbn          || '',
        anoPublicacao: initial.anoPublicacao || '',
        autorId:       initial.autor?.id     || initial.autorId || '',
        generoId:      initial.genero?.id    || initial.generoId || '',
        isDecolonized: initial.isDecolonized || false,
        tags:          initial.tags          || [],
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError('')
  }, [initial])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'isDecolonized') {
      setForm(prev => ({ ...prev, isDecolonized: checked, tags: checked ? prev.tags : [] }))
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
    setError('')
  }

  const handleTagToggle = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const validate = () => {
    if (!form.titulo.trim())   return 'O título é obrigatório.'
    if (!form.autorId)         return 'Selecione um autor.'
    if (!form.generoId)        return 'Selecione um gênero.'
    if (form.anoPublicacao && (form.anoPublicacao < 1000 || form.anoPublicacao > new Date().getFullYear() + 1))
      return 'Ano de publicação inválido.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')

    const payload = {
      titulo:        form.titulo.trim(),
      isbn:          form.isbn.trim() || undefined,
      anoPublicacao: form.anoPublicacao ? Number(form.anoPublicacao) : undefined,
      autorId:       Number(form.autorId),
      generoId:      Number(form.generoId),
      isDecolonized: form.isDecolonized,
      tags:          form.isDecolonized ? form.tags : [],
    }

    try {
      if (initial?.id) {
        await booksAPI.update(initial.id, payload)
        setToast('Livro atualizado com sucesso!')
      } else {
        await booksAPI.create(payload)
        setToast('Livro criado com sucesso!')
      }
      setTimeout(() => { setToast(''); onSuccess?.() }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar livro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {toast && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-emerald-400 animate-fadeIn"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {toast}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-rose-400"
          style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Título */}
      <div>
        <label className="form-label">Título <span className="text-rose-400">*</span></label>
        <input name="titulo" value={form.titulo} onChange={handleChange}
          className="input-field" placeholder="Ex: Pedagogia do Oprimido" required />
      </div>

      {/* ISBN */}
      <div>
        <label className="form-label">ISBN</label>
        <input name="isbn" value={form.isbn} onChange={handleChange}
          className="input-field" placeholder="Ex: 978-85-7584-023-5" />
      </div>

      {/* Ano */}
      <div>
        <label className="form-label">Ano de Publicação</label>
        <input name="anoPublicacao" type="number" value={form.anoPublicacao} onChange={handleChange}
          className="input-field" placeholder="Ex: 1968" min="1000" max={new Date().getFullYear() + 1} />
      </div>

      {/* Autor + Gênero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Autor <span className="text-rose-400">*</span></label>
          <div className="relative">
            <select name="autorId" value={form.autorId} onChange={handleChange} className="select-field pr-8" required>
              <option value="">Selecionar autor...</option>
              {authors.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="form-label">Gênero <span className="text-rose-400">*</span></label>
          <div className="relative">
            <select name="generoId" value={form.generoId} onChange={handleChange} className="select-field pr-8" required>
              <option value="">Selecionar gênero...</option>
              {genres.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Decolonized toggle */}
      <div className="p-4 rounded-xl border border-white/[0.06]"
        style={{ background: 'rgba(139,92,246,0.05)' }}>
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              name="isDecolonized"
              checked={form.isDecolonized}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${form.isDecolonized ? 'bg-violet-600' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${form.isDecolonized ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Diversidade Cultural / Decolonial</p>
            <p className="text-xs text-slate-400 mt-0.5">Marque se este livro aborda temáticas de diversidade e saberes decoloniais</p>
          </div>
        </label>
      </div>

      {/* Tags (shown when isDecolonized) */}
      {form.isDecolonized && (
        <div className="animate-fadeIn">
          <label className="form-label">Tags de Diversidade</label>
          <p className="text-xs text-slate-500 mb-3">Selecione as categorias que melhor descrevem este livro</p>
          <div className="flex flex-wrap gap-2">
            {DECOLONIZED_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                  form.tags.includes(tag)
                    ? 'text-white border-violet-500/60 bg-violet-500/20'
                    : 'text-slate-400 border-white/10 bg-white/[0.03] hover:border-white/20 hover:text-slate-300'
                }`}
              >
                {form.tags.includes(tag) && '✓ '}{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.06]">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner size="xs" color="white" />
              Salvando...
            </span>
          ) : (
            initial ? 'Salvar Alterações' : 'Criar Livro'
          )}
        </button>
      </div>
    </form>
  )
}
