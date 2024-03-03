import React,{useEffect, useState} from 'react'
import moment from 'moment'
import {FaThumbsUp} from 'react-icons/fa'

export default function Comment({comment, onLike}) {
    const [user, setUser] = useState({})

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/user/${comment.userId}`)
                const data = await res.json();
                if (res.ok) {
                    setUser(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getUser();
    },[comment])
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shink-o mr-3'>
        <img
            src={user.profilePic}
            alt={user.username}
            className='h-10 w-10 rounded-full bg-gray-200'
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
            <span className='font-bold mr-1 text-sm truncate'>{user ? `@${user.username}` : "anonymous"}</span>
            <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        <p className='text-gray-500 mb-2'>{comment.content}</p>
        <div>
          <button className='text-gray-400 hover:text-blue-500' type='button' onClick={() => onLike(comment._id)}>
            <FaThumbsUp className='text-sm'/>
          </button>
        </div>
      </div>
    </div>
  )
}
