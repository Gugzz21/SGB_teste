import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confSenha: '', bairro: '', grupo: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(form.senha !== form.confSenha) return alert("Senhas não conferem!")
    await register(form)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-sgb-vinho p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Cadastro Inclusivo</h2>
          <p className="text-rose-100 text-sm mt-1">Junte-se ao SGB e expanda seus horizontes.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="form-label">Nome Completo *</label>
              <input type="text" required value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="input-field" placeholder="Maria da Silva" />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Email *</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="maria@email.com" />
            </div>

            <div>
              <label className="form-label">Senha *</label>
              <input type="password" required value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} className="input-field" />
            </div>

            <div>
              <label className="form-label">Confirme a Senha *</label>
              <input type="password" required value={form.confSenha} onChange={e => setForm({...form, confSenha: e.target.value})} className="input-field" />
            </div>

            <div className="md:col-span-2">
              <label className="form-label">Bairro *</label>
              <select required value={form.bairro} onChange={e => setForm({...form, bairro: e.target.value})} className="input-field">
                <option value="">Selecione...</option>
                <option value="Centro">Centro</option>
                <option value="Liberdade">Liberdade</option>
                <option value="Periferia Norte">Periferia Norte</option>
                <option value="Zona Sul">Zona Sul</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="form-label text-sgb-rosa">Grupo Social / Identificação (Opcional)</label>
              <input type="text" value={form.grupo} onChange={e => setForm({...form, grupo: e.target.value})} className="input-field focus:ring-sgb-rosa" placeholder="Ex: Comunidade Quilombola, Povos Indígenas..." />
              <p className="text-xs text-slate-500 mt-1">Essencial para a inteligência demográfica, garantimos seu anonimato.</p>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn-primary w-full py-3">Concluir Cadastro</button>
          </div>

          <div className="text-center mt-4">
            <Link to="/login" className="text-slate-500 hover:text-sgb-vinho text-sm transition-colors">Já possui conta? Faça login</Link>
          </div>
        </form>

        <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            <span className="font-semibold text-sgb-vinho">🔒 Privacidade Garantida:</span> Seus dados demográficos são usados coletivamente. Seu histórico individual de leitura é totalmente confidencial, respeitando sua liberdade de pensamento.
          </p>
        </div>
      </div>
    </div>
  )
}
