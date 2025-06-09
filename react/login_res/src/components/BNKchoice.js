import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BNKChoiceImage from '../icons/bnkHome.png';

const BNK_TYPES = [1, 2, 3, 4,5 ]; // You can extend this list

function BNKChoice() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    BNK_TYPES.forEach(async (bnk) => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/getBNKCount?bedrooms=${bnk}`);
        setCounts(prev => ({ ...prev, [bnk]: res.data.count }));
      } catch (err) {
        console.error(`Error fetching count for ${bnk} BNK:`, err.message);
      }
    });
  }, []);

  return (
    <div className="container bhkchoice-container">
         <h2 className="titlehome mb-4">BHK choice in mind?</h2>
      <div className="row text-center">
        {BNK_TYPES.map((bnk, index) => (
          <div key={index} className="col-lg-2 col-md-4 col-sm-6 mb-4 bnkcontainer-box">
            <img
              src={BNKChoiceImage}
              alt={`${bnk} BNK`}
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <h4>{bnk} BNK</h4>
            <h6>{counts[bnk] ?? '...'} Properties</h6>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BNKChoice;
