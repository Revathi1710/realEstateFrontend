import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PrimaryDetails.css';
import Navbar from '../components/navbar';
import axios from 'axios';

const LOCATIONIQ_API_KEY = 'YOUR_LOCATIONIQ_API_KEY'; // Replace with your key

function LocationDetails() {
  const [userName, setUserName] = useState('');
  const [city, setCity] = useState('Chennai');
  const [locality, setLocality] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

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

  const handleSearch = async (e) => {
    const value = e.target.value;
    setLocality(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${value}&limit=5&normalizeaddress=1`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error('Autocomplete error:', err);
    }
  };

  const handleSelect = (place) => {
    setLocality(place.display_name);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const propertyId = localStorage.getItem('propertyId');

      const updateResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/updatePropertyLocation`,
        { propertyId, city, locality }
      );

      if (updateResponse.data.status === 'ok') {
        toast.success('Location details updated successfully!');
        setTimeout(() => navigate('/postproperty/propertyProfile'), 1500);
      } else {
        toast.error('Failed to update location details.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong.');
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container my-5">
        <div className="row">
          {/* Sidebar Stepper */}
          <div className="col-md-3 primarysidebar">
            <div className="stepper">
              <div className="step active">Basic Details</div>
              <div className="step active">Location Details</div>
              <div className="step">Property Profile</div>
              <div className="step">Photos, Videos & Voice-over</div>
              <div className="step">Pricing & Others</div>
            </div>
            <div className="mt-4">
              <div className="border p-3 rounded">
                <h5>Property Score</h5>
                <p>17%</p>
                <small>Better your property score, greater your visibility</small>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="col-md-9 mainprimarybox">
            <h3>Where is Your Property Located{userName && `, ${userName}`}?</h3>
            <p>An accurate location helps you connect with the right buyers</p>

            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-4 position-relative">
                <input
                  type="text"
                  className="form-control"
                  id="localityInput"
                  placeholder="Enter your locality or apartment name"
                  value={locality}
                  onChange={handleSearch}
                  required
                  autoComplete="off"
                />
                <label htmlFor="localityInput">Locality / Apartment</label>

                {suggestions.length > 0 && (
                  <ul className="list-group position-absolute w-100 z-3" style={{ top: '100%', zIndex: '10' }}>
                    {suggestions.map((place) => (
                      <li
                        key={place.place_id}
                        className="list-group-item list-group-item-action"
                        onClick={() => handleSelect(place)}
                        style={{ cursor: 'pointer' }}
                      >
                        {place.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-floating mb-4">
                <select
                  className="form-select"
                  id="citySelect"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                >
                  <option value="">Select City</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Madurai">Madurai</option>
                </select>
                <label htmlFor="citySelect">City</label>
              </div>

              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocationDetails;
