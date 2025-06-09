import React, { Component } from 'react';
import Navbar from '../components/navbar';
import ImageSlider from '../components/ImageSlider';
import AllProducts from '../components/AllProductHome';
import AllCategory from "../components/AllCategoryHome";
import Allcate from "../components/AllCateHome";
import AllBanner from "../components/AllBanner";
import TwosectionHome from "../components/HomePageTwosec";
import Homerecent from '../components/Homerecent';
import TopCategory from '../components/TopCategories';
import Footer from '../components/Footer';
import HomeForm from './homeForm';
import AllHomeTowerBanner from './AllHometowerBanner';
import RecentAddedProperty from './RecentAddedProperty';
import MoveInProperty from './MoveInProperty';
import BNKchoice from './BNKchoice';
import './home.css';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
    };
  }

  componentDidMount() {
    // Extract the 'search' query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const searchLocation = params.get('search') || '';
    
    // Set the location state with the search parameter
    this.setState({ location: searchLocation });
  }

  handleLocationChange = (e) => {
    this.setState({ location: e.target.value });
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="body">
          <div className="homebody">
            <div className="bannerbox">
            
              
              <AllBanner />       
                       <HomeForm/>
                {/*<div className="container locationbox">
                  <h2>Select Location</h2>
                  <form className='searchform'>
                    <input
                      id="location-search"
                      type="search"
                      name="search"
                      className='form-control searchfield'
                      placeholder="Select Location"
                      onChange={this.handleLocationChange}
                      value={this.state.location}
                    />
                    <button className='btn setlocation'>Set Location</button>
                  </form>
                </div>*/}
              </div>
              {/*<div className="col-md-3">
              
              </div>*/}
            </div>
            <div className='backgroundImage row'>
            <div className='col-sm-10'>
            
            <div className='category-container p-3'>
            <h3 className="titlehome mb-4">Our Categories</h3>
            <AllCategory />

            </div>
           {/* <div className='container'>
    
        <TopCategory />
        </div>*/}
            <div className="category-container feature-product-container ">
              <h2 className="titlehome mb-4">Projects in High Demand</h2>
              {/* Pass the selected location as a prop to AllProducts */}
              <AllProducts location={this.state.location} />
            </div>
              <div className='container mt-2'>
                <h2 className="titlehome mb-4">Recently Added Property</h2>
                <RecentAddedProperty />
              </div>
             
                 <div className='container mt-2'>
               
                <BNKchoice />
              </div>
                <div className='container mt-2'>
                <h2 className="titlehome mb-4">Move in now,  later</h2>
                <MoveInProperty />
              </div>
            </div>
            <div className='col-sm-2'>
            <AllHomeTowerBanner />
            </div>
         
        </div></div>
      
       {/* <Homerecent/>*/}
       < Footer/>
      </div>
    );
  }
}

export default Index;
