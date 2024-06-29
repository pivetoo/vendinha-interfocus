import React from 'react';
import './App.css';
import { BrowserRouter } from 'simple-react-routing';
import Layout from './layout/Layout';
import ClientesLista from './views/ClientesLista';
import DividasLista from './views/DividasLista';
import ClienteForm from './views/ClienteForm';
import DividaForm from './views/DividaForm';
import Sobre from './views/Sobre';

function App() {
  return (
    <BrowserRouter
      notFoundPage={<h1 style={{ textAlign: 'center' }}>404 - NOT FOUND</h1>}
      routes={[
        {
          path: "",
          component: <ClientesLista></ClientesLista>
        },
        {
          path: "dividas",
          component: <DividasLista></DividasLista>
        },
        {
          path: "cliente/novo",
          component: <ClienteForm></ClienteForm>
        },
        {
          path: "divida/nova",
          component: <DividaForm></DividaForm>
        },
        {
          path: "sobre",
          component: <Sobre></Sobre>
        }
      ]}
    >
      <Layout />
    </BrowserRouter>
  );
}

export default App;
