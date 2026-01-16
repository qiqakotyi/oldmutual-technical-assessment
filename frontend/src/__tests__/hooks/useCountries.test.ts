import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCountries } from '../../hooks/useCountries';
import { countryService } from '../../services/countryService';
import { createWrapper } from '../test-utils';

vi.mock('../../services/countryService');

describe('useCountries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch countries successfully', async () => {
    const mockCountries = [
      { name: 'Test', flag: 'test.svg', population: 1000, capital: 'Capital' },
    ];

    vi.mocked(countryService.getAllCountries).mockResolvedValue(mockCountries);

    const { result } = renderHook(() => useCountries(), { wrapper: createWrapper() });

    expect(result.current.loading).toBe(true);
    expect(result.current.countries).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.error).toBeNull();
  });

  it('should handle Error instance', async () => {
    const errorMessage = 'Network error';
    vi.mocked(countryService.getAllCountries).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCountries(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.countries).toEqual([]);
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(countryService.getAllCountries).mockRejectedValue('String error');

    const { result } = renderHook(() => useCountries(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch countries');
    expect(result.current.countries).toEqual([]);
  });
});
