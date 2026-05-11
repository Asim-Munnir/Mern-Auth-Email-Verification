import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets.js'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const navigate = useNavigate()
    const { backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            setLoading(true)
            // Sign Up API

            if (state === 'Sign Up') {
                const res = await axios.post(backendUrl + '/api/v1/auth/register', {
                    name,
                    email,
                    password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                })

                if (res.data.success) {
                    toast.success(res.data.message)
                    setIsLoggedIn(true)
                    getUserData()
                    navigate("/")
                } else {
                    toast.error(res.data.message)
                }
            } else {
                // Sign In API
                const res = await axios.post(backendUrl + '/api/v1/auth/login', {
                    email,
                    password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                })

                if (res.data.success) {
                    toast.success(res.data.message)
                    setIsLoggedIn(true)
                    getUserData()
                    navigate("/")
                } else {
                    toast.error(res.data.message)
                }

            }
        } catch (error) {
            console.log(error)

            toast.error(
                error.response?.data?.message || error.message
            )
        } finally {
            setLoading(false)
            setName('')
            setEmail('')
            setPassword('')
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <Link to="/">
                <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
            </Link>

            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account...!'}</p>

                <form onSubmit={onSubmitHandler}>
                    {/* Name */}

                    {
                        state === 'Sign Up' && (
                            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                                <img src={assets.person_icon} alt="" />
                                <input value={name} onChange={(e) => setName(e.target.value)} className='bg-transparent outline-none text-white' type="text" placeholder='Full Name' required />
                            </div>
                        )
                    }


                    {/* Email */}
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="" />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className='bg-transparent outline-none text-white' type="email" placeholder='Email Id' required />
                    </div>

                    {/* Password */}
                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="" />
                        <input value={password} onChange={(e) => setPassword(e.target.value)} className='bg-transparent outline-none text-white' type="password" placeholder='Password' required />
                    </div>

                    <Link to="/reset-password">
                        <p className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>
                    </Link>

                    <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>
                        {
                            loading ? 'Loading...' : state
                        }
                    </button>
                </form>

                {
                    state === 'Sign Up' ? (
                        <p className='text-center text-gray-400 text-xs mt-4'>Already have an account? <span onClick={() => setState("Sign In")} className='text-blue-400 cursor-pointer underline'>Login here</span></p>
                    ) : (
                        <p className='text-center text-gray-400 text-xs mt-4'>Don't have an account? <span onClick={() => setState("Sign Up")} className='text-blue-400 cursor-pointer underline'>Sign Up</span></p>
                    )
                }





            </div>

        </div>
    )
}

export default Login