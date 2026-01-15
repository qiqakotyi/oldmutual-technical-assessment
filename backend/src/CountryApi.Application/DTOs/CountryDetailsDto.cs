namespace CountryApi.Application.DTOs;

public record CountryDetailsDto(
    string Name,
    int Population,
    string Capital,
    string Flag
);