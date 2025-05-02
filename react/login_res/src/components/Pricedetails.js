import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PrimaryDetails.css';
import Navbar from '../components/navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Pricedetails() {
  const [expectedPrice, setExpectedPrice] = useState('');
  const [allInclusive, setAllInclusive] = useState(false);
  const [taxExcluded, setTaxExcluded] = useState(false);
  const [priceNegotiable, setPriceNegotiable] = useState(false);

  const [maintenance, setMaintenance] = useState('');
  const [expectedRental, setExpectedRental] = useState('');
  const [bookingAmount, setBookingAmount] = useState('');
  const [annualDues, setAnnualDues] = useState('');
  const [maintancewish, setmaintancewish] = useState('');
  const [aboutproperty, setaboutproperty] = useState('');
  const [pricePersqft, setpricePersqft] = useState('');
  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!expectedPrice) {
      toast.error('Please enter expected price!');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const propertyId = localStorage.getItem('propertyId');
  
      const updateResponse = await axios.put(`${process.env.REACT_APP_API_URL}/updatePropertyprice`, {
        propertyId,
        expectedPrice,
        allInclusive,
        taxExcluded,
        priceNegotiable,
        maintenance,
        expectedRental,
        pricePersqft,
        bookingAmount,
        annualDues,
        maintancewish,
        aboutproperty
      });
  
      if (updateResponse.data.status === 'ok') {
        toast.success('Price details updated successfully!');
        
        // Correct way to remove item from localStorage
        localStorage.removeItem('propertyId');
  
        setTimeout(() => {
          // Corrected template string syntax
          navigate(`/propertyPreview/${propertyId}`);
        }, 1500);
      } else {
        toast.error('Failed to update price details.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong.');
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
              <div className="step active">Location Details</div>
              <div className="step active">Property Profile</div>
              <div className="step active">Photos, Videos & Voice-over</div>
              <div className="step active">Pricing & Others</div>
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
            <h3>Add Pricing and Details...</h3>

            {/* Price Details */}
            <h5 className='mt-5 fw-bold'>Price Details</h5>
            <div className='row'>
            <div className="form-floating mb-4 col-sm-6 twofields">
              <input
                type="text"
                className="form-control"
                id="ExpectedPriceInput"
                placeholder="Expected Price"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
              />
              <label htmlFor="ExpectedPriceInput">Expected Price</label>
            </div>
            <div className="form-floating mb-4 col-sm-6 twofields">
              <input
                type="text"
                className="form-control"
                id="pricePersqftInput"
                placeholder="Price Per Sq.ft"
                value={pricePersqft}
                onChange={(e) => setpricePersqft(e.target.value)}
              />
              <label htmlFor="pricePersqftInput me-2">Price Per Sq.ft</label>
            </div></div>
            {/* Checkboxes */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="allInclusive"
                  checked={allInclusive}
                  onChange={(e) => setAllInclusive(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="allInclusive">All Inclusive Price</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="taxExcluded"
                  checked={taxExcluded}
                  onChange={(e) => setTaxExcluded(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="taxExcluded">Tax and Govt. charges excluded</label>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="priceNegotiable"
                  checked={priceNegotiable}
                  onChange={(e) => setPriceNegotiable(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="priceNegotiable">Price Negotiable</label>
              </div>
            </div>

            {/* Additional Price Details */}
            <h5 className='mt-5 fw-bold'>Additional Price Details</h5>
            <div className="form-floating mb-4 position-relative">
              <input
                type="text"
                className="form-control"
                id="MaintenanceInput"
                placeholder="Maintenance"
                value={maintenance}
                onChange={(e) => setMaintenance(e.target.value)}
              />
              <label htmlFor="MaintenanceInput">Maintenance</label>
              <select  
                id="maintanceViewSelect"
                value={maintancewish}
                onChange={(e) => setmaintancewish(e.target.value)}
                style={{position: "absolute", top: "20px", right: "10px", width: "auto"}}
              >
                <option value="">Select</option>
                <option value="Monthly">Monthly</option>
                <option value="Annually">Annually</option>
                <option value="Per Month">Per Month</option>
                <option value="Once">Once</option>
              </select>
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="ExpectedRentalInput"
                placeholder="Expected Rental"
                value={expectedRental}
                onChange={(e) => setExpectedRental(e.target.value)}
              />
              <label htmlFor="ExpectedRentalInput">Expected Rental</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="BookingAmountInput"
                placeholder="Booking Amount"
                value={bookingAmount}
                onChange={(e) => setBookingAmount(e.target.value)}
              />
              <label htmlFor="BookingAmountInput">Booking Amount</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="AnnualDuesInput"
                placeholder="Annual Dues Payable"
                value={annualDues}
                onChange={(e) => setAnnualDues(e.target.value)}
              />
              <label htmlFor="AnnualDuesInput">Annual Dues Payable</label>
            </div>

            {/* About Property */}
            <h5 className='mt-5 fw-bold'>What makes Your Property unique</h5>
            <textarea
              name="aboutproperty"
              className="form-control mb-4"
              value={aboutproperty}
              onChange={(e) => setaboutproperty(e.target.value)}
              rows={5}
              placeholder="Describe what makes your property unique..." required
            ></textarea>

            {/* Continue Button */}
            <button
              className="btn btn-primary"
              onClick={handleContinue}
              disabled={isSubmitting || !expectedPrice}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </button>

          </div>
        </div>
      </div>
    </>
  );
}

export default Pricedetails;
