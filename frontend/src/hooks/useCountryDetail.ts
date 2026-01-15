import { useState, useEffect } from 'react';
import type { CountryDetail } from '../types/Country';
import { countryService } from '../services/countryService';

export const useCountryDetail = (countryName: string | undefined) => {
  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryName) return;

    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await countryService.getCountryByName(countryName);
        setCountry(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch country details');
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [countryName]);

  return { country, loading, error };
};
