import React from 'react';

export default function ModalEditarCliente({ cliente, onSave, onClose, onChange, errorMessage }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Cliente</h2>
        <form onSubmit={onSave}>
          <div className="form-group">
            <label htmlFor="nomeCompleto">Nome Completo</label>
            <input type="text" id="nomeCompleto" name="nomeCompleto" value={cliente.nomeCompleto} onChange={(e) => onChange({ ...cliente, nomeCompleto: e.target.value })} required />
          </div>
          <div className="form-group">
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" name="cpf" value={cliente.cpf} onChange={(e) => onChange({ ...cliente, cpf: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="dataNascimento">Data de Nascimento</label>
            <input type="date" id="dataNascimento" name="dataNascimento" value={cliente.dataNascimento} onChange={(e) => onChange({ ...cliente, dataNascimento: e.target.value })} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={cliente.email} onChange={(e) => onChange({ ...cliente, email: e.target.value })} />
          </div>
          <div className="button-group">
            <button className="btn-save">Salvar</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          </div>
          {errorMessage && (
            <div className="error-messages">
              <p>{errorMessage}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
