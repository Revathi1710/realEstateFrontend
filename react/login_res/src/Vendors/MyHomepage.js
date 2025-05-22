import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import './MyHomepage.css';

function MyHomepage() {
    const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const vendorId = localStorage.getItem('vendorId');
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const vendorId = localStorage.getItem('vendorId');

        if (!userId && !vendorId) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, vendorId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'ok' && result.data && result.data.fname) {
          setUserName(result.data.fname);
        } else {
          console.error('Error in API response:', result.message || 'No name found');
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchUserName();
  }, []);
  useEffect(() => {
    setLoading(true);

    // Fetch products
    fetch(`${process.env.REACT_APP_API_URL}/getVendorProperty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setProducts(data.data);
        } else {
          setMessage('Error fetching products: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setMessage('Error fetching products');
      });

    // Fetch product count
    axios.post(`${process.env.REACT_APP_API_URL}/getVendorPropertycount`, { vendorId })
      .then(response => {
        if (response.data.status === 'ok') {
          setProductCount(response.data.data.productCount);
        } else {
          setMessage('Error fetching product count: ' + response.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching product count:', error);
        setMessage('Error fetching product count');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [vendorId]);

  const handleUpdate = (productId) => {
    navigate(`/UpdateProperty/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/deleteProduct`, { productId });
      if (res.data.status === 'ok') {
        setProducts(products.filter(p => p._id !== productId));
        setProductCount(prev => prev - 1);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting product');
    }
  };const formatIndianPrice = (amount) => {
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
        <div className="container d-flex" style={{ height: '100vh', textAlign: 'left' }}>
          {/* Sidebar */}
          <div className="bg-dark text-white sidebarmyhomepage leftsidebarbuilder" >
            <div className="user-info-sidebar">
              <h5> {userName}</h5>
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
              <h6>{productCount} Active Products</h6>
              {message && <p className="text-danger">{message}</p>}
              {loading ? (
                <p>Loading...</p>
              ) : (
                products.map(product => (
                  <div key={product._id} className="border p-3 mb-3 rounded bg-white">
                    <h6>{product.title}</h6>
                    <p className="mb-1">Price:  ₹{formatIndianPrice(product.expectedPrice)}| Carpet Area: {product.carpetArea} sq.ft.</p>
                    <p className="mb-1 text-success">
                      Active | Posted On: {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div></div>
                      <div>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleUpdate(product._id)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyHomepage;
