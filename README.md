# Old Mutual Technical Assessment

A full-stack application that provides country information through a RESTful API.

## Architecture

This project follows Clean Architecture principles with four layers:

- **Api** - Controllers, middleware, and HTTP configuration
- **Application** - Business logic, DTOs, and service interfaces
- **Domain** - Core entities and repository interfaces
- **Infrastructure** - External API clients, caching, and data access

## Project Structure

```
├── backend/          # .NET Core Web API
│   ├── src/
│   │   ├── CountryApi.Api/           # Web API layer
│   │   ├── CountryApi.Application/    # Application logic
│   │   ├── CountryApi.Domain/         # Domain entities
│   │   └── CountryApi.Infrastructure/ # External integrations
│   └── tests/
│       └── CountryApi.UnitTests/      # Unit tests
└── front-end/        # Frontend application
```

## Technologies

- .NET 8
- ASP.NET Core Web API
- xUnit & FluentAssertions (Testing)
- Moq (Mocking)
- Memory Cache (Caching)

## Backend Setup

### Prerequisites

- [.NET SDK 8.0](https://dotnet.microsoft.com/download) or later
- IDE (Visual Studio, VS Code, or Rider)

### Running the API

```bash
cd backend
dotnet restore
cd src/CountryApi.Api
dotnet run
```

The API will be available at `http://localhost:5145/swagger` with Swagger UI

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /countries | Retrieve all countries (name and flag) |
| GET | /countries/{name} | Retrieve details for a specific country |

### Example Responses

**GET /countries**
```json
[
  {
    "name": "South Africa",
    "flag": "https://flagcdn.com/w320/za.png"
  }
]
```

**GET /countries/South Africa**
```json
{
  "name": "South Africa",
  "population": 59308690,
  "capital": "Pretoria",
  "flag": "https://flagcdn.com/w320/za.png"
}
```

### Running Tests

```bash
cd backend
dotnet test
```

For coverage report:
```bash
dotnet test --collect:"XPlat Code Coverage" --settings tests/CountryApi.UnitTests/coverlet.runsettings.xml
```

## Front-end Setup

_To be added_

---

**Assessment Date:** January 2026
