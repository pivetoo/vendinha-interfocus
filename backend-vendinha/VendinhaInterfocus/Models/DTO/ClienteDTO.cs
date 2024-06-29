namespace VendinhaInterfocus.Models.DTO
{
    public class ClienteDTO
    {
        public int Id { get; set; }
        public string NomeCompleto { get; set; }
        public string CPF { get; set; }
        public DateTime DataNascimento { get; set; }
        public string Email { get; set; }
        public decimal? TotalDividas { get; set; }
    }
}
