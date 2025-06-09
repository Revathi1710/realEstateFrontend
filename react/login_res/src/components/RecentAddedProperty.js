import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from "date-fns";
function RecentAddedProperty() {
  const [properties, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${process.env.REACT_APP_API_URL}/getRecentlypropertyHome`;
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === "ok") {
          setProducts(data.data);
          setMessage("");
        } else {
          setProducts([]);
          setMessage(data.message);
        }
      } catch (error) {
        setMessage("An error occurred: " + error.message);
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const scroll = (direction) => {
    const cardWidth = scrollRef.current.querySelector(".property-card").offsetWidth;
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
          {properties.map((property) => (
            <div
              key={property._id}
              className="property-card flex-shrink-0"
              style={{ width: "25%" }}
            >
              <div className="card recentlyAdded-card">
                 <div className="recent-image-container">
                 {property.PropertyImages && property.PropertyImages.length > 0 ? (
                   
                                      <Link to={`/ProductView/${property._id}`}>
                                <img
                                  src={`${process.env.REACT_APP_API_URL}/${property.PropertyImages[0].replace('\\', '/')}`}
                                  alt="Property"   className="card-img-top homeproductimage" 
                                />   </Link>
                              ) : (
                                <Link to={`/ProductView/${property._id}`}>
                                <img
                                  src="path_to_default_image.jpg" // Default image in case PropertyImages is empty
                                  alt="Default Property"   className="card-img-top homeproductimage" 
                                /> </Link>
                               
                              )}
               </div>
                <div className="card-body">
                  <h5 className="price-container">₹{formatIndianPrice(property.expectedPrice)}</h5>
                  <p className="card-text fw-bold">{property.bedrooms} BNK  {property.kindofPropertyDetails}  {property.bathrooms} Baths</p>
                  <p className="card-text text-muted propety-local-recent">{property.locality}</p>
                  <div className="d-flex justify-content-between mt-2">
                  <p className="card-text text-muted propety-local-recent">
                    Posted by {property.vendorDetails?.fname || "Unknown"} </p>
                  <p className="card-text text-muted propety-local-recent"> {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}</p>  
                 </div>
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
    </div>
  );
}

export default RecentAddedProperty;
