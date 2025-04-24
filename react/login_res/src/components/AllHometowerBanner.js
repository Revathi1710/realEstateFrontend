import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllHomeTowerBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch banners from the backend
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getTowerBannerImages`);
        if (response.data.status === 'ok') {
          setBanners(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching tower banners:', err);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    // Rotate banners every 6 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [banners]);

  if (banners.length === 0) return <div>Loading banners...</div>;

  const currentBanner = banners[currentIndex];
  const imageUrl = currentBanner?.image
    ? `${process.env.REACT_APP_API_URL}/${currentBanner.image.replace(/\\/g, '/')}`
    : null;

  return (
    <div style={{ overflow: 'hidden', marginTop: '120px', padding: '10px' }}>
      {imageUrl ? (
      <a href={currentBanner.URL || '#'} target="_blank" rel="noopener noreferrer">
      <img
        src={imageUrl}
        alt={currentBanner.altText || `Banner ${currentIndex + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'opacity 1s ease-in-out',
          opacity: 1,
          borderRadius: '10px',
        }}
      />
    </a>
    
      ) : (
        <div style={{ textAlign: 'center', paddingTop: '50%' }}>No Image</div>
      )}
    </div>
  );
};

export default AllHomeTowerBanner;
