import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './EnquirySendBuilder.css';

const EnquirySendBuilder = ({ show, handleClose, product, vendorData }) => {
  const [userData, setUserData] = useState({
    fname: '',
    number: '',
    email: ''
  });

  const [isDealer, setIsDealer] = useState(null);
  const [buyPlan, setBuyPlan] = useState('');

  useEffect(() => {
    const fetchBuilderData = async () => {
      const storedVendorId = localStorage.getItem('vendorId');
      if (!storedVendorId) {
        setUserData({ fname: '', number: '', email: '' });
        setIsDealer(null);
        return;
      }

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/BuilderData`, {
          id: storedVendorId,
        });

        if (response.data.status === 'ok') {
          const data = response.data.data;
          setUserData({
            fname: data.fname || '',
            number: data.number || '',
            email: data.email || ''
          });
          setIsDealer('yes');
        }
      } catch (err) {
        console.error('Error fetching vendor data:', err.message);
      }
    };

    if (show) {
      fetchBuilderData();
    }
  }, [show]);

  const handleEnquirySubmit = async () => {
    if (!userData.fname || !userData.number || !userData.email) {
      alert('Please fill all the required fields.');
      return;
    }

    const enquiryPayload = {
      customerId: localStorage.getItem('vendorId'),
      customername: userData.fname,
      customerIdNumber: userData.number,
      customerEmail: userData.email,
      isBuilder: isDealer,
      buyPlan,
      property_id: product?._id || '',
      ownerId: vendorData?._id || '',
      ownerName: vendorData?.fname || '',
      ownerNumber: vendorData?.number || ''
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/sendEnquiryProperty`, enquiryPayload);
      if (response.data.status === 'ok') {
        alert('Enquiry sent successfully!');
        handleClose();
      } else {
        alert('Failed to send enquiry');
      }
    } catch (err) {
      console.error('Error sending enquiry:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className='buildersend-container'>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Please share your details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="mb-3"><strong>BASIC INFORMATION</strong></h6>

          <div className='row'>
            <div className='col-sm-6'>
              <Form.Group>
                <Form.Label className="form-label">Are you a property dealer?</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    inline
                    label="Yes"
                    name="dealer"
                    type="radio"
                    checked={isDealer === 'yes'}
                    onChange={() => setIsDealer('yes')}
                  />
                  <Form.Check
                    inline
                    label="No"
                    name="dealer"
                    type="radio"
                    checked={isDealer === 'no'}
                    onChange={() => setIsDealer('no')}
                  />
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label className="form-label">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  className="form-control custom-input"
                  value={userData.fname}
                  onChange={(e) => setUserData({ ...userData, fname: e.target.value })}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="form-label">Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your phone number"
                  className="form-control custom-input"
                  value={userData.number}
                  onChange={(e) => setUserData({ ...userData, number: e.target.value })}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label className="form-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="form-control custom-input"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </Form.Group>
            </div>

            <div className='col-sm-6'>
              <h6 className="mb-3"><strong>OPTIONAL INFORMATION</strong></h6>

              <Form.Group className="mb-3">
                <Form.Label className="form-label">By when are you planning to buy the property?</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  <Form.Check
                    inline
                    label="3 months"
                    name="plan"
                    type="radio"
                    checked={buyPlan === '3 months'}
                    onChange={() => setBuyPlan('3 months')}
                  />
                  <Form.Check
                    inline
                    label="6 months"
                    name="plan"
                    type="radio"
                    checked={buyPlan === '6 months'}
                    onChange={() => setBuyPlan('6 months')}
                  />
                  <Form.Check
                    inline
                    label="More than 6 months"
                    name="plan"
                    type="radio"
                    checked={buyPlan === 'More than 6 months'}
                    onChange={() => setBuyPlan('More than 6 months')}
                  />
                </div>
              </Form.Group>

              <Form.Check
                className="mb-3"
                label={
                  <>
                    I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>
                  </>
                }
              />

              <Button onClick={handleEnquirySubmit} className="btn-dark w-100">
                View Number
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EnquirySendBuilder;
