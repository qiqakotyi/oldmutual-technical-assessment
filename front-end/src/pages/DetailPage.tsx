import { useParams, useNavigate } from 'react-router-dom';
import { useCountryDetail } from '../hooks/useCountryDetail';
import { Loader } from '../components/Loader';
import { ErrorMessage } from '../components/ErrorMessage';
import './DetailPage.scss';

export const DetailPage = () => {
  const { countryName } = useParams<{ countryName: string }>();
  const navigate = useNavigate();
  const { country, loading, error } = useCountryDetail(countryName);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!country) return <ErrorMessage message="Country not found" />;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="detail-page">
      <button className="back-button" onClick={() => navigate('/')}>
        ← Back to Countries
      </button>

      <div className="detail-container">
        <div className="flag-section">
          <img src={country.flag} alt={`${country.name} flag`} className="detail-flag" />
        </div>

        <div className="info-section">
          <h1 className="country-title">{country.name}</h1>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">
                <span className="label-icon">🏛️</span>
                Capital
              </span>
              <span className="info-value">{country.capital}</span>
            </div>

            <div className="info-item">
              <span className="info-label">
                <span className="label-icon">👥</span>
                Population
              </span>
              <span className="info-value">{formatNumber(country.population)}</span>
            </div>

            {country.region && (
              <div className="info-item">
                <span className="info-label">
                  <span className="label-icon">🌍</span>
                  Region
                </span>
                <span className="info-value">{country.region}</span>
              </div>
            )}

            {country.subregion && (
              <div className="info-item">
                <span className="info-label">
                  <span className="label-icon">📍</span>
                  Subregion
                </span>
                <span className="info-value">{country.subregion}</span>
              </div>
            )}

            {country.area && (
              <div className="info-item">
                <span className="info-label">
                  <span className="label-icon">📏</span>
                  Area
                </span>
                <span className="info-value">{formatNumber(country.area)} km²</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
