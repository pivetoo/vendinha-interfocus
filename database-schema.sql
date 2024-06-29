create database vendinhainterfocus;

create sequence clientes_sequence;

create table clientes (
    id integer not null default nextval('clientes_sequence') primary key,
    nomecompleto varchar(100) not null,
    cpf varchar(11) not null unique,
    datanascimento date not null,
    email varchar(255)
);

create sequence dividas_sequence;

create table dividas (
    id integer not null default nextval('dividas_sequence') primary key,
    clienteid integer not null,
    valor decimal(10, 2) not null,
    situacao integer not null default 0,
    datacriacao timestamp not null default current_timestamp,
    datapagamento timestamp,
    descricao text,
    constraint fk_cliente_divida foreign key (clienteid) references clientes(id)
);

/* Inserts caso queira popular o banco de dados */
INSERT INTO clientes (nomecompleto, cpf, datanascimento, email) VALUES
('Cliente 1', '12345678901', '1980-01-01', 'cliente1@gmail.com'),
('Cliente 2', '23456789012', '1981-02-02', 'cliente2@gmail.com'),
('Cliente 3', '34567890123', '1982-03-03', 'cliente3@gmail.com'),
('Cliente 4', '45678901234', '1983-04-04', 'cliente4@gmail.com'),
('Cliente 5', '56789012345', '1984-05-05', 'cliente5@gmail.com'),
('Cliente 6', '67890123456', '1985-06-06', 'cliente6@gmail.com'),
('Cliente 7', '78901234567', '1986-07-07', 'cliente7@gmail.com'),
('Cliente 8', '89012345678', '1987-08-08', 'cliente8@gmail.com'),
('Cliente 9', '90123456789', '1988-09-09', 'cliente9@gmail.com'),
('Cliente 10', '01234567890', '1989-10-10', 'cliente10@gmail.com'),
('Cliente 11', '11234567890', '1990-11-11', 'cliente11@gmail.com'),
('Cliente 12', '12234567890', '1991-12-12', 'cliente12@gmail.com'),
('Cliente 13', '13234567890', '1992-01-13', 'cliente13@gmail.com'),
('Cliente 14', '14234567890', '1993-02-14', 'cliente14@gmail.com'),
('Cliente 15', '15234567890', '1994-03-15', 'cliente15@gmail.com'),
('Cliente 16', '16234567890', '1995-04-16', 'cliente16@gmail.com'),
('Cliente 17', '17234567890', '1996-05-17', 'cliente17@gmail.com'),
('Cliente 18', '18234567890', '1997-06-18', 'cliente18@gmail.com'),
('Cliente 19', '19234567890', '1998-07-19', 'cliente19@gmail.com'),
('Cliente 20', '20234567890', '1999-08-20', 'cliente20@gmail.com');

INSERT INTO dividas (clienteid, valor, descricao, datacriacao) VALUES
(1, 150.00, 'Divida 1', '2024-06-25'),
(2, 75.50, 'Divida 2', '2024-06-25'),
(3, 200.00, 'Divida 3', '2024-06-25'),
(4, 50.75, 'Divida 4', '2024-06-25'),
(5, 120.00, 'Divida 5', '2024-06-25'),
(6, 90.25, 'Divida 6', '2024-06-25'),
(7, 180.00, 'Divida 7', '2024-01-07'),
(8, 60.50, 'Divida 8', '2024-01-08'),
(9, 130.00, 'Divida 9', '2024-01-09'),
(10, 70.00, 'Divida 10', '2024-01-10'),
(11, 200.00, 'Divida 11', '2024-01-11'),
(12, 45.75, 'Divida 12', '2024-01-12'),
(13, 110.00, 'Divida 13', '2024-01-13'),
(14, 150.25, 'Divida 14', '2024-01-14'),
(15, 95.00, 'Divida 15', '2024-01-15'),
(16, 80.00, 'Divida 16', '2024-01-16'),
(17, 170.50, 'Divida 17', '2024-01-17'),
(18, 60.00, 'Divida 18', '2024-01-18'),
(19, 140.75, 'Divida 19', '2024-01-19'),
(20, 85.00, 'Divida 20', '2024-01-20');
