using CountryApi.Domain.Entities;

namespace CountryApi.UnitTests;

public static class TestData
{
    public static List<Country> GetTestCountries()
    {
        return new List<Country>
        {
            new()
            {
                Name = "South Africa",
                Flag = "https://flagcdn.com/w320/za.png",
                Population = 59308690,
                Capital = "Pretoria"
            },
            new()
            {
                Name = "Nigeria",
                Flag = "https://flagcdn.com/w320/ng.png",
                Population = 206139589,
                Capital = "Abuja"
            },
            new()
            {
                Name = "Kenya",
                Flag = "https://flagcdn.com/w320/ke.png",
                Population = 53771296,
                Capital = "Nairobi"
            }
        };
    }

    public static Country GetSouthAfrica()
    {
        return new Country
        {
            Name = "South Africa",
            Flag = "https://flagcdn.com/w320/za.png",
            Population = 59308690,
            Capital = "Pretoria"
        };
    }
}