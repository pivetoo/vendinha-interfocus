using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using VendinhaInterfocus.Models.DTO;
using VendinhaInterfocus.Services;

namespace VendinhaInterfocus.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteService _clienteService;

        public ClienteController(ClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpGet]
        public IActionResult ListarClientes(int page = 1, int size = 10, string busca = "")
        {
            var clientes = _clienteService.ListarClientes(page, size, busca, out int totalClientes);
            var result = new
            {
                Clientes = clientes,
                TotalClientes = totalClientes
            };
            return Ok(result);
        }

        [HttpPost]
        public IActionResult CadastrarClientes(ClienteDTO clienteDTO)
        {
            var cadastro = _clienteService.CadastrarClientes(clienteDTO, out List<ValidationResult> erros);
            return cadastro ? Ok(cadastro) : BadRequest(erros);
        }

        [HttpPut("{id}")]
        public IActionResult AtualizarClientes(int id, ClienteDTO clienteDTO)
        {
            if (id != clienteDTO.Id)
            {
                return BadRequest(new ValidationResult("ID do cliente não coincide com nenhum no nosso banco."));
            }

            var atualizar = _clienteService.AtualizarClientes(clienteDTO, out List<ValidationResult> erros);
            return atualizar ? Ok(atualizar) : BadRequest(erros);
        }

        [HttpDelete("{id}")]
        public IActionResult ExcluirClientes(int id)
        {
            var excluir = _clienteService.ExcluirClientes(id, out List<ValidationResult> erros);
            return excluir ? Ok(excluir) : BadRequest(erros);
        }
    }
}