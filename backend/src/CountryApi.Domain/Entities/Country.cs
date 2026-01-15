namespace CountryApi.Domain.Entities;

public class Country
{
    public string Name { get; set; } = string.Empty;
    public string Flag { get; set; } = string.Empty;
    public long Population { get; set; }
    public string Capital { get; set; } = string.Empty;
}