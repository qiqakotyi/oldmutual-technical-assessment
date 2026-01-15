using CountryApi.Api.Controllers;
using CountryApi.Application.DTOs;
using CountryApi.Application.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace CountryApi.UnitTests.Controllers;

public class CountriesControllerTests
{
    private readonly Mock<ICountryService> _mockService;
    private readonly Mock<ILogger<CountriesController>> _mockLogger;
    private readonly CountriesController _controller;

    public CountriesControllerTests()
    {
        _mockService = new Mock<ICountryService>();
        _mockLogger = new Mock<ILogger<CountriesController>>();
        _controller = new CountriesController(_mockService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAllCountries_ReturnsOkWithCountries()
    {
        // Arrange
        var countries = new List<CountryDto>
        {
            new("South Africa", "https://flagcdn.com/w320/za.png"),
            new("Nigeria", "https://flagcdn.com/w320/ng.png")
        };
        _mockService.Setup(s => s.GetAllCountriesAsync()).ReturnsAsync(countries);

        // Act
        var result = await _controller.GetAllCountries();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedCountries = okResult.Value.Should().BeAssignableTo<IEnumerable<CountryDto>>().Subject;
        returnedCountries.Should().HaveCount(2);
    }

    [Fact]
    public async Task GetAllCountries_WhenEmpty_ReturnsOkWithEmptyList()
    {
        // Arrange
        _mockService.Setup(s => s.GetAllCountriesAsync()).ReturnsAsync(new List<CountryDto>());

        // Act
        var result = await _controller.GetAllCountries();

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedCountries = okResult.Value.Should().BeAssignableTo<IEnumerable<CountryDto>>().Subject;
        returnedCountries.Should().BeEmpty();
    }

    [Fact]
    public async Task GetCountryByName_WhenCountryExists_ReturnsOkWithDetails()
    {
        // Arrange
        var countryDetails = new CountryDetailsDto("South Africa", 59308690, "Pretoria", "https://flagcdn.com/w320/za.png");
        _mockService.Setup(s => s.GetCountryByNameAsync("South Africa")).ReturnsAsync(countryDetails);

        // Act
        var result = await _controller.GetCountryByName("South Africa");

        // Assert
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedCountry = okResult.Value.Should().BeOfType<CountryDetailsDto>().Subject;
        returnedCountry.Name.Should().Be("South Africa");
        returnedCountry.Population.Should().Be(59308690);
        returnedCountry.Capital.Should().Be("Pretoria");
    }

    [Fact]
    public async Task GetCountryByName_WhenCountryDoesNotExist_ReturnsNotFound()
    {
        // Arrange
        _mockService.Setup(s => s.GetCountryByNameAsync("Wakanda")).ReturnsAsync((CountryDetailsDto?)null);

        // Act
        var result = await _controller.GetCountryByName("Wakanda");

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public async Task GetCountryByName_ReturnsNotFoundWithMessage()
    {
        // Arrange
        _mockService.Setup(s => s.GetCountryByNameAsync("Wakanda")).ReturnsAsync((CountryDetailsDto?)null);

        // Act
        var result = await _controller.GetCountryByName("Wakanda");

        // Assert
        var notFoundResult = result.Result.Should().BeOfType<NotFoundObjectResult>().Subject;
        notFoundResult.Value.Should().NotBeNull();
    }

    [Fact]
    public async Task GetAllCountries_CallsServiceOnce()
    {
        // Arrange
        _mockService.Setup(s => s.GetAllCountriesAsync()).ReturnsAsync(new List<CountryDto>());

        // Act
        await _controller.GetAllCountries();

        // Assert
        _mockService.Verify(s => s.GetAllCountriesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetCountryByName_CallsServiceWithCorrectName()
    {
        // Arrange
        _mockService.Setup(s => s.GetCountryByNameAsync(It.IsAny<string>())).ReturnsAsync((CountryDetailsDto?)null);

        // Act
        await _controller.GetCountryByName("Kenya");

        // Assert
        _mockService.Verify(s => s.GetCountryByNameAsync("Kenya"), Times.Once);
    }
}