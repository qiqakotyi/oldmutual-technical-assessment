import { useNavigate } from 'react-router-dom';
import type { Country } from '../../types/Country';
import './CountryCard.scss';

interface CountryCardProps {
  country: Country;
}

export const CountryCard = ({ country }: CountryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/country/${encodeURIComponent(country.name)}`);
  };

  return (
    <div className="country-card" onClick={handleClick} role="button" tabIndex={0}>
      <div className="flag-container">
        <img src={country.flag} alt={`${country.name} flag`} className="flag-image" />
      </div>
      <div className="country-info">
        <h3 className="country-name">{country.name}</h3>
      </div>
    </div>
  );
};
