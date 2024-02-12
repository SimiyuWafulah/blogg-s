import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
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
          for the world to see, so how about you sign up and materialize this
        </p>
        </div>

        {/*right*/}
        <div className='flex-1'>
          <form className='flex flex-col gap-4'>
            <div className=''>
              <Label value='Enter username'/>
              <TextInput
                type='text'
                placeholder='username'
                id='username'
              />
            </div>
            <div className=''>
              <Label value='Enter Email'/>
              <TextInput
                type='email'
                placeholder='example@gmail.com'
                id='email'
              />
            </div>
            <div className=''>
              <Label value='Enter password'/>
              <TextInput
                type='passoword'
                placeholder='password'
                id='password'
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit'>
              Sign Up
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Do you Have an Account?</span>
            <Link to='/signin' className='text-blue-500'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
