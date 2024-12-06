import React, { createContext, useState } from 'react';
import api from '../../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/userContext';

const roleRoutes = {
    driver: '/driver',
    user: '/user', 
  };
const AuthContext = createContext();

const Login = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUserDetails } = useUserContext();

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
        const res = await api.post('/api/login/', { username, password})
        const { access, refresh, role, id, username: userName } = res.data;
        localStorage.setItem(ACCESS_TOKEN, access);
        localStorage.setItem(REFRESH_TOKEN, refresh); 
        localStorage.setItem('ROLE', role); 
        localStorage.setItem('id', id); 
        localStorage.setItem('USERNAME', username); 
        setUserDetails(role, userName, access, refresh, id);
        console.log(res)
        const redirectPath = roleRoutes[role] || '/';
        navigate(redirectPath)
        
    } catch (error) {
        alert(error)
    } 

    setError('');
    setEmail('');
    setPassword('');
  };
  return (
    <div className='w-[100vw] h-[100vh] bg-[#2a9d90be]'>
      <div className="flex justify-center items-center min-h-screen z-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md bg-opacity-20">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="text" className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a9d90be] text-gray-900 placeholder-gray-900 rounded-md focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full py-2 rounded-md focus:outline-none bg-[#125850] hover:bg-[#125850e0] duration-300 text-gray-300"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
    </div>
  )
}

export default Login
