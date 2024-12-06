import React, { useEffect } from 'react'
import api from '../api';

const Userridelist = ({notifications}) => {

    const cancelRide = async (rideId) => {
        console.log(rideId)
        try {
            const response = await api.post('api/cancel-ride/', { ride_id: rideId });
            console.log('Ride cancelled successfully:', response.data);
            window.location.reload()
        } catch (error) {
            console.error('Error cancelling ride:', error.response?.data || error.message);
        }
    }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ride History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr className='bg-gray-300'>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">ID</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">User</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Pickup Location</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Dropoff Location</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Created At</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Updated At</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Status</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications && notifications.map((ride, index) => (
                
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
                <td className="px-6 py-4 text-sm text-gray-700 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      ride.status === "requested"
                        ? "bg-blue-500"
                        : ride.status === "in_progress"
                        ? "bg-yellow-500"
                        : ride.status === "completed"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {ride.status === 'requested'? "Waiting for driver acceptance...":ride.status}
                  </span>
                </td>
                <td className='px-6 py-4 text-center'>
                    {(ride.status !== 'cancelled' && ride.status !== 'completed' )&&
                    <button className='py-1 px-4 bg-[#a53860] text-white rounded' onClick={()=>{cancelRide(ride.id)}}>Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Userridelist
