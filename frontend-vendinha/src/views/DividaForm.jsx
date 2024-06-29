import { useEffect, useState } from "react";
import { useNavigation, useRouter } from "simple-react-routing";
import { obterDividaPorId, postDivida } from "../services/dividaApi";
import '../styles/Formularios.css';

export default function DividaForm() {
    const { pathParams } = useRouter();
    const id = pathParams.id;
    const { navigateTo } = useNavigation();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [divida, setDivida] = useState();

    const salvarDivida = async (evento) => {
        evento.preventDefault();
        var dados = new FormData(evento.target);
        var novaDivida = {
            clienteId: dados.get("clienteId"),
            valor: dados.get("valor"),
            descricao: dados.get("descricao"),
            dataCriacao: dados.get("dataCriacao")
        };
        var result = await postDivida(novaDivida);
        if (result.status == 200) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigateTo(null, "/dividas");
            }, 3000);
        } else {
            var erro = await result.json();
            var erroMensagem = erro.map(e => e.errorMessage).join(", ");
            setErrorMessage("Erro ao salvar dívida: " + erroMensagem);
        }
    };

    useEffect(() => {
        if (id) {
            obterDividaPorId(id)
                .then(response => response.json())
                .then(result => setDivida(result))
                .catch(error => setErrorMessage("Erro ao obter a dívida: " + error.message));
        } else {
            setDivida({
                clienteId: "",
                valor: "",
                descricao: "",
                dataCriacao: ""
            });
        }
    }, [id]);

    return divida && (
        <>
            <div className="cadastros-form-container">
                {showSuccess && (
                    <div className="popup-success">
                        Dívida Cadastrada com Sucesso!
                    </div>
                )}
                <h1>Cadastrar Dívida</h1>
                <form onSubmit={salvarDivida} className="cadastros-form">
                    <div className="form-group">
                        <label htmlFor="clienteId">Cliente ID</label>
                        <input type="text" id="clienteId" name="clienteId" defaultValue={divida.clienteId} placeholder="ID do Cliente" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="valor">Valor</label>
                        <input type="number" id="valor" name="valor" defaultValue={divida.valor} placeholder="Valor da dívida" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descricao">Descrição</label>
                        <input type="text" id="descricao" name="descricao" defaultValue={divida.descricao} placeholder="Descrição da dívida" maxLength="100" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dataCriacao">Data de Criação</label>
                        <input type="date" id="dataCriacao" name="dataCriacao" defaultValue={divida.dataCriacao} required />
                    </div>
                    <button type="submit">Salvar</button>
                    {errorMessage && (
                        <div className="error-messages">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}