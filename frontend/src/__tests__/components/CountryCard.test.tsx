import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { CountryCard } from '../../components/CountryCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CountryCard', () => {
  const mockCountry = {
    name: 'South Africa',
    flag: 'https://flag.url/za.svg',
    population: 59000000,
    capital: 'Pretoria',
  };

  it('should render country name and flag', () => {
    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );

    expect(screen.getByText('South Africa')).toBeInTheDocument();
    expect(screen.getByAltText('South Africa flag')).toBeInTheDocument();
  });

  it('should navigate to detail page on click', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );

    const card = screen.getByRole('button');
    await user.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/country/South%20Africa');
  });

  it('should display flag image with correct src', () => {
    render(
      <BrowserRouter>
        <CountryCard country={mockCountry} />
      </BrowserRouter>
    );

    const img = screen.getByAltText('South Africa flag') as HTMLImageElement;
    expect(img.src).toBe('https://flag.url/za.svg');
  });
});
