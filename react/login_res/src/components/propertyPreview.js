import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from 'axios';
import './PrimaryDetails.css'; // your existing CSS
import './PropertyPreview.css'; // your new CSS file

function PropertyPreview() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    // Fetch property details based on ID
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getProperty/${id}`);
        if (response.data.status === 'ok') {
          setProperty(response.data.property);
        } else {
          console.error('Failed to fetch property details');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };
    fetchProperty();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="preview-container">
        {property ? (
          <div className="preview-card">
            <div className="preview-image">
              {/* Make sure PropertyImages is an array and has valid data */}
              {property.PropertyImages && property.PropertyImages.length > 0 ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${property.PropertyImages[0].replace('\\', '/')}`}
                  alt="Property"
                />
              ) : (
                <img
                  src="path_to_default_image.jpg" // Default image in case PropertyImages is empty
                  alt="Default Property"
                />
              )}
            </div>
            <div className="preview-details "style={{textAlign:"left"}}>
              <h2>
                {property.lookingFor || ''} {property.bedrooms || ''} BHK {property.kindofPropertyDetails || ''}
              </h2>
              <p>{property.locality || 'Property Location'}</p>
              <h3>₹{property.expectedRental || 0}</h3>
              <p>
                <b>Maintenance:</b> ₹{property.maintenance || 'N/A'}
              </p>
              <p>
                <b>About Property:</b> {property.aboutproperty || 'No additional information.'}
              </p>
              <div className="preview-buttons">
                <Link to={`/editProperty/${id}`} className="btn-edit">
                  Edit / Preview
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="loading">Loading property details...</div>
        )}
      </div>
    </>
  );
}

export default PropertyPreview;
