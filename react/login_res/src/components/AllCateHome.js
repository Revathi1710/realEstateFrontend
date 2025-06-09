import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

function RecentAddedProperty() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/getCategoryHome`)
      .then((response) => {
        if (response.data.status === "ok") {
          setProducts(response.data.data);
        } else {
          setError(response.data.message);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("An error occurred while fetching data.");
        setLoading(false);
      });
  }, []);

  const scroll = (direction) => {
    const cardWidth = scrollRef.current.querySelector(".category-card")?.offsetWidth || 300;
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

  const colorClasses = ['bg-light', 'bg-warning', 'bg-info', 'bg-success'];

  return (
    <div className="container mt-5">
      {error && <p className="text-danger">{error}</p>}

      <div className="position-relative">
        <button
          onClick={() => scroll("prev")}
          className="btn btn-light position-absolute top-50 start-0 translate-middle-y z-3"
        >
          ‹
        </button>

        <div
          className="d-flex overflow-auto gap-3 px-2"
          style={{ scrollBehavior: "smooth" }}
          ref={scrollRef}
        >
          {products.map((product, index) => {
            const cardColor = colorClasses[index % colorClasses.length];
            return (
              <div
                key={product._id}
                className={`category-card flex-shrink-0 ${cardColor}`}
                style={{ width: "25%" }}
              >
                <div className="card recentlyAdded-card h-100">
                  <div className="recent-image-container">
                    {product.PropertyImages && product.PropertyImages.length > 0 ? (
                      <Link to={`/ProductView/${product._id}`}>
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${product.PropertyImages[0].replace('\\', '/')}`}
                          alt="Property"
                          className="card-img-top homeproductimage"
                        />
                      </Link>
                    ) : (
                      <Link to={`/ProductView/${product._id}`}>
                        <img
                          src="/path_to_default_image.jpg"
                          alt="Default Property"
                          className="card-img-top homeproductimage"
                        />
                      </Link>
                    )}
                  </div>
                  <div className="card-body text-center">
                    <Link to={`/Categoryview/${product._id}`} className="card-title fw-bold text-dark text-decoration-none">
                      {product.name}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll("next")}
          className="btn btn-light position-absolute top-50 end-0 translate-middle-y z-3"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default RecentAddedProperty;
