import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const { backendUrl, isloggedIn, userData, getUserData } = useContext(AppContext)

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRefs = React.useRef([])
  const [isEmailSent, setIsEmailSent] = useState('')
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('')
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(backendUrl + '/api/v1/auth/send-reset-otp', { email }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      if (res.data.success) {
        toast.success(res.data.message)
        setIsEmailSent(true)
      }
    } catch (error) {
      console.log(error)

      toast.error(
        error.response?.data?.message || error.message
      )
    }
  }

  return (

    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <Link to="/">
        <img src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
      </Link>

      {/* enter email id */}

      {
        !isEmailSent &&

        <form action="" className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img className='w-3 h-3' src={assets.mail_icon} alt="" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder='Email Id' className='bg-transparent outline-none text-white' />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
        </form>

      }

      {/* Otp Input Form */}

      {
        !isOtpSubmitted && isEmailSent &&

        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id.</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {
              Array(6).fill(0).map((_, index) => {
                return <input key={index} type="text" maxLength='1' required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                  ref={e => inputRefs.current[index] = e}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              })
            }
          </div>

          <button className='w-full text-white font-semibold py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full'>
            {
              loading ? 'Loading...' : ' Submit'
            }
          </button>
        </form>

      }

      {/* enter new password */}
      {
        isOtpSubmitted && isEmailSent &&
        <form action="" className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the new Password below.</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img className='w-3 h-3' src={assets.lock_icon} alt="" />
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required type="password" placeholder='Password' className='bg-transparent outline-none text-white' />
          </div>
          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Submit</button>
        </form>

      }


    </div>
  )
}

export default ResetPassword