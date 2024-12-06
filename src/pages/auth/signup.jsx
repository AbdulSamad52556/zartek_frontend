import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
        const res = await api.post('/api/user/register/',{username,email,password,role})
        console.log(res)
        if (res.status == 201){
            navigate('/login')
        }
    }
    catch (err) {
        setError(err)
    }

    setError('');
    
    setEmail('');
    setPassword('');
  };
  return (
    <div className='w-[100vw] h-[100vh] bg-[#2a9d90be]'>
      <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md bg-opacity-20">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {/* Display Error Message */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
            <div className='flex gap-2'>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              value={username}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a9d90be] text-gray-900 placeholder-gray-900 rounded-md focus:outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="mb-4">
  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
    Role
  </label>
  <select
    id="role"
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full px-4 py-2 bg-[#2a9d90be] text-gray-900 placeholder-gray-900 rounded-md focus:outline-none"
    required
  >
    <option value="">Select your role</option>
    <option value="driver">Driver</option>
    <option value="user">User</option>
  </select>
</div>

          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a9d90be] text-gray-900 placeholder-gray-900 rounded-md focus:outline-none"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a9d90be] text-gray-900 placeholder-gray-900 rounded-md focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a9d90be] text-gray-900 placeholder-gray-900 rounded-md focus:outline-none"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md focus:outline-none bg-[#125850] hover:bg-[#125850e0] duration-300 text-gray-300"
            >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already a User?{' '}
          <a href="/login" className="text-blue-500 hover:underline">Log in</a>
        </p>
      </div>
    </div>
    </div>
  )
}

export default Signup
