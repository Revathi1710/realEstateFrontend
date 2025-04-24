import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';

import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './UserProfile.css';
import menu from '../icons/menu.png'; 




const AddProductVendor = () => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');

    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [floorSpace, setfloorSpace] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [noBedroom, setnoBedroom] = useState('');
    const [noBathroom, setnoBathroom] = useState('');
       const [roomVideo, setRoomVideo] = useState('');
    const [overallSize, setoverallSize] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [TotalFloors, setTotalFloors] = useState([]);
    const [Overlooking, setOverlooking] = useState([]); 
    const [PropertyAge, setPropertyAge] = useState([]);
    const [persquare, setpersquare] = useState([]);
    const [ConstructionStatus, setConstructionStatus] = useState([]);
    const [Typeofproperty, setTypeofproperty] = useState([]);
    const [areaType, setareaType] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);

    const [subcategories, setSubCategories] = useState([]);
   

    const [filteredSubcategories, setFilteredSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [vendorData, setVendorData] = useState({});
    const [error, setError] = useState(null);
    const [categoryName, setCategoryName] = useState('');
const [sidebarmenuOpen, setSidebarmenuOpen] = useState(false);
    const [message, setMessage] = useState('');
    const toggleVendorsidebar = () => {
      setSidebarmenuOpen(!sidebarmenuOpen);
    };
    // Add new input
const handleAddGalleryImage = () => {
  setGalleryImages([...galleryImages, { file: null }]);
};

// Handle file selection
const handleGalleryImageChange = (index, file) => {
  const updatedImages = [...galleryImages];
  updatedImages[index].file = file;
  setGalleryImages(updatedImages);
};

// Remove a specific input
const handleRemoveGalleryImage = (index) => {
  const updatedImages = [...galleryImages];
  updatedImages.splice(index, 1);
  setGalleryImages(updatedImages);
};

    
    // Close Sidebar
    const closeSidebar = () => {
      setSidebarmenuOpen(false);
    };
    useEffect(() => {
        const token = localStorage.getItem('vendortoken');
        const storedVendorId = localStorage.getItem('vendorId');
        if (token && storedVendorId) {
          try {
            const decoded = jwtDecode(token); // Correct function name
            setVendorId(storedVendorId); // Set the vendorId from localStorage
          } catch (error) {
            console.error('Invalid token or failed to decode:', error);
          }
        } else {
          alert('Vendor not authenticated. Please log in.');
          // Redirect to login page or show an error
        }
      }, []);
    
      useEffect(() => {
        const vendorId = localStorage.getItem('vendorId');
        if (!vendorId) {
          alert('Vendor ID not found in local storage');
          return;
        }
    
        // You need to define vendortoken or remove this request if not used
        const vendortoken =  localStorage.getItem('vendortoken'); // Define or get vendortoken if needed
    
        axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken })
          .then(response => {
            if (response.data.status === 'ok') {
              setVendorData(response.data.data);
            } else {
              setMessage(response.data.message);
            }
          })
          .catch(error => {
            console.error('Error:', error);
            setMessage(error.message);
          });
       
        fetchCategories();
        fetchSubCategories();
    }, []);
 const handleLogout = () => {
    localStorage.removeItem('vendorId'); // Remove vendorId
    window.location.href = '/vendor/login'; // Redirect to login page
  };
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/getCategoryHome`);
            const data = response.data;
            if (data.status === 'ok') {
                setCategories(data.data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred: ' + error.message);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/selectSubCatebaseCate`);
            const data = response.data;
            if (data.status === 'ok') {
                setSubCategories(data.data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred: ' + error.message);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        const selectedCategoryName = categories.find(cat => cat._id === selectedCategoryId)?.name || '';
    
        setCategory(selectedCategoryId);
        setCategoryName(selectedCategoryName);

        // Filter subcategories based on the selected category
        const filtered = subcategories.filter(subcat => subcat.Category === selectedCategoryId);
        setFilteredSubCategories(filtered);
    };

    const handleSubCategoryChange = (e) => {
        setSelectedSubCategory(e.target.value);
    };

    useEffect(() => {
        const token = localStorage.getItem('vendortoken');
        const storedVendorId = localStorage.getItem('vendorId');
        if (token && storedVendorId) {
            try {
                const decoded = jwtDecode(token);
                setVendorId(storedVendorId);
            } catch (error) {
                console.error('Invalid token or failed to decode:', error);
            }
        } else {
            alert('Vendor not authenticated. Please log in.');
        }
    }, []);

    useEffect(() => {
        if (vendorId) {
            axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken: localStorage.getItem('vendortoken') })
                .then(response => {
                    if (response.data.status === 'ok') {
                        setVendorData(response.data.data);
                    } else {
                        setError(response.data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    setError(error.message);
                });
        }
    }, [vendorId]);

    const handleSubmit = (e) => {
      e.preventDefault();
    
      if (!vendorId) {
        alert("Invalid or missing vendorId. Please log in again.");
        return;
      }
    
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('image', image);
      formData.append('description', description);
      formData.append('active', active);
      formData.append('vendorId', vendorId);
      formData.append('overallSize', overallSize);
      formData.append('location', location);
      formData.append('floorSpace', floorSpace);
      formData.append('price', price);
      formData.append('TotalFloors',TotalFloors);

      formData.append('Overlooking',Overlooking);
      formData.append('PropertyAge',PropertyAge);
      formData.append('persquare',persquare);
      formData.append('ConstructionStatus',ConstructionStatus);
      formData.append('Typeofproperty',Typeofproperty);
      formData.append('areaType',areaType);
      
      formData.append('noBedroom', noBedroom); // ✅ removed comma
      formData.append('noBathroom', noBathroom); // ✅ removed comma
      formData.append('roomVideo', roomVideo);
      formData.append('category', category);
    
      // ✅ Append gallery images individually
      galleryImages.forEach((imgObj, index) => {
        if (imgObj.file) {
          formData.append('galleryImages', imgObj.file); // backend must handle as array
        }
      });
    
      fetch(`${process.env.REACT_APP_API_URL}/addProduct`, {
        method: "POST",
        body: formData
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'ok') {
            alert('Product added successfully!');
            window.location.href = "/Vendor/AllProduct"; // ✅ added forward slash
          } else {
            alert(data.message || 'Product addition failed!');
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    
    const handleSubMenuToggle = (index) => {
        setActiveSubMenu(activeSubMenu === index ? null : index);
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
             
       
        <div className="col-sm-8">
          <div className=" businessinfo-container">
          <h1 className="title-vendorInfo">Add Place</h1>
                    <div className="col-sm-12 mt-2">
                       
                    <form onSubmit={handleSubmit} className="category-form">
             
              <div className="form-row row">
              <div className="form-group col-sm-6">
                                        <label>Category</label>
                                        <select
                                            className="form-control col-sm-6"
                                            value={category}
                                            onChange={handleCategoryChange}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                               
                <div className="form-group col-sm-6">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Project Name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="slug">Slug</label>
                  <input
                    type="text"
                    id="slug"
                    placeholder="Project Slug"
                    className="form-control"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    placeholder="Location"
                    className="form-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6 ">
                  <label htmlFor="floorSpace">Floor space</label>
                  <input
                    type="text"
                    id="floorSpace"
                    placeholder="Floor Space"
                    className="form-control"
                    value={floorSpace}
                    onChange={(e) => setfloorSpace(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="overallSize">Project overall size</label>
                  <input type="text"
                    id="overallSize"
                    className="form-control"
                    placeholder="Project overall size"
                  
                    value={overallSize}
                    onChange={(e) => setoverallSize(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="price">Price</label>
                  <input type="text"
                    id="price"
                    className="form-control"
                    placeholder="Price"
                  
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
               
                <div className="form-group col-sm-6">
                  <label htmlFor="price">Overlooking</label>
                  <input type="text"
                    id="Overlooking"
                    className="form-control"
                    placeholder="Overlooking"
                  
                    value={Overlooking}
                    onChange={(e) => setOverlooking(e.target.value)}
                    required
                  />
                </div>
               
                <div className="form-group col-sm-6">
                  <label htmlFor="TotalFloors">Total Floor</label>
                  <input type="number"
                    id="TotalFloors"
                    className="form-control"
                    placeholder="Total Floor"
                  
                    value={TotalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="PropertyAge">Property Age</label>
                  <input type="text"
                    id="PropertyAge"
                    className="form-control"
                    placeholder="Total Floor"
                  
                    value={PropertyAge}
                    onChange={(e) => setPropertyAge(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="TotalFloors">Total Floor</label>
                  <input type="text"
                    id="TotalFloors"
                    className="form-control"
                    placeholder="Total Floor"
                  
                    value={TotalFloors}
                    onChange={(e) => setTotalFloors(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="TotalFloors">Per square</label>
                  <input type="text"
                    id="persquare"
                    className="form-control"
                    placeholder="Per Square"
                  
                    value={persquare}
                    onChange={(e) => setpersquare(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="price"> Construction Status</label>
                  <select 
                    id="constructionStatus"
                    className="form-control"
                   
                  
                    value={ConstructionStatus}
                    onChange={(e) => setConstructionStatus(e.target.value)}
                    required
                  >
                  <option>New Launch</option>
                  <option>Under Construction</option>
                  <option>Ready to move</option>
                 
                  </select></div>
                <div className="form-group col-sm-6">
                  <label htmlFor="price">Type of Property</label>
                  <select 
                    id="Typeofproperty"
                    className="form-control"
                   
                  
                    value={Typeofproperty}
                    onChange={(e) => setTypeofproperty(e.target.value)}
                    required
                  >
                  <option>Residential Apartment</option>
                  <option>Residential Apartment</option>
                  <option>Independent/Builder Floor</option>
                  <option>Serviced Apartments</option>
                  <option>Independent House/Villa</option>
                  <option>Independent/Builder Floor</option>
                  
                  </select></div>
                  <div className="form-group col-sm-6">
                  <label htmlFor="price">Area Type</label>
                  <select 
                    id="areaType"
                    className="form-control"
                   
                  
                    value={areaType}
                    onChange={(e) => setareaType(e.target.value)}
                    required
                  >
                  <option>Built-up Area</option>
                  <option>Super Built-up Area</option>
                  <option>Carpet Area</option>
                 
                  </select></div>
                  <div className="form-group col-sm-6">
                  <label htmlFor="price">No of Bedroom</label>
                  <select 
                    id="noBathroom"
                    className="form-control"
                   
                  
                    value={noBedroom}
                    onChange={(e) => setnoBedroom(e.target.value)}
                    required
                  >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  </select>
                </div>
                  <div className="form-group col-sm-6">
                  <label htmlFor="price">No of Bathroom</label>
                  <select 
                    id="noBathroom"
                    className="form-control"
                   
                  
                    value={noBathroom}
                    onChange={(e) => setnoBathroom(e.target.value)}
                    required
                  >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    placeholder="Product Description"
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="image">Image</label>
                  <input
                    type="file"
                    id="image"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label>Status</label>
                  <div className="status-options">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="status"
                        value={true}
                        checked={active === true}
                        onChange={() => setActive(true)}
                      />{' '}
                      Active
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value={false}
                        checked={active === false}
                        onChange={() => setActive(false)}
                      />{' '}
                      Inactive
                    </label>
                  </div>
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="roomVideo">Room Video</label>
                  <input
                    type="file"
                    id="roomVideo"
                    className="form-control"
                    onChange={(e) =>setRoomVideo(e.target.files[0])}
                    accept="video/*"
                    required
                  />
                </div>
                <button
  type="button"
  onClick={handleAddGalleryImage}
  className="btn btn-secondary mb-3"
>
  Add Gallery Image
</button>

{galleryImages.map((img, index) => (
  <div key={index} className="form-group col-sm-6 d-flex align-items-center gap-2 mb-2">
    <input
      type="file"
      className="form-control"
      onChange={(e) => handleGalleryImageChange(index, e.target.files[0])}
      accept="image/*"
      required
    />
    <button
      type="button"
      className="btn btn-danger"
      onClick={() => handleRemoveGalleryImage(index)}
    >
      Remove
    </button>
  </div>
))}


               
                
                <div className="form-group col-12 mt-3">
                  <button type="submit" className="btn btn-primary submitbtn ">
                    Add Project
                  </button>
                </div>
              </div>
            </form>
          
                    </div>
                    </div>
                </div>
             
            </div>
        </div>
    );
};

export default AddProductVendor;
