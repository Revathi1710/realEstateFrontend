import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  // Add more enquiries as needed
];

function BuilderEnquiryList() {
  return (
    <>
      <Navbar />
      <div className="container-fluid d-flex p-0" style={{ height: '100vh' }}>
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
          <h5>Preethi</h5>
          <p className="text-success">Master User</p>
          <hr />
          <ul className="list-unstyled">
            <li><strong>My99acres</strong></li>
            <li className="mt-3">Dashboard</li>
            <li className="mt-2">Builder Enquiry List</li>
            <li className="mt-2">Manage Listings</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1 p-4 bg-light">
          <h4 className="mb-4">Received Enquiries</h4>

          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.length > 0 ? (
                  enquiries.map((enquiry, index) => (
                    <tr key={enquiry.id}>
                      <td>{index + 1}</td>
                      <td>{enquiry.name}</td>
                      <td>{enquiry.email}</td>
                      <td>{enquiry.phone}</td>
                      <td>{enquiry.message}</td>
                      <td>{enquiry.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No enquiries received.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default BuilderEnquiryList;
