const URL_API = "https://localhost:7280";

export function listarDividas(page, size, busca, mostrarPago) {
    const data = busca ? `busca=${busca}&` : '';
    const url = `${URL_API}/api/divida?page=${page}&size=${size}&${data}mostrarPago=${mostrarPago}`;

    return fetch(url);
}

export function deletarDivida(id) {
    const request = {
        method: "DELETE",
    };
    return fetch(`${URL_API}/api/divida/${id}`, request);
}

export function postDivida(divida) {
    const request = {
        method: divida.id ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(divida),
    };
    return fetch(`${URL_API}/api/divida`, request);
}

export function marcarDividaComoPaga(id) {
    const request = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ situacao: 1, dataPagamento: new Date().toISOString()}),
    };
    return fetch(`${URL_API}/api/divida/${id}`, request);
}

export function obterDividaPorId(id) {
    return fetch(`${URL_API}/api/divida/${id}`);
}