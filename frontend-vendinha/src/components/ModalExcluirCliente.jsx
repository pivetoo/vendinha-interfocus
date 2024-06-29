import React from 'react';

export default function ModalExcluirCliente({ cliente, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirmação</h2>
        <p>Tem certeza que deseja excluir o cliente {cliente.nomeCompleto}?</p>
        <button className="confirm-button" onClick={onConfirm}>Sim</button>
        <button className="cancel-button" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
