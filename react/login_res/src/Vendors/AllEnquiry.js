import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import './MyHomepage.css';

const AllEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [message, setMessage] = useState('');
  const [vendorData, setVendorData] = useState({});

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    const vendortoken = localStorage.getItem('vendortoken');

    if (!vendorId) {
      setMessage('Vendor ID not found. Please login again.');
      return;
    }

    // Fetch vendor data
    axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
        } else {
          setMessage(response.data.message || 'Failed to load vendor data');
        }
      })
      .catch(error => {
        console.error('Vendor fetch error:', error);
        setMessage('Error fetching vendor data');
      });

    // Fetch enquiries
    axios.post(`${process.env.REACT_APP_API_URL}/getVendorEnquiry`, { vendorId })
      .then(response => {
        if (response.data.status === 'ok') {
          setEnquiries(response.data.data);
        } else {
          setMessage('Error fetching enquiries: ' + response.data.message);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setMessage('Error fetching enquiries');
      });
  }, []);

  const updateStatus = (enquiryId, status) => {
    axios.post(`${process.env.REACT_APP_API_URL}/updateEnquiryStatus`, { enquiryId, status })
      .then(response => {
        if (response.data.status === 'ok') {
          setEnquiries(prev =>
            prev.map(enq => enq._id === enquiryId ? { ...enq, status } : enq)
          );
        } else {
          setMessage('Error updating status: ' + response.data.message);
        }
      })
      .catch(error => {
        console.error('Update error:', error);
        setMessage('Error updating status');
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
    <>
      <Navbar />
      <div className="bodymyhomepage">
        <div className="container d-flex" style={{ height: '100vh' }}>
          {/* Sidebar */}
          <div className="bg-dark text-white sidebarmyhomepage leftsidebarbuilder">
            <div className="user-info-sidebar">
              <h5>{vendorData.name || 'Vendor'}</h5>
            </div>
            <hr />
            <ul className="list-unstyled myhomelist">
              <li><Link to="/MyHomepage" className="myhomelist-a">My Homepage</Link></li>
              <li className="mt-3"><Link to="/AllProduct" className="myhomelist-a">All Product</Link></li>
              <li className="mt-3"><Link to="/AllEnquiry" className="myhomelist-a">All Enquiry</Link></li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-grow-1 sidebarmyhomepage">
            <div className="p-4 rightdashboard">
              <h2>All Enquiries</h2>
              {message && <div className="alert alert-info">{message}</div>}
           

            <div className="allenquiry px-4">
              {enquiries.length > 0 ? (
                enquiries.map(enquiry => {
                  const property = enquiry.property_id || {}; // populated object
                  const imagePath = property.image ? `${process.env.REACT_APP_API_URL}/${property.image.replace(/\\/g, '/')}` : null;

                  return (
                    <div className="row container ordercontainer mb-4 p-3 border rounded" key={enquiry._id}>
                      <div className="col-sm-4">
                        {imagePath ? (
                          <img
                            src={imagePath}
                            alt="Property"
                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            className="img-fluid rounded"
                          />
                        ) : (
                          <div className="text-muted">No image available</div>
                        )}
                      </div>
                      <div className="col-sm-8">
                         <b className='fs-2 mb-2'>
              ₹{formatIndianPrice(property.expectedPrice)}

                <span className='sqaureprice'>@{property.pricePersqft} Sq.ft</span>
              </b>
              <div className='locationDetails'>
                <h3 className="productName">{property.bedrooms}BNK {property.bathrooms} Bath</h3>
                <p>{property.kindofPropertyDetails} for Sale</p>
                <p>{property.locality}</p>
              </div>
                     
                        <a href={`tel:${enquiry.customerNumber}`} className="sellernumber d-block mt-2 text-decoration-none">
                          <div className="ordersellerdetails text-white">
                            <i className="fa fa-phone me-2"></i>{enquiry.customerIdNumber}
                          </div>
                        </a>

                        {/* Status Buttons */}
                        <div className="d-flex justify-content-start mt-3 gap-2">
                          {['Completed', 'Cancelled', 'Pending'].map(status => (
                            <button
                              key={status}
                              className={`btn ${enquiry.status === status ? (
                                status === 'Completed' ? 'btn-success' :
                                status === 'Cancelled' ? 'btn-danger' : 'btn-warning'
                              ) : (
                                status === 'Completed' ? 'btn-outline-success' :
                                status === 'Cancelled' ? 'btn-outline-danger' : 'btn-outline-warning'
                              )}`}
                              onClick={() => updateStatus(enquiry._id, status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No enquiries found.</p>
              )}
            </div>
          </div>
        </div>
      </div> </div>
    </>
  );
};

export default AllEnquiry;
