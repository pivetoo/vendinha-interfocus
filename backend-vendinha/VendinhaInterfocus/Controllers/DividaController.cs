using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using VendinhaInterfocus.Models.DTO;
using VendinhaInterfocus.Services;

namespace VendinhaInterfocus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DividaController : ControllerBase
    {
        public readonly DividaService _dividaService;

        public DividaController(DividaService dividaService)
        {
            _dividaService = dividaService;
        }

        [HttpGet]
        public IActionResult ListarDividas(int page = 1, int size = 10, string busca = "", bool mostrarPago = false)
        {
            var dividas = _dividaService.ListarDividas(page, size, busca, mostrarPago, out int totalDividas);
            var result = new
            {
                Dividas = dividas,
                TotalDividas = totalDividas
            };
            return Ok(result);
        }

        [HttpGet("cliente/{clienteId}")]
        public IActionResult ListarDividasPorId(int clienteId, int page = 1, int size = 10)
        {
            var dividas = _dividaService.ListarDividasPorId(clienteId, page, size);
            var result = new { Dividas = dividas };
            return Ok(result);
        }

        [HttpPost]
        public IActionResult CadastrarDividas(DividaDTO dividaDTO)
        {
            var cadastro = _dividaService.CadastrarDividas(dividaDTO, out List<ValidationResult> erros);
            return cadastro ? Ok(cadastro) : BadRequest(erros);
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarDividas(int id, DividaDTO dividaDTO)
        {
            var atualizar = _dividaService.AtualizarDividas(id, dividaDTO, out List<ValidationResult> erros);
            return atualizar ? Ok(atualizar) : BadRequest(erros);
        }

        [HttpDelete("{id}")]
        public IActionResult ExcluirDividas(int id)
        {
            var excluir = _dividaService.ExcluirDividas(id, out List<ValidationResult> erros);
            return excluir ? Ok(excluir) : BadRequest(erros);
        }
    }
}
