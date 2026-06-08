import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const mockReservations = [
  { id: 101, user: 'Maria da Silva', livro: 'A Queda do Céu', data: '10/06/2026', posicao: 1, status: 'PENDENTE' },
  { id: 102, user: 'João Pedro', livro: 'A Queda do Céu', data: '11/06/2026', posicao: 2, status: 'PENDENTE' },
  { id: 103, user: 'Ana Carolina', livro: 'Ideias para Adiar o Fim do Mundo', data: '12/06/2026', posicao: 1, status: 'PENDENTE' },
];

export default function ReservationPanel() {
  const { isBibliotecario } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fila de Espera Transparente</h1>
          <p className="text-sm text-slate-500 mt-1">Garantindo equidade e justiça no acesso ao conhecimento.</p>
        </div>
        <button className="btn-primary">Nova Reserva</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockReservations
          .filter(res => isBibliotecario || res.user === 'Maria da Silva') // Simula o Leitor vendo só as dele
          .map(res => (
          <div key={res.id} className="glass-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-12 h-12 rounded-full border-4 border-sgb-dourado bg-yellow-50 flex items-center justify-center shadow-md">
                <span className="text-sgb-dourado font-black text-lg">{res.posicao}º</span>
              </div>
            </div>
            
            <div className="p-6">
              <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-4">
                {res.status}
              </span>
              <h3 className="font-bold text-slate-800 text-lg pr-12 leading-tight mb-2">{res.livro}</h3>
              <p className="text-sm text-slate-600 mb-1"><span className="font-semibold">Leitor:</span> {res.user}</p>
              <p className="text-sm text-slate-500"><span className="font-semibold">Solicitado em:</span> {res.data}</p>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between">
              <button className="text-slate-500 hover:text-rose-600 text-sm font-medium transition-colors">Cancelar</button>
              {isBibliotecario && res.posicao === 1 && (
                <button className="text-sgb-vinho hover:text-rose-900 text-sm font-bold transition-colors">Atender</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
