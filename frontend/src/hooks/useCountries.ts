import { useQuery } from '@tanstack/react-query';
import { countryService } from '../services/countryService';

export const useCountries = () => {
  const { data: countries = [], isLoading: loading, error } = useQuery({
    queryKey: ['countries'],
    queryFn: countryService.getAllCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { 
    countries, 
    loading, 
    error: error ? (error instanceof Error ? error.message : 'Failed to fetch countries') : null 
  };
};
