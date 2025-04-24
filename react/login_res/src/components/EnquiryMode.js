import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import './modelStyle.css';
import { useNavigate } from 'react-router-dom';
const EnquiryModal = ({ show, handleClose, product, vendorData,userData }) => {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };
 
  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      navigate('/login');  // Redirect to login first
      return;  // Stop further execution
  }
   
    const enquiryData = {
      productname: product.name,
      product_id: product._id,
      productPrice: product.sellingPrice,
      vendorId: product.vendorDetails._id,
      UserId: userData._id,
      Username: userData.fname,
      UserNumber: userData.number,
      Quality: quantity,
      vendorName:vendorData.fname,
      vendorBusinessName:vendorData.businessName,
      vendorNumber:vendorData.number,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/sendEnquiry`, enquiryData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      if (data.status === 'ok') {
        setMessage('Enquiry sent successfully!');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('An error occurred: ' + error.message);
    }
  };

  if (!product) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Contact Seller by adding a few details of your requirement</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-sm-4 imageside'>
            <img 
              src={`${process.env.REACT_APP_API_URL}/${product.image.replace('\\', '/')}`} 
              className="img-fluid mb-3" 
              alt={product.name}
            />
            <h6>{product.name}</h6>
            <div>Sold By - {product.vendorDetails.businessName}, {product.vendorDetails.City}, {product.vendorDetails.State}</div>
          </div>
          <div className='col-sm-8'>
            <h5>{product.name}</h5>
            <div>₹{product.sellingPrice}</div>
            
            <div className="form-group">
              <label htmlFor="quantity">Select Quantity</label>
              <input 
                type="number" 
                className="form-control quanity" 
                id="quantity" 
                value={quantity} 
                onChange={handleQuantityChange} 
                min="1"
              />
            </div>
            {message && <div className="alert alert-info">{message}</div>}
            <Button  onClick={handleEnquirySubmit} className='enquiry-btn'>
              Submit Enquiry
            </Button>
            
            {/*<div className='yourinfo'>
            <hr></hr>
              <h4>Your Contact Information</h4>
              <div>{vendorData ? `${vendorData.fname}, ${vendorData.number}` : 'Please log in to continue'}</div>
            </div>*/}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EnquiryModal;
