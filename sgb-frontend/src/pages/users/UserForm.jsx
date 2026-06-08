import { useState, useEffect } from 'react'
import { usersAPI } from '../../api/client'
import Spinner from '../../components/ui/Spinner'

const EMPTY_FORM = {
  nome: '',
  email: '',
  senha: '',
  tipo: 'LEITOR',
  bairro: '',
  grupoSocial: '',
}

export default function UserForm({ initial, onSuccess, onCancel }) {
  const [form, setForm]       = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [toast, setToast]     = useState('')
  const [showPwd, setShowPwd] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        nome:        initial.nome        || '',
        email:       initial.email       || '',
        senha:       '',
        tipo:        initial.tipo        || 'LEITOR',
        bairro:      initial.bairro      || '',
        grupoSocial: initial.grupoSocial || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
    setError('')
  }, [initial])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const validate = () => {
    if (!form.nome.trim()) return 'O nome é obrigatório.'
    if (!form.email.trim()) return 'O email é obrigatório.'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Email inválido.'
    if (!initial && !form.senha) return 'A senha é obrigatória para novos usuários.'
    if (form.senha && form.senha.length < 6) return 'A senha deve ter pelo menos 6 caracteres.'
    if (!form.tipo) return 'O tipo é obrigatório.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    setError('')

    const payload = {
      nome:        form.nome.trim(),
      email:       form.email.trim().toLowerCase(),
      tipo:        form.tipo,
      bairro:      form.bairro.trim() || undefined,
      grupoSocial: form.grupoSocial.trim() || undefined,
    }
    if (form.senha) payload.senha = form.senha

    try {
      if (initial?.id) {
        await usersAPI.update(initial.id, payload)
        setToast('Usuário atualizado com sucesso!')
      } else {
        await usersAPI.create(payload)
        setToast('Usuário criado com sucesso!')
      }
      setTimeout(() => { setToast(''); onSuccess?.() }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar usuário.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {toast && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-emerald-400"
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

      {/* Nome */}
      <div>
        <label className="form-label">Nome Completo <span className="text-rose-400">*</span></label>
        <input name="nome" value={form.nome} onChange={handleChange}
          className="input-field" placeholder="Ex: Ana Maria Silva" required />
      </div>

      {/* Email */}
      <div>
        <label className="form-label">Email <span className="text-rose-400">*</span></label>
        <input name="email" type="email" value={form.email} onChange={handleChange}
          className="input-field" placeholder="Ex: ana@email.com" required />
      </div>

      {/* Senha */}
      <div>
        <label className="form-label">
          {initial ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}{!initial && <span className="text-rose-400"> *</span>}
        </label>
        <div className="relative">
          <input
            name="senha"
            type={showPwd ? 'text' : 'password'}
            value={form.senha}
            onChange={handleChange}
            className="input-field pr-11"
            placeholder="••••••••"
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {showPwd
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Tipo */}
      <div>
        <label className="form-label">Tipo de Usuário <span className="text-rose-400">*</span></label>
        <div className="grid grid-cols-2 gap-3">
          {['LEITOR', 'BIBLIOTECARIO'].map(tipo => (
            <label key={tipo}
              className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                form.tipo === tipo
                  ? 'border-violet-500/60 bg-violet-500/10 text-white'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20'
              }`}>
              <input
                type="radio"
                name="tipo"
                value={tipo}
                checked={form.tipo === tipo}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                form.tipo === tipo ? 'border-violet-500' : 'border-slate-600'
              }`}>
                {form.tipo === tipo && <div className="w-2 h-2 rounded-full bg-violet-500" />}
              </div>
              <span className="text-sm font-medium">
                {tipo === 'LEITOR' ? 'Leitor' : 'Bibliotecário'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bairro */}
      <div>
        <label className="form-label">Bairro</label>
        <input name="bairro" value={form.bairro} onChange={handleChange}
          className="input-field" placeholder="Ex: Vila Nova, Centro..." />
      </div>

      {/* Grupo Social */}
      <div>
        <label className="form-label">
          Grupo Social
          <span className="text-xs text-slate-500 font-normal ml-2">(opcional, para fins de inclusão)</span>
        </label>
        <input
          name="grupoSocial"
          value={form.grupoSocial}
          onChange={handleChange}
          className="input-field"
          placeholder="ex: Comunidade Quilombola, Povos Indígenas, Movimento Sem Terra"
        />
        <p className="text-xs text-slate-600 mt-1.5">
          ℹ️ Este campo é opcional e usado apenas para fins de análise de inclusão social da biblioteca.
        </p>
      </div>

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
            initial ? 'Salvar Alterações' : 'Criar Usuário'
          )}
        </button>
      </div>
    </form>
  )
}
