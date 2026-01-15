# Old Mutual Technical Assessment

A full-stack application that provides country information through a RESTful API.

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

## Backend Setup

### Prerequisites

- [.NET SDK 8.0](https://dotnet.microsoft.com/download) or later

### Running the API

```bash
cd backend
dotnet restore
cd src/CountryApi.Api
dotnet run
```

The API will be available at `http://localhost:5000` with Swagger UI at `/swagger`

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
