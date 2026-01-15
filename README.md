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

### Prerequisites

- [Node.js 20.x](https://nodejs.org/) or later
- npm (comes with Node.js)

### Running the Application

```bash
cd front-end
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

### Running Tests

```bash
cd front-end
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report
```

### Building for Production

```bash
cd front-end
npm run build
npm run preview     # Preview production build locally
```

### Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- React Router (navigation)
- Vitest + React Testing Library (testing)
- Clean Architecture pattern

### Features

- ✅ Responsive grid layout showing country flags
- ✅ Click any flag to view detailed country information
- ✅ Country details: name, population, capital, region, area
- ✅ 90%+ test coverage
- ✅ Type-safe with TypeScript
- ✅ Clean architecture (domain, infrastructure, presentation layers)

---

**Assessment Date:** January 2026
