import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaBed, FaRulerCombined, FaHome, FaTools } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import AllHorizontalBanner from "./AllHorizontalBanner";
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import EnquirySendBuilder from './EnquirySendBuilder';
const SearchResults = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
     const [product, setProduct] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const query = queryParams.get("query");
  const city = queryParams.get("city");
  const locality = queryParams.get("locality");
  const propertyType = queryParams.get("propertyType");

  const [results, setResults] = useState([]);
const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

  // Filters and toggles
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');

  const [showBedroomOptions, setShowBedroomOptions] = useState(true);
  const [showPropertyOptions, setShowPropertyOptions] = useState(true);
  const [showConstructionOptions, setShowConstructionOptions] = useState(false);
  const [showBudgetOptions, setShowBudgetOptions] = useState(false);
  const [showAreaOptions, setShowAreaOptions] = useState(false);

  // Filter values
  const [typeFilter, setTypeFilter] = useState('');
  const [bedroomFilter, setBedroomFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Property options from API
  const [propertyOptions, setPropertyOptions] = useState([]);

  

  // Fetch categories for property type options
  useEffect(() => {
    const fetchPropertyOptions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getcategoriesMain`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const result = await response.json();
        if (result.status === 'ok' && Array.isArray(result.data)) {
          setPropertyOptions(result.data);
        }
      } catch (error) {
        console.error('Error fetching property options:', error);
      }
    };
    fetchPropertyOptions();
  }, []);

  // Fetch user data and products based on category
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) return;
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/userData`, { id: storedUserId });
        if (response.data.status === 'ok') setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };



    fetchUserData();
  
  }, []);

  // Filter products whenever filters or products change
  useEffect(() => {
    let filtered = [...products];

    if (typeFilter) filtered = filtered.filter(p => p.propertyType === typeFilter);
    if (bedroomFilter) filtered = filtered.filter(p => String(p.bedrooms) === bedroomFilter);
    if (statusFilter) filtered = filtered.filter(p => p.constructionStatus === statusFilter);

    if (minPrice) filtered = filtered.filter(p => Number(p.price) >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter(p => Number(p.price) <= Number(maxPrice));

    if (minArea) filtered = filtered.filter(p => Number(p.area) >= Number(minArea));
    if (maxArea) filtered = filtered.filter(p => Number(p.area) <= Number(maxArea));

    setFilteredProducts(filtered);
  }, [products, typeFilter, bedroomFilter, statusFilter, minPrice, maxPrice, minArea, maxArea]);

  // Remove individual filter
  const removeFilter = (filterName) => {
    switch (filterName) {
      case 'typeFilter':
        setTypeFilter('');
        break;
      case 'bedroomFilter':
        setBedroomFilter('');
        break;
      case 'statusFilter':
        setStatusFilter('');
        break;
      case 'minPrice':
        setMinPrice('');
        break;
      case 'maxPrice':
        setMaxPrice('');
        break;
      case 'minArea':
        setMinArea('');
        break;
      case 'maxArea':
        setMaxArea('');
        break;
      default:
        break;
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setTypeFilter('');
    setBedroomFilter('');
    setStatusFilter('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
  };
useEffect(() => {
  const fetchResults = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/search`, {
        params: {
          query,
          city,
          locality,
          propertyType,
          minPrice,
          maxPrice,
          minArea,
          maxArea,
          bedrooms: bedroomFilter,
          constructionStatus: statusFilter
        },
      });
      setResults(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  fetchResults();
}, [query, city, locality, propertyType, minPrice, maxPrice, minArea, maxArea, bedroomFilter, statusFilter]);


  const handleEnquiry = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const enquiryDetails = Object.fromEntries(formData.entries());
    console.log("Enquiry submitted:", enquiryDetails);
    alert("Enquiry submitted successfully!");
  };
  const handleModalOpen = () => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Navbar />
    <div className="container mt-5">
      
      <h3 className="mb-4">Properties matching your search</h3>

      
        <>
        <div className="mb-3">
          {(typeFilter || bedroomFilter || statusFilter || minPrice || maxPrice || minArea || maxArea) && (
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <strong>Applied Filters:</strong>
              {typeFilter && (
                <span className="badge bg-primary d-flex align-items-center">
                  Type: {propertyOptions.find(o => o._id === typeFilter)?.name || typeFilter}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    onClick={() => removeFilter('typeFilter')}
                  />
                </span>
              )}
              {bedroomFilter && (
                <span className="badge bg-primary d-flex align-items-center">
                  Bedrooms: {bedroomFilter} BHK
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    onClick={() => removeFilter('bedroomFilter')}
                  />
                </span>
              )}
              {statusFilter && (
                <span className="badge bg-primary d-flex align-items-center">
                  Status: {statusFilter}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    onClick={() => removeFilter('statusFilter')}
                  />
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="badge bg-primary d-flex align-items-center">
                  Budget: ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    onClick={() => {
                      removeFilter('minPrice');
                      removeFilter('maxPrice');
                    }}
                  />
                </span>
              )}
              {(minArea || maxArea) && (
                <span className="badge bg-primary d-flex align-items-center">
                  Area: {minArea || '0'} - {maxArea || '∞'} sq.ft
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-2"
                    aria-label="Remove"
                    onClick={() => {
                      removeFilter('minArea');
                      removeFilter('maxArea');
                    }}
                  />
                </span>
              )}

              <button className="btn btn-outline-danger btn-sm ms-3" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          )}
        </div>

        <div className="row">
          {/* Filters Section */}
          <div className="col-md-3">
            <div className="bg-white p-3 border rounded shadow-sm" style={{ position: "sticky", top: "85px" }}>
              <h5 className="mb-3">Filters</h5>

              {/* Property Type */}
              <div className="mb-4">
                <div
                  className="text-muted mb-2 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPropertyOptions(!showPropertyOptions)}
                >
                  <strong>Type of Property</strong>
                  <span>{showPropertyOptions ? '▲' : '▼'}</span>
                </div>

                {showPropertyOptions && (
                  <div className="d-flex flex-wrap gap-2">
                    {Array.isArray(propertyOptions) && propertyOptions.map((option) => (
                      <button
                        key={option._id}
                        type="button"
                        className={`btn btn-sm ${typeFilter === option._id ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setTypeFilter(option._id)}
                      >
                        {option.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bedrooms */}
              <div className="mb-4">
                <div
                  className="text-muted mb-2 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowBedroomOptions(!showBedroomOptions)}
                >
                  <strong>Bedrooms</strong>
                  <span>{showBedroomOptions ? '▲' : '▼'}</span>
                </div>

                {showBedroomOptions && (
                  <div className="d-flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        className={`btn btn-sm ${bedroomFilter === String(num) ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setBedroomFilter(String(num))}
                      >
                        {num} BHK
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Construction Status */}
              <div className="mb-4">
                <div
                  className="text-muted mb-2 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowConstructionOptions(!showConstructionOptions)}
                >
                  <strong>Construction Status</strong>
                  <span>{showConstructionOptions ? '▲' : '▼'}</span>
                </div>

                {showConstructionOptions && (
                  <div className="d-flex flex-wrap gap-2">
                    {['New Launch', 'Under Construction', 'Ready To Move'].map(status => (
                      <button
                        key={status}
                        type="button"
                        className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setStatusFilter(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="mb-4">
                <div
                  className="text-muted mb-2 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowBudgetOptions(!showBudgetOptions)}
                >
                  <strong>Budget (₹)</strong>
                  <span>{showBudgetOptions ? '▲' : '▼'}</span>
                </div>

                {showBudgetOptions && (
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="form-control"
                      value={minPrice}
                      onChange={e => setMinPrice(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="form-control"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Area */}
              <div className="mb-4">
                <div
                  className="text-muted mb-2 d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowAreaOptions(!showAreaOptions)}
                >
                  <strong>Area (sq.ft)</strong>
                  <span>{showAreaOptions ? '▲' : '▼'}</span>
                </div>

                {showAreaOptions && (
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="form-control"
                      value={minArea}
                      onChange={e => setMinArea(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="form-control"
                      value={maxArea}
                      onChange={e => setMaxArea(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <AllHorizontalBanner />
{results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <>
            {results.map((item, index) => (
              <div key={index} className="card mb-3 shadow-sm border">
                <div className="row g-0">
                  <div className="col-md-5">
                    {item.PropertyImages?.length > 0 || item.propertyVideo ? (
                      <div
                        id={`carousel-${item._id}`}
                        className="carousel slide"
                        data-bs-ride="carousel"
                      >
                        <div className="carousel-inner">
                          {/* Show video first if present */}
                          {item.propertyVideo && (
                            <div className="carousel-item active">
                             <video
  className="d-block w-100 rounded-start p-2"
  controls
  autoPlay
  muted
  loop
  style={{
    objectFit: "cover",
    maxHeight: "250px",
    borderRadius: "20px",
  }}
>
  <source
    src={`${process.env.REACT_APP_API_URL}/${item.propertyVideo.replace("\\", "/")}`}
    type="video/mp4"
  />
  Your browser does not support the video tag.
</video>

                            </div>
                          )}

                          {/* Show images */}
                          {item.PropertyImages?.map((img, i) => (
                            <div
                              className={`carousel-item ${
                                !item.propertyVideo && i === 0 ? "active" : ""
                              }`}
                              key={i}
                            >
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${img.replace("\\", "/")}`}
                                className="d-block w-100 rounded-start p-2"
                                alt={`Slide ${i}`}
                                style={{
                                  objectFit: "cover",
                                  maxHeight: "250px",
                                  borderRadius: "20px",
                                }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Show controls only if more than 1 item */}
                        {(item.PropertyImages?.length || 0) + (item.propertyVideo ? 1 : 0) > 1 && (
                          <>
                            <button
                              className="carousel-control-prev"
                              type="button"
                              data-bs-target={`#carousel-${item._id}`}
                              data-bs-slide="prev"
                            >
                              <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                              ></span>
                            </button>
                            <button
                              className="carousel-control-next"
                              type="button"
                              data-bs-target={`#carousel-${item._id}`}
                              data-bs-slide="next"
                            >
                              <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                              ></span>
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <img
                        src="/default.jpg"
                        className="img-fluid rounded-start p-2"
                        alt="No Image"
                        style={{ objectFit: "cover", maxHeight: "250px" }}
                      />
                    )}
                  </div>

                  <div className="col-md-7">
                    <div className="card-body">
                   <Link to={`/ProductView/${item._id}`}>
  <h5 className="card-title mb-1">{item.bedrooms}BNK {item.bathrooms} Bath</h5>
</Link>

                      <p>{item.locality}</p>

                      <div className="d-flex gap-3 flex-wrap mb-2">
                        <span className="text-muted">
                          <FaBed /> {item.bedrooms} BHK
                        </span>
                        <span className="text-muted">
                          <FaRulerCombined /> {item.buildUpArea} sq.ft
                        </span>
                        <span className="text-muted">
                          <FaHome /> {item.kindofPropertyDetails}
                        </span>
                        <span className="text-muted">
                          <FaTools /> {item.availabilityStatus}
                        </span>
                      </div>

                      <p className="card-text text-muted pricedetailscategory">
                        ₹{item.expectedPrice}
                      </p>
                    <p className="card-text mb-0" style={{
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxHeight: "3em", // roughly 2 lines height
}}>
  <small className="text-muted">{item.aboutproperty}</small>
</p>
<Link to={`/ProductView/${item._id}`} style={{ color: "blue", cursor: "pointer" }}>
  Read more
</Link>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                        <p className="mb-0">
                         Dealer: {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                     
                        </p>
                  <p>{item.vendorId?.fname}</p>
 </div>
 <div>
  <button type="button" className="btn btn-primary sendenq" onClick={handleModalOpen}>
                View Number
              </button>
  </div>
    {/* Modal component */}
          <EnquirySendBuilder
            show={showModal}
            handleClose={handleModalClose}
            product={selectedProduct}
            vendorData={item.vendorId}
          />
                        <form onSubmit={handleEnquiry} className="d-inline">
                          <input type="hidden" name="productname" value={item.name} />
                          <input type="hidden" name="product_id" value={item._id} />
                          <input type="hidden" name="vendorId" value={item.vendorId} />
                          <input type="hidden" name="productPrice" value={item.price} />
                          <input
                            type="hidden"
                            name="vendor_name"
                            value={item.vendorName || ""}
                          />
                          <input
                            type="hidden"
                            name="business_name"
                            value={item.business_name || ""}
                          />
                          <input
                            type="hidden"
                            name="vendor_number"
                            value={item.vendorNumber || ""}
                          />
                          <button type="submit" className="btn btn-primary enquiry-btn">
                            Enquiry
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}  </> )}
          </div>
        </div></>
   
    </div></>
  );
};

export default SearchResults;
