import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from "../context/userContext";

const Header = () => {
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const { user } = useUserContext();


    const logout = () =>{
        localStorage.clear()
        window.location.reload()
    }

  return (
    <div className='w-100 h-20 flex items-center bg-[#2a9d90be]'>
    <div className='w-4/5 gap-20 text-black font-bold flex justify-end items-center font-mono'>
      <div className='cursor-pointer hover:text-[#10443ef8]'>Home</div>
      <div className='cursor-pointer hover:text-[#10443ef8]'>About</div>
      <div className='cursor-pointer hover:text-[#10443ef8]'>Contact</div>
      <div className='cursor-pointer hover:text-[#10443ef8]' onClick={()=>setShow(!show)}>Start</div>
    </div>
    {show && !user.access ? (
  <div>
    <br />
    <br />
    <br />
    <div className='bg-[#20776d] p-1 rounded flex gap-1 font-bold font-mono'>
      <div className='bg-white cursor-pointer py-2 px-6 rounded' onClick={() => { navigate('/login') }}>
        <h1>Login</h1>
      </div>
      <div className='bg-white cursor-pointer duration-300 py-2 px-6 rounded' onClick={() => { navigate('/signup') }}>
        <h1>SignUp</h1>
      </div>
    </div>
  </div>
) : ( show &&
  <div>
    <br />
    <br />
    <br />
    <div className='bg-[#20776d] p-1 rounded flex gap-1 font-bold font-mono'>
      <div className='bg-white cursor-pointer py-2 px-6 rounded' onClick={() => { navigate(`/${user.role}`) }}>
        <h1>Start Journey</h1>
      </div>
      <div className='bg-white cursor-pointer duration-300 py-2 px-6 rounded' onClick={logout}>
        <h1>Logout</h1>
      </div>
    </div>
  </div>
)}

    </div>
  )
}

export default Header
