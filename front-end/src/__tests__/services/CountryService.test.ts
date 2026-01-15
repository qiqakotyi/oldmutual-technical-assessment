import { describe, it, expect, vi, beforeEach } from 'vitest';
import { countryService } from '../../services/countryService';

global.fetch = vi.fn();

describe('countryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllCountries', () => {
    it('should fetch all countries successfully', async () => {
      const mockData = [
        { name: 'Test', flag: 'test.svg', population: 1000, capital: 'Capital' },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await countryService.getAllCountries();
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/countries'));
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

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

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await countryService.getCountryByName('Test');
      expect(result).toEqual(mockData);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/countries/Test'));
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(countryService.getCountryByName('Test')).rejects.toThrow('Failed to fetch country: Test');
    });
  });
});
