import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import './MyHomepage.css';

function EditProfile() {
  return (
    <>
    <Navbar />
     <div className="bodymyhomepage">
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
          <div className="card shadow-sm rounded-4">
            <div className="card-body">
              <h4 className="mb-4">Edit Profile</h4>

              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">You are<span className="text-danger">*</span></label>
                    <input type="text" className="form-control" defaultValue="Dealer" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Name<span className="text-danger">*</span></label>
                    <input type="text" className="form-control" defaultValue="Rajesh" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email ID<span className="text-danger">*</span></label>
                    <input type="email" className="form-control" defaultValue="officearistos1@gmail.com" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Company Name</label>
                    <div className="d-flex align-items-center">
                      <input type="text" className="form-control me-2" defaultValue="Individual Consultant" />
                      <a href="#" className="text-primary">Change</a>
                    </div>
                  </div>
                  {[1, 2, 3].map((_, index) => (
                    <div className="col-md-6" key={index}>
                      <label className="form-label">Phone Number</label>
                      <div className="d-flex">
                        <select className="form-select w-25 me-2">
                          <option>+91 IND</option>
                        </select>
                        <input type="text" className="form-control" placeholder="Phone Number" />
                      </div>
                    </div>
                  ))}
                  <div className="col-12">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="whatsapp" />
                      <label className="form-check-label" htmlFor="whatsapp">
                        Allow buyers to WhatsApp me on this number
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Company URL</label>
                    <input type="text" className="form-control" placeholder="Company URL" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Company Profile<span className="text-danger">*</span></label>
                    <input type="text" className="form-control" defaultValue="Individual Consultant" />
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button className="btn btn-primary px-4">Save Changes</button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div> 
    </>
  );
}

export default EditProfile;
