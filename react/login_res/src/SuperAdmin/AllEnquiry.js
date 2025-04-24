import React, { useState, useEffect } from 'react'; 
import Sidebar from './sidebar';

const AllEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Show 10 items per page

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getAllEnquiry`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setEnquiries(data.data);
        } else {
          console.error('Error:', data.message);
          setMessage('Error fetching enquiries: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setMessage('Error fetching enquiries');
      });
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(enquiries.length / itemsPerPage);

  // Slice the array for pagination
  const displayedEnquiries = enquiries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <Sidebar />
      <div className="add-category-container">
        <div className="content row mt-4">
          <div className="col-sm-12">
            <div className="title">
              <h2>All Enquiries</h2>
            </div>
            <div className='allenquiry'>
              {message && <p className="text-danger">{message}</p>}
              {enquiries.length > 0 ? (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>SI.No</th>
                        <th>Date/Time</th>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Buyer Number</th>
                        <th>Buyer Name</th>
                        <th>Seller Name</th>
                        <th>Company Name</th>
                        <th>Seller Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedEnquiries.map((enquiry, index) => (
                        <tr key={enquiry._id}>
                          <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                          <td>{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "N/A"}</td>

                          <td>
                            <img
                              src={enquiry.productImage ? 
                                `${process.env.REACT_APP_API_URL}/${enquiry.productImage.replace(/\\/g, '/')}` 
                                : '/placeholder.jpg'}
                              style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                              alt="Product"
                              onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                            />
                          </td>
                          <td>{enquiry.productname}</td>
                          <td>{enquiry.UserNumber}</td>
                          <td>{enquiry.Username}</td>
                          <td>{enquiry.vendorName || 'No Vendor'}</td>
                          <td>{enquiry.vendorBusiness || 'No Vendor'}</td>
                          <td>{enquiry.vendorEmail || 'No Email'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  <div className="pagination">
                    <button className="btn btn-primary" onClick={prevPage} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <span className="mx-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button className="btn btn-primary" onClick={nextPage} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <p>No Enquiries found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEnquiry;
