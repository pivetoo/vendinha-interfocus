using VendinhaInterfocus.Models.Entidades;

namespace VendinhaInterfocus.Models.DTO
{
    public class DividaDTO
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public string? ClienteNome { get; set; }
        public string? DataNascimento { get; set; }
        public decimal? Valor { get; set; }
        public string? CPF { get; set; }
        public string? Email { get; set; }
        public Situacao Situacao { get; set; }
        public decimal? TotalDividas { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataPagamento { get; set; }
        public string? Descricao { get; set; }
    }
}
