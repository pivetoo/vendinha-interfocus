using NHibernate;
using NHibernate.Cfg;
using NHibernateSession = NHibernate.ISession;
using VendinhaInterfocus.Services;

var builder = WebApplication.CreateBuilder(args);

// Configura��o de NHibernate
builder.Services.AddSingleton<ISessionFactory>((serviceProvider) =>
{
    var config = new Configuration();
    var configFile = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "hibernate.cfg.xml");
    config.Configure(configFile);
    return config.BuildSessionFactory();
});

// Registrar NHibernate.ISession como um servi�o por escopo usando o alias
builder.Services.AddScoped<NHibernateSession>(serviceProvider =>
    serviceProvider.GetRequiredService<ISessionFactory>().OpenSession());

// Adicionar servi�o CORS
builder.Services.AddCors(
    b => b.AddDefaultPolicy(c => c.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin())
);

// Registro dos servi�os e reposit�rios da aplica��o
builder.Services.AddScoped<ClienteService>();
builder.Services.AddScoped<DividaService>();

// Adicionar servi�os ao container.
builder.Services.AddControllers();

// Configura��o do Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
