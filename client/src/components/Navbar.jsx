import React from 'react'
import { assets } from '../assets/assets.js'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} className='w-28 sm:w-32' alt="" />
            <button className='flex items-center gap-2 border border-gray-500 px-6 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all'><Link to="/login">Login</Link> <img src={assets.arrow_icon} alt="" /></button>
        </div>
    )
}

export default Navbar