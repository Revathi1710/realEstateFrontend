import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import './PrimaryDetails.css';
import Navbar from '../components/navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // import CSS
import axios from 'axios'; // Import Axios
function PropertyProfile() {
  // Define state variables for each input field
  const [userName, setUserName] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [balconies, setBalconies] = useState('');
  const [carpetArea, setCarpetArea] = useState('');
  const [buildUpArea, setBuildUpArea] = useState('');
  const [superBuildUpArea, setSuperBuildUpArea] = useState('');
  const [otherRooms, setOtherRooms] = useState([]);
  const [propertyFloor, setPropertyFloor] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [ageOfProperty, setAgeOfProperty] = useState('');
  const [FloorNumber,setFloorNumber]=useState('');
  const [Propertyfacing,setPropertyfacing]=useState('');
 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showAdditionalBedroom, setShowAdditionalBedroom] = useState(false); // State to toggle visibility of additional bedroom input field
  const [additionalBedrooms, setAdditionalBedrooms] = useState(''); // State to track additional bedrooms
  const [PropertyNearby,setPropertyNearby ]= useState([]);
  const addOtherBedroom = () => {
    setShowAdditionalBedroom(true); // Show the additional bedroom input field
  };
  const handleRoomSelection = (room) => {
    setOtherRooms((prevRooms) => {
      if (prevRooms.includes(room)) {
        // Remove the room from the selection if already selected
        return prevRooms.filter((r) => r !== room);
      } else {
        // Add the room to the selection if not already selected
        return [...prevRooms, room];
      }
    });
  };
  const handlePropertyNearby = (room) => {
    setPropertyNearby((prevRooms) => {
      if (prevRooms.includes(room)) {
        return prevRooms.filter((r) => r !== room);
      } else {
        return [...prevRooms, room];
      }
    });
  };
  

  const handleContinue = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true); // Set submitting flag to true to disable the button during submission
    
    try {
      // Retrieve the propertyId from local storage
      const propertyId = localStorage.getItem('propertyId');

      // Send the update request using Axios
      const updateResponse = await axios.put(`${process.env.REACT_APP_API_URL}/updatePropertyprofile`, {
        propertyId,
        bedrooms,
        bathrooms,
        balconies,
        
        carpetArea,
        buildUpArea,
        superBuildUpArea,
        propertyFloor,
        otherRooms,
        FloorNumber,
        availabilityStatus,
        ageOfProperty,
        Propertyfacing,
        PropertyNearby
      });

      // Check the response from the server
      if (updateResponse.data.status === 'ok') {
        toast.success('Profile details updated successfully!');
        setTimeout(() => {
          navigate('/postproperty/propertyImage'); // Move to the next page
        }, 1500);
      } else {
        toast.error('Failed to update location details.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong.');
    } finally {
      setIsSubmitting(false); // Reset submitting flag after request completes
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
              <div className="step active" >Location Details</div>
              <div className="step active">Property Profile</div>
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
            <h3>Tell About Your Property Details</h3>
            <h5 className='mt-5 fw-bold'>Add Room Details</h5>
            
            {/* Bedrooms */}
            <div className="mb-4">
              <label className="form-label fw-bold">No of Bedroom</label>
              <div className="d-flex gap-3">
                {["1", "2", "3", "4", "5"].map((option) => (
                  <button
                    key={option}
                    className={`btn ${bedrooms === option ? 'btn-otpion' : 'btn-outlinebtn'}`}
                    onClick={() => setBedrooms(option)}
                  >
                    {option}
                  </button>
                ))}
                <div
                  className="fw-bold"
                  style={{ color: '#3f73d5e', cursor: 'pointer' }}
                  onClick={addOtherBedroom}
                >
                  + Add Other
                </div>
              </div>
              {/* Show additional bedroom input field when `showAdditionalBedroom` is true */}
              {showAdditionalBedroom && (
                <div className="d-flex addotherbedroom-container mt-2">
                  <input
                    type="text"
                    className="form-control"
                    value={additionalBedrooms} // Using `additionalBedrooms` here
                    onChange={(e) => setAdditionalBedrooms(e.target.value)}
                    placeholder="Enter number of additional bedrooms" 
                    style={{ width: "30%" }}
                  />
                  <button onClick={() => setShowAdditionalBedroom(false)} className='btn btn-primary'>
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Bathrooms */}
            <div className="mb-4">
              <label className="form-label fw-bold">No of Bathroom</label>
              <div className="d-flex gap-3">
                {["1", "2", "3", "4", "5"].map((option) => (
                  <button
                    key={option}
                    className={`btn ${bathrooms === option ? 'btn-otpion' : 'btn-outlinebtn'}`}
                    onClick={() => setBathrooms(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Balconies */}
            <div className="mb-4">
              <label className="form-label fw-bold">No of Balconies</label>
              <div className="d-flex gap-3">
                {["1", "2", "3", "More than 3"].map((option) => (
                  <button
                    key={option}
                    className={`btn ${balconies === option ? 'btn-otpion' : 'btn-outlinebtn'}`}
                    onClick={() => setBalconies(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Details */}
            <h5 className='mt-5 fw-bold'>Add Area Details</h5>
            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="CarpetAreaInput"
                placeholder="CarpetArea"
                value={carpetArea}
                onChange={(e) => setCarpetArea(e.target.value)}
              
              />
              <label htmlFor="CarpetAreaInput">Carpet Area</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="BuildUpAreaInput"
                placeholder="Build-up Area"
                value={buildUpArea}
                onChange={(e) => setBuildUpArea(e.target.value)}
               
              />
              <label htmlFor="BuildUpAreaInput">Build-up Area</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="SuperBuildUpAreaInput"
                placeholder="Super Build-up Area"
                value={superBuildUpArea}
                onChange={(e) => setSuperBuildUpArea(e.target.value)}
            
              />
              <label htmlFor="SuperBuildUpAreaInput">Super Build-up Area</label>
            </div>

            {/* Additional Rooms */}
            <div className="mb-4">
        <label className="form-label fw-bold">Other Room</label>
        <div className="d-flex gap-3">
          {["Pooja Room", "Study Room", "Servant Room", "Store Room"].map((option) => (
            <button
              key={option}
              className={`btn ${otherRooms.includes(option) ? 'btn-otpion' : 'btn-outlinebtn'}`}
              onClick={() => handleRoomSelection(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

            {/* Floor Details */}
            <h5 className='mt-5 fw-bold'>Add Floor Details</h5>
            <div className="form-floating mb-4">
              <input
                type="number"
                className="form-control"
                id="PropertyFloorInput"
                placeholder="Property on Floor"
                value={propertyFloor}
                onChange={(e) => setPropertyFloor(e.target.value)}
                required
              />
              <label htmlFor="PropertyFloorInput">Property on Floor</label>
            </div>

            <div className="form-floating mb-4">
              <select
                className="form-select"
                id="FloorTypeInput"
                value={FloorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option>Basement</option>
                <option>Lower Ground</option>
                <option>Ground</option>
              </select>
              <label htmlFor="FloorTypeInput">Floor Type</label>
            </div>

            {/* Availability Status */}
            <div className="mb-4">
              <label className="form-label fw-bold">Availability Status</label>
              <div className="d-flex gap-3">
                {["Ready to move", "Under Construction"].map((option) => (
                  <button
                    key={option}
                    className={`btn ${availabilityStatus === option ? 'btn-otpion' : 'btn-outlinebtn'}`}
                    onClick={() => setAvailabilityStatus(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Age of Property */}
            <div className="mb-4">
              <label className="form-label fw-bold">Age Of Property</label>
              <div className="d-flex gap-3">
                {["0-1 years", "1-5 years", "5-10 years", "+10 years"].map((option) => (
                  <button
                    key={option}
                    className={`btn ${ageOfProperty === option ? 'btn-otpion' : 'btn-outlinebtn'}`}
                    onClick={() => setAgeOfProperty(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
        <label className="form-label fw-bold">Property Facing</label>
        <div className="d-flex gap-3">
        {["North", "South", "East", "West","North-East","North-West","South-East","South-West"].map((option) => (
                  <button
                    key={option}
                    className={`btn ${Propertyfacing === option ? 'btn-otpion' : 'btn-outlinebtn'}`}
                    onClick={() => setPropertyfacing(option)}
                  >
                    {option}
                  </button>
                ))}
        
        </div>
      </div>
      <div className="mb-4">
        <label className="form-label fw-bold">Nearby</label>
        <div className="d-flex gap-3">
          {["Close to Metro Station", "Close to School", "Close to Market", "Close to Hosptial","Close to Airport","Close to Railway Station","Close to Highway","Close to Mall"].map((option) => (
            <button
              key={option}
              className={`btn ${PropertyNearby.includes(option) ? 'btn-otpion' : 'btn-outlinebtn'}`}
              onClick={() => handlePropertyNearby(option)}
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

export default PropertyProfile;
