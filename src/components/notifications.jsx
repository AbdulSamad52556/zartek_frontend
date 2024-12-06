import React, { useEffect, useState } from 'react'
import api from '../api'
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api'
import { FaBell, FaList, FaMap } from 'react-icons/fa';

const libraries = ["places"];
const mapContainerStyle = {
  width: "40vw",
  height: "60vh",
};
const googlemapkey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

const Notifications = ({notifications}) => {
    const [rideId, setRideId] = useState(0)
    const [currentlocation, setCurentLocation] = useState(null);
    const [showmap, setShowmap] = useState(false)
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googlemapkey,
        libraries,
      });

      useEffect(()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurentLocation({lat:position.coords.latitude, lng: position.coords.longitude})
                
            }, (error) => {
                console.error('Error fetching location:', error);
            }, { enableHighAccuracy: true });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
      },[showmap])

    const cancelRide = async (rideId) => {
        console.log(rideId)
        try {
            const response = await api.post('api/cancel-ride/', { ride_id: rideId });
            console.log('Ride cancelled successfully:', response.data);
            localStorage.removeItem('rideId')
            window.location.reload()
        } catch (error) {
            console.error('Error cancelling ride:', error.response?.data || error.message);
        }
    }
    const acceptRide = async (rideId) => {
        try {
            const response = await api.post('/api/accept-ride/', { ride_id: rideId });
            localStorage.setItem('rideId',rideId)
        } catch (error) {
            setError(error.response?.data?.error || 'Something went wrong');
        }
    };
    useEffect(()=>{
        try {
            const rideid = localStorage.getItem('rideId')
            setRideId(rideid)
        }
        catch (err) {
            console.log(err)
        }
    },[acceptRide])

    const completeRide = async (rideId) => {
        try {
            const response = await api.post('api/complete-ride/', { ride_id: rideId });
            localStorage.removeItem('rideId')
            window.location.reload()

        } catch (error) {
            console.log(error.response?.data?.error || 'Something went wrong');
        }
    };

    
useEffect(() => {
    if (rideId != 0 ){
        const socket = new WebSocket(`ws://localhost:8000/ws/ride-tracking/${rideId}/`);
    
        socket.onopen = () => {
            console.log('WebSocket connected');
        };
    
        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };
    
        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
        };
    
        const sendLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    setCurentLocation({lat:position.coords.latitude, lng: position.coords.longitude})
                    socket.send(JSON.stringify({
                        latitude: latitude,
                        longitude: longitude
                    }));
                }, (error) => {
                    console.error('Error fetching location:', error);
                }, { enableHighAccuracy: true });
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };
    
        const interval = setInterval(sendLocation, 1000);
    
        return () => {
            clearInterval(interval);
            socket.close();
        };
    }
  }, [rideId]);
  if (loadError) {
    console.log(loadError)
    return <div >Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div >Loading maps</div>;
  }


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notification</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100 w-full">
            <tr className='bg-gray-300 w-full'>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">ID</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">User</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Pickup Location</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Dropoff Location</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Created At</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Updated At</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Action</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {notifications && notifications.map((ride, index) => (
                (ride.status == 'requested' || ride.status == 'in_progress') &&
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="px-6 py-4 text-sm text-center text-gray-700">{index+1}</td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  {ride.rider_username}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  {ride.pickup_location}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  {ride.dropoff_location}
                </td>
                
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  {new Date(ride.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-center text-gray-700">
                  {new Date(ride.updated_at).toLocaleString()}
                </td>
                {ride.status == 'requested'?
                <td className='px-6 py-4 text-sm text-center flex gap-2'>
                    <button className='px-6 py-2 bg-[#a53860] rounded text-white' onClick={()=>cancelRide(ride.id)}>Reject</button>
                    <button className='px-6 py-2 bg-[#73ba9b] rounded' onClick={()=>{acceptRide(ride.id)}}>Accept</button>
                </td>:
                <td className='px-6 py-4 text-sm text-center flex gap-2'>
                <button className='px-6 py-2 bg-[#ccd5ae] rounded' onClick={()=>cancelRide(ride.id)}>Cancel</button>
                <button className='px-6 py-2 bg-[#386641] rounded text-white' onClick={()=>{completeRide(ride.id)}}>Completed</button>
            </td>
                }
            <td className='text-center text-blue-600'>
                {ride.status == 'in_progress' && 
                <FaMap size={20} className='cursor-pointer' title='show map ' onClick={()=>{setShowmap(!showmap)}} />}
            </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showmap &&
        <div className=" md:w-1/2 fixed top-1 md:left-60 h-[60vh] flex">
        <GoogleMap
          mapContainerStyle={mapContainerStyle  || { lat: 0, lng: 0 }}
          zoom={15}
          options={{ zoomControl: false, streetViewControl: false }}
          center={currentlocation}
        >
          {currentlocation && <Marker position={currentlocation} />}
        </GoogleMap>
      </div>}

      </div>
    </div>
  )
}

export default Notifications
