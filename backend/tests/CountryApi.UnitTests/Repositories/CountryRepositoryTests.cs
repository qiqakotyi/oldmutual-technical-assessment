using System.Net;
using System.Text.Json;
using CountryApi.Infrastructure.ExternalApis.Models;
using CountryApi.Infrastructure.Repositories;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;

namespace CountryApi.UnitTests.Repositories;

public class CountryRepositoryTests
{
    private readonly Mock<ILogger<CountryRepository>> _mockLogger;
    private readonly IMemoryCache _cache;

    public CountryRepositoryTests()
    {
        _mockLogger = new Mock<ILogger<CountryRepository>>();
        _cache = new MemoryCache(new MemoryCacheOptions());
    }

    private HttpClient CreateMockHttpClient(HttpStatusCode statusCode, object? content = null)
    {
        var mockHandler = new Mock<HttpMessageHandler>();

        var response = new HttpResponseMessage
        {
            StatusCode = statusCode,
            Content = content != null
                ? new StringContent(JsonSerializer.Serialize(content))
                : new StringContent("")
        };

        mockHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(response);

        var httpClient = new HttpClient(mockHandler.Object)
        {
            BaseAddress = new Uri("https://restcountries.com/v3.1/")
        };

        return httpClient;
    }

    [Fact]
    public async Task GetAllCountriesAsync_ReturnsCountriesFromApi()
    {
        // Arrange
        var apiResponse = new List<RestCountryResponse>
        {
            new()
            {
                Name = new RestCountryName { Common = "South Africa", Official = "Republic of South Africa" },
                Population = 59308690,
                Capital = new List<string> { "Pretoria" },
                Flags = new RestCountryFlags { Png = "https://flagcdn.com/w320/za.png", Svg = "" }
            }
        };

        var httpClient = CreateMockHttpClient(HttpStatusCode.OK, apiResponse);
        var repository = new CountryRepository(httpClient, _cache, _mockLogger.Object);

        // Act
        var result = await repository.GetAllCountriesAsync();

        // Assert
        result.Should().HaveCount(1);
        result.First().Name.Should().Be("South Africa");
        result.First().Population.Should().Be(59308690);
        result.First().Capital.Should().Be("Pretoria");
    }

    [Fact]
    public async Task GetAllCountriesAsync_ReturnsCachedData_OnSecondCall()
    {
        // Arrange
        var apiResponse = new List<RestCountryResponse>
        {
            new()
            {
                Name = new RestCountryName { Common = "Kenya", Official = "Republic of Kenya" },
                Population = 53771296,
                Capital = new List<string> { "Nairobi" },
                Flags = new RestCountryFlags { Png = "https://flagcdn.com/w320/ke.png", Svg = "" }
            }
        };

        var httpClient = CreateMockHttpClient(HttpStatusCode.OK, apiResponse);
        var repository = new CountryRepository(httpClient, _cache, _mockLogger.Object);

        // Act
        var firstCall = await repository.GetAllCountriesAsync();
        var secondCall = await repository.GetAllCountriesAsync();

        // Assert
        firstCall.Should().BeEquivalentTo(secondCall);
    }

    [Fact]
    public async Task GetAllCountriesAsync_WhenCapitalIsNull_ReturnsNA()
    {
        // Arrange
        var apiResponse = new List<RestCountryResponse>
        {
            new()
            {
                Name = new RestCountryName { Common = "Antarctica", Official = "Antarctica" },
                Population = 0,
                Capital = null,
                Flags = new RestCountryFlags { Png = "https://flagcdn.com/w320/aq.png", Svg = "" }
            }
        };

        var httpClient = CreateMockHttpClient(HttpStatusCode.OK, apiResponse);
        var repository = new CountryRepository(httpClient, _cache, _mockLogger.Object);

        // Act
        var result = await repository.GetAllCountriesAsync();

        // Assert
        result.First().Capital.Should().Be("N/A");
    }

    [Fact]
    public async Task GetCountryByNameAsync_ReturnsCorrectCountry()
    {
        // Arrange
        var apiResponse = new List<RestCountryResponse>
        {
            new()
            {
                Name = new RestCountryName { Common = "South Africa", Official = "RSA" },
                Population = 59308690,
                Capital = new List<string> { "Pretoria" },
                Flags = new RestCountryFlags { Png = "https://flagcdn.com/za.png", Svg = "" }
            },
            new()
            {
                Name = new RestCountryName { Common = "Nigeria", Official = "Nigeria" },
                Population = 206139589,
                Capital = new List<string> { "Abuja" },
                Flags = new RestCountryFlags { Png = "https://flagcdn.com/ng.png", Svg = "" }
            }
        };

        var httpClient = CreateMockHttpClient(HttpStatusCode.OK, apiResponse);
        var repository = new CountryRepository(httpClient, _cache, _mockLogger.Object);

        // Act
        var result = await repository.GetCountryByNameAsync("Nigeria");

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("Nigeria");
        result.Capital.Should().Be("Abuja");
    }

    [Fact]
    public async Task GetCountryByNameAsync_IsCaseInsensitive()
    {
        // Arrange
        var apiResponse = new List<RestCountryResponse>
        {
            new()
            {
                Name = new RestCountryName { Common = "South Africa", Official = "RSA" },
                Population = 59308690,
                Capital = new List<string> { "Pretoria" },
                Flags = new RestCountryFlags { Png = "https://flagcdn.com/za.png", Svg = "" }
            }
        };

        var httpClient = CreateMockHttpClient(HttpStatusCode.OK, apiResponse);
        var repository = new CountryRepository(httpClient, _cache, _mockLogger.Object);

        // Act
        var result = await repository.GetCountryByNameAsync("south africa");

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("South Africa");
    }

    [Fact]
    public async Task GetCountryByNameAsync_WhenNotFound_ReturnsNull()
    {
        // Arrange
        var apiResponse = new List<RestCountryResponse>
        {
            new()
            {
                Name = new RestCountryName { Common = "South Africa", Official = "RSA" },
                Population = 59308690,
                Capital = new List<string> { "Pretoria" },
                Flags = new RestCountryFlags { Png = "https://flagcdn.com/za.png", Svg = "" }
            }
        };

        var httpClient = CreateMockHttpClient(HttpStatusCode.OK, apiResponse);
        var repository = new CountryRepository(httpClient, _cache, _mockLogger.Object);

        // Act
        var result = await repository.GetCountryByNameAsync("Wakanda");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllCountriesAsync_WhenCapitalListIsEmpty_ReturnsNA()
    {
        // Arrange
        var apiResponse = new List<RestCountryResponse>
        {
            new()
            {
                Name = new RestCountryName { Common = "TestCountry", Official = "TestCountry" },
                Population = 1000,
                Capital = new List<string>(),
                Flags = new RestCountryFlags { Png = "https://flag.png", Svg = "" }
            }
        };

        var httpClient = CreateMockHttpClient(HttpStatusCode.OK, apiResponse);
        var repository = new CountryRepository(httpClient, _cache, _mockLogger.Object);

        // Act
        var result = await repository.GetAllCountriesAsync();

        // Assert
        result.First().Capital.Should().Be("N/A");
    }

    [Fact]
    public async Task GetAllCountriesAsync_MapsAllFieldsCorrectly()
    {
        // Arrange
        var apiResponse = new List<RestCountryResponse>
        {
            new()
            {
                Name = new RestCountryName { Common = "TestCountry", Official = "Official TestCountry" },
                Population = 12345678,
                Capital = new List<string> { "TestCapital", "SecondCapital" },
                Flags = new RestCountryFlags { Png = "https://test.png", Svg = "https://test.svg" }
            }
        };

        var httpClient = CreateMockHttpClient(HttpStatusCode.OK, apiResponse);
        var repository = new CountryRepository(httpClient, _cache, _mockLogger.Object);

        // Act
        var result = await repository.GetAllCountriesAsync();
        var country = result.First();

        // Assert
        country.Name.Should().Be("TestCountry");
        country.Population.Should().Be(12345678);
        country.Capital.Should().Be("TestCapital"); // Takes first capital only
        country.Flag.Should().Be("https://test.png");
    }
}