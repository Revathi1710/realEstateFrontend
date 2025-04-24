
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './UserProfile.css';
import './businessProfile.css';
import menu from '../icons/menu.png'; 
import percentageimage1 from '../icons/percentageimage1.png';

import infogif from '../icons/gifinfo.gif';


const UpdateProfileVendor = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    businessName: '',
    OfficeContact: '',
    FaxNumber: '',
    Ownership: '',
    AnnualTakeover: '',
    establishment: '',
    NoEmployee: '',
      selectType:'',
    Address: '',
    City: '',
    State: '',
    Country: '',
    Pincode: ''
  });
  
  const [sidebarmenuOpen, setSidebarmenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [businessType, setBusinessType] = useState(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [showCompanyDetails, setShowCompanyDetails] = useState(true);
  const [showAddressDetails, setShowAddressDetails] = useState(false);

  const toggleCompanyDetails = () => setShowCompanyDetails(!showCompanyDetails);
  const toggleAddressDetails = () => setShowAddressDetails(!showAddressDetails);

   const toggleVendorsidebar = () => {
    setSidebarmenuOpen(!sidebarmenuOpen);
  };
  
  // Close Sidebar
  const closeSidebar = () => {
    setSidebarmenuOpen(false);
  };

  

 

  useEffect(() => {
    const vendortoken = window.localStorage.getItem('vendortoken');

    if (!vendortoken) {
      setError('No token found');
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
          setBusinessType(response.data.data.businessType);
        } else {
          setError(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  }, [vendorId]);
  const calculateCompleteness = (data) => {
    let filledFields = 0;
    const totalFields = 13;

    if (data.businessName && data.businessName.trim() !== '') filledFields++;
    if (data.OfficeContact && data.OfficeContact.trim() !== '') filledFields++;
    if (data.FaxNumber && data.FaxNumber.trim() !== '') filledFields++;
    if (data.Ownership && data.Ownership.trim() !== '') filledFields++;
    if (data.AnnualTakeover && data.AnnualTakeover.trim() !== '') filledFields++;
    if (data.establishment && data.establishment.trim() !== '') filledFields++;
    if (data.NoEmployee && data.NoEmployee.trim() !== '') filledFields++;
   
    if (data.selectType && data.selectType.trim() !== '') filledFields++;
    if (data.Address && data.Address.trim() !== '') filledFields++;
    if (data.City && data.City.trim() !== '') filledFields++;
    if (data.State && data.State.trim() !== '') filledFields++;
    if (data.Country && data.Country.trim() !== '') filledFields++;
    if (data.Pincode && data.Pincode.trim() !== '') filledFields++;

    const completeness = Math.round((filledFields / totalFields) * 100);
    setProfileCompleteness(completeness);
  };
  useEffect(() => {
    calculateCompleteness(vendorData);
}, [vendorData]); 
  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLogout = () => {
    localStorage.removeItem('vendorId'); // Remove vendorId
    window.location.href = '/vendor/login'; // Redirect to login page
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const vendortoken = window.localStorage.getItem('vendortoken');
    const vendorId = window.localStorage.getItem('vendorId');
    axios.put(`${process.env.REACT_APP_API_URL}/BusinessProfile`, vendorData, {
      headers: { 'Authorization': `Bearer ${vendortoken} `}
    })
    .then(response => {
      if (response.data.status === 'ok') {
        alert('updated successflly')
      } else {
        setError(response.data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.message);
    });
  };


  return (
    <div className="update-profile-vendor">
      <Navbar />
       <div className="vendor-sidebarmobile-menu mx-2 mt-2">
        <div style={{ position: "relative" }}>
          <img 
            src={menu} 
            width={30} 
            alt="Menu" 
            className="usermenu-bar-vendor" 
            onClick={toggleVendorsidebar}
          />
        </div>
      </div>
      <div className="content row mt-4">
      <div className='col-sm-3 desktop-vendor-sidebar'>
          <ul className='VendorList'>
            <li className='list'> <Link to="/Vendor/Dashboard"><i className="fas fa-home sidebaricon"></i> Dashboard</Link></li>
          </ul>
          <ul className="nano-content VendorList">
            <li className={`sub-menu list ${activeSubMenu === 5 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(5)}>
                <i className="fas fa-user-alt sidebaricon"></i><span>Profile</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                <li className='list_sidebar'><Link to="/Vendor/UserProfile" className='listsidebar'>User Profile</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/BusinessProfile" className='listsidebar'>Business Profile</Link></li>
               {/* <li className='list_sidebar'><Link to="/Vendor/BankDetails" className='listsidebar'>Bank Details</Link></li>*/}
              </ul>
            </li>
            <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                <i className="fab fa-product-hunt sidebaricon"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }} className='vendorsidebarmenu'>
              <li className='list_sidebar'><Link to="/Vendor/AllProduct" className='listsidebar'>All Product</Link></li>
              <li className='list_sidebar'><Link to="/Vendor/AddProductVendor" className='listsidebar'>Add Product</Link></li>
              </ul>
            </li>
          
         
            <ul className='VendorList' onClick={handleLogout}>
            <li className='list'><i className="fas fa-sign-out-alt sidebaricon"></i>Logout</li>
          </ul>
         
          </ul>
      
        </div>
         {/* Sidebar */}
              <div className={`mobiles-vendor-sidebar ${sidebarmenuOpen ? "active" : ""}`}>
                <div className="overlay">
                  <div className="text-left mobileclose-btn">
                    <button className="mt-2 closebtn" onClick={toggleVendorsidebar}>
                      <i className="fas fa-arrow-left"></i>
                    </button>
                  </div>
                  <ul className="VendorList">
                    <li className="list">
                      <Link to="/Vendor/Dashboard">
                        <i className="fas fa-home sidebaricon"></i> Dashboard
                      </Link>
                    </li>
                  </ul>
                  <ul className="nano-content VendorList">
                    <li className={`sub-menu list ${activeSubMenu === 5 ? 'active' : ''}`}>
                      <a href="#!" onClick={() => handleSubMenuToggle(5)}>
                        <i className="fas fa-user-alt sidebaricon"></i><span>Profile</span><i className="arrow fa fa-angle-right pull-right"></i>
                      </a>
                      <ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                        <li className='list_sidebar'><Link to="/Vendor/UserProfile" className='listsidebar'>User Profile</Link></li>
                        <li className='list_sidebar'><Link to="/Vendor/BusinessProfile" className='listsidebar'>Business Profile</Link></li>
                       {/* <li className='list_sidebar'><Link to="/Vendor/BankDetails" className='listsidebar'>Bank Details</Link></li>*/}
                      </ul>
                    </li>
                    <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
                      <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                        <i className="fab fa-product-hunt sidebaricon"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
                      </a>
                      <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                      <li className='list_sidebar'><Link to="/Vendor/AllProduct" className='listsidebar'>All Product</Link></li>
                      <li className='list_sidebar'><Link to="/Vendor/AddProductVendor" className='listsidebar'>Add Product</Link></li>
                      </ul>
                    </li>
                  
                 
                    <ul className='VendorList' onClick={handleLogout}>
                    <li className='list'><i className="fas fa-sign-out-alt sidebaricon"></i>Logout</li>
                  </ul>
                 
                  </ul>
                </div>
              </div>
        <div className='col-sm-8 '>
          <div className='businessinfo-container'>
          <h3 className='title-vendorInfo'>Business Profile</h3>
          {error && <p className="error">{error}</p>}
          <div className="form-container1">
            {/*<div className='row threesection'>
                <div className='col-sm-4'>
                    Business Details
                </div>
                <div className='col-sm-4'>
                   Additional Details
                </div>
                <div className='col-sm-4'>
                Certification & Awards
                </div>
            </div>*/}

            <div className='companyDetails'>
               
                
            <form onSubmit={handleSubmit}>
  <div className='titlecompany row' id='companydetails'>
    <div className="topic col-sm-10">Company Details</div>
    <div className='iconsbusiness col-sm-2' onClick={toggleCompanyDetails}>
      <i className={`fa fa-caret-${showCompanyDetails ? 'up' : 'down'}`}></i>
    </div>
  </div>

  {showCompanyDetails && (
    <div>
      <div className="form-group">
        <div className="mb-2">
          <div className="labelcontainer">
            <label htmlFor="businessName">Company Name:</label>
          </div>
          <input
            type="text"
            className="form-control"
            id="businessName"
            name="businessName"
            placeholder='Enter Company Name'
            value={vendorData.businessName}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="OfficeContact">Office Contact Number:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="OfficeContact"
              name="OfficeContact"
              placeholder='Office Contact Number'
              value={vendorData.OfficeContact}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="FaxNumber">Fax Number:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="FaxNumber"
              name="FaxNumber"
              placeholder='Fax Number'
              value={vendorData.FaxNumber}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="Ownership">Ownership Type:</label>
            </div>
            <select
              className="form-control"
              id="Ownership"
              name="Ownership"
              value={vendorData.Ownership}
              onChange={handleChange}
              required
            >
              <option>Ownership Type</option>
              <option>Public Limited Company</option>
              <option>Private Limited Company</option>
              <option>Partnership</option>
              <option>Proprietorship</option>
              <option>Professional Associations</option>
              <option>Others</option>
            </select>
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="AnnualTakeover">Annual Takeover</label>
            </div>
            <input
              type="tel"
              className="form-control"
              id="AnnualTakeover"
              name="AnnualTakeover"
              placeholder='Annual Takeover'
              value={vendorData.AnnualTakeover}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="establishment">Year of Establishment:</label>
            </div>
            <input
              type="tel"
              className="form-control"
              id="establishment"
              name="establishment"
              placeholder='Year of Establishment'
              value={vendorData.establishment}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="NoEmployee">Number of Employees:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="NoEmployee"
              name="NoEmployee"
              placeholder='Number of Employees'
              value={vendorData.NoEmployee}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
      
      </div>
    </div>
  )}

  <div className='titlecompany row' id='addressdetails'>
    <div className="topic col-sm-10">Address Details</div>
    <div className='iconsbusiness col-sm-2' onClick={toggleAddressDetails}>
      <i className={`fa fa-caret-${showAddressDetails ? 'up' : 'down'}`}></i>
    </div>
  </div>

  {showAddressDetails && (
    <div>
      <div className="form-group">
        <div className="mb-2">
          <div className="labelcontainer">
            <label htmlFor="Address">Address:</label>
          </div>
          <textarea
            className="form-control"
            id="Address"
            name="Address"
            placeholder="Enter Address"
            value={vendorData.Address}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="City">City:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="City"
              name="City"
              placeholder='City'
              value={vendorData.City}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="State">State:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="State"
              name="State"
              placeholder='State'
              value={vendorData.State}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="Pincode">Pincode:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="Pincode"
              name="Pincode"
              placeholder='Pincode'
              value={vendorData.Pincode}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-2">
            <div className="labelcontainer">
              <label htmlFor="Country">Country</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="Country"
              name="Country"
              placeholder='Country'
              value={vendorData.Country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  )}
  <div className="form-group text-center">
    <button type="submit" className="btn btn-primary">Update Profile</button>
  </div>
</form>

          </div>
          </div>
          
        </div>
          
       {/* <div className='col-sm-3  perbox'>
          <div className='percentage'>
  

  
  <div class="circle-wrap">
    <div class="circle">
      <div class="mask full-1">
        <div class="fill-1"></div>
      </div>
      <div class="mask half">
        <div class="fill-1"></div>
      </div>
      <div className="inside-circle"> {profileCompleteness}% </div>
    </div>
  </div>
   
     

        <h6>My Profile Completeness</h6>
        <p>Please add your Standard Certificate</p>
          </div>
          <img src={percentageimage1}  />
          </div>*/}
        
      </div></div>
    </div>
  );
};

export default UpdateProfileVendor;