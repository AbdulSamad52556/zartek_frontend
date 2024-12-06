import { useState } from 'react'
import Home from './pages/Home/home';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import Driverhome from './pages/Home/driverhome';
import Userhome from './pages/Home/userhome';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
     <Routes>
       <Route path="/" element={<div><Home/></div>} />
       <Route path="/login" element={<div><Login/></div>} />
       <Route path="/signup" element={<div><Signup/></div>} />
       <Route path="/driver" element={<div> <ProtectedRoute children = {<Driverhome/>} allowedRoles={['driver']}/></div>} />
       <Route path="/user" element={<div> <ProtectedRoute children = {<Userhome/>} allowedRoles={['user']}/></div>} />
       <Route path="*" element={<Navigate to="/" />} />
     </Routes>
   </div>
    </>
  )
}
export default App