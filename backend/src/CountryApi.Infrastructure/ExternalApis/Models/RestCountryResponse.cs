using System.Text.Json.Serialization;

namespace CountryApi.Infrastructure.ExternalApis.Models;

public class RestCountryResponse
{
    [JsonPropertyName("name")]
    public RestCountryName Name { get; set; } = new();

    [JsonPropertyName("population")]
    public long Population { get; set; }

    [JsonPropertyName("capital")]
    public List<string>? Capital { get; set; }

    [JsonPropertyName("flags")]
    public RestCountryFlags Flags { get; set; } = new();
}

public class RestCountryName
{
    [JsonPropertyName("common")]
    public string Common { get; set; } = string.Empty;

    [JsonPropertyName("official")]
    public string Official { get; set; } = string.Empty;
}

public class RestCountryFlags
{
    [JsonPropertyName("png")]
    public string Png { get; set; } = string.Empty;

    [JsonPropertyName("svg")]
    public string Svg { get; set; } = string.Empty;
}