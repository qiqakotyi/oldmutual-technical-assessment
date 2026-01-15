using CountryApi.Application.DTOs;
using CountryApi.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CountryApi.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class CountriesController : ControllerBase
{
    private readonly ICountryService _countryService;
    private readonly ILogger<CountriesController> _logger;

    public CountriesController(ICountryService countryService, ILogger<CountriesController> logger)
    {
        _countryService = countryService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieve all countries
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<CountryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IEnumerable<CountryDto>>> GetAllCountries()
    {
        _logger.LogInformation("Retrieving all countries");

        var countries = await _countryService.GetAllCountriesAsync();

        return Ok(countries);
    }

    /// <summary>
    /// Retrieve details about a specific country
    /// </summary>
    [HttpGet("{name}")]
    [ProducesResponseType(typeof(CountryDetailsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<CountryDetailsDto>> GetCountryByName(string name)
    {
        _logger.LogInformation("Retrieving country: {CountryName}", name);

        var country = await _countryService.GetCountryByNameAsync(name);

        if (country is null)
        {
            _logger.LogWarning("Country not found: {CountryName}", name);
            return NotFound(new { message = $"Country '{name}' not found" });
        }

        return Ok(country);
    }
}