import React, { Component } from 'react';
import Navbar from '../components/navbar';
import Signupslider1 from '../icons/signupslider1.png';
import Signupslider2 from '../icons/signupslider2.2.png';
import Slider from 'react-slick';
import forgotpass from '../icons/forgotpass.png';
import leftsideimage from '../icons/realestatesingup.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      email: "",
      number: "",
      businessName: "",
      password: "",
      cpassword: "",
      verifyButton: false,
      verifyOtp: false,
      Otp: "",
      emailOtp: "",
      otpSent: false,
      emailOtpVerified: false,
      formSubmitted: false,
      otpEnable: false,
      loadingSettings: true,
    };
  }

  componentDidMount() {
    const BUSINESS_ID = '6811cd66ebc5f31faa61db1f';
    fetch(`${process.env.REACT_APP_API_URL}/OTPenable/${BUSINESS_ID}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ otpEnable: data.otpEnable, loadingSettings: false });
      })
      .catch(err => {
        console.error("Failed to fetch business settings:", err);
        this.setState({ loadingSettings: false });
        toast.error("Failed to load OTP settings.");
      });
  }

  handleSendOtp = () => {
    const { email } = this.state;

    fetch(`${process.env.REACT_APP_API_URL}/Vendorsend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
    .then(res => {
      if (res.status === 200) {
        this.setState({ otpSent: true });
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP");
      }
    })
    .catch(() => toast.error("Something went wrong while sending OTP"));
  };

  handleVerifyOtp = () => {
    const { email, emailOtp } = this.state;

    fetch(`${process.env.REACT_APP_API_URL}/VendorVerify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp: emailOtp })
    })
    .then(res => {
      if (res.status === 200) {
        this.setState({ emailOtpVerified: true }, this.finalSubmit);
        toast.success("OTP Verified!");
      } else {
        toast.error("Invalid OTP");
      }
    })
    .catch(() => toast.error("OTP verification failed"));
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { email, password, cpassword, otpEnable } = this.state;

    if (!email || !password || !cpassword) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password !== cpassword) {
      toast.error('Passwords do not match.');
      return;
    }

    this.setState({ formSubmitted: true }, () => {
      if (otpEnable) {
        this.handleSendOtp();
      } else {
        this.finalSubmit();
      }
    });
  };

  finalSubmit = () => {
    const { fname, email, number, businessName, password, cpassword } = this.state;
  
    if (!fname || !email || !number || !businessName || !password || !cpassword) {
      toast.error('Please fill in all required fields.');
      return;
    }
  
    fetch(`${process.env.REACT_APP_API_URL}/VendorRegister`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fname, email, number, businessName, password, cpassword })
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'ok') {
        toast.success("Registration successful!");
        
        // ✅ Store vendorId and login flag
        localStorage.setItem('vendorId', data._id);
        localStorage.setItem('loggedIn', true);
        
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        toast.error("Registration failed: " + data.message);
      }
    })
    .catch(() => toast.error("Error occurred during registration"));
  };
  

  render() {
    const { formSubmitted, otpEnable, loadingSettings, emailOtp } = this.state;

    if (loadingSettings) {
      return <div>Loading settings...</div>;
    }

    return (
      <div>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="mt-4 containersignup row backgroundImagesignuppage">
          <div className="col-sm-7 leftsidebanner">
            <h2 className="signupheader mb-5">Sell Or Rent Your Property</h2>
            <ul className="unordersignup">
              <li className="mb-3"><h5>✅ Post Property for Free</h5></li>
              <li className="mb-3"><h5>🔄 Unlimited Buyer Enquiries</h5></li>
              <li className="mb-3"><h5>📈 High Visibility Listings</h5></li>
              <li className="mb-3"><h5>🕒 24/7 Dashboard Access</h5></li>
            </ul>
            <img src={leftsideimage} alt="signup" />
          </div>

          <div className="col-sm-4">
            {!formSubmitted || (formSubmitted && !otpEnable) ? (
              <form onSubmit={this.handleSubmit} className="formbox">
                <div className="form-container signupform">
                  <h6 className="mt-2 signup-title">Start Posting Your Property</h6>

                  {["fname", "email", "number", "businessName", "password", "cpassword"].map((field, i) => (
                    <div className="mb-3 input-group" key={i}>
                      <span className="input-group-text">
                        <i className={`fa ${field.includes("pass") ? "fa-lock" : field === "email" ? "fa-envelope" : field === "number" ? "fa-phone" : field === "businessName" ? "fa-building" : "fa-user"}`}></i>
                      </span>
                      <input
                        type={field.includes("pass") ? "password" : field === "email" ? "email" : field === "number" ? "number" : "text"}
                        className="form-control signupinput"
                        placeholder={field === "businessName" ? "Enter Company/Business/Shop Name" : `Enter ${field}`}
                        onChange={(e) => this.setState({ [field]: e.target.value })}
                      />
                    </div>
                  ))}

                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-signup">Sign Up</button>
                  </div>

                  <p className="forgot-password text-right">
                    Have an Account? <Link to="/vendor/login">Login</Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="verifybackground" >
                <div className="formbox container">
                 
                  <div className="form-container otpform">
                    <h3 className="mt-3 mb-3">OTP Verification</h3>
                    <div className="mb-3 input-group">
                      <span className="input-group-text"><i className="fa fa-key"></i></span>
                      <input
                        type="text"
                        className="form-control signupinput"
                        placeholder="Enter OTP"
                        value={emailOtp}
                        onChange={(e) => this.setState({ emailOtp: e.target.value })}
                      />
                    </div>
                    <button type="button" className="btn btn-3d" onClick={this.handleVerifyOtp}>
                      Verify & Proceed
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
