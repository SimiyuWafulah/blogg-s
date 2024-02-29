import { Button, Modal, Table } from 'flowbite-react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom'

export default function DashPosts() {
  const {currentUser} = useSelector(state => state.user)
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const [postDelete ,setPostIdDelete] = useState(null)
 useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await fetch (`http://localhost:3000/api/post/getposts?userId=${currentUser._id}`)
      const data = await res.json()
      if(res.ok) {
        setUserPosts(data.posts)
        if(data.posts.length <9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  if(currentUser.isAdmin) {
    fetchPosts()
  }
 },[currentUser._id]);

 const handleShowMore = async () => {
  const startIndex =userPosts.length
  try {
    const res = await fetch(`http://localhost:3000/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
    const data = await res.json()
    if(res.ok) {
      setUserPosts((prev) => [...prev, ...data.posts])
      if(data.posts.length <9) {
        setShowMore(false)
      }
    }
  } catch (error) {
    console.log(error.image)
  }
 }

 const handleDeletePost = async (e) => {
  e.preventDefault();
  setShowModal(false);
  try {
    const res = await fetch(`http://localhost:3000/api/post/delete/${postDelete}/${currentUser._id}`,{
      method: 'DELETE',
      credentials: 'include'
    })
    const data = await res.json()
    if(!res.ok){
      console.log(data.message)
    }else{
      setUserPosts((prev) => prev.filter((post) => post._id !== postDelete));
    }
  } catch (error) {
    console.log(error.image)
  }
 }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track=slate-700 dark:scrollbar-thumb-slate-300'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className='divide-y' key={post._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                    <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                      <button 
                      onClick={() => {
                        setShowModal(true);
                        setPostIdDelete(post._id)
                      }}
                      className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
                      >
                      Delete
                      </button>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer'>Edit</button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {
            showMore &&
            <div className='flex justify-center mt-5'>
              <button onClick={handleShowMore } className='w-full text-teal-500 text-sm font-bold py-7 self-center hover:underline cursor-pointer'>Show More</button>
            </div>
          }
        </>
      ) : (
        <p>You have no posts yet</p>
      )}
      <Modal show={showModal} onClose={() =>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400  dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeletePost}>Yes</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    </div>
  )
}
