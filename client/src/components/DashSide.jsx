import React, { useEffect, useState } from 'react'
import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import {signOutSuccess} from '../redux/user/user.slice'
import {useDispatch} from 'react-redux'

export default function DashSide() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch()

    useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFormUrl = urlParams.get('tab')
    if(tabFormUrl) {
      setTab(tabFormUrl)
    }
  },[location.search])

  const handleSignOut = async () => {
    try{
      const res = await fetch('http://localhost:3000/api/user/signout', {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      }else{
        dispatch(signOutSuccess(data))
      }
    } catch(error) {
      console.log(error.message)
    }
  }

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
        <Link to='/dashboard?tab=profile'>
        <Sidebar.Item active={tab === 'profile'}  icon = {HiUser} label={"User"} labelColor='dark'  as='div'>
                Profile
            </Sidebar.Item>
            <Sidebar.Item  icon = {HiArrowSmRight} className='cursor-pointer' onClick ={handleSignOut}>
                Sign Out
            </Sidebar.Item>
        </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

