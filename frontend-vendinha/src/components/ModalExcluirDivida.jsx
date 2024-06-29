import React from 'react';

export default function ModalConfirmacaoExcluirDivida({ divida, onConfirm, onClose }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirmação</h2>
        <p>Tem certeza que deseja excluir a dívida {divida.descricao}?</p>
        <button className="confirm-button" onClick={onConfirm}>Sim</button>
        <button className="cancel-button" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
