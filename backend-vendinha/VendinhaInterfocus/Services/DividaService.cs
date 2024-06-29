using Microsoft.AspNetCore.Mvc.RazorPages;
using NHibernate;
using System.ComponentModel.DataAnnotations;
using VendinhaInterfocus.Models.DTO;
using VendinhaInterfocus.Models.Entidades;

namespace VendinhaInterfocus.Services
{
    public class DividaService
    {
        public readonly ISessionFactory _sessionFactory;

        public DividaService(ISessionFactory sessionFactory)
        {
            _sessionFactory = sessionFactory;
        }

        public IEnumerable<DividaDTO> ListarDividas(int page, int size, string busca, bool mostrarPago, out int totalDividas)
        {
            using var sessao = _sessionFactory.OpenSession();

            var query = sessao.Query<Divida>();

            if (!mostrarPago)
            {
                query = query.Where(d => d.Situacao == Situacao.Pendente);
            }

            if (!string.IsNullOrEmpty(busca))
            {
                query = query.Where(d => d.Cliente.NomeCompleto.ToLower().Contains(busca.ToLower()) ||
                                        d.Descricao.ToLower().Contains(busca.ToLower()) ||
                                        d.Cliente.Email.ToLower().Contains(busca.ToLower()));
            }

            totalDividas = query.Count();

            var dividas = query
                .OrderByDescending(d => d.Situacao)
                .ThenByDescending(d => d.Valor)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(d => new DividaDTO
                {
                    Id = d.Id,
                    ClienteId = d.Cliente.Id,
                    ClienteNome = d.Cliente.NomeCompleto,
                    CPF = d.Cliente.CPF,
                    DataNascimento = d.Cliente.DataNascimento.ToString("dd/MM/yyyy"),
                    Email = d.Cliente.Email,
                    Valor = d.Valor,
                    Situacao = d.DataPagamento.HasValue ? Situacao.Paga : ((DateTime.Today - d.DataCriacao).TotalDays > 30 ? Situacao.Atraso : Situacao.Pendente),
                    DataCriacao = d.DataCriacao,
                    DataPagamento = d.DataPagamento,
                    Descricao = d.Descricao,
                    TotalDividas = SomarDividasClientes(d.Cliente.Id)
                }).ToList();
            return dividas;
        }

        public IEnumerable<DividaDTO> ListarDividasPorId(int clienteId, int page, int size)
        {
            using var sessao = _sessionFactory.OpenSession();

            var dividas = sessao.Query<Divida>()
                .Where(d => d.Cliente.Id == clienteId)
                .OrderByDescending(d => d.Situacao)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(d => new DividaDTO
                {
                    Id = d.Id,
                    ClienteId = d.Cliente.Id,
                    ClienteNome = d.Cliente.NomeCompleto,
                    CPF = d.Cliente.CPF,
                    DataNascimento = d.Cliente.DataNascimento.ToString("dd/MM/yyyy"),
                    Email = d.Cliente.Email,
                    Valor = d.Valor,
                    Situacao = d.DataPagamento.HasValue ? Situacao.Paga : ((DateTime.Today - d.DataCriacao).TotalDays > 30 ? Situacao.Atraso : Situacao.Pendente),
                    DataCriacao = d.DataCriacao,
                    DataPagamento = d.DataPagamento,
                    Descricao = d.Descricao,
                    TotalDividas = SomarDividasClientes(d.Cliente.Id)
                }).ToList();

            return dividas;
        }


        public bool CadastrarDividas(DividaDTO dividaDTO, out List<ValidationResult> erros)
        {
            erros = new List<ValidationResult>();
            using var sessao = _sessionFactory.OpenSession();
            using var transaction = sessao.BeginTransaction();

            if (dividaDTO.Valor < 0)
            {
                erros.Add(new ValidationResult("Valor da dívida não pode ser negativo."));
                return false;
            }

            var cliente = sessao.Get<Cliente>(dividaDTO.ClienteId);
            if (cliente == null)
            {
                erros.Add(new ValidationResult("Cliente não encontrado"));
                return false;
            }

            var totalDividas = cliente.Dividas.Where(d => d.Situacao == Situacao.Pendente || d.Situacao == Situacao.Atraso).Sum(d => d.Valor);
            if (totalDividas + dividaDTO.Valor > 200)
            {
                erros.Add(new ValidationResult("A soma das dívidas do cliente ultrapassa o limite permitido de R$200"));
                return false;
            }

            var divida = new Divida
            {
                Cliente = cliente,
                Valor = dividaDTO.Valor ?? 0,
                Situacao = dividaDTO.Situacao,
                DataCriacao = dividaDTO.DataCriacao,
                DataPagamento = dividaDTO.DataPagamento ?? null,
                Descricao = dividaDTO.Descricao ?? string.Empty
            };

            try
            {
                sessao.Save(divida);
                transaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                erros.Add(new ValidationResult($"Erro ao cadastrar Dívida: {ex.Message}"));
                return false;
            }
        }

        public bool AtualizarDividas(int id, DividaDTO dividaDTO, out List<ValidationResult> erros)
        {
            erros = new List<ValidationResult>();
            using var sessao = _sessionFactory.OpenSession();
            using var transaction = sessao.BeginTransaction();

            var divida = sessao.Get<Divida>(id);
            if (divida == null)
            {
                erros.Add(new ValidationResult("Dívida não encontrada."));
                return false;
            }

            try
            {
                divida.Situacao = dividaDTO.Situacao;
                if (dividaDTO.Situacao == Situacao.Paga)
                {
                    divida.DataPagamento = dividaDTO.DataPagamento ?? DateTime.Today;
                }

                divida.Valor = dividaDTO.Valor ?? divida.Valor;
                divida.Descricao = dividaDTO.Descricao ?? divida.Descricao;

                sessao.Merge(divida);
                transaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                erros.Add(new ValidationResult($"Erro ao atualizar Dívida: {ex.Message}"));
                return false;
            }
        }

        public bool ExcluirDividas(int id, out List<ValidationResult> erros)
        {
            erros = new List<ValidationResult>();
            using var sessao = _sessionFactory.OpenSession();
            using var transaction = sessao.BeginTransaction();

            var divida = sessao.Get<Divida>(id);

            if (divida == null)
            {
                erros.Add(new ValidationResult($"Dívida do cliente {id} não encontrada"));
                return false;
            }

            try
            {
                sessao.Delete(divida);
                transaction.Commit();
                return true;
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                erros.Add(new ValidationResult($"Erro ao excluir Dívida: {ex.Message}"));
                return false;
            }
        }

        public decimal SomarDividasClientes(int clienteId)
        {
            using var sessao = _sessionFactory.OpenSession();

            var totalDividas = sessao.Query<Divida>()
                .Where(d => d.Cliente.Id == clienteId && d.Situacao == Situacao.Pendente)
                .Sum(d => (decimal?)d.Valor) ?? 0;

            return totalDividas;
        }
    }
}
