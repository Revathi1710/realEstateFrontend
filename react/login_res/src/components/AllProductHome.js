import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EnquiryModal from './EnquiryMode';
import { Link } from 'react-router-dom';
import defaultImage from '../icons/default-image.png';
import './AllproductHome.css';

const AllProducts = ({ location }) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    const vendortoken = window.localStorage.getItem("vendortoken");

    if (vendortoken) {
      fetch(`${process.env.REACT_APP_API_URL}/vendorData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ vendortoken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== "ok") {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message);
        });
    }

    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) return;

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/userData`, { id: storedUserId });
        if (response.data.status !== 'ok') {
          console.error('User fetch failed');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getFeacturePropertyHome`);
        const data = response.data;

        if (data.status === 'ok') {
          setProducts(data.data);
          setMessage('');
        } else {
          setProducts([]);
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
        setProducts([]);
      }
    };

    fetchProducts();
    fetchUserData();
  }, [location.pathname]);

  const handleEnquiryClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const scroll = (direction) => {
    const cardWidth = scrollRef.current?.querySelector(".feacture-product-card")?.offsetWidth || 300;
    scrollRef.current.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  const formatIndianPrice = (amount) => {
    if (amount >= 10000000) {
      return (amount / 10000000).toFixed(2).replace(/\.00$/, '') + ' Crore';
    } else if (amount >= 100000) {
      return (amount / 100000).toFixed(2).replace(/\.00$/, '') + ' Lac';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(2).replace(/\.00$/, '') + ' Thousand';
    } else {
      return amount;
    }
  };

  return (
    <div className="container mt-5">
      {message && <p className="text-danger">{message}</p>}

      <div className="position-relative">
        <button
          onClick={() => scroll("prev")}
          className="btn btn-light position-absolute top-50 start-0 translate-middle-y z-3"
        >
          ‹
        </button>

        <div
          className="d-flex overflow-auto gap-3"
          style={{ scrollBehavior: "smooth" }}
          ref={scrollRef}
        >
          {products.map((product, index) => (
            <div key={index} className="col-lg-6 col-md-4 col-sm-6 mb-4 feacture-product-card">
              <div className="card cardImageContainer h-100 text-center">
                <div className='category-inner-container'>
                  <Link to={`/ProductView/${product._id}`}>
                    <img
                      src={product.PropertyImages && product.PropertyImages.length > 0
                        ? `${process.env.REACT_APP_API_URL}/${product.PropertyImages[0].replace('\\', '/')}`
                        : defaultImage}
                      alt="Property"
                      style={{
                        width: '100%',
                        maxWidth: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px'
                      }}
                      className="card-img-top"
                    />
                  </Link>
                </div>

                <div className="card-body home-product-card">
                  <Link to={`/ProductView/${product._id}`} className="card-title ellipsis2 home-product-title">
                    <h5 className="feacture-product-name-home ">
                      {product.bedrooms} BNK {product.kindofPropertyDetails} {product.bathrooms} Baths
                    </h5>
                  </Link>
                  <p className='text-center'>{product.locality}</p>

                 <h5 className="feacture-product-name-home ">{formatIndianPrice(product.expectedPrice)}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("next")}
          className="btn btn-light position-absolute top-50 end-0 translate-middle-y z-3 next-prev-btn"
        >
          ›
        </button>
      </div>

      {showModal && <EnquiryModal product={selectedProduct} onClose={handleModalClose} />}
    </div>
  );
};

export default AllProducts;
