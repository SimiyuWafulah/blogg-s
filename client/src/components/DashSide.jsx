import React, { useEffect, useState } from 'react'
import {Sidebar} from 'flowbite-react'
import {HiArrowSmRight, HiDocumentText, HiUser, HiOutlineUserGroup} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import {signOutSuccess} from '../redux/user/user.slice'
import {useDispatch, useSelector} from 'react-redux'

export default function DashSide() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const {currentUser} = useSelector(state => state.user)

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
        dispatch(signOutSuccess())
      }
    } catch(error) {
      console.log(error.message)
    }
  }

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
        <Link to='/dashboard?tab=profile'>
        <Sidebar.Item active={tab === 'profile'}  icon = {HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark'  as='div'>
                Profile
            </Sidebar.Item>
            </Link>
            {currentUser.isAdmin && (
              <Link to='/dashboard?tab=posts'>
            <Sidebar.Item active={tab === 'posts'} icon ={HiDocumentText} as='div'>
              Posts
            </Sidebar.Item>
            </Link>
            )}
            {currentUser.isAdmin && (
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item active={tab === 'users'} as='div' icon={HiOutlineUserGroup}>
                  Users
                </Sidebar.Item>
              </Link>
            )}
            <Sidebar.Item  icon = {HiArrowSmRight} className='cursor-pointer' onClick ={handleSignOut}>
                Sign Out
            </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

