import {Alert, Button, Textarea } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import Comment from './Comment'
import {useNavigate} from 'react-router-dom'

export default function Comments({postId}) {
    const {currentUser} = useSelector(state => state.user)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const [commentError, setCommentError] = useState(null)
    const [commentSuccess, setCommentSuccess] = useState(false)
    const navigate = useNavigate();
    const cookies = new Cookies()

    useEffect(() => {
      try {
        const fetchComments = async () => {
          const res = await fetch(`http://localhost:3000/api/comment/getPostcomments/${postId}`)
          const data = await res.json()
          if(!res.ok){
            setCommentError(data.message)
          } else {
            setComments(data)
          }
        }
        fetchComments();
      } catch (error) {
        console.log(error)
      }
    },[postId])

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
                },4000);
                setComment("")
                setComments([data, ...comments])
            }
        } catch (error) {
            setCommentError(error.message)
        }
    }

    const handleLikes = async (commentId) => {
      try {
        if(!currentUser) {
          navigate('/signin')
          return;
        }
        const res = await fetch(`http://localhost:3000/api/comment/like/${commentId}`, {
          method: 'PUT',
          mode: 'cors',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cookies.get('access_token')}`
          }
        })
        if(res.ok){
         const data = await res.json()
         setComments(comments.map((comment) => 
         comment._id === commentId ? {
           ...comment,
           likes: data.likes,
           numberOfLikes: data.likes.length,
         } : comment
       ));
       
        }
      } catch (error) {
        console.log(error)
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
      {comments.length === 0 ? (
        <p className='text-sm my-7'>Be the first one to comment</p>
      ): (
        <>
        <div className='flex text-sm my-5 items-center gap-1'>
          <p>Comments</p>
          <div className='border border-gray-400 py-1 px-2 rounded-sm'>
            <p>{comments.length}</p>
          </div>
        </div>
        {comments.map((comment) => (
          <Comment key={comment._id} comment={comment} onLike={handleLikes}/>
        ))}
        </>
      )}
    </div>
  )
}
