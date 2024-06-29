import { useNavigation, useRouter } from "simple-react-routing";
import { postCliente, obterClientePorId } from '../services/clienteApi';
import { useEffect, useReducer, useState } from 'react';
import '../styles/Formularios.css';

export default function ClienteForm() {
    const { pathParams } = useRouter();
    const id = pathParams["id"];
    const { navigateTo } = useNavigation();
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [cliente, setCliente] = useState();

    const salvarCliente = async (evento) => {
        evento.preventDefault();
        var dados = new FormData(evento.target);
        var novoCliente = {
            id: id,
            nomeCompleto: dados.get("nomeCompleto"),
            cpf: dados.get("cpf").replace(/\D/g, ""),
            dataNascimento: dados.get("dataNascimento"),
            email: dados.get("email")
        };
        var result = await postCliente(novoCliente);
        if (result.status == 200) {
            setShowSuccess(true);
            setTimeout(() => {
               setShowSuccess(false);
               navigateTo(null, "/");
            }, 3000);
        } else {
            var erro = await result.json();
            var erroMensagem = erro.map(e => e.errorMessage).join(", ");
            setErrorMessage("Erro ao salvar cliente: " + erroMensagem);
        }
    };

    useEffect(() => {
        if (id) {
            obterClientePorId(id)
                .then(e => e.json())
                .then(result => {
                    setCliente(result);
                    setCpf(result.cpf);
                });
        } else {
            setCliente({});
        }
    }, [id]);

    const [email, setEmail] = useReducer((old, value) => {
        return value.toLowerCase().replaceAll(" ", "");
    }, "");

    const [cpf, setCpf] = useReducer((old, value) => {
        const digitos = value.replace(/\D/g, "").substring(0, 11);

        if (digitos.length <= 3) return digitos;
        else if (digitos.length <= 6) {
            return digitos.replace(/(\d{3})(\d+)/, "$1.$2");
        }
        else if (digitos.length <= 9) {
            return digitos.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
        }   
        else {
            return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
        }
    }, "");

    return cliente && (
        <>
            <div className="cadastros-form-container">
                {showSuccess && (
                    <div className="popup-success">
                        Cliente Cadastrado com Sucesso!
                    </div>
                )}
                <h1>Cadastrar Cliente</h1>
                <form onSubmit={salvarCliente} className="cadastros-form">
                    <div className="form-group">
                        <label htmlFor="nomeCompleto">Nome Completo</label>
                        <input type="text" id="nomeCompleto" name="nomeCompleto" defaultValue={cliente.nomeCompleto} placeholder="Nome Completo" maxLength="50" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpf">CPF</label>
                        <input type="text" id="cpf" name="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF do Cliente" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                        <input type="date" id="dataNascimento" name="dataNascimento" defaultValue={cliente.dataNascimento} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" maxLength="50"/>
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