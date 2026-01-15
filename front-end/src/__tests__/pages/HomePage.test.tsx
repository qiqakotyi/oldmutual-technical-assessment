import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../../pages/HomePage';
import { countryService } from '../../services/countryService';

const mockCountries = [
  { name: 'South Africa', flag: 'https://flag.url/za.svg', population: 59000000, capital: 'Pretoria' },
  { name: 'Nigeria', flag: 'https://flag.url/ng.svg', population: 206000000, capital: 'Abuja' },
];

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
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/countries and their flags/i)).toBeInTheDocument();
    });
  });
});
