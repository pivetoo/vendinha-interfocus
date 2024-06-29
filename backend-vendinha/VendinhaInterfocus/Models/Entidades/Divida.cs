namespace VendinhaInterfocus.Models.Entidades
{
    public class Divida
    {
        public virtual int Id { get; set; }
        public virtual Cliente Cliente { get; set; }
        public virtual decimal Valor { get; set; }
        public virtual Situacao? Situacao { get; set; }
        public virtual DateTime DataCriacao { get; set; }
        public virtual DateTime? DataPagamento { get; set; }
        public virtual string Descricao { get; set; }
    }

    public enum Situacao
    {
        Pendente = 0,
        Paga = 1,
        Atraso = 2
    }
}
