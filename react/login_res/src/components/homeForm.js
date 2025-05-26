import React, { useState, useRef, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { useLoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const libraries = ["places"];

const HomeForm = () => {
  const [activeTab, setActiveTab] = useState("Apartments");
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");

  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD8XPj9I4BSv8p6usmkR0-26GQKZFXeNpY",
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place || !place.address_components) return;

        setSearchQuery(place.formatted_address || place.name);

        let newCity = "", newLocality = "";

        place.address_components.forEach((component) => {
          const types = component.types;
          if (types.includes("locality")) newCity = component.long_name;
          if (types.includes("sublocality") || types.includes("sublocality_level_1")) newLocality = component.long_name;
        });

        setCity(newCity);
        setLocality(newLocality);
      });
    }
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams({
      query: searchQuery,
      city,
      locality,
      propertyType: activeTab,
    }).toString();

    navigate(`/search-results?${params}`);
  };

  const tabs = ["Apartments", "Villas", "Plots", "Farm Land"];

  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <div className="container my-4">
      <div className="card shadow rounded-4 p-4">
        <ul className="nav nav-tabs mb-3 border-bottom">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSearch} className="d-flex gap-3 align-items-center flex-wrap">
          <select className="form-select w-auto rounded-3">
            <option>Residential</option>
            <option>Commercial</option>
          </select>

          <div className="position-relative flex-grow-1">
            <input
              ref={inputRef}
              type="text"
              className="form-control rounded-3 ps-4"
              placeholder="Search city, area, locality, street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaCog
              style={{
                position: "absolute",
                top: "50%",
                left: "5px",
                transform: "translateY(-50%)",
                color: "#888",
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary rounded-3 px-4">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomeForm;
