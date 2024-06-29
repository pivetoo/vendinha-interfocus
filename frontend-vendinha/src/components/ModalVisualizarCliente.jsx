import React from 'react';

export default function ModalVisualizarCliente({ cliente, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Informações do Cliente</h2>
        <p><strong>ID:</strong> {cliente.clienteId}</p>
        <p><strong>Nome Completo:</strong> {cliente.clienteNome}</p>
        <p><strong>CPF:</strong> {cliente.cpf}</p>
        <p><strong>Data de Nascimento:</strong> {cliente.dataNascimento}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Total Dívidas:</strong> {cliente.totalDividas}</p>
        <button type="button" className="btn-close" onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}
