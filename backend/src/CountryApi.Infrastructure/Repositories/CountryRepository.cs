using System.Net.Http.Json;
using CountryApi.Domain.Entities;
using CountryApi.Domain.Interfaces;
using CountryApi.Infrastructure.ExternalApis.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace CountryApi.Infrastructure.Repositories;

public class CountryRepository : ICountryRepository
{
    private readonly HttpClient _httpClient;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CountryRepository> _logger;

    private const string AllCountriesCacheKey = "all_countries";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(1);

    // Specify the fields we need from the API
    private const string FieldsQuery = "?fields=name,population,capital,flags";

    public CountryRepository(
        HttpClient httpClient,
        IMemoryCache cache,
        ILogger<CountryRepository> logger)
    {
        _httpClient = httpClient;
        _cache = cache;
        _logger = logger;
    }

    public async Task<IEnumerable<Country>> GetAllCountriesAsync()
    {
        if (_cache.TryGetValue(AllCountriesCacheKey, out IEnumerable<Country>? cachedCountries))
        {
            _logger.LogDebug("Returning countries from cache");
            return cachedCountries!;
        }

        _logger.LogInformation("Fetching countries from RestCountries API");

        var response = await _httpClient.GetFromJsonAsync<List<RestCountryResponse>>($"all{FieldsQuery}");

        if (response is null)
        {
            _logger.LogWarning("No data returned from RestCountries API");
            return Enumerable.Empty<Country>();
        }

        var countries = response.Select(MapToDomain).ToList();

        _cache.Set(AllCountriesCacheKey, countries, CacheDuration);

        _logger.LogInformation("Cached {Count} countries", countries.Count);

        return countries;
    }

    public async Task<Country?> GetCountryByNameAsync(string name)
    {
        var countries = await GetAllCountriesAsync();

        return countries.FirstOrDefault(c =>
            c.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
    }

    private static Country MapToDomain(RestCountryResponse response)
    {
        return new Country
        {
            Name = response.Name.Common,
            Flag = response.Flags.Png,
            Population = response.Population,
            Capital = response.Capital?.FirstOrDefault() ?? "N/A"
        };
    }
}