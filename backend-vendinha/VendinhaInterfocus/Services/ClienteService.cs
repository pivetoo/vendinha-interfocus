using NHibernate;
using Npgsql;
using System.ComponentModel.DataAnnotations;
using VendinhaInterfocus.Models.DTO;
using VendinhaInterfocus.Models.Entidades;

namespace VendinhaInterfocus.Services
{
    public class ClienteService
    {
        private readonly ISessionFactory _sessionFactory;

        public ClienteService(ISessionFactory sessionFactory)
        {
            _sessionFactory = sessionFactory;
        }

        public IEnumerable<ClienteDTO> ListarClientes(int page, int size, string busca, out int totalClientes)
        {
            using var sessao = _sessionFactory.OpenSession();

            var query = sessao.Query<Cliente>();

            if (!string.IsNullOrEmpty(busca))
            {
                query = query.Where(c => c.NomeCompleto.ToLower().Contains(busca.ToLower()) ||
                          c.CPF.Contains(busca) ||
                          c.Email.ToLower().Contains(busca.ToLower()));
            }

            totalClientes = query.Count();

            var clientes = query
                .OrderByDescending(c => c.Dividas.Where(d => d.Situacao == Situacao.Pendente).Sum(d => (decimal?)d.Valor) ?? 0)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(cliente => new ClienteDTO
                {
                    Id = cliente.Id,
                    NomeCompleto = cliente.NomeCompleto,
                    CPF = cliente.CPF,
                    DataNascimento = cliente.DataNascimento,
                    Email = cliente.Email,
                    TotalDividas = cliente.Dividas.Where(d => d.Situacao == Situacao.Pendente || d.Situacao == Situacao.Atraso).Sum(d => (decimal?)d.Valor) ?? 0
                }).ToList();

            return clientes;
        }

        public bool CadastrarClientes(ClienteDTO clienteDTO, out List<ValidationResult> erros)
        {
            erros = new List<ValidationResult>();
            using var sessao = _sessionFactory.OpenSession();
            using var transaction = sessao.BeginTransaction();

            if (clienteDTO.DataNascimento > DateTime.Today)
            {
                erros.Add(new ValidationResult("Data de nascimento não pode ser no futuro."));
                return false;
            }

            var cliente = new Cliente
            {
                NomeCompleto = clienteDTO.NomeCompleto,
                CPF = clienteDTO.CPF,
                DataNascimento = clienteDTO.DataNascimento,
                Email = clienteDTO.Email
            };

            try
            {
                sessao.Save(cliente);
                transaction.Commit();

                clienteDTO.Id = cliente.Id;
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();

                if (ex is NHibernate.Exceptions.GenericADOException adoEx && adoEx.InnerException is Npgsql.PostgresException pgEx)
                {
                    if (pgEx.SqlState == "23505")
                    {
                        erros.Add(new ValidationResult("CPF já cadastrado, tente novamente."));
                    }
                }
                return false;
            }
        }

        public bool AtualizarClientes(ClienteDTO clienteDTO, out List<ValidationResult> erros)
        {
            erros = new List<ValidationResult>();
            using var sessao = _sessionFactory.OpenSession();
            using var transaction = sessao.BeginTransaction();

            var cliente = sessao.Get<Cliente>(clienteDTO.Id);

            if (clienteDTO.DataNascimento > DateTime.Today)
            {
                erros.Add(new ValidationResult("Data de nascimento não pode ser no futuro."));
                return false;
            }

            try
            {
                cliente.NomeCompleto = clienteDTO.NomeCompleto;
                cliente.CPF = clienteDTO.CPF;
                cliente.DataNascimento = clienteDTO.DataNascimento;
                cliente.Email = clienteDTO.Email;

                sessao.Merge(cliente);
                transaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();

                if (ex is NHibernate.Exceptions.GenericADOException adoEx && adoEx.InnerException is Npgsql.PostgresException pgEx)
                {
                    if (pgEx.SqlState == "23505")
                    {
                        erros.Add(new ValidationResult("CPF já cadastrado, tente novamente."));
                    }
                }
                return false;
            }
        }

        public bool ExcluirClientes(int id, out List<ValidationResult> erros)
        {
            erros = new List<ValidationResult>();
            using var sessao = _sessionFactory.OpenSession();
            using var transaction = sessao.BeginTransaction();

            try
            {
                var cliente = sessao.Get<Cliente>(id);
                if (cliente == null)
                {
                    erros.Add(new ValidationResult("Cliente não encontrado"));
                    return false;
                }

                sessao.Delete(cliente);
                transaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                erros.Add(new ValidationResult($"Erro ao excluir Cliente: {ex.Message}"));
                return false;
            }
        }

        public ClienteDTO ListarClientePorId(int id)
        {
            using var sessao = _sessionFactory.OpenSession();
            var cliente = sessao.Get<Cliente>(id);

            return new ClienteDTO
            {
                Id = cliente.Id,
                NomeCompleto = cliente.NomeCompleto,
                CPF = cliente.CPF,
                DataNascimento = cliente.DataNascimento,
                Email = cliente.Email,
                TotalDividas = cliente.Dividas.Where(d => d.Situacao == Situacao.Pendente || d.Situacao == Situacao.Atraso).Sum(d => (decimal?)d.Valor) ?? 0
            };
        }
    }
}
