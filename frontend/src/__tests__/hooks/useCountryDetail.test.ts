import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCountryDetail } from '../../hooks/useCountryDetail';
import { countryService } from '../../services/countryService';
import { createWrapper } from '../test-utils';

vi.mock('../../services/countryService');

describe('useCountryDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch country detail successfully', async () => {
    const mockCountry = {
      name: 'Test',
      flag: 'test.svg',
      population: 1000,
      capital: 'Capital',
      region: 'Region',
    };

    vi.mocked(countryService.getCountryByName).mockResolvedValue(mockCountry);

    const { result } = renderHook(() => useCountryDetail('Test'), { wrapper: createWrapper() });

    expect(result.current.loading).toBe(true);
    expect(result.current.country).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.country).toEqual(mockCountry);
    expect(result.current.error).toBeNull();
  });

  it('should handle Error instance', async () => {
    const errorMessage = 'Not found';
    vi.mocked(countryService.getCountryByName).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCountryDetail('Test'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.country).toBeNull();
  });

  it('should handle non-Error exceptions', async () => {
    vi.mocked(countryService.getCountryByName).mockRejectedValue('String error');

    const { result } = renderHook(() => useCountryDetail('Test'), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch country details');
    expect(result.current.country).toBeNull();
  });

  it('should not fetch when country name is undefined', async () => {
    const { result } = renderHook(() => useCountryDetail(undefined), { wrapper: createWrapper() });

    expect(result.current.loading).toBe(false);
    expect(result.current.country).toBeNull();
    expect(result.current.error).toBeNull();
    expect(countryService.getCountryByName).not.toHaveBeenCalled();
  });
});
