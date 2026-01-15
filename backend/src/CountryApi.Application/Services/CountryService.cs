using CountryApi.Application.DTOs;
using CountryApi.Application.Interfaces;
using CountryApi.Domain.Interfaces;

namespace CountryApi.Application.Services;

public class CountryService : ICountryService
{
    private readonly ICountryRepository _countryRepository;

    public CountryService(ICountryRepository countryRepository)
    {
        _countryRepository = countryRepository;
    }

    public async Task<IEnumerable<CountryDto>> GetAllCountriesAsync()
    {
        var countries = await _countryRepository.GetAllCountriesAsync();
        
        return countries.Select(c => new CountryDto(
            c.Name,
            c.Flag
        ));
    }

    public async Task<CountryDetailsDto?> GetCountryByNameAsync(string name)
    {
        var country = await _countryRepository.GetCountryByNameAsync(name);
        
        if (country is null)
            return null;

        return new CountryDetailsDto(
            country.Name,
            (int)country.Population,
            country.Capital,
            country.Flag
        );
    }
}