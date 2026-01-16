import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import './SearchForm.scss';

interface SearchFormProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchForm = ({ onSearch, placeholder = 'Search...' }: SearchFormProps) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateInput = (value: string): string | null => {
    // Check for valid characters (alphanumeric, spaces, hyphens, apostrophes)
    const validPattern = /^[a-zA-Z0-9\s\-']*$/;
    if (!validPattern.test(value)) {
      return 'Please use only letters, numbers, spaces, hyphens, and apostrophes';
    }

    // Check minimum length if input is not empty
    if (value.trim() && value.trim().length < 2) {
      return 'Search query must be at least 2 characters';
    }

    // Check maximum length
    if (value.length > 50) {
      return 'Search query must be less than 50 characters';
    }

    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const validationError = validateInput(value);
    setError(validationError);

    // Only trigger search if valid or empty
    if (!validationError) {
      onSearch(value);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationError = validateInput(query);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    setError(null);
    onSearch('');
  };

  return (
    <form className="search-form" onSubmit={handleSubmit} noValidate>
      <div className="search-input-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          className={`search-input ${error ? 'search-input--error' : ''}`}
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          aria-label="Search countries"
          aria-invalid={!!error}
          aria-describedby={error ? 'search-error' : undefined}
        />
        {query && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {error && (
        <p className="search-error" id="search-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
};
