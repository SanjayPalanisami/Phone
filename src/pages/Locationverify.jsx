import React, { useEffect, useState } from "react";
import "./locationVerify.css";
import Button from '../component/Button';
import Header from "../component/Header";
import details from "../Details";

const LocationPage = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState("");
  const [exteriorPhoto, setExteriorPhoto] = useState(null);
  const [interiorPhoto, setInteriorPhoto] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Initialize Google Maps
  const initializeMap = () => {
    const initialPosition = { lat: -34.397, lng: 150.644 };
    const mapElement = document.getElementById("map");

    if (!mapElement) return;

    const mapInstance = new window.google.maps.Map(mapElement, {
      center: initialPosition,
      zoom: 8,
    });
    setMap(mapInstance);

    const markerInstance = new window.google.maps.Marker({
      position: initialPosition,
      map: mapInstance,
      draggable: true,
    });
    setMarker(markerInstance);

    setGeocoder(new window.google.maps.Geocoder());
    setAutocomplete(new window.google.maps.places.Autocomplete(document.getElementById("location-search")));
  };

  // Setup Autocomplete Listener
  const setupAutocompleteListener = () => {
    if (autocomplete) {
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = place.geometry.location;
          map.setCenter(location);
          marker.setPosition(location);
          setAddress(place.formatted_address);
        }
      });
    }
  };

  // Handle Locate User
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        if (map && marker) {
          map.setCenter(userLocation);
          marker.setPosition(userLocation);
        } else {
          console.error("Map or Marker is not initialized.");
        }
      },
      (error) => {
        console.error(`Error fetching location: ${error.message}`);
        alert(`Unable to fetch location: ${error.message}`);
      }
    );
  };

  // Handle Image Upload
  const handleImageUpload = (event, setImageCallback) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageCallback(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Image Remove
  const handleImageRemove = (setImageCallback) => setImageCallback(null);

  // Handle Submit Location
  const handleSubmit = async () => {
    if (!marker || !userId) {
      alert("Please ensure you have selected a location and are logged in.");
      return;
    }
  
    const lat = marker.getPosition().lat();
    const lon = marker.getPosition().lng();
  
    console.log('Submitting:', { userId, lat, lon }); // Log the data being sent
  
    try {
      const response = await fetch('http://localhost:5000/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, lat, lon }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Location updated successfully!');
      } else {
        throw new Error(data.error || 'Failed to update location');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert(error.message);
    }
  };

  // Initialize Map on Component Mount
  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API failed to load.");
      return;
    }
    initializeMap();
  }, []);

  // Setup Autocomplete Listener when Autocomplete is Ready
  useEffect(() => {
    setupAutocompleteListener();
  }, [autocomplete]);

  return (
    <div className="location-page">
      <Header headerData={details.HeaderVerify} />
      <h1>Locate Your Position</h1>
      <div className="controls">
        <button onClick={handleLocateUser} className="locate-button">
          Get Current Location
        </button>
        <input
          id="location-search"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Search for a location..."
          className="address-input"
        />
      </div>
      <div id="map" className="map"></div>

      <div className="image-upload-container">
        {/* Exterior Photo Section */}
        <ImageUpload
          label="Upload Exterior Photo"
          image={exteriorPhoto}
          onImageUpload={(e) => handleImageUpload(e, setExteriorPhoto)}
          onImageRemove={() => handleImageRemove(setExteriorPhoto)}
        />

        {/* Interior Photo Section */}
        <ImageUpload
          label="Upload Interior Photo"
          image={interiorPhoto}
          onImageUpload={(e) => handleImageUpload(e, setInteriorPhoto)}
          onImageRemove={() => handleImageRemove(setInteriorPhoto)}
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        <Button bt="Next" to="/verification/profile" />
        <button onClick={handleSubmit} className="submit-button">
          Submit Location
        </button>
      </div>
    </div>
  );
};

// ImageUpload Component
const ImageUpload = ({ label, image, onImageUpload, onImageRemove }) => (
  <div className="image-section">
    <label className="upload-label">{label}</label>
    <input
      type="file"
      accept="image/*"
      onChange={onImageUpload}
      className="upload-input"
      disabled={image} // Disable the input if an image is already uploaded
    />
    {image && (
      <div className="image-container">
        <img src={image} alt={label} className="uploaded-image" />
        <button onClick={onImageRemove} className="remove-button">
          Remove {label}
        </button>
      </div>
    )}
  </div>
);

export default LocationPage;