import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PrimaryDetails.css';
import Navbar from '../components/navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // import CSS

function PrimaryDetails() {
  const [userName, setUserName] = useState('');
  const [lookingTo, setLookingTo] = useState('');
  const [propertyType, setPropertyType] = useState('Residential');
  const [selectedPropertyOption, setSelectedPropertyOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const propertyOptions = [
    "Flat/Apartment", "Independent House / Villa", "Independent / Builder Floor",
    "Plot / Land", "1 RK/ Studio Apartment", "Serviced Apartment", "Farmhouse", "Other"
  ];

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

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        if (result.status === 'ok' && result.data?.fname) {
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

  const handleContinue = async () => {
    if (!lookingTo) {
      toast.error('Please select what you are looking to do.');
      return;
    }
    if (!selectedPropertyOption) {
      toast.error('Please select your property type.');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const vendorId = localStorage.getItem('vendorId');
  
      if (!vendorId) {
        toast.error('Vendor ID missing!');
        setIsSubmitting(false);
        return;
      }
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/addProperty`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          lookingFor: lookingTo,
          kindofProperty: propertyType,
          kindofPropertyDetails: selectedPropertyOption,
        }),
      });
  
      const result = await response.json();
  
      if (result.status === 'ok') {
        // Store only the _id of the newly added property in localStorage
        localStorage.setItem('propertyId', result._id);
  
        // Success message and navigate after 1.5 seconds
        toast.success('Property added successfully!', {
          autoClose: 1500,
          onClose: () => navigate('/postproperty/locationDetails'),  // Navigate to locationDetails
        });
      } else {
        toast.error(result.message || 'Failed to add property!');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
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
            <h3>Welcome back {userName},</h3>
            <p>Fill out basic details</p>

            {/* I'm looking to */}
            <div className="mb-4">
              <label className="form-label fw-bold">I'm looking to</label>
              <div className="d-flex gap-3">
                {["Sell", "Rent / Lease", "PG"].map((option) => (
                  <button
                    key={option}
                    className={`btn ${lookingTo === option ? 'btn-otpion' : 'btn-outlinebtn'}`}
                    onClick={() => setLookingTo(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Property category */}
            <div className="mb-4">
              <label className="form-label fw-bold">What kind of property do you have?</label>
              <div className="d-flex gap-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="residential"
                    name="propertyCategory"
                    value="Residential"
                    checked={propertyType === "Residential"}
                    onChange={(e) => setPropertyType(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="residential">Residential</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="commercial"
                    name="propertyCategory"
                    value="Commercial"
                    checked={propertyType === "Commercial"}
                    onChange={(e) => setPropertyType(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="commercial">Commercial</label>
                </div>
              </div>
            </div>

            {/* Property Options */}
            <div className="mb-4">
              <div className="d-flex flex-wrap gap-2">
                {propertyOptions.map((option) => (
                  <button
                    key={option}
                    className={`btn ${selectedPropertyOption === option ? 'btn-otpion' : 'btn-outlinebtn'}`}
                    onClick={() => setSelectedPropertyOption(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              className="btn btn-primary"
              onClick={handleContinue}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrimaryDetails;
