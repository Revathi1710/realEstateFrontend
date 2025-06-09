import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from 'react-router-dom';

function AllCategory() {
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

  const softBgColors = [
"#fff8f0", "#f0f8ff", "#f5fff0", "#f2f0ff", "#fff0f5", "#f0fbff"];

  

  return (
    <div className="container mt-5">
      {error && <p className="text-danger">{error}</p>}

      <div className="position-relative">
        <button
          onClick={() => scroll("prev")}
          className="btn btn-outline-secondary position-absolute top-50 start-0 translate-middle-y z-3"
          style={{ borderRadius: "50%" }}
        >
          ‹
        </button>

        <div
          className="d-flex overflow-auto gap-3 px-2"
          ref={scrollRef}
          style={{ scrollBehavior: "smooth" }}
        >
          {products.map((product, index) => {
            const bgColor = softBgColors[index % softBgColors.length];
            return (
              <div
                key={product._id}
                className="category-card flex-shrink-0"
                style={{
                  width: "250px",
                  backgroundColor: bgColor,
                  borderRadius: "12px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)"
                }}
              >
                <div className="card h-100 border-0">
                  <div className="category-image-container">
                    <Link to={`/Categoryview/${product._id}`}>
                    
                      <img
                        src={
                          product.image?.length > 0
                            ? `${process.env.REACT_APP_API_URL}/${product.image.replace('\\', '/')}`
                            : "/path_to_default_image.jpg"
                        }
                        alt="Property"
                        className="card-img-top homeproductimage"
                        style={{
                       
                          objectFit: "cover"
                         
                        }}
                      />
                      
                    </Link>
                  </div>
                  <div className="card-body text-center" style={{  backgroundColor: bgColor}}>
                    <Link
                      to={`/Categoryview/${product._id}`}
                      className="fw-semibold text-dark text-decoration-none"
                    >
                      {product.name}
                    </Link>
                       <p className="text-muted mb-0">
                  888+ Properties
                  </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => scroll("next")}
          className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y z-3"
          style={{ borderRadius: "50%" }}
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default AllCategory;
