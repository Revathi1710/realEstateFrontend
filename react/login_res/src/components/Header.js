import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../icons/logbuildero.png';

function Header() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const vendorId = localStorage.getItem('vendorId');

        if (!userId && !vendorId) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, vendorId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'ok' && result.data && result.data.fname) {
          setUserName(result.data.fname);
        } else {
          console.error('Error in API response:', result.message || 'No name found');
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchUserName();
  }, []);

  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <header className="bg-white shadow-sm px-4 py-2 d-flex justify-content-between align-items-center">
      {/* Left: Logo */}
      <div className="d-flex align-items-center gap-4">
        <h1 className="logonameheader">KeyMile</h1>

        {/* Property Types */}
        <nav className="d-none d-md-flex gap-3">
          <a href="#" className="text-dark fw-medium text-decoration-none">Buy</a>
          <a href="#" className="text-dark fw-medium text-decoration-none">Rent</a>
          <a href="#" className="text-dark fw-medium text-decoration-none">Commercial</a>
        </nav>
      </div>

      {/* Center: Search + City */}
      <div className="d-none d-lg-flex align-items-center bg-light rounded-pill px-3 py-1" style={{ width: '40%' }}>
        <span className="text-muted me-2">📍</span>
        <select className="form-select border-0 bg-light me-2" style={{ width: '100px' }}>
          <option>City</option>
          <option>Delhi</option>
          <option>Mumbai</option>
        </select>
        <input
          type="text"
          className="form-control border-0 bg-light"
          placeholder="Search locality, project, builder..."
        />
      </div>

      {/* Right: User Icon or Name */}
      <div className="d-flex align-items-center gap-3">
        {userName ? (
          <Link to="/dashboard" className="user-circle" title={userName}>
            {getFirstLetter(userName)}
          </Link>
        ) : (
          <Link to="/Signup" className="login-icon" title="Login / Signup">
           <i class='far fa-user-circle fs-4'></i>
          </Link>
        )}
 {userName ? (
  <Link to="/postproperty/primarydetails" className="login-icon">
    <button className="btn postbtn">Post Property</button>
  </Link>
) : (
  <Link to="/Signup" className="login-icon">
    <button className="btn postbtn">Post Property</button>
  </Link>
)}

      </div>
    </header>
  );
}

export default Header;
