import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";
import CountryCard from "./CountryCard";
import axios from "axios";
import './App.css';

const Home = ({ countries, error, loading }) => {
  const { theme } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");

  if (loading) {
    return <div className={`loading ${theme}`}>Loading...</div>;
  }

  if (error) {
    return <div className={`error ${theme}`}>{error}</div>;
  }

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) &&
      (region === "" || country.region === region)
  );

  return (
    <>
      <div className={`controls`}>
        <input
          type="text"
          placeholder="Search for a country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`search-input ${theme}`}
        />
        <select
          onChange={(e) => setRegion(e.target.value)}
          value={region}
          className={`region-select ${theme}`}
        >
          <option value="">Filter by Region</option>
          <option value="Africa">Africa</option>
          <option value="Americas">America</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      <div className="grid">
        {filteredCountries.map((country) => (
          <Link
            to={`/country/${country.alpha3Code}`}
            key={country.alpha3Code}
            className="country-link"
          >
            <CountryCard country={country} />
          </Link>
        ))}
      </div>
    </>
  );
};

const CountryDetail = ({ countries, loading }) => {
  const { theme } = useContext(ThemeContext);
  const { countryCode } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);

  useEffect(() => {
    if (!countries || countries.length === 0) return; // Wait until countries data is available

    const foundCountry = countries.find((c) => c.alpha3Code === countryCode);
    setCountry(foundCountry);

    if (foundCountry && foundCountry.borders && Array.isArray(foundCountry.borders)) {
      const borders = countries.filter((c) =>
        foundCountry.borders.includes(c.alpha3Code)
      );
      setBorderCountries(borders);
    } else {
      setBorderCountries([]);
    }
  }, [countryCode, countries]);

  if (!country) {
    return <div className={`loading ${theme}`}>Loading...</div>;
  }

  return (
    <div className={`country-detail ${theme}`}>
      <button
        className={`back-button ${theme}`}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="country-content">
        <div className="country-flag">
          <img src={country.flags?.png} alt={`${country.name} flag`} />
        </div>

        <div className="country-info">
          <h1>{country.name}</h1>

          <div className="details-grid">
            <div className="details-column">
              <p><strong>Native Name:</strong> {country.nativeName || "N/A"}</p>
              <p><strong>Population:</strong> {country.population?.toLocaleString() || "N/A"}</p>
              <p><strong>Region:</strong> {country.region || "N/A"}</p>
              <p><strong>Sub Region:</strong> {country.subregion || "N/A"}</p>
              <p><strong>Capital:</strong> {country.capital || "N/A"}</p>
            </div>

            <div className="details-column">
              <p><strong>Top Level Domain:</strong> {country.topLevelDomain?.join(", ") || "N/A"}</p>
              <p><strong>Currencies:</strong> {country.currencies?.map((c) => c.name).join(", ") || "N/A"}</p>
              <p><strong>Languages:</strong> {country.languages?.map((l) => l.name).join(", ") || "N/A"}</p>
            </div>
          </div>

          {borderCountries.length > 0 && (
            <div className={`border-countries ${theme}`}>
              <h3>Border Countries:</h3>
              <div className="border-container">
                {borderCountries.map((border) => (
                  <Link
                    key={border.alpha3Code}
                    to={`/country/${border.alpha3Code}`}
                    className={`border-link ${theme}`}
                  >
                    {border.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [countries, setCountries] = useState(() => {
    // Load cached data from localStorage if available
    const cachedData = localStorage.getItem("countriesData");
    return cachedData ? JSON.parse(cachedData) : [];
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!localStorage.getItem("countriesData")); // Set loading to false if cached data exists

  useEffect(() => {
    // Fetch data and update cache
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("data.json");
        if (Array.isArray(response.data)) {
          setCountries(response.data);
          localStorage.setItem("countriesData", JSON.stringify(response.data)); // Cache the data
        } else {
          setError("Refresh to display data");
          console.error("Data is not an array");
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Router basename="/my-react-app">
      <div className={`app ${theme}`}>
        <header className={`header ${theme}`}>
          <Link to="/" className="header-link">
            <h1>Where in the world?</h1>
          </Link>
          <button
            onClick={toggleTheme}
            className={`theme-toggle ${theme}`}
          >
            {theme === "light" ? (
              <>
                <span className="moon-icon">🌙</span> Dark Mode
              </>
            ) : (
              <>
                <span className="sun-icon">☀️</span> Light Mode
              </>
            )}
          </button>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home countries={countries} error={error} loading={loading} />} />
            <Route path="/country/:countryCode" element={<CountryDetail countries={countries} loading={loading} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;