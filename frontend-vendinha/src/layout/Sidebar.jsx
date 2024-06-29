import { useState } from "react";
import '../styles/Sidebar.css';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>&#9776;</button>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-logo">
                    <img src="/vendinha.png" alt="Logo" />
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li><a href="/">Lista de Clientes</a></li>
                        <li><a href="/dividas">Lista de Dívidas</a></li>
                        <li><a href="/cliente/novo">Cadastrar Cliente</a></li>
                        <li><a href="/divida/nova">Cadastrar Dívida</a></li>
                        <li><a href="/sobre">Sobre</a></li>
                    </ul>
                </nav>
            </div>
        </>
    )
}