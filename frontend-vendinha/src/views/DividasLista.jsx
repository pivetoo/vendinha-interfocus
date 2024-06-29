import { useEffect, useState } from "react";
import { deletarDivida, listarDividas, marcarDividaComoPaga } from "../services/dividaApi";
import '../styles/DividasLista.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import ModalExcluirDivida from '../components/ModalExcluirDivida';
import ModalVisualizarCliente from '../components/ModalVisualizarCliente';

const SITUACOES = ["Pendente", "Paga", "Atraso"];

export default function DividasLista() {
    const [dividas, setDividas] = useState([]);
    const [paginacao, setPaginacao] = useState(1);
    const [totalDividas, setTotalDividas] = useState(0);
    const [busca, setBusca] = useState("");
    const [mostrarPago, setMostrarPago] = useState(false);
    const [modal, setModal] = useState(false);
    const [excluirDivida, setExcluirDivida] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [modalVisualizar, setModalVisualizar] = useState(false);
    const [clienteVisualizar, setClienteVisualizar] = useState(null);
    const maxDividas = 10;

    useEffect(() => {
        listarDividas(paginacao, maxDividas, busca, mostrarPago)
            .then(response => {
                if (response.status == 200) {
                    response.json()
                        .then(data => {
                            setDividas(data.dividas);
                            setTotalDividas(data.totalDividas);
                        });
                } else {
                    console.error('Erro ao buscar dívidas:', response.statusText);
                }
            });
    }, [paginacao, busca, mostrarPago]);

    const mudarPagina = (pagina) => {
        setPaginacao(pagina);
    };

    const marcarComoPaga = async (id) => {
        const dataPagamento = new Date().toISOString();
        const response = await marcarDividaComoPaga(id, dataPagamento);
        if (response.ok) {
            setDividas(dividas.map(divida => divida.id == id ? { ...divida, situacao: 1, dataPagamento: dataPagamento } : divida));
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } else {
            const errorData = await response.json();
            alert("Erro ao marcar dívida como paga: " + (errorData.errors ? errorData.errors.join(', ') : 'Tente novamente.'));
        }
    };

    const abrirModalConfirmacao = (divida) => {
        setExcluirDivida(divida);
        setModal(true);
    };

    const fecharModalConfirmacao = () => {
        setModal(false);
    };

    const confirmarExcluirDivida = async () => {
        const response = await deletarDivida(excluirDivida.id);
        if (response.status == 200) {
            setDividas(dividas.filter(divida => divida.id != excluirDivida.id));
            setShowDeleteSuccess(true);
            setTimeout(() => setShowDeleteSuccess(false), 3000);
            fecharModalConfirmacao();
        } else {
            alert("Erro ao excluir dívida. Tente novamente.");
        }
    };

    const mudarBusca = (evento) => {
        setBusca(evento.target.value);
        setPaginacao(1);
    };

    const alternarMostrarPagas = () => {
        setMostrarPago(!mostrarPago);
        setPaginacao(1);
    };

    const adicionarDivida = () => {
        window.location.href = '/divida/nova';
    };

    const visualizarCliente = (clienteNome) => {
        const cliente = dividas.find(divida => divida.clienteNome == clienteNome);
        if (cliente) {
            setClienteVisualizar(cliente);
            setModalVisualizar(true);
        }
    };

    const totalPaginas = Math.ceil(totalDividas / maxDividas);

    return (
        <div className="divida-list-container">
            <h1>Lista de Dívidas</h1>
            {showSuccess && (
                <div className="popup-success">Dívida marcada como paga!</div>
            )}
            {showDeleteSuccess && (
                <div className="popup-delete-success">Dívida removida com sucesso!</div>
            )}
            <div className="search-container">
                <input type="text" placeholder="Pesquisar dívidas..." value={busca} onChange={mudarBusca} className="search-input" />
                <div className="buttons-container">
                    <button onClick={alternarMostrarPagas} className={`toggle-paid-button ${mostrarPago ? 'show-paid' : 'show-all'}`}>
                        {mostrarPago ? 'Mostrar Todas' : 'Dívidas Pendentes'}
                    </button>
                    <button onClick={adicionarDivida} className="add-button">Adicionar Dívida</button>
                </div>
            </div>
            <table className="divida-table">
                <thead>
                    <tr>
                        <th>Nome do Cliente</th>
                        <th>Valor</th>
                        <th>Descrição</th>
                        <th>Data Criação</th>
                        <th>Data Pagamento</th>
                        <th>Situação</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {dividas.map(divida => (
                        <tr key={divida.id}>
                            <td data-label="NomeDoCliente" title={divida.clienteNome}>{divida.clienteNome}</td>
                            <td data-label="Valor">{divida.valor}</td>
                            <td data-label="Descrição" title={divida.descricao}>{divida.descricao}</td>
                            <td data-label="Data de Criação">{new Date(divida.dataCriacao).toLocaleDateString()}</td>
                            <td data-label="Data de Pagamento">{divida.dataPagamento ? new Date(divida.dataPagamento).toLocaleDateString() : 'Em espera...'}</td>
                            <td data-label="Situação">
                                <span style={{ color: divida.situacao == 1 ? 'green' : (divida.situacao == 2 ? 'red' : '#ff8c00') }}>
                                    {SITUACOES[divida.situacao]}
                                </span>
                            </td>
                            <td data-label="Ações">
                                {(divida.situacao == 0 || divida.situacao == 2) && (
                                    <FontAwesomeIcon icon={faCheck} style={{ cursor: 'pointer', color: 'green', marginRight: '10px' }} onClick={() => marcarComoPaga(divida.id)} />
                                )}
                                <FontAwesomeIcon icon={faFileAlt} style={{ cursor: 'pointer', color: 'black', marginRight: '10px' }} onClick={() => visualizarCliente(divida.clienteNome)} />
                                <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer', color: 'red' }} onClick={() => abrirModalConfirmacao(divida)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="paginacao">
                {Array.from({ length: totalPaginas }, (_, index) => (
                    <button key={index} onClick={() => mudarPagina(index + 1)} className={index + 1 == paginacao ? 'active' : ''}>{index + 1}</button>
                ))}
            </div>
            {modal && (
                <ModalExcluirDivida divida={excluirDivida} onConfirm={confirmarExcluirDivida} onClose={fecharModalConfirmacao} />
            )}
            {modalVisualizar && (
                <ModalVisualizarCliente cliente={clienteVisualizar} onClose={() => setModalVisualizar(false)} />
            )}
        </div>
    );
}
