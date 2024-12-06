import React from 'react'
import image from '../../assets/b32a881607add57acd3b459a3d7a02f8-removebg-preview.png'
import Header from '../../components/header'

const Home = () => {
  return (
    <>
        <Header/>
    <div className='flex flex-col md:flex-row justify-center items-center w-full h-[90vh]'>
        <div className='w-1/2 flex justify-center items-center'>
            <h1 className='text-5xl font-mono font-bold relative p-8'>
                Ready <br /> For <br /> Take Off
                <span className="absolute inset-0 border-t-4 border-l-4 border-b-4 border-r-4 border-transparent rounded animate-border"></span>
            </h1>
        </div>

        <div className='w-1/2 flex justify-center items-center'>
        <img src={image} alt="" className='w-[700px]' />
        </div>
    </div>
    </>
  )
}

export default Home
