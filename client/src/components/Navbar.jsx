import React, { useContext } from 'react'
import { assets } from '../assets/assets.js'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const { userData, backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext)
    const navigate = useNavigate()

    const logout = async () => {
        try {
            const res = await axios.post(backendUrl + '/api/v1/auth/logout', {}, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
                setIsLoggedIn(false)
                setUserData(false)
                navigate("/")
            }
        } catch (error) {
            console.log(error)
            toast.error(
                error.response?.data?.message || error.message
            )
        }
    }

    return (
        <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
            <img src={assets.logo} className='w-28 sm:w-32' alt="" />
            {
                userData ?
                    <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white cursor-pointer relative group'>
                        {userData?.name[0].toUpperCase()}
                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
                            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                                {
                                    !userData.isAccountVerified && <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify Email</li>
                                }
                                <li onClick={() => logout()} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
                            </ul>
                        </div>
                    </div>
                    : <button className='flex items-center gap-2 border border-gray-500 px-6 py-2 rounded-full text-gray-800 hover:bg-gray-100 transition-all'><Link to="/login">Login</Link> <img src={assets.arrow_icon} alt="" /></button>
            }

        </div>
    )
}

export default Navbar