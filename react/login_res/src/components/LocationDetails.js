import React, { useState, useEffect } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import Navbar from '../components/navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LocationDetails() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedLocality, setSelectedLocality] = useState(null);
  const navigate = useNavigate();

  // Fetch existing data for editing
  useEffect(() => {
    const fetchLocation = async () => {
      const propertyId = localStorage.getItem('propertyId');
      if (!propertyId) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/getPropertyById/${propertyId}`);
        const data = res.data;

        if (data.city) {
          setSelectedCity({ label: data.city, value: data.city });
        }
        if (data.locality) {
          setSelectedLocality({ label: data.locality, value: data.locality });
        }
      } catch (err) {
        console.error('Error fetching property location:', err);
      }
    };

    fetchLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const city = selectedCity?.label || '';
    const locality = selectedLocality?.label || '';

    if (!city || !locality) {
      toast.error('Please select both city and locality.');
      return;
    }

    try {
      let propertyId = localStorage.getItem('propertyId');

      const updateResponse = await axios.put(`${process.env.REACT_APP_API_URL}/updatePropertyLocation`, {
        propertyId,
        city,
        locality,
      });

      if (updateResponse.data.status === 'ok') {
        toast.success('Location details updated successfully!');
        setTimeout(() => {
          navigate('/postproperty/propertyProfile');
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
          {/* Sidebar */}
          <div className="col-md-3 primarysidebar">
            <div className="stepper">
              <div className="step active">Basic Details</div>
              <div className="step">Location Details</div>
              <div className="step">Property Profile</div>
              <div className="step">Photos, Videos & Voice-over</div>
              <div className="step">Pricing & Others</div>
            </div>

            <div className="mt-4">
              <div className="border p-3 rounded">
                <h5>Property Score</h5>
                <p>0%</p>
                <small>Better your property score, greater your visibility</small>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="col-md-9 mainprimarybox">
            <h3>Select Your Property Location</h3>
            <form onSubmit={handleSubmit}>
              {/* City Autocomplete */}
              <div className="form-group">
                <label>City</label>
                <GooglePlacesAutocomplete
                  apiKey="AIzaSyD8XPj9I4BSv8p6usmkR0-26GQKZFXeNpY"
                  selectProps={{
                    value: selectedCity,
                    onChange: setSelectedCity,
                    placeholder: 'Type city name',
                  }}
                  autocompletionRequest={{
                    types: ['(cities)'],
                    componentRestrictions: {
                      country: ['in'],
                    },
                  }}
                />
              </div>

              {/* Locality Autocomplete */}
              {selectedCity && (
                <div className="form-group mt-3">
                  <label>Locality</label>
                  <GooglePlacesAutocomplete
                    apiKey="AIzaSyD8XPj9I4BSv8p6usmkR0-26GQKZFXeNpY"
                    selectProps={{
                      value: selectedLocality,
                      onChange: setSelectedLocality,
                      placeholder: 'Type locality or street name',
                    }}
                    autocompletionRequest={{
                      types: ['address'],
                      componentRestrictions: {
                        country: ['in'],
                      },
                    }}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary mt-4">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocationDetails;
