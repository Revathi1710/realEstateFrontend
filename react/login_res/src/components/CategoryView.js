import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import { formatDistanceToNow } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';
import './categoryview.css';
import AllHorizontalBanner from './AllHorizontalBanner';
import { FaBed, FaRulerCombined, FaHome, FaTools } from 'react-icons/fa';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
const [minPrice, setMinPrice] = useState('');
const [maxPrice, setMaxPrice] = useState('');

  const [typeFilter, setTypeFilter] = useState('');
  const [bedroomFilter, setBedroomFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { category } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) return;

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/userData`, { id: storedUserId });
        if (response.data.status === 'ok') {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchProducts = async () => {
      if (!category) {
        setMessage('Category is not defined.');
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getProductsByCategory/${category}`);
        if (response.data.status === 'ok') {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    const fetchSubcategories = async () => {
      if (!category) return;
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getSubCategory/${category}`);
        if (response.data.status === 'ok') {
          setSubcategories(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error.message);
      }
    };

    fetchUserData();
    fetchProducts();
    fetchSubcategories();
  }, [category]);

  useEffect(() => {
    let filtered = [...products];

    if (typeFilter) {
      filtered = filtered.filter(p => p.propertyType === typeFilter);
    }

    if (bedroomFilter) {
      filtered = filtered.filter(p => String(p.bedrooms) === bedroomFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(p => p.constructionStatus === statusFilter);
    }

    setFilteredProducts(filtered);
  }, [products, typeFilter, bedroomFilter, statusFilter]);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!userData) {
      window.localStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const enquiryData = {
      productname: formData.get('productname'),
      product_id: formData.get('product_id'),
      productPrice: formData.get('productPrice'),
      vendorId: formData.get('vendorId'),
      UserId: userData._id,
      Username: userData.fname,
      UserNumber: userData.number,
      Quality: 1,
      vendorName: formData.get('vendor_name'),
      vendorBusinessName: formData.get('business_name'),
      vendorNumber: formData.get('vendor_number'),
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/sendEnquiry`, enquiryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status === 'ok') {
        setMessage('Enquiry sent successfully!');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        {message && <div className="alert alert-info">{message}</div>}

        <div className="row">
          {/* Filters */}
          <div className="col-md-3">
          <div className="bg-white p-3 border rounded shadow-sm" style={{ position: "sticky", top: "85px" }}>
            <h5 className="mb-3">Filters</h5>

            {/* Property Type */}
            <div className="mb-4">
              <h6 className="text-muted mb-2">Type of Property</h6>
              {[
                'Independent House/Villa',
                'Residential Land',
                'Residential Apartment',
                'Independent/Builder Floor',
                'Farm House'
              ].map(type => (
                <div key={type} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="propertyType"
                    id={type}
                    checked={typeFilter === type}
                    onChange={() => setTypeFilter(type)}
                  />
                  <label className="form-check-label" htmlFor={type}>
                    {type}
                  </label>
                </div>
              ))}
            </div>

            {/* Bedrooms */}
            <div className="mb-4">
              <h6 className="text-muted mb-2">Bedrooms</h6>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <div key={num} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="bedrooms"
                    id={`bedroom-${num}`}
                    checked={bedroomFilter === String(num)}
                    onChange={() => setBedroomFilter(String(num))}
                  />
                  <label className="form-check-label" htmlFor={`bedroom-${num}`}>
                    {num} BHK
                  </label>
                </div>
              ))}
            </div>

            {/* Construction Status */}
            <div className="mb-4">
              <h6 className="text-muted mb-2">Construction Status</h6>
              {['New Launch', 'Under Construction', 'Ready To Move'].map(status => (
                <div key={status} className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="status"
                    id={status}
                    checked={statusFilter === status}
                    onChange={() => setStatusFilter(status)}
                  />
                  <label className="form-check-label" htmlFor={status}>
                    {status}
                  </label>
                </div>
              ))}
            </div>

            {/* Budget */}
            <div className="mb-4">
              <h6 className="text-muted mb-2">Budget (₹)</h6>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="form-control"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="form-control"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Clear Filters */}
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setTypeFilter("");
                setBedroomFilter("");
                setStatusFilter("");
                setMinPrice("");
                setMaxPrice("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>


          {/* Products */}
          <div className="col-md-9">
            <AllHorizontalBanner />
            {filteredProducts.map((product, index) => (
              <div key={index} className="card mb-3 shadow-sm border">
                <div className="row g-0">
                  <div className="col-md-5">
                    {product.galleryimages?.length > 0 ? (
                      <div id={`carousel-${product._id}`} className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                          {product.galleryimages.map((img, i) => (
                            <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
                              <img
                                src={`${process.env.REACT_APP_API_URL}/${img.replace("\\", "/")}`}
                                className="d-block w-100 rounded-start p-2"
                                alt={`Slide ${i}`}
                                style={{ objectFit: "cover", maxHeight: "250px", borderRadius: "20px" }}
                              />
                            </div>
                          ))}
                        </div>
                        {product.galleryimages.length > 1 && (
                          <>
                            <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${product._id}`} data-bs-slide="prev">
                              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${product._id}`} data-bs-slide="next">
                              <span className="carousel-control-next-icon" aria-hidden="true"></span>
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
                      <h5 className="card-title mb-1">{product.name}</h5>
                      <p>{product.location}</p>

                      <div className="d-flex gap-3 flex-wrap mb-2">
                        <span className="text-muted"><FaBed /> {product.noBedroom} BHK</span>
                        <span className="text-muted"><FaRulerCombined /> {product.overallSize} sq.ft</span>
                        <span className="text-muted"><FaHome /> {product.Typeofproperty}</span>
                        <span className="text-muted"><FaTools /> {product.ConstructionStatus}</span>
                      </div>

                      <p className="card-text text-muted pricedetailscategory">₹{product.price}</p>
                      <p className="card-text"><small className="text-muted">{product.description}</small></p>

                      <div className="d-flex justify-content-between align-items-center">
                        <p>{formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}</p>
                        <form onSubmit={handleEnquiry} className="d-inline">
                          <input type="hidden" name="productname" value={product.name} />
                          <input type="hidden" name="product_id" value={product._id} />
                          <input type="hidden" name="vendorId" value={product.vendorId} />
                          <input type="hidden" name="productPrice" value={product.price} />
                          <input type="hidden" name="vendor_name" value={product.vendorName || ''} />
                          <input type="hidden" name="business_name" value={product.business_name || ''} />
                          <input type="hidden" name="vendor_number" value={product.vendorNumber || ''} />
                          <button type="submit" className="enquiry-btn">Enquiry</button>
                        </form>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
