import React, { useEffect , useState} from 'react'
import {useLocation} from 'react-router-dom'
import DashSide from '../components/DashSide';
import DashProfile from '../components/DashProfile';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFormUrl = urlParams.get('tab')
    if(tabFormUrl) {
      setTab(tabFormUrl)
    }
  },[location.search])

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSide/>
      </div>
        {tab === 'profile' && <DashProfile/>}
    </div>
  )
}
