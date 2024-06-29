const URL_API = "https://localhost:7280";

export function listarClientes(page, pageSize, pesquisa) {
    const data = pesquisa ? `busca=${pesquisa}&` : '';
    const url = `${URL_API}/api/cliente?page=${page}&size=${pageSize}&${data}`;

    return fetch(url);
}

export function deletarCliente(id) {
    var request = {
        method: "DELETE",
    };
    var response = fetch(URL_API + "/api/cliente/" + id, request);
    return response;
}

export function postCliente(cliente) {
    var request = {
        method: cliente.id ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
      },
        body: JSON.stringify(cliente),
    };
    var response = fetch(URL_API + "/api/cliente/", request);
    return response;
  }

export function atualizarCliente(cliente) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
    };
    return fetch(`${URL_API}/api/cliente/${cliente.id}`, request);
}

export function obterClientePorId(id) {
    var response = fetch(`${URL_API}/api/cliente/${id}`);
    return response.then(response => response.json());
}


export async function listarDividasPorCliente(clienteId) {
    const response = await fetch(`${URL_API}/api/divida/cliente/${clienteId}`);
    if (response.status == 200) {
        const data = await response.json();
        return data.dividas;
    } else {
        console.error(`Erro ao buscar dívidas do cliente: ${response.statusText}`);
    }
}