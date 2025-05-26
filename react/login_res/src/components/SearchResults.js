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

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/search`, {
          params: { query, city, locality, propertyType },
        });
        setResults(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchResults();
  }, [query, city, locality, propertyType]);

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

      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="row">
          <div className="col-sm-3"></div>

          <div className="col-md-9">
            <AllHorizontalBanner />

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
            ))}
          </div>
        </div>
      )}
    </div></>
  );
};

export default SearchResults;
