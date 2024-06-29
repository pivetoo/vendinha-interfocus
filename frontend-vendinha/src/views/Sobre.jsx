import React from 'react';
import '../styles/Sobre.css';

export default function Sobre() {
  return (
    <div className="sobre-container">
      <div className="sobre-content">
        <h1>Bem-vindo à Vendinha Interfocus!</h1>
        <p>
          Esse sistema foi desenvolvido para ajudar no controle de dívidas dos clientes de uma vendinha.
          Aqui, você pode cadastrar clientes, adicionar dívidas e acompanhar o status de pagamento de cada uma delas.
        </p>
        <p>
          O objetivo é facilitar a vida do dono da vendinha, oferecendo uma forma prática e eficiente de gerenciar as dívidas que antes eram feitas em papel.
        </p>
        <div className="sobre-faq">
          <h2>Documentação</h2>
          <p>Este projeto foi desenvolvido com base no processo seletivo de estágio da Interfocus. Toda a documentação da API está disponível no link abaixo.</p>
          <a href="https://documenter.getpostman.com/view/32817755/2sA3XY7JPx" className="sobre-button">Postman</a>
        </div>
      </div>
    </div>
  );
}
