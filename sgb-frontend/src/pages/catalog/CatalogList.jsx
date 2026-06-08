import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { booksAPI, authorsAPI, genresAPI, reservationsAPI } from '../../api/client';
import Modal from '../../components/ui/Modal';
import BookForm from './BookForm';

export default function CatalogList() {
  const { isBibliotecario } = useAuth();
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [booksRes, authorsRes, genresRes] = await Promise.all([
        booksAPI.getAll(),
        authorsAPI.getAll(),
        genresAPI.getAll(),
      ]);
      setBooks(booksRes.data.data || booksRes.data);
      setAuthors(authorsRes.data.data || authorsRes.data);
      setGenres(genresRes.data.data || genresRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchData();
  };

  const handleReserve = async (bookId) => {
    try {
      await reservationsAPI.create({ bookId });
      alert('Reserva solicitada com sucesso!');
      fetchData(); // refresh to update book status if needed
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao criar reserva');
    }
  };

  const filteredBooks = books.filter(b => 
    b.titulo.toLowerCase().includes(search.toLowerCase()) ||
    b.autor?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    b.tags?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Catálogo de Livros</h1>
        <div className="flex gap-3">
          <input 
            type="text" 
            placeholder="Buscar livros, autores ou tags..." 
            className="input-field w-64 md:w-80"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {isBibliotecario && (
            <button onClick={handleCreate} className="btn-primary">Novo Livro</button>
          )}
        </div>
      </div>

      <Modal 
        open={showForm} 
        onClose={() => setShowForm(false)} 
        title={editingBook ? 'Editar Livro' : 'Adicionar Novo Livro'}
        hideFooter
      >
        <BookForm 
          initial={editingBook} 
          authors={authors} 
          genres={genres} 
          onSuccess={handleFormSuccess} 
          onCancel={() => setShowForm(false)} 
        />
      </Modal>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Título & Autor</th>
                <th className="px-6 py-4 font-semibold">Tags Éticas</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-8 dark:text-slate-400">Carregando catálogo...</td></tr>
              ) : filteredBooks.map((book) => {
                const tagsArray = typeof book.tags === 'string' ? JSON.parse(book.tags) : (book.tags || []);
                const status = book.exemplares?.some(e => e.status === 'DISPONIVEL') ? 'DISPONIVEL' : 'INDISPONIVEL';
                
                return (
                <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-base">{book.titulo}</p>
                    <p className="text-slate-500 dark:text-slate-400">{book.autor?.nome} • {book.genero?.nome}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {tagsArray.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-sgb-rosa/10 text-sgb-rosa border border-sgb-rosa/20 rounded-full text-xs font-semibold shadow-sm">
                          {tag}
                        </span>
                      ))}
                      {!book.isDecolonized && <span className="text-slate-400 text-xs italic">Sem tags específicas</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      status === 'DISPONIVEL' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {isBibliotecario ? (
                      <button onClick={() => handleEdit(book)} className="text-sgb-vinho hover:text-rose-900 font-medium text-sm">Editar</button>
                    ) : (
                      <button onClick={() => handleReserve(book.id)} className="text-sgb-vinho hover:text-rose-900 font-medium text-sm">Reservar</button>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
