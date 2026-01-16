import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { renderWithClient } from '../test-utils';

describe('NotFoundPage', () => {
  it('should render 404 message', () => {
    renderWithClient(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should display error message', () => {
    renderWithClient(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/doesn't exist or has been moved/i)).toBeInTheDocument();
  });

  it('should have link to home page', () => {
    renderWithClient(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );
    
    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
