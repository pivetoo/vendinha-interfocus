namespace VendinhaInterfocus.Models.Entidades
{
    public class Cliente
    {
        public virtual int Id { get; set; }
        public virtual string NomeCompleto { get; set; }
        public virtual string CPF { get; set; }
        public virtual DateTime DataNascimento { get; set; }
        public virtual string Email { get; set; }
        public virtual IList<Divida> Dividas { get; set; }

        public Cliente()
        {
            Dividas = new List<Divida>();
        }
    }
}
