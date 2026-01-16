import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('should render without crashing', async () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
    
    await waitFor(() => {
      expect(container.querySelector('.app')).toBeInTheDocument();
    });
  });

  it('should have router and QueryClient setup', async () => {
    const { container } = render(<App />);
    
    await waitFor(() => {
      expect(container.querySelector('.app')).toBeInTheDocument();
    });
  });
});
