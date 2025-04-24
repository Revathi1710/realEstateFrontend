import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import RelatedProduct from '../components/RelatedProduct';
import MoreSellerProduct from '../components/MoreSellerProduct';
import axios from 'axios';
import './productview.css';
import Footer from './Footer';

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

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleChange = (e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1));
  const handleTabClick = (tab) => setActiveTab(tab);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await axios.get(`${process.env.REACT_APP_API_URL}/ProductView/${id}`);
        if (productResponse.data.status === 'ok') {
          const fetchedProduct = productResponse.data.data;
          setProduct(fetchedProduct);
          const mainImg = `${process.env.REACT_APP_API_URL}/${fetchedProduct.image.replace(/\\/g, '/')}`;
          setMainMedia({ type: 'image', src: mainImg });

          const gallery = fetchedProduct.galleryimages.map(img => `${process.env.REACT_APP_API_URL}/${img.replace(/\\/g, '/')}`);
          setGalleryImages(gallery);
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

  const handleMainImageClick = () => {
    if (!galleryImages.includes(mainMedia.src)) {
      setGalleryImages(prev => [mainMedia.src, ...prev]);
    }
  };

  const handleEnquiry = async (e) => {
    e.preventDefault();

    if (!userData) {
      localStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    const enquiryData = {
      productname: product.name,
      product_id: id,
      productPrice: product.sellingPrice,
      vendorId: product.vendorId._id,
      UserId: userData._id,
      Username: userData.fname,
      UserNumber: userData.number,
      Quality: quantity,
      vendorName: product.vendorId.fname,
      vendorBusinessName: product.vendorId.businessName,
      vendorNumber: product.vendorId.number,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/sendEnquiry`, enquiryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      setMessage(data.status === 'ok' ? 'Enquiry sent successfully!' : data.message);
    } catch (err) {
      setMessage('An error occurred: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Navbar />
      {product && (
        <>
          <div className='projectnameBtn'>
            <div className='d-flex productNamecontainer col-sm-5'>
              <b className='productPrice'>
                {product.price}
                <span className='sqaureprice'>@{product.overallSize}</span>
              </b>
              <div className='locationDetails'>
                <h3 className="productName">{product.name}</h3>
                <p>{product.category?.name}</p>
                <p>{product.location}</p>
              </div>
            </div>
            <div className='col-sm-4'>
              <form onSubmit={handleEnquiry}>
                <button className="btn btn-primary sendenq">Send Enquiry</button>
              </form>
              {message && <p className="mt-2 text-success">{message}</p>}
            </div>
          </div>

          <div className="row productview-section">
            <div className="col-md-9 productDetails">
              <div className="row productrow">
                <div className="productimage-showcase">
                  <div className="productimage-sticky">
                    <div className="productimage-container" onClick={handleMainImageClick} style={{ cursor: 'pointer' }}>
                      {mainMedia.type === 'image' ? (
                        <img src={mainMedia.src} className="img-fluid product-view-image" alt={product.name} />
                      ) : (
                        <video src={mainMedia.src} className="img-fluid product-view-image" controls autoPlay muted />
                      )}
                    </div>

                    <div className='d-flex mt-2 flex-wrap'>
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

                      {product.roomVideo && (
                        <video
                          className='galleryproduct-view-image me-2'
                          src={`${process.env.REACT_APP_API_URL}/${product.roomVideo.replace(/\\/g, '/')}`}
                          width={100}
                          height={100}
                          onClick={() => setMainMedia({ type: 'video', src: `${process.env.REACT_APP_API_URL}/${product.roomVideo.replace(/\\/g, '/')}` })}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="product-special-section">
               
         
            <div className="card-body">
              <h3 className="card-title text-primary">₹ {product.price}</h3>
              <p className="card-text fw-semibold">{product.noBedroom} Bedrooms | {product.noBathroom} Baths</p>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Plot Area:</strong> {product.overallSize}
                </li>
                <li className="list-group-item">
                  <strong>Configuration:</strong> {product.noBedroom} Bedrooms, {product.noBathroom} Bathrooms
                </li>
                <li className="list-group-item">
                  <strong>Address:</strong>{product.location} 
                </li>
                <li className="list-group-item">
                  <strong>Total Floors:</strong> 1
                </li>
                <li className="list-group-item">
                  <strong>Facing:</strong> South-East
                </li>
                <li className="list-group-item">
                  <strong>Overlooking:</strong> Main Road, Others
                </li>
                <li className="list-group-item">
                  <strong>Property Age:</strong> 1 to 5 Year Old
                </li>
              </ul>
             
            </div>
          </div>
   
     
 

               
              </div>
          
            <div className='overview-container px-3'>
            <div className="tabs mt-4">
                    <button
                      onClick={() => handleTabClick('overview')}
                      className={`btn btn-sm me-2 ${activeTab === 'overview' ? 'btn-dark' : 'btn-outline-dark'}`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => handleTabClick('reviews')}
                      className={`btn btn-sm ${activeTab === 'reviews' ? 'btn-dark' : 'btn-outline-dark'}`}
                    >
                      Dealer Details
                    </button>
                  </div>

                  {activeTab === 'overview' && (
                    <div className="productOverview mt-3">
                      <h4>Product Overview</h4>
                      <p className="description">{product.description}</p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="productReviews mt-3">
                      <h4>Dealer Details</h4>
                      {reviews.length > 0 ? (
                        reviews.map((rev, idx) => (
                          <div key={idx} className="review-box border p-2 mb-2">
                            <p><strong>{rev.user}</strong>: {rev.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p>No .</p>
                      )}
                    </div>
                  )}
            </div>  </div>
          </div>
 {/* Optional Related Products */}
 <div className='product-related mt-3 px-3'>
        <h3 className='productrecent'>Related Products </h3>
        <RelatedProduct categoryId={product.category} productId={product._id}/> 
      </div>
      <div className='product-related mt-3 px-3'>
        <h3 className='productrecent'>More Product From This seller</h3>
         <MoreSellerProduct  vendorId={product.vendorId._id} productId={product._id} /> 
      </div>
        </>
      )}

      {!product && <p>Product not found.</p>}
      <Footer />
    </div>
  );
};

export default ProductView;
