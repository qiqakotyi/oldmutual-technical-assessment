import { describe, it, expect, vi, beforeEach } from 'vitest';
import { countryService } from '../../services/countryService';

const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('countryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCountries', () => {
    it('should fetch all countries successfully', async () => {
      const mockData = [
        { name: 'Test', flag: 'test.svg', population: 1000, capital: 'Capital' },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await countryService.getAllCountries();
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/countries'));
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(countryService.getAllCountries()).rejects.toThrow('Failed to fetch countries');
    });
  });

  describe('getCountryByName', () => {
    it('should fetch country by name successfully', async () => {
      const mockData = {
        name: 'Test',
        flag: 'test.svg',
        population: 1000,
        capital: 'Capital',
        region: 'Region',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as Response);

      const result = await countryService.getCountryByName('Test');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/countries/Test'));
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await expect(countryService.getCountryByName('Test')).rejects.toThrow('Failed to fetch country: Test');
    });
  });
});
