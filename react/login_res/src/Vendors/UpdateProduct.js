import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/navbar';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './UserProfile.css';

const UpdateProductVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [lookingTo, setLookingTo] = useState('');
  const [propertyType, setPropertyType] = useState('Residential');
  const [selectedPropertyOption, setSelectedPropertyOption] = useState('');
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
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
    const [showAdditionalBedroom, setShowAdditionalBedroom] = useState(false); // State to toggle visibility of additional bedroom input field
    const [additionalBedrooms, setAdditionalBedrooms] = useState(''); // State to track additional bedrooms
    const [PropertyNearby,setPropertyNearby ]= useState([]);

        const [propertyImages, setPropertyImages] = useState([]); // [{file, preview}] for new, or {url}
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [existingVideo, setExistingVideo] = useState('');
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
  
  useEffect(() => {
    const fetchPropertyOptions = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getcategoriesMain`);
        const result = await res.json();
        if (result.status === 'ok') {
          setPropertyOptions(result.data);
        } else {
          toast.error('Failed to load property options.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error loading property options.');
      }
    };
    fetchPropertyOptions();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const vendorId = localStorage.getItem('vendorId');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getName`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, vendorId }),
        });
        const result = await res.json();
        if (result.status === 'ok') {
          setUserName(result.data.fname || '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getProperty/${id}`);
        const result = await res.json();
        if (result.status === 'ok') {
          const data = result.property;
          setLookingTo(data.lookingFor || '');
          setPropertyType(data.kindofProperty || 'Residential');
          setSelectedPropertyOption(data.categoryId || '');
          setLocality(data.locality || '');
          setCity(data.city || '');
          setBedrooms(data.bedrooms || '');
          setBathrooms(data.bathrooms || '')
          setBalconies(data.balconies || '')
          setCarpetArea(data.carpetArea || '')
          setBuildUpArea(data.buildUpArea || '')
          setSuperBuildUpArea(data.superBuildUpArea || '')
          setOtherRooms(data.OtherRooms || '')
          setPropertyFloor(data.propertyFloor || '')
          setAvailabilityStatus(data.availabilityStatus || '')
          setAgeOfProperty(data.ageOfProperty || '')
          setFloorNumber(data.FloorNumber || '')
          setPropertyfacing(data.Propertyfacing || '')
          setPropertyNearby(data.PropertyNearby || '')
           setExpectedPrice(data.expectedPrice || '')
          setAllInclusive(data.allInclusive || '')
          setTaxExcluded(data.taxExcluded || '')
          setPriceNegotiable(data.priceNegotiable || '')
          setMaintenance(data.maintenance || '')
          setExpectedRental(data.expectedRental || '')
          setBookingAmount(data.bookingAmount || '')
          setAnnualDues(data.annualDues || '')
          setmaintancewish(data.maintancewish || '')
          setaboutproperty(data.aboutproperty || '')
          setpricePersqft(data.pricePersqft || '')
        
         
            const existingImgs = data.PropertyImages?.map(url => ({ url })) || [];
        setPropertyImages(existingImgs);
        // Set existing video
        if (data.propertyVideo) {
          setExistingVideo(data.propertyVideo);
          setVideoPreview(`${process.env.REACT_APP_API_URL}${data.propertyVideo}`);

        }
       } else {
          toast.error(result.message || 'Property not found');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching property details');
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleBusinessContinue = async () => {
    if (!lookingTo) return toast.error('Please select what you are looking to do.');
    if (!selectedPropertyOption) return toast.error('Please select a property category.');

    setIsSubmitting(true);

    try {
      const vendorId = localStorage.getItem('vendorId');
      if (!vendorId) {
        toast.error('Vendor ID missing!');
        setIsSubmitting(false);
        return;
      }

      const selectedOption = propertyOptions.find(opt => opt._id === selectedPropertyOption);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/UpdateProperty/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          lookingFor: lookingTo,
          kindofProperty: propertyType,
          categoryId: selectedPropertyOption,
          kindofPropertyDetails: selectedOption?.name || '',
        }),
      });

      const result = await res.json();

      if (result.status === 'ok') {
        localStorage.setItem('propertyId', result._id);
        toast.success('Basic details updated!');
        setCurrentStep(2);
      } else {
        toast.error(result.message || 'Failed to update property!');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };
    const handleContinueProfile = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/updatePropertyprofile/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
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
      }),
    });

    const result = await res.json();
    if (result.status === 'ok') {
      toast.success('Property profile updated!');
      setCurrentStep(4);
    } else {
      toast.error(result.message || 'Failed to update property details');
    }
  } catch (err) {
    console.error(err);
    toast.error('Error updating property details');
  }
};

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (!locality || !city) {
      toast.error('Please fill in location details.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/updatePropertyLocation/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locality, city }),
      });

      const result = await res.json();
      if (result.status === 'ok') {
        toast.success('Location updated!');
        setCurrentStep(3);
      } else {
        toast.error(result.message || 'Failed to update location');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error updating location');
    }
  };
   const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPropertyImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveGalleryImage = (index) => {
    const updatedImages = [...propertyImages];
    updatedImages.splice(index, 1);
    setPropertyImages(updatedImages);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setExistingVideo(''); // remove existing
    } else {
      toast.error('Invalid video file');
    }
  };
 
const  handleSubmitPrice = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/updatePropertyprice/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
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
      }),
    });

    const result = await res.json();
    if (result.status === 'ok') {
      toast.success('Property profile updated!');
     navigate('/MyHomepage');
    } else {
      toast.error(result.message || 'Failed to update property details');
    }
  } catch (err) {
    console.error(err);
    toast.error('Error updating property details');
  }
};
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
    setExistingVideo('');
  };

  const handleSubmitMedia = async () => {
    const formData = new FormData();

    // Separate new images vs existing URLs
    const existingImages = propertyImages
      .filter(img => img.url)
      .map(img => img.url);

    const newImages = propertyImages.filter(img => img.file);
    newImages.forEach(img => {
      formData.append('newImages', img.file);
    });

    existingImages.forEach(url => {
      formData.append('existingImages[]', url);
    });

    if (videoFile) {
      formData.append('propertyVideo', videoFile);
    } else if (existingVideo) {
      formData.append('existingVideo', existingVideo);
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/updatePropertyMedia/${id}`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (result.status === 'ok') {
        toast.success('Media updated successfully');
         setCurrentStep(5);
      // refresh media
      } else {
        toast.error(result.message || 'Failed to update media');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error uploading media');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div id="business-details">
            <h3>Welcome back {userName},</h3>
            <p>Fill out basic details</p>

            <div className="mb-4">
              <label className="form-label fw-bold">I'm looking to</label>
              <div className="d-flex gap-3">
                {['Sell', 'Rent / Lease', 'PG'].map(option => (
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

            <div className="mb-4">
              <label className="form-label fw-bold">What kind of property do you have?</label>
              <div className="d-flex gap-3">
                {['Residential', 'Commercial'].map(type => (
                  <div className="form-check" key={type}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="propertyCategory"
                      id={type.toLowerCase()}
                      value={type}
                      checked={propertyType === type}
                      onChange={(e) => setPropertyType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={type.toLowerCase()}>
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 d-flex flex-wrap gap-2">
              {propertyOptions.map(option => (
                <button
                  key={option._id}
                  className={`btn ${selectedPropertyOption === option._id ? 'btn-otpion' : 'btn-outlinebtn'}`}
                  onClick={() => setSelectedPropertyOption(option._id)}
                >
                  {option.name}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={handleBusinessContinue}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </button>
          </div>
        );

      case 2:
        return (
          <div id="location-details">
            <h3>Where is Your Property Located{userName && `, ${userName}`}?</h3>
            <p>An accurate location helps you connect with the right buyers</p>

            <form onSubmit={handleLocationSubmit}>
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
                  <option value="Tirunelveli">Tirunelveli</option>
                  <option value="Trichy">Trichy</option>
                </select>
                <label htmlFor="citySelect">City</label>
              </div>

              <button type="submit" className="btn btn-primary">Continue</button>
            </form>
          </div>
        );

      case 3:
        return (
          <div id="property-profile">
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
              onClick={handleContinueProfile}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </button>
           
          </div>
        );

      case 4:
        return (
          <div id="media-details">
            <h3>Add Images and Video</h3>

            <div className="property-image-upload">
              {/* Upload Images */}
              <h5 className="mt-4 fw-bold">Upload Property Photos</h5>
              <div className="gallery-grid">

        <label className="upload-box">
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleGalleryImageChange}
          />
          <div className="upload-content">
            <span className="plus-icon">+</span>
            <p>Upload Photos</p>
          </div>
        </label>

        {propertyImages.map((imgObj, index) => (
          <div className="image-thumbnail" key={index}>
            <img
              src={imgObj.preview || `${process.env.REACT_APP_API_URL}${imgObj.url}`}
              alt={`uploaded-${index}`}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemoveGalleryImage(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <h5 className="mt-5 fw-bold">Upload Property Video</h5>
      <div className="gallery-grid">
        {!videoFile && !videoPreview && (
          <label className="upload-box">
            <input
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoChange}
            />
            <div className="upload-content">
              <span className="plus-icon">+</span>
              <p>Upload Video</p>
            </div>
          </label>
        )}

        {videoPreview && (
          <div className="image-thumbnail">
            <video
              src={videoPreview}
              controls
              width="100%"
              height="100%"
              style={{ objectFit: 'cover' }}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={handleRemoveVideo}
            >
              ×
            </button>
          </div>
        )}
      </div>

      <button className="btn btn-primary mt-4" onClick={handleSubmitMedia}>
        Save Media
      </button>
          </div>       </div>
        );

      case 5:
        return (
          <div id="pricing-details">
            <h3>Pricing & Others</h3>
            <p>Enter your property pricing and additional information.</p>
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
              onClick={handleSubmitPrice}
              disabled={isSubmitting || !expectedPrice}
            >
              {isSubmitting ? 'Submitting...' : 'Continue'}
            </button>

          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <div className="row">
          <div className="col-md-3 primarysidebar">
            <div className="stepper">
              {['Basic Details', 'Location Details', 'Property Profile', 'Photos, Videos & Voice-over', 'Pricing & Others'].map((step, index) => (
                <div key={index} className={`step ${currentStep === index + 1 ? 'active' : ''}`}>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-9 mainprimarybox">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProductVendor;
