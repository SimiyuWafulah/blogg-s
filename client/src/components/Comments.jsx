import {Alert, Button, Textarea } from 'flowbite-react'
import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'

export default function Comments({postId}) {
    const {currentUser} = useSelector(state => state.user)
    const [comment, setComment] = useState("")
    const [commentError, setCommentError] = useState(null)
    const [commentSuccess, setCommentSuccess] = useState(false)
    const cookies = new Cookies()

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (comment.length >200) {
            return;
        }
        try {
            const res = await fetch('http://localhost:3000/api/comment/create', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('access_token')}`
                },
                body: JSON.stringify({
                    content: comment,
                    postId,
                    userId: currentUser._id
                })
            })
            const data = await res.json();
            if(!res.ok){
                setCommentError(data.message)
                setTimeout(() => {
                    setCommentError(null)
                },4000)
                return;
            }
            if(res.ok){
                setCommentError(null);
                setCommentSuccess('comment submitted')
                setTimeout(() => {
                    setCommentSuccess(false)
                },4000)
                setComment("")
            }
        } catch (error) {
            setCommentError(error.message)
        }
    }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
         <p>Signed in as:</p>
         <img className='w-5 h-5 rounded-full object-cover' src={currentUser.profilePic} alt=''/>
         <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
            @{currentUser.username}
         </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
            You Must sign in to Comments
            <Link className='text-blue-500 hover:underline' to='/signin'>Sign In</Link>
        </div>
      )}
      {currentUser && (
        <form onSubmit={handleSubmit} className='border border-teal-500 rounded-md p-3'>
            <Textarea
                placeholder='Add a comment'
                rows={3}
                maxLength={200}
                onChange={(e) => setComment(e.target.value)}
                value={comment}
            />
            <div className='flex justify-between items-center mt-3'>
                <p className='text-gray-500 text-sm'>{ 200 - comment.length}</p>
                <Button outline gradientDuoTone='purpleToBlue' type='submit'>Submit</Button>
            </div>
        </form>
      )}
      {commentError && (
        <Alert className='mt-5' type='error'>{commentError}</Alert>
      )}
      {commentSuccess && (
        <Alert className='mt-5' type='success'>{commentSuccess}</Alert>
      )}
    </div>
  )
}
