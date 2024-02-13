import React from 'react'
import {Navbar, Button, Dropdown, Avatar} from 'flowbite-react'
import { Link , useLocation} from 'react-router-dom'
import  {TextInput} from 'flowbite-react'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon,FaSun} from 'react-icons/fa'
import {useDispatch, useSelector} from 'react-redux'
import { toogleTheme } from '../redux/theme/theme.slice'

export default function Header() {
  const dispatch = useDispatch()
    const path = useLocation().pathname
    const {currentUser} = useSelector(state =>  state.user)
    const {theme} = useSelector(state => state.theme)
  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white '>Blogg</span>
        -s
      </Link>
      <form>
        <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
        />
      </form>
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch/>
      </Button>
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color ='gray' pill onClick={() => dispatch(toogleTheme())}>
            {theme === 'light' ? <FaMoon/> : <FaSun/>}
        </Button>
        {currentUser ? (
          <Dropdown
          arrowIcon={false}
          inline
          label ={
            <Avatar
              alt='user'
              img={currentUser.profilePic}
              rounded
            />
          }
          >
             <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
             </Dropdown.Header>
             <Link to={'/dashboard?tab=profile'}>
                <Dropdown.Item>Profile</Dropdown.Item>
             </Link>
             <Dropdown.Divider/>
             <Dropdown.Item>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button gradientDuoTone='purpleToBlue' outline>
                Sign In
            </Button>
        </Link>
        )}

        <Navbar.Toggle/>
      </div>
      <Navbar.Collapse>
            <Navbar.Link active={path ==="/"} as={'div'}>
                <Link to='/'>
                    Home
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path ==="/about"} as={'div'}>
                <Link to='/about'>
                    About
                </Link>
            </Navbar.Link>
            <Navbar.Link active={path ==="/projects"} as={'div'}>
                <Link to='/projects'>
                    Projects
                </Link>
            </Navbar.Link>
        </Navbar.Collapse>
    </Navbar>
  )
}
