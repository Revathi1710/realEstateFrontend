import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../icons/logbuildero.png';

function Header() {
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const autocompleteRef = useRef(null);

  // Load Google Maps Places library
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyD8XPj9I4BSv8p6usmkR0-26GQKZFXeNpY', // 🔑 Replace this
    libraries: ['places'],
  });

  // Fetch user name
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const vendorId = localStorage.getItem('vendorId');

        if (!userId && !vendorId) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getName`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, vendorId }),
        });

        const result = await response.json();
        if (result.status === 'ok' && result.data?.fname) {
          setUserName(result.data.fname);
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchUserName();
  }, []);

  // Pre-fill search bar from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query');
    const cityParam = params.get('city');
    if (queryParam) setSearchQuery(decodeURIComponent(queryParam));
    if (cityParam) setSelectedCity(decodeURIComponent(cityParam));
  }, [location.search]);

  const getFirstLetter = (name) => (name ? name.charAt(0).toUpperCase() : '');

  const handleSearch = () => {
    if (!searchQuery && !selectedCity) return;
    navigate(
      `/search-results?query=${encodeURIComponent(searchQuery)}&city=${encodeURIComponent(
        selectedCity
      )}`
    );
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const address = place?.formatted_address;
      if (address) {
        const trimmed = address.split(',').slice(0, 2).join(',').trim(); // "City, State"
        setSearchQuery(trimmed);
      }
    }
  };

  return (
    <header className="bg-white shadow-sm px-4 py-2 d-flex justify-content-between align-items-center header-sticky">
      {/* Left: Logo + Links */}
      <div className="d-flex align-items-center gap-4">
        <Link to="/">
          <h1 className="logonameheader">KeyMile</h1>
        </Link>
        <nav className="d-none d-md-flex gap-3">
          <a href="#" className="text-dark fw-medium text-decoration-none">Buy</a>
          <a href="#" className="text-dark fw-medium text-decoration-none">Rent</a>
          <a href="#" className="text-dark fw-medium text-decoration-none">Commercial</a>
        </nav>
      </div>

      {/* Center: Search bar */}
      <div
        className="d-none d-lg-flex align-items-center bg-light rounded-pill px-3 py-1"
        style={{ width: '40%', border: '1px solid #bad2ff' }}
      >
        <span className="text-muted me-2">📍</span>
      

        {isLoaded && (
          <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              className="form-control border-0 bg-light"
              placeholder="Search locality, project, builder..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Autocomplete>
        )}

        <button className="btn btn-light border-0 ms-2" onClick={handleSearch}>
          🔍
        </button>
      </div>

      {/* Right: User Info + Post Property */}
      <div className="d-flex align-items-center gap-3">
        {userName ? (
          <Link to="/MyHomepage" className="user-circle" title={userName}>
            {getFirstLetter(userName)}
          </Link>
        ) : (
          <Link to="/Vendor/Signup" className="login-icon" title="Login / Signup">
            <i className="far fa-user-circle fs-4"></i>
          </Link>
        )}

        <Link to={userName ? "/postproperty/primarydetails" : "/Vendor/Signup"} className="login-icon">
          <button className="btn postbtn">Post Property</button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
