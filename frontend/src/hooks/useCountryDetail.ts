import { useQuery } from '@tanstack/react-query';
import { countryService } from '../services/countryService';

export const useCountryDetail = (countryName: string | undefined) => {
  const { data: country = null, isLoading: loading, error } = useQuery({
    queryKey: ['country', countryName],
    queryFn: () => countryService.getCountryByName(countryName!),
    enabled: !!countryName,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { 
    country, 
    loading, 
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch country details') : null 
  };
};
