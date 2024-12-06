import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import api from '../../api'
import { useUserContext } from '../../context/userContext'
import { FaBell, FaList } from 'react-icons/fa';
import Notifications from '../../components/notifications';
import Ridelist from '../../components/ridelist';

const Driverhome = () => {
  const [active, setActive] = useState(false)
  const { user } = useUserContext();
  const [notifications, setNotifications] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showRideList, setShowRideList] = useState(false)
  const [rides, setRides] = useState(null)
  const [rideId, setRideId] = useState(0)
  const [isVisible, setIsVisible] = useState(true);
  const [type, setType] = useState('')

  const closeNotification = () => {
    setIsVisible(false);
  };

  const notificationStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black',
  };
  const updatework = async() =>{
    try {
      const res = await api.patch('api/update-status/',{"is_active": !active})
      console.log(res)
      if (res.status == 200) {
        setActive(!active)
      }
    }
    catch (err) {
      console.log(err)
    }
  }



  useEffect(()=>{
    const req = async () =>{
      try {
        const res = await api.get('/api/check-status/')
        console.log(res.data)
        setActive(res.data.is_active)
      }
      catch (err) {
        console.log(err)
      }
    }
    req()
  },[updatework])

  useEffect(() => {
    const socket = new WebSocket(`ws://zartek.audsculpt.shop/ws/ride_notifications/${user.id}/`);

    socket.onopen = () => {
      console.log('WebSocket connected!');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      setRideId(data.ride_id)
      setType(notificationStyles.success)
      setNotifications((prevNotifications) => [...prevNotifications, data.message]);
      setShowNotifications(true)
      setShowRideList(false)
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => socket.close();
  }, [user.id]);
  
  const shownotification = () => {
    setShowNotifications(!showNotifications)
    setShowRideList(false)
  }

  const showridelist = () => {
    setShowRideList(!showRideList)
    setShowNotifications(false)
  }
  const cancelRide = async (rideId) => {
    console.log(rideId)
    try {
        const response = await api.post('api/cancel-ride/', { ride_id: rideId });
        console.log('Ride cancelled successfully:', response.data);
        setNotifications(false)
        setShowNotifications(true)
        setShowNotifications(false)
        setShowRideList(false)
        setShowRideList(true)
        
    } catch (error) {
        console.error('Error cancelling ride:', error.response?.data || error.message);
    }
}
const acceptRide = async (rideId) => {
  try {
      const response = await api.post('/api/accept-ride/', { ride_id: rideId });
      console.log(response.data.message);
      localStorage.setItem('rideId',rideId)
      setNotifications(false)
      setShowRideList(false)
      setShowNotifications(false)
      
  } catch (error) {
      console.log(error.response?.data?.error || 'Something went wrong');
  }
};
useEffect(()=>{
  const req = async () =>{
    try {
      const res = await api.get('/api/driver/rides/')
      console.log(res.data)
      setRides(res.data)
    }
    catch (err) {
      console.log(err)
    }
  }
  req()
},[setRideId, showNotifications])
  return (
    <div>
      <Header/>
      {notifications&&
      <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#003049] text-white p-6 rounded-lg shadow-lg w-96 flex flex-col items-center justify-between space-x-4">
        <h1 className='text-end w-full cursor-pointer' onClick={()=>setNotifications(false)}>X</h1>
        <span>{notifications}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => { acceptRide(rideId); closeNotification(); }}
            className="px-4 py-2 bg-[#ff9f1c] text-white rounded hover:bg-[#ffa01caf]"
          >
            Accept
          </button>
          <button
            onClick={() => { cancelRide(rideId); closeNotification(); }}
            className="px-4 py-2 bg-[#ee4266] text-white rounded hover:bg-[#ee4267a6]"
          >
            Reject
          </button>
        </div>
      </div>
    </div>}
      <div className='flex w-full gap-5 items-center justify-center p-20'>
      <FaList size={20} className='cursor-pointer' title='show history ' onClick={showridelist} />

        {active ? 
        <button className='bg-[#0f6157] text-white py-2 px-10 rounded font-mono font-bold'  onClick={updatework}>Stop Work</button>:
        <button className='bg-[#2a9d90] py-2 px-10 rounded font-mono font-bold' onClick={updatework}>Start Work</button> }
      <FaBell size={20} title='Show New Rides' onClick={shownotification} className='cursor-pointer' />
      </div>
      {showNotifications&&
      <Notifications notifications={rides} />} 
      {showRideList && 
      <Ridelist notifications={rides} />}
    </div>
  )
}

export default Driverhome
