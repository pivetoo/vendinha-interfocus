import React, { useState } from 'react';
import '../styles/ModalVisualizarDividas.css';

const SITUACOES = ["Pendente", "Paga", "Atraso"];

export default function ModalVisualizarDividas({ cliente, dividas, onClose, marcarDividasComoPagas }) {
  const [dividasSelecionadas, setDividasSelecionadas] = useState([]);
  const [paginacao, setPaginacao] = useState(1);
  const maxDividas = 3;

  const checkboxChange = (id) => {
    setDividasSelecionadas((anterior) => {
      if (anterior.includes(id)) {
        return anterior.filter((item) => item != id);
      } else {
        return [...anterior, id];
      }
    });
  };

  const marcarComoPagas = () => {
    marcarDividasComoPagas(dividasSelecionadas);
  };

  const totalPaginas = Math.ceil(dividas.length / maxDividas);

  const dividasPaginadas = dividas.slice((paginacao - 1) * maxDividas, paginacao * maxDividas);

  const paginaAnterior = () => {
    setPaginacao((anterior) => Math.max(anterior - 1, 1));
  };

  const proximaPagina = () => {
    setPaginacao((anterior) => Math.min(anterior + 1, totalPaginas));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dividas">
        <h2>Histórico de {cliente}</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Valor</th>
              <th>Descrição</th>
              <th>Criação</th>
              <th>Pagamento</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {dividasPaginadas && dividasPaginadas.length > 0 &&
              dividasPaginadas.map((divida, index) => (
                <tr key={index}>
                  <td>
                    {divida.situacao != 1 && (
                      <input type="checkbox" checked={dividasSelecionadas.includes(divida.id)} onChange={() => checkboxChange(divida.id)} />
                    )}
                  </td>
                  <td data-label="Valor">{divida.valor}</td>
                  <td data-label="Descrição">{divida.descricao}</td>
                  <td data-label="Criação">{new Date(divida.dataCriacao).toLocaleDateString()}</td>
                  <td data-label="Pagamento">{divida.dataPagamento ? new Date(divida.dataPagamento).toLocaleDateString() : 'Em espera...'}</td>
                  <td data-label="Situação">
                    <span style={{ color: divida.situacao == 1 ? 'green' : (divida.situacao == 2 ? 'red' : '#ff8c00') }}>
                      {SITUACOES[divida.situacao]}
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        <div className="pagination-container">
          <button onClick={paginaAnterior} disabled={paginacao == 1} className="pagination-button">Anterior</button>
          <span className="pagination-span">{paginacao} / {totalPaginas}</span>
          <button onClick={proximaPagina} disabled={paginacao == totalPaginas} className="pagination-button">Próxima</button>
        </div>
        <button onClick={marcarComoPagas} disabled={dividasSelecionadas.length == 0} className="confirm-button">Marcar como Pagas</button>
        <button onClick={onClose} className="cancel-button">Fechar</button>
      </div>
    </div>
  );
}