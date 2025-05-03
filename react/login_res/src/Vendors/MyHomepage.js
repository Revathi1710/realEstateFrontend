import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import './MyHomepage.css'; // Add custom styling here

function MyHomepage() {
  
  return (
    <>
    <Navbar />
    <div className="bodymyhomepage ">
    <div className="container d-flex " style={{ height: '100vh', textAlign: 'left' }}>

      {/* Sidebar */}
      <div className="bg-dark text-white sidebarmyhomepage" style={{ width: '200px' }}>
        <div className="user-info-sidebar">
        <h5>Rajesh</h5>
       
        </div>
        <hr />
        <ul className="list-unstyled myhomelist">
          <li><Link to="" className="myhomelist-a">My Homepage</Link></li>
          <li className="mt-3" ><Link to=""className="myhomelist-a" >All Product</Link></li>
          <li className="mt-3" ><Link to=""className="myhomelist-a" >All Enquiry</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 sidebarmyhomepage">
        {/* Top Navigation */}
      

        {/* Listing Content */}
        <div className="p-4">
          <h6>1 Active Products</h6>
          <div className="border p-3 mb-3 rounded bg-white">
            <h6>2 BHK Flat/Apartment for Sale in Golden Opulence, Poonamallee, Chennai</h6>
           
            <p className="mb-1">Price: ₹80 Lac | Carpet Area: 333 sq.ft.</p>
            <p className="mb-1 text-success">Active | Posted On: 28 Apr 2025 </p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
               
              </div>
              <div>
                <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                <button className="btn btn-sm btn-outline-danger">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div></>
  );
}

export default MyHomepage;
