import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';
import { countryService } from '../../services/countryService';

const mockCountries = [
  { name: 'South Africa', flag: 'https://flag.url/za.svg', population: 59000000, capital: 'Pretoria' },
  { name: 'Nigeria', flag: 'https://flag.url/ng.svg', population: 206000000, capital: 'Abuja' },
  { name: 'Kenya', flag: 'https://flag.url/ke.svg', population: 53000000, capital: 'Nairobi' },
  { name: 'Egypt', flag: 'https://flag.url/eg.svg', population: 102000000, capital: 'Cairo' },
];

const generateManyCountries = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    name: `Country ${i + 1}`,
    flag: `https://flag.url/${i}.svg`,
    population: 1000000 + i,
    capital: `Capital ${i + 1}`,
  }));
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    vi.spyOn(countryService, 'getAllCountries').mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getAllByRole('generic', { class: /skeleton/ }).length).toBeGreaterThan(0);
  });

  it('should display countries after loading', async () => {
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(mockCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('South Africa')).toBeInTheDocument();
      expect(screen.getByText('Nigeria')).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    vi.spyOn(countryService, 'getAllCountries').mockRejectedValue(
      new Error('Network error')
    );

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('should display correct number of countries', async () => {
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(mockCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText(/countries and their flags/i)).toBeInTheDocument();
    });
  });

  it('should filter countries by search query', async () => {
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(mockCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('South Africa')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by country name or capital/i);
    fireEvent.change(searchInput, { target: { value: 'South' } });

    await waitFor(() => {
      expect(screen.getByText('South Africa')).toBeInTheDocument();
      expect(screen.queryByText('Nigeria')).not.toBeInTheDocument();
    });
  });

  it('should show no results message when search has no matches', async () => {
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(mockCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('South Africa')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by country name or capital/i);
    fireEvent.change(searchInput, { target: { value: 'XYZ123' } });

    await waitFor(() => {
      expect(screen.getByText(/no countries found matching/i)).toBeInTheDocument();
    });
  });

  it('should display pagination when there are more than 24 countries', async () => {
    const manyCountries = generateManyCountries(30);
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(manyCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Country 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Next →')).toBeInTheDocument();
    expect(screen.getByText('← Previous')).toBeInTheDocument();
  });

  it('should navigate to next page when Next button is clicked', async () => {
    const manyCountries = generateManyCountries(30);
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(manyCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Country 1')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next →');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Country 25')).toBeInTheDocument();
      expect(screen.queryByText('Country 1')).not.toBeInTheDocument();
    });
  });

  it('should navigate to specific page when page number is clicked', async () => {
    const manyCountries = generateManyCountries(30);
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(manyCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Country 1')).toBeInTheDocument();
    });

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(screen.getByText('Country 25')).toBeInTheDocument();
    });
  });

  it('should disable Previous button on first page', async () => {
    const manyCountries = generateManyCountries(30);
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(manyCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Country 1')).toBeInTheDocument();
    });

    const prevButton = screen.getByText('← Previous');
    expect(prevButton).toBeDisabled();
  });

  it('should disable Next button on last page', async () => {
    const manyCountries = generateManyCountries(30);
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(manyCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Country 1')).toBeInTheDocument();
    });

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    await waitFor(() => {
      const nextButton = screen.getByText('Next →');
      expect(nextButton).toBeDisabled();
    });
  });

  it('should reset to page 1 when search query changes', async () => {
    const manyCountries = generateManyCountries(30);
    vi.spyOn(countryService, 'getAllCountries').mockResolvedValue(manyCountries);

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Country 1')).toBeInTheDocument();
    });

    // Go to page 2
    const nextButton = screen.getByText('Next →');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Country 25')).toBeInTheDocument();
    });

    // Search for something
    const searchInput = screen.getByPlaceholderText(/search by country name or capital/i);
    fireEvent.change(searchInput, { target: { value: 'Country 1' } });

    // Should be back on page 1
    await waitFor(() => {
      expect(screen.getByText('Country 1')).toBeInTheDocument();
      expect(screen.queryByText('Country 25')).not.toBeInTheDocument();
    });
  });
});
