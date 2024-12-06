import React, { useEffect, useState } from "react";
import Header from "../../components/header";
import { FaBell, FaList } from 'react-icons/fa';

import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import api from "../../api";
import Userridelist from "../../components/userridelist";

const libraries = ["places"];
const mapContainerStyle = {
  width: "60vw",
  height: "60vh",
};

const googlemapkey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
const Userhome = () => {
  const [currentlocation, setCurentLocation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectDriver, setSelectDriver] = useState(false);
  const [autocomplete, setAutocomplete] = useState(null);
  const [users, setUsers] = useState(null);
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [rides, setRides] = useState(null)
  const [showRideList, setShowRideList] = useState(false)

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googlemapkey,
    libraries,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error retrieving location:", error);
      }
    );
  }, []);

 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('api/create_ride/',
        {
          driver_id: selectedUser,
          pickup_location: location,
          dropoff_location: destination
        }
      )
      if (res.status == 201) {
        setSelectDriver(false)
        setLocation('')
        setDestination('')
        setShowRideList(true)
      }
      console.log(res.data)
      console.log(res.status)
    }
    catch (err) {
      if (err.response.data.error === 'You already have a pending ride request.'){
        alert('You already have a pending ride request.')
      }
    }
  };
  useEffect(()=>{
    const req = async () =>{
      try {
        const res = await api.get('/api/user/rides/')
        console.log(res.data)
        setRides(res.data)
      }
      catch (err) {
        console.log(err)
      }
    }
    req()
  },[showRideList])

  const onLoad = (autocomplete, setStateCallback) => {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setStateCallback(place.formatted_address || place.name);
      }
    });
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const onLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const onDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSubmitLocation = (e) => {
    e.preventDefault();
    setSelectDriver(true)
  };
  useEffect(() => {
    const req = async () => {
      const res = await api.get("api/drivers/");
      console.log(res.data);
      if (res.status == 200) {
        const userData = res.data.drivers.map((user) => ({
          id: user.id,
          name: user.username,
        }));
        setUsers(userData);
      }
    };
    req();
  }, [selectDriver]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  

  return (
    <div>
      <Header />
      <div className="px-10 py-2">

      <FaList size={20} className='cursor-pointer' title='show history ' onClick={()=>{setShowRideList(!showRideList)}} />
      </div>
      {showRideList ?
      <Userridelist notifications={rides}/>:
      <form onSubmit={handleSubmitLocation} className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 p-10">
      <div>
        <label htmlFor="location">Enter your Location</label>
        <Autocomplete onLoad={(autocomplete) => onLoad(autocomplete, setLocation)} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            id="location"
            value={location}
            onChange={onLocationChange}
            className="bg-gray-300 py-4 px-2 w-80 rounded text-black focus:outline-none"
            placeholder="Location"
            required
          />
        </Autocomplete>
      </div>
      
      <div>
        <label htmlFor="destination">Enter your Destination</label>
        <Autocomplete onLoad={(autocomplete) => onLoad(autocomplete, setDestination)} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={onDestinationChange}
            className="bg-gray-300 py-4 px-2 w-80 rounded text-black focus:outline-none"
            placeholder="Destination"
            required
          />
        </Autocomplete>
      </div>
      
      <div className="py-6">
        <button
          type="submit"
          className="bg-black px-10 py-4 rounded text-white"
        >
          Search
        </button>
      </div>
    </form>}
    {!showRideList&&
      <div className="w-full h-[60vh] flex justify-center items-center">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={currentlocation}
        >
          <Marker position={currentlocation} />
        </GoogleMap>
      </div>}
      {selectDriver && (
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 lg:w-1/3 bg-black inset-1 absolute left-auto flex flex-col justify-between p-4"
        >
          {/* Selectable Divs Section */}
          <div className="w-full bg-white p-4 m-2 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Select Driver</h2>
            <div className="space-y-2">
              {users &&
                users.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 border-2 border-gray-300 rounded-md cursor-pointer ${
                      selectedUser === user.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-black"
                    }`}
                    onClick={() => setSelectedUser(user.id)}
                  >
                    {user.name}
                  </div>
                ))}
            </div>
          </div>

          {/* Submit Button Section */}
          <div className="p-2 w-full flex gap-2">
            <button
              type="submit"
              className="bg-white w-full h-10 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              OK
            </button>
            <button
              type="btn"
              className="bg-white w-full h-10 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
              onClick={()=>{setSelectDriver(false)}}
            >
              CLOSE
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Userhome;
