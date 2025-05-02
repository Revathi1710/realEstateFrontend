import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import RelatedProduct from '../components/RelatedProduct';
import MoreSellerProduct from '../components/MoreSellerProduct';
import axios from 'axios';
import './productview.css';
import Footer from './Footer';
import EnquirySendBuilder from './EnquirySendBuilder';

import AreaProperty from '../icons/maximize.png';
import Configuration from '../icons/bed (3).png';
import PriceProperty from '../icons/tag.png';
import AddressProperty from '../icons/map.png';
import FloorProperty from '../icons/stairs.png';
import FacingProperty from '../icons/compass.png';
import otherRoomsProperty from '../icons/study-room.png';
import AgeProperty from '../icons/birthday-cake.png';
const ProductView = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [userData, setUserData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [mainMedia, setMainMedia] = useState({ type: 'image', src: '' });
  const [galleryImages, setGalleryImages] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

const scrollToSection = (sectionId) => {
  const element = document.getElementById(`${sectionId}-container`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(sectionId);
  }
};


  const handleModalOpen = () => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleTabClick = (tab) => setActiveTab(tab);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(`${process.env.REACT_APP_API_URL}/PropertyView/${id}`);
        if (productResponse.data.status === 'ok') {
          const fetchedProduct = productResponse.data.data;
          setProduct(fetchedProduct);
          const images = fetchedProduct.PropertyImages.map(img =>
            `${process.env.REACT_APP_API_URL}/${img.replace(/\\/g, '/')}`
          );
          setGalleryImages(images);
          setMainMedia({ type: 'image', src: images[0] });
        } else {
          setError(productResponse.data.message);
        }

        const reviewsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/productReviews/${id}`);
        if (reviewsResponse.data.status === 'ok') {
          setReviews(reviewsResponse.data.data);
        } else {
          setError(reviewsResponse.data.message);
        }
      } catch (err) {
        setError('An error occurred: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
  
    
    const fetchUserData = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) return;

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/userData`, { id: storedUserId });
        if (response.data.status === 'ok') {
          setUserData(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching user data:', err.message);
      }
    };

    fetchProduct();
    fetchUserData();
    window.scrollTo(0, 0);
  }, [id]);
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
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      {product ? (
        <>
        <div className='propertyTopdetails'>
          <div className='projectnameBtn'>
            <div className='d-flex productNamecontainer col-sm-7'>
              <b className='productPrice'>
              ₹{formatIndianPrice(product.expectedPrice)}

                <span className='sqaureprice'>@{product.pricePersqft} Sq.ft</span>
              </b>
              <div className='locationDetails'>
                <h3 className="productName">{product.bedrooms}BNK {product.bathrooms} Bath</h3>
                <p>{product.kindofPropertyDetails} for Sale</p>
                <p>{product.locality}</p>
              </div>
            </div>
            <div className='col-sm-4'>
              <button type="button" className="btn btn-primary sendenq" onClick={handleModalOpen}>
                View Number
              </button>
              {message && <p className="mt-2 text-success">{message}</p>}
            </div>
        
          </div>
          <ul className='propertyoverviewlist'>
  <li className={activeSection === 'overview' ? 'active' : ''} onClick={() => scrollToSection('overview')}>Overview</li>
  <li className={activeSection === 'builder' ? 'active' : ''} onClick={() => scrollToSection('builder')}>Builder Details</li>
  <li className={activeSection === 'featured' ? 'active' : ''} onClick={() => scrollToSection('featured')}>Featured Builders</li>
  <li className={activeSection === 'recommendations' ? 'active' : ''} onClick={() => scrollToSection('recommendations')}>Recommendations</li>
  <li className={activeSection === 'more' ? 'active' : ''} onClick={() => scrollToSection('more')}>Builder More Property</li>
</ul>

</div>
<div id="overview-container">
          <div className=" row productview-section">
            <div className="container productDetails">
              <div className="row productrow">
              <div className="productimage-showcase">
  <div className="productimage-sticky">
    {/* Main Display Area */}
    <div className="productimage-container" style={{ cursor: 'pointer' }}>
      {mainMedia.type === 'image' ? (
        <img
          src={mainMedia.src}
          className="img-fluid product-view-image"
          alt={product.name}
        />
      ) : (
        <video
          src={mainMedia.src}
          className="img-fluid product-view-image"
          controls
          autoPlay
          muted
        />
      )}
    </div>

    {/* Thumbnails */}
    <div className="d-flex mt-2 flex-wrap">
      {galleryImages.map((imgSrc, index) => (
        <img
          key={index}
          src={imgSrc}
          className="img-fluid galleryproduct-view-image me-2"
          width={100}
          height={100}
          alt={`Gallery ${index + 1}`}
          onClick={() => setMainMedia({ type: 'image', src: imgSrc })}
          style={{ cursor: 'pointer' }}
        />
      ))}

      {product.propertyVideo && (
        <video
          className="galleryproduct-view-image me-2"
          src={`${process.env.REACT_APP_API_URL}/${encodeURIComponent(product.propertyVideo.replace(/\\/g, '/'))}`}
          width={100}
          height={100}
          muted
          onClick={() =>
            setMainMedia({
              type: 'video',
              src: `${process.env.REACT_APP_API_URL}/${encodeURIComponent(product.propertyVideo.replace(/\\/g, '/'))}`,
            })
          }
          style={{ cursor: 'pointer' }}
        />
      )}
    </div>
  </div>
</div>



                <div className="product-special-section">
          <div className="container my-4">
  <div className="row g-3 border rounded p-3 shadow-sm containerboxproductspl" style={{ backgroundColor: "#fff" }}>
    {/* Area */}


    <div className="col-md-6 propertydetailslist">
      <div className="d-flex gap-3 align-items-start">
        <img src={AreaProperty} width={30} alt="Area" />
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>Area</div>
          <div className="list-property" style={{ fontSize: "1rem" }}>{product.carpetArea} Sq/ft</div>
        </div>
      </div>
    </div>

    {/* Configuration */}
    <div className="col-md-6 propertydetailslist">
      <div className="d-flex gap-3 align-items-start">
        <img src={Configuration} width={30} alt="Configuration" />
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>Configuration</div>
          <div className="list-property" style={{ fontSize: "1rem" }}>{product.bedrooms}Bedroom,
          {product.bathrooms}Bathroom,{product.balconies} Balcony
          </div>
        </div>
      </div>
    </div>

    {/* Price */}
    <div className="col-md-6 propertydetailslist">
      <div className="d-flex gap-3 align-items-start">
        <img src={PriceProperty} width={30} alt="Price" />
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>Price</div>
          <div className="list-property" style={{ fontSize: "1rem" }}>₹ {product.expectedPrice}</div>
        </div>
      </div>
    </div>

    {/* Address */}
    <div className="col-md-6 propertydetailslist">
      <div className="d-flex gap-3 align-items-start">
        <img src={AddressProperty} width={30} alt="Address" />
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>Address</div>
          <div className="list-property" style={{ fontSize: "1rem" }}>{product.locality}</div>
        </div>
      </div>
    </div>

    {/* Floor */}
    <div className="col-md-6 propertydetailslist">
      <div className="d-flex gap-3 align-items-start">
        <img src={FloorProperty} width={30} alt="Floor" />
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>Floor</div>
          <div className="list-property" style={{ fontSize: "1rem" }}>{product.FloorNumber}</div>
        </div>
      </div>
    </div>

    {/* Facing */}
    <div className="col-md-6 propertydetailslist">
      <div className="d-flex gap-3 align-items-start">
        <img src={FacingProperty} width={30} alt="Facing" />
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>Facing</div>
          <div className="list-property" style={{ fontSize: "1rem" }}>{product.Propertyfacing}</div>
        </div>
      </div>
    </div>

    {/* Other Rooms */}
    <div className="col-md-6 propertydetailslist">
      <div className="d-flex gap-3 align-items-start">
        <img src={otherRoomsProperty} width={30} alt="Other Rooms" />
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>Other Rooms</div>
          <div className="list-property" style={{ fontSize: "1rem" }}>  {Array.isArray(product.otherRooms) ? product.otherRooms.join(', ') : product.otherRooms}</div>
        </div>
      </div>
    </div>

    {/* Property Age */}
    <div className="col-md-6 propertydetailslist">
      <div className="d-flex gap-3 align-items-start">
        <img src={AgeProperty} width={30} alt="Property Age" />
        <div>
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>Property Age</div>
          <div className="list-property" style={{ fontSize: "1rem" }}>{product.ageOfProperty}</div>
        </div>
      </div>
    </div>
  </div>
</div>


                
                </div></div>
                <div className='container nearbycontainer mb-3'>
                  <h3 className='about_title mb-3'>Places Nearby Property</h3>
                  <div className='d-flex gap-3'>
                  {Array.isArray(product.PropertyNearby) ? (
  product.PropertyNearby.map((item, index) => (
    <div key={index} className="nearlist-property" style={{ fontSize: "1rem" }}>
      {item}
    </div>
  ))
) : (
  <div className="nearlist-property" style={{ fontSize: "1rem" }}>
    {product.PropertyNearby}
  </div>
)}

                </div></div>
                <div className='container about-container'>
                  <h3 className='mb-3 about_title'>About Property</h3>
                <p className="description">{product.aboutproperty}</p>
                </div>
                
              </div>
             
            </div>
          </div>
         
          <div id="builder-container" className='mt-3'>
        
            <div className='container'>
           
            <h2  className='mb-3 builder-title'>Builder Details</h2>
            <h4>{product.vendorId.fname}</h4>
            </div>
             


          </div>
          {/* Modal component */}
          <EnquirySendBuilder
            show={showModal}
            handleClose={handleModalClose}
            product={selectedProduct}
            vendorData={product.vendorId}
          />

         
         
        </>
      ) : (
        <p>Product not found.</p>
      )}
   

<div id="featured-container">
<div className='container'>
<h2  className='mb-3 builder-title'>Feactured Builder</h2>

</div></div>
<div id="recommendations-container">
<div className='container'>
<h2  className='mb-3 builder-title'>Recommendations</h2>
<div className='product-related mt-3 px-3'>
           
            <RelatedProduct categoryId={product.category} productId={product._id} />
          </div></div>
</div>
<div id="more-container">
<div className='container'>
<h2  className='mb-3 builder-title'>Builder More Property</h2>
<div className='product-related mt-3 px-3'>
          
            <MoreSellerProduct vendorId={product.vendorId._id} productId={product._id} />
          </div></div>
</div>

      <Footer />
    </div>
  );
};

export default ProductView;
