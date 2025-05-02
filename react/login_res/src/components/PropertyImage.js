// PropertyImage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './PropertyImage.css'; // basic CSS

function PropertyImage() {
  const [propertyImages, setPropertyImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Handle selecting multiple images
  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPropertyImages(prev => [...prev, ...newImages]);
  };

  // Handle remove image
  const handleRemoveGalleryImage = (index) => {
    const updatedImages = [...propertyImages];
    updatedImages.splice(index, 1);
    setPropertyImages(updatedImages);
  };

  // Handle selecting video
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    } else {
      toast.error('Please upload a valid video file.');
    }
  };

  // Remove video
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview('');
  };

  // Submit images and video
  const handleContinue = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const propertyId = localStorage.getItem('propertyId');
      if (!propertyId) {
        toast.error('Property ID not found.');
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append('propertyId', propertyId);

      // Add images
      propertyImages.forEach((imgObj) => {
        formData.append('PropertyImages', imgObj.file);
      });

      // Add video
      if (videoFile) {
        formData.append('propertyVideo', videoFile);
      }

      // API Call
      const updateResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}/updatePropertyImageVideo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (updateResponse.data.status === 'ok') {
        toast.success('Images and video uploaded successfully!');
        setTimeout(() => {
          navigate('/postproperty/Pricedetails');
        }, 1500);
      } else {
        toast.error('Failed to upload images and video.');
      }
    } catch (error) {
      console.error('Error uploading:', error);
      toast.error('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container my-5">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 primarysidebar">
            <div className="stepper">
              <div className="step active">Basic Details</div>
              <div className="step active">Location Details</div>
              <div className="step active">Property Profile</div>
              <div className="step active">Photos, Videos & Voice-over</div>
              <div className="step">Pricing & Others</div>
            </div>

            <div className="mt-4">
              <div className="border p-3 rounded">
                <h5>Property Score</h5>
                <p>0%</p>
                <small>Better your property score, greater your visibility</small>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="col-md-9 mainprimarybox">
            <h3>Add Images and Video</h3>

            <div className="property-image-upload">
              {/* Upload Images */}
              <h5 className="mt-4 fw-bold">Upload Property Photos</h5>
              <div className="gallery-grid">

                {/* Upload Box */}
                <label className="upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImageChange}
                    hidden
                  />
                  <div className="upload-content">
                    <span className="plus-icon">+</span>
                    <p>Upload Photos</p>
                  </div>
                </label>

                {/* Uploaded Images */}
                {propertyImages.map((imgObj, index) => (
                  <div className="image-thumbnail" key={index}>
                    <img src={imgObj.preview} alt={`uploaded-${index}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleRemoveGalleryImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Video */}
              <h5 className="mt-5 fw-bold">Upload Property Video</h5>
              <div className="gallery-grid">
                {!videoFile && (
                  <label className="upload-box">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      hidden
                    />
                    <div className="upload-content">
                      <span className="plus-icon">+</span>
                      <p>Upload Video</p>
                    </div>
                  </label>
                )}

                {/* Uploaded Video Preview */}
                {videoFile && (
                  <div className="image-thumbnail">
                    <video
                      src={videoPreview}
                      controls
                      width="100%"
                      height="100%"
                      style={{ objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={handleRemoveVideo}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  className="btn btn-primary"
                  onClick={handleContinue}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Continue'}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default PropertyImage;
