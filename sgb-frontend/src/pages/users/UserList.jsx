import { useState, useEffect, useCallback } from 'react'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import SearchBar from '../../components/ui/SearchBar'
import Modal from '../../components/ui/Modal'
import UserForm from './UserForm'
import { usersAPI, loansAPI, finesAPI, reservationsAPI } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

const MOCK_USERS = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  nome: ['Ana Silva', 'Carlos Souza', 'Maria Oliveira', 'João Santos', 'Beatriz Lima',
    'Pedro Costa', 'Fernanda Rocha', 'Rafael Alves', 'Luciana Martins', 'Diego Pereira'][i % 10],
  email: `usuario${i + 1}@exemplo.com`,
  tipo: i % 5 === 0 ? 'BIBLIOTECARIO' : 'LEITOR',
  bairro: ['Centro', 'Vila Nova', 'Periferia Norte', 'Quilombo São João', 'Jardim Esperança'][i % 5],
  grupoSocial: i % 3 === 0 ? ['Comunidade Quilombola', 'Povos Indígenas', 'Movimento Sem Terra'][i % 3] : null,
  ativo: true,
  createdAt: new Date(Date.now() - i * 86400000 * 7).toISOString(),
}))

export default function UserList() {
  const { isBibliotecario } = useAuth()
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [isMock, setIsMock]       = useState(false)
  const [search, setSearch]       = useState('')
  const [filterTipo, setFilterTipo] = useState('')
  const [page, setPage]           = useState(1)
  const [total, setTotal]         = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const LIMIT = 10

  // Modals
  const [modalForm, setModalForm]       = useState(false)
  const [editUser, setEditUser]         = useState(null)
  const [detailUser, setDetailUser]     = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [userStats, setUserStats]       = useState(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    const params = { page, limit: LIMIT }
    if (search) params.busca = search
    if (filterTipo) params.tipo = filterTipo

    usersAPI.getAll(params)
      .then((res) => {
        const d = res.data
        setUsers(d.data || d.usuarios || d || MOCK_USERS)
        setTotal(d.total || d.count || MOCK_USERS.length)
        setTotalPages(d.totalPages || Math.ceil((d.total || MOCK_USERS.length) / LIMIT))
        setIsMock(false)
      })
      .catch(() => {
        const filtered = MOCK_USERS.filter(u => {
          if (search && !u.nome.toLowerCase().includes(search.toLowerCase()) &&
              !u.email.toLowerCase().includes(search.toLowerCase())) return false
          if (filterTipo && u.tipo !== filterTipo) return false
          return true
        })
        const start = (page - 1) * LIMIT
        setUsers(filtered.slice(start, start + LIMIT))
        setTotal(filtered.length)
        setTotalPages(Math.ceil(filtered.length / LIMIT))
        setIsMock(true)
      })
      .finally(() => setLoading(false))
  }, [page, search, filterTipo])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const openDetail = async (user) => {
    setDetailUser(user)
    setStatsLoading(true)
    setUserStats(null)
    try {
      const res = await usersAPI.getOne(user.id)
      const d = res.data
      setUserStats({
        emprestimosTotal: d.emprestimosTotal || d._count?.emprestimos || 0,
        emprestimosAtivos: d.emprestimosAtivos || 0,
        multasPendentes: d.multasPendentes || 0,
        reservasAtivas: d.reservasAtivas || 0,
      })
    } catch {
      setUserStats({ emprestimosTotal: 8, emprestimosAtivos: 1, multasPendentes: 0, reservasAtivas: 2 })
    } finally {
      setStatsLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await usersAPI.remove(deleteTarget.id)
      setDeleteTarget(null)
      fetchUsers()
    } catch {
      alert('Erro ao excluir usuário.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const columns = [
    {
      key: 'nome',
      label: 'Nome',
      render: (val, row) => (
        <button
          onClick={() => openDetail(row)}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 group-hover:scale-110 transition-transform"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            {val?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white group-hover:text-violet-300 transition-colors">{val}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </button>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (val) => <Badge status={val} />,
    },
    {
      key: 'bairro',
      label: 'Bairro',
      render: (val) => <span className="text-slate-400 text-sm">{val || '—'}</span>,
    },
    {
      key: 'grupoSocial',
      label: 'Grupo Social',
      render: (val) => val ? (
        <span className="px-2 py-1 text-xs rounded-lg text-teal-400 bg-teal-500/10 border border-teal-500/20">
          {val}
        </span>
      ) : <span className="text-slate-600 text-xs">—</span>,
    },
    {
      key: 'ativo',
      label: 'Status',
      render: (val) => (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-lg border ${
          val ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-emerald-400' : 'bg-slate-500'}`} />
          {val ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      key: 'id',
      label: 'Ações',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openDetail(row)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            Ver
          </button>
          {isBibliotecario && (
            <>
              <button
                onClick={() => { setEditUser(row); setModalForm(true) }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
              >
                Editar
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
              >
                Excluir
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Usuários</h2>
          <p className="text-slate-400 text-sm mt-0.5">{total} usuários cadastrados</p>
        </div>
        {isBibliotecario && (
          <button
            onClick={() => { setEditUser(null); setModalForm(true) }}
            className="btn-primary flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Usuário
          </button>
        )}
      </div>

      {isMock && (
        <div className="mock-banner">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          Exibindo dados de demonstração (API offline)
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1) }}
          placeholder="Buscar por nome ou email..."
          className="flex-1"
        />
        <div className="relative">
          <select
            value={filterTipo}
            onChange={(e) => { setFilterTipo(e.target.value); setPage(1) }}
            className="select-field w-full sm:w-48"
          >
            <option value="">Todos os tipos</option>
            <option value="LEITOR">Leitor</option>
            <option value="BIBLIOTECARIO">Bibliotecário</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={users}
        loading={loading}
        keyField="id"
        emptyMessage="Nenhum usuário encontrado"
        pagination={{ page, total, totalPages, limit: LIMIT, onChange: setPage }}
      />

      {/* User Form Modal */}
      <Modal
        open={modalForm}
        onClose={() => { setModalForm(false); setEditUser(null) }}
        title={editUser ? 'Editar Usuário' : 'Novo Usuário'}
        size="md"
        hideFooter
      >
        <UserForm
          initial={editUser}
          onSuccess={() => { setModalForm(false); setEditUser(null); fetchUsers() }}
          onCancel={() => { setModalForm(false); setEditUser(null) }}
        />
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={!!detailUser}
        onClose={() => { setDetailUser(null); setUserStats(null) }}
        title="Perfil do Usuário"
        size="md"
        hideFooter
      >
        {detailUser && (
          <div className="space-y-5">
            {/* Avatar + info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                {detailUser.nome?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{detailUser.nome}</h3>
                <p className="text-sm text-slate-400">{detailUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge status={detailUser.tipo} />
                  {detailUser.bairro && (
                    <span className="text-xs text-slate-500">📍 {detailUser.bairro}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Grupo social */}
            {detailUser.grupoSocial && (
              <div className="px-4 py-3 rounded-xl"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p className="text-xs font-semibold text-emerald-400 mb-1">Grupo Social</p>
                <p className="text-sm text-slate-300">{detailUser.grupoSocial}</p>
              </div>
            )}

            {/* Stats */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Estatísticas</p>
              {statsLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton h-16 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Empréstimos Total', value: userStats?.emprestimosTotal ?? 0, color: 'text-violet-400' },
                    { label: 'Ativos Agora', value: userStats?.emprestimosAtivos ?? 0, color: 'text-blue-400' },
                    { label: 'Multas Pendentes', value: userStats?.multasPendentes ?? 0, color: 'text-rose-400' },
                    { label: 'Reservas Ativas', value: userStats?.reservasAtivas ?? 0, color: 'text-amber-400' },
                  ].map(stat => (
                    <div key={stat.label} className="p-4 rounded-xl text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-white/[0.06]">
              <button onClick={() => { setDetailUser(null); setUserStats(null) }} className="btn-secondary">
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir Usuário"
        size="sm"
        confirmLabel="Excluir"
        confirmVariant="danger"
        onConfirm={handleDelete}
        loading={deleteLoading}
      >
        <p className="text-slate-300">
          Tem certeza que deseja excluir o usuário <strong className="text-white">"{deleteTarget?.nome}"</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}
