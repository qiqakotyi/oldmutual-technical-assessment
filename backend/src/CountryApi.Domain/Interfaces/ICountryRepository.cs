using CountryApi.Domain.Entities;

namespace CountryApi.Domain.Interfaces;

public interface ICountryRepository
{
    Task<IEnumerable<Country>> GetAllCountriesAsync();
    Task<Country?> GetCountryByNameAsync(string name);
}