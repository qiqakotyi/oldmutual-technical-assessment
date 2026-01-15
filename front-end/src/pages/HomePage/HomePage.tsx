import { useState, useMemo } from 'react';
import { useCountries } from '../../hooks/useCountries';
import { CountryCard } from '../../components/CountryCard';
import { SkeletonGrid } from '../../components/SkeletonCard';
import { ErrorMessage } from '../../components/ErrorMessage';
import './HomePage.scss';

const ITEMS_PER_PAGE = 24;

export const HomePage = () => {
  const { countries, loading, error } = useCountries();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return countries;
    
    const query = searchQuery.toLowerCase();
    return countries.filter((country) =>
      country.name.toLowerCase().includes(query) ||
      (country.capital && country.capital.toLowerCase().includes(query))
    );
  }, [countries, searchQuery]);

  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCountries = filteredCountries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Countries of the World</h1>
        <p className="subtitle">
          Explore <span className="count">{loading ? '...' : filteredCountries.length}</span> countries and their flags
        </p>
      </header>

      {!loading && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by country name or capital..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <span className="search-icon">🔍</span>
        </div>
      )}
      
      {loading ? (
        <SkeletonGrid />
      ) : (
        <>
          {paginatedCountries.length === 0 ? (
            <div className="no-results">
              <p>No countries found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="countries-grid">
              {paginatedCountries.map((country) => (
                <CountryCard key={country.name} country={country} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return <span key={page} className="pagination-ellipsis">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
