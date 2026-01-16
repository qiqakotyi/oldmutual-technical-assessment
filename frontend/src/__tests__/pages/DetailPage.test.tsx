import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DetailPage } from '../../pages/DetailPage';
import { countryService } from '../../services/countryService';
import { renderWithClient } from '../test-utils';

const mockCountryDetail = {
  name: 'South Africa',
  flag: 'https://flag.url/za.svg',
  population: 59000000,
  capital: 'Pretoria',
  region: 'Africa',
  subregion: 'Southern Africa',
  area: 1221037,
};

describe('DetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    vi.spyOn(countryService, 'getCountryByName').mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithClient(
      <MemoryRouter initialEntries={['/country/South%20Africa']}>
        <Routes>
          <Route path="/country/:countryName" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display country details after loading', async () => {
    vi.spyOn(countryService, 'getCountryByName').mockResolvedValue(mockCountryDetail);

    renderWithClient(
      <MemoryRouter initialEntries={['/country/South%20Africa']}>
        <Routes>
          <Route path="/country/:countryName" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('South Africa')).toBeInTheDocument();
      expect(screen.getByText('Pretoria')).toBeInTheDocument();
      expect(screen.getByText(/59,000,000/)).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    vi.spyOn(countryService, 'getCountryByName').mockRejectedValue(
      new Error('Country not found')
    );

    renderWithClient(
      <MemoryRouter initialEntries={['/country/InvalidCountry']}>
        <Routes>
          <Route path="/country/:countryName" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('should format population number correctly', async () => {
    vi.spyOn(countryService, 'getCountryByName').mockResolvedValue(mockCountryDetail);

    renderWithClient(
      <MemoryRouter initialEntries={['/country/South%20Africa']}>
        <Routes>
          <Route path="/country/:countryName" element={<DetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/59,000,000/)).toBeInTheDocument();
    });
  });
});
