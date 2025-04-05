import React from "react";
import "./CountryCard.css";

const CountryCard = ({ country }) => {
  return (
    <div className="card">
      <img src={country.flag} alt={country.name} />
      <div className="info">
        <h3>{country.name}</h3>
        <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> {country.region}</p>
        <p><strong>Capital:</strong> {country.capital}</p>
      </div>
    </div>
  );
};

export default CountryCard;
