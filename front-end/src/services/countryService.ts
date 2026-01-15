import type { Country, CountryDetail } from '../types/Country';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const countryService = {
  async getAllCountries(): Promise<Country[]> {
    const response = await fetch(`${API_BASE_URL}/countries`);
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    return response.json();
  },

  async getCountryByName(name: string): Promise<CountryDetail> {
    const response = await fetch(`${API_BASE_URL}/countries/${encodeURIComponent(name)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch country: ${name}`);
    }
    return response.json();
  },
};
