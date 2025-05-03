import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import './MyHomepage.css';

const enquiries = [
  {
    id: 1,
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    phone: '9876543210',
    message: 'Interested in 2BHK in Golden Opulence.',
    date: '2025-05-01',
  },
  {
    id: 2,
    name: 'Sita Iyer',
    email: 'sita@example.com',
    phone: '9988776655',
    message: 'Looking for a 3BHK flat with amenities.',
    date: '2025-05-02',
  },
];

function BuilderEnquiryList() {
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
              <h4 className="mb-4">Received Builder Enquiries</h4>

              {enquiries.map((enquiry) => (
                <div key={enquiry.id} className="card mb-3 shadow-sm border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{enquiry.name}</h6>
                        <p className="mb-1 text-muted">{enquiry.email} | {enquiry.phone}</p>
                        <p className="mb-0">{enquiry.message}</p>
                      </div>
                      <div>
                        <span className="badge bg-primary">
                          {new Date(enquiry.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {enquiries.length === 0 && (
                <div className="alert alert-info">No enquiries received yet.</div>
              )}
            </div>

          </div>
        </div>
     
    </>
  );
}

export default BuilderEnquiryList;
