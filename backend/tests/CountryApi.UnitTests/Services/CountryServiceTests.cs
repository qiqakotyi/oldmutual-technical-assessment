using CountryApi.Application.Services;
using CountryApi.Domain.Entities;
using CountryApi.Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace CountryApi.UnitTests.Services;

public class CountryServiceTests
{
    private readonly Mock<ICountryRepository> _mockRepository;
    private readonly CountryService _service;

    public CountryServiceTests()
    {
        _mockRepository = new Mock<ICountryRepository>();
        _service = new CountryService(_mockRepository.Object);
    }

    [Fact]
    public async Task GetAllCountriesAsync_ReturnsCountryDtos()
    {
        // Arrange
        var countries = TestData.GetTestCountries();
        _mockRepository.Setup(r => r.GetAllCountriesAsync()).ReturnsAsync(countries);

        // Act
        var result = await _service.GetAllCountriesAsync();

        // Assert
        result.Should().HaveCount(3);
        result.First().Name.Should().Be("South Africa");
        result.First().Flag.Should().Be("https://flagcdn.com/w320/za.png");
    }

    [Fact]
    public async Task GetAllCountriesAsync_WhenEmpty_ReturnsEmptyList()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetAllCountriesAsync()).ReturnsAsync(new List<Country>());

        // Act
        var result = await _service.GetAllCountriesAsync();

        // Assert
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetCountryByNameAsync_WhenCountryExists_ReturnsDetails()
    {
        // Arrange
        var country = TestData.GetSouthAfrica();
        _mockRepository.Setup(r => r.GetCountryByNameAsync("South Africa")).ReturnsAsync(country);

        // Act
        var result = await _service.GetCountryByNameAsync("South Africa");

        // Assert
        result.Should().NotBeNull();
        result!.Name.Should().Be("South Africa");
        result.Population.Should().Be(59308690);
        result.Capital.Should().Be("Pretoria");
        result.Flag.Should().Be("https://flagcdn.com/w320/za.png");
    }

    [Fact]
    public async Task GetCountryByNameAsync_WhenCountryDoesNotExist_ReturnsNull()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetCountryByNameAsync("Wakanda")).ReturnsAsync((Country?)null);

        // Act
        var result = await _service.GetCountryByNameAsync("Wakanda");

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAllCountriesAsync_CallsRepositoryOnce()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetAllCountriesAsync()).ReturnsAsync(TestData.GetTestCountries());

        // Act
        await _service.GetAllCountriesAsync();

        // Assert
        _mockRepository.Verify(r => r.GetAllCountriesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetCountryByNameAsync_CallsRepositoryWithCorrectName()
    {
        // Arrange
        _mockRepository.Setup(r => r.GetCountryByNameAsync(It.IsAny<string>())).ReturnsAsync(TestData.GetSouthAfrica());

        // Act
        await _service.GetCountryByNameAsync("South Africa");

        // Assert
        _mockRepository.Verify(r => r.GetCountryByNameAsync("South Africa"), Times.Once);
    }
}