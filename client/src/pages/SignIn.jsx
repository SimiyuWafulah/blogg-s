import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/user.slice';
import Oauth from '../components/Oauth';

export default function SignIn() {
  const {loading, error : error} = useSelector(state => state.user)
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if( !formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all details'))
    }
    try {
      dispatch(signInStart())
      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers : {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success===false) {
       dispatch(signInFailure(data.message))
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row gap-5'>
        {/*left*/}
        <div className='flex-1'>
        <Link to='/' className=' font-bold dark:text-white text-4xl'>
        <span className='px-2 py-1 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white '>Blogg</span>
        -s
        </Link>
        <p className='text-sm mt-5'>
          Welcome to Blogg-s a site where you can put pen to paper and pour out you heart
          for the world to see, so how about you sign in and materialize this
        </p>
        </div>

        {/*right*/}
        <div className='flex-1'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className=''>
              <Label value='Enter Email'/>
              <TextInput
                type='email'
                placeholder='example@gmail.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div className=''>
              <Label value='Enter password'/>
              <TextInput
                type='password'
                placeholder='********'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button disabled={loading} gradientDuoTone='purpleToPink' type='submit'>
              {
                loading ? (
                  <>
                    <Spinner className='sm'/>
                    <span className='pl-3'>Signing In...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
            <Oauth/>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Dont  Have an Account?</span>
            <Link to='/signup' className='text-blue-500'>Sign Up</Link>
          </div>
          {error && (
            <Alert className='mt-5' color='failure'>
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}
