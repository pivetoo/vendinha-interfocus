import { useEffect, useState } from 'react';
import { listarClientes, atualizarCliente, deletarCliente, listarDividasPorCliente } from '../services/clienteApi';
import '../styles/ClientesLista.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import ModalEditarCliente from '../components/ModalEditarCliente';
import ModalExcluirCliente from '../components/ModalExcluirCliente';
import ModalVisualizarDividas from '../components/ModalVisualizarDividas';
import { marcarDividaComoPaga } from '../services/dividaApi';

export default function ClientesLista() {
  const [clientes, setClientes] = useState([]);
  const [paginacao, setPaginacao] = useState(1);
  const [totalClientes, setTotalClientes] = useState(0);
  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(false);
  const [modalErros, setModalErros] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [excluirCliente, setExcluirCliente] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [clienteDividas, setClienteDividas] = useState(null);
  const [dividasCliente, setDividasCliente] = useState([]);
  const maxClientes = 10;

  useEffect(() => {
    listarClientes(paginacao, maxClientes, busca)
      .then(response => {
        if (response.status == 200) {
          response.json()
            .then(data => {
              setClientes(data.clientes);
              setTotalClientes(data.totalClientes);
            });
        } else {
          console.error('Erro ao buscar clientes:', response.statusText);
        }
      });
  }, [paginacao, busca]);

  const mudarPagina = (pagina) => {
    setPaginacao(pagina);
  };

  const calcularIdade = (dataNascimento) => {
    const dataNasc = new Date(dataNascimento);
    const dataAtual = new Date();
    let idade = dataAtual.getFullYear() - dataNasc.getFullYear();
    const diferencaMes = dataAtual.getMonth() - dataNasc.getMonth();
    if (diferencaMes < 0 || (diferencaMes == 0 && dataAtual.getDate() < dataNasc.getDate())) {
      idade--;
    }
    return idade;
  };

  const editarCliente = (cliente) => {
    const dataNascimento = cliente.dataNascimento.split('T')[0];
    setClienteSelecionado({ ...cliente, dataNascimento });
    setModal(true);
  };

  const abrirConfirmacaoExcluir = (cliente) => {
    setExcluirCliente(cliente);
    setShowConfirmModal(true);
  };

  const fecharConfirmacaoExcluir = () => {
    setExcluirCliente(null);
    setShowConfirmModal(false);
  };

  const confirmarExcluirCliente = async () => {
    const response = await deletarCliente(excluirCliente.id);
    if (response.status == 200) {
      setClientes(clientes.filter(cliente => cliente.id != excluirCliente.id));
      setShowDelete(true);
      setTimeout(() => setShowDelete(false), 3000);
      fecharConfirmacaoExcluir();
    } else {
      console.error("Erro ao excluir cliente. Tente novamente.");
    }
  };

  const visualizarDividas = async (cliente) => {
    const dividas = await listarDividasPorCliente(cliente.id);
    setClienteDividas(cliente);
    setDividasCliente(dividas);
    setModalVisualizar(true);
  };

  const mudarPesquisa = (evento) => {
    setBusca(evento.target.value);
    setPaginacao(1);
  };

  const fecharModal = () => {
    setModal(false);
    setClienteSelecionado(null);
    setModalErros([]);
    setErrorMessage("");
  };

  const adicionarCliente = () => {
    window.location.href = '/cliente/novo';
  };

  const salvarModal = async (evento) => {
    evento.preventDefault();
    const response = await atualizarCliente(clienteSelecionado);
    if (response.status == 200) {
      setShowSuccess(true);
      listarClientes(paginacao, maxClientes, busca);
      setModal(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      const erro = await response.json();
      const erroMensagem = erro.map(e => e.errorMessage).join(", ");
      setErrorMessage("Erro ao salvar cliente: " + erroMensagem);
    }
  };

  const marcarDividasComoPagas = async (ids) => {
    try {
      for (const id of ids) {
        await marcarDividaComoPaga(id);
      }
      setDividasCliente(dividasCliente.map(divida => ids.includes(divida.id) ? { ...divida, situacao: 1, dataPagamento: new Date().toISOString() } : divida));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setModalVisualizar(false);
    } catch (error) {
      console.error('Erro ao marcar dívidas como pagas:', error);
      alert("Erro ao marcar dívidas como pagas. Tente novamente.");
    }
  };

  const totalPaginas = Math.ceil(totalClientes / maxClientes);

  return (
    <div className="cliente-list-container">
      <h1 className="header">Lista de Clientes</h1>
      {showSuccess && (
        <div className="popup-success">Operação realizada com sucesso!</div>
      )}
      {showDelete && (
        <div className="popup-delete-success">Cliente removido com sucesso!</div>
      )}
      <div className="search-add-container">
        <input type="text" placeholder="Pesquisar clientes..." value={busca} onChange={mudarPesquisa} className="search-input" />
        <button onClick={adicionarCliente} className="add-button">Adicionar Cliente</button>
      </div>
      <table className="cliente-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome Completo</th>
            <th>CPF</th>
            <th>Idade</th>
            <th>Email</th>
            <th>Total Dívidas</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td data-label="ID">{cliente.id}</td>
              <td data-label="NomeCompleto" title={cliente.nomeCompleto}>{cliente.nomeCompleto}</td>
              <td data-label="CPF">{cliente.cpf}</td>
              <td data-label="Idade">{calcularIdade(cliente.dataNascimento)}</td>
              <td data-label="Email" title={cliente.email}>{cliente.email}</td>
              <td data-label="Total Dívidas">{cliente.totalDividas}</td>
              <td data-label="Ações">
                <FontAwesomeIcon icon={faEdit} style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => editarCliente(cliente)} />
                <FontAwesomeIcon icon={faUser} style={{ cursor: 'pointer', color: 'green', marginRight: '10px' }} onClick={() => visualizarDividas(cliente)} />
                <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer', color: 'red' }} onClick={() => abrirConfirmacaoExcluir(cliente)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="paginacao">
        {Array.from({ length: totalPaginas }, (_, indice) => (
          <button key={indice} onClick={() => mudarPagina(indice + 1)} className={indice + 1 == paginacao ? 'active' : ''}>{indice + 1}</button>
        ))}
      </div>
      {modal && (
        <ModalEditarCliente cliente={clienteSelecionado} erros={modalErros} onSave={salvarModal} onClose={fecharModal} onChange={setClienteSelecionado} errorMessage={errorMessage} />
      )}
      {showConfirmModal && (
        <ModalExcluirCliente cliente={excluirCliente} onConfirm={confirmarExcluirCliente} onCancel={fecharConfirmacaoExcluir} />
      )}
      {modalVisualizar && (
        <ModalVisualizarDividas cliente={clienteDividas.nomeCompleto} dividas={dividasCliente} onClose={() => setModalVisualizar(false)} marcarDividasComoPagas={marcarDividasComoPagas} />
      )}
    </div>
  );
}
