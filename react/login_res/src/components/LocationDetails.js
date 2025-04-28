import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PrimaryDetails.css';
import Navbar from '../components/navbar';
import axios from 'axios'; // Import Axios

function LocationDetails() {
  const [userName, setUserName] = useState('');
  const [city, setCity] = useState('Chennai');
  const [locality, setLocality] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve the propertyId from local storage
      let propertyId = localStorage.getItem('propertyId');
      
      // Send the update request using Axios
      const updateResponse = await axios.put(`${process.env.REACT_APP_API_URL}/updatePropertyLocation`, {
        propertyId,
        city,
        locality,
      });

      // Check the response from the server
      if (updateResponse.data.status === 'ok') {
        toast.success('Location details updated successfully!');
        setTimeout(() => {
          navigate('/postproperty/propertyProfile'); // Move to the next page
        }, 1500);
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
              <div className="form-floating mb-4">
                <input
                  type="text"
                  className="form-control"
                  id="localityInput"
                  placeholder="Enter your locality or apartment name"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  required
                />
                <label htmlFor="localityInput">Locality / Apartment</label>
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
