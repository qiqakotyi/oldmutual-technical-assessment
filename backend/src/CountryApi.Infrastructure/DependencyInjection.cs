using CountryApi.Domain.Interfaces;
using CountryApi.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace CountryApi.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddMemoryCache();

        services.AddHttpClient<ICountryRepository, CountryRepository>(client =>
        {
            client.BaseAddress = new Uri("https://restcountries.com/v3.1/");
            client.Timeout = TimeSpan.FromSeconds(30);
            client.DefaultRequestHeaders.Add("User-Agent", "CountryApi/1.0");
            client.DefaultRequestHeaders.Add("Accept", "application/json");
        });

        return services;
    }
}