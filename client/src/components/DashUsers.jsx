import { Button, Modal, Table } from 'flowbite-react'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import {useSelector} from 'react-redux'


export default function DashUsers() {
  const {currentUser} = useSelector(state => state.user)
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const [userDelete ,setUserDelete] = useState(null)

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch ('http://localhost:3000/api/user/getUsers',{
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      })
      const data = await res.json()
      if(res.ok) {
        setUsers(data.users)
        if(data.users.length <9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  if(currentUser.isAdmin) {
    fetchUsers()
  }
 },[currentUser._id]);

 const handleShowMore = async () => {
  const startIndex =users.length
  try {
    const res = await fetch(`http://localhost:3000/api/user/getUsers?userId=${currentUser._id}&startIndex=${startIndex}`);
    const data = await res.json()
    if(res.ok) {
      setUsers((prev) => [...prev, ...data.users])
      if(data.users.length <9) {
        setShowMore(false)
      }
    }
  } catch (error) {
    console.log(error.image)
  }
 }

 const handleDeleteUser = async (e) => {
  e.preventDefault();
  setShowModal(false);
  try {
    const res = await fetch(`http://localhost:3000/api/user/delete/${userDelete}`,{
      method: 'DELETE',
      credentials: 'include'
    })
    const data = await res.json()
    if(!res.ok){
      console.log(data.message)
    }else{
      setUsers((prev) => prev.filter((user) => user._id !== userDelete));
      setShowModal(false)
    }
  } catch (error) {
    console.log(error.image)
  }
 }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track=slate-700 dark:scrollbar-thumb-slate-300'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Profile Picture</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <img 
                    src={user.profilePic} 
                    alt={user.username} 
                    className='w-10 h-10 rounded-full object-cover bg-gray-500' 
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? 'Admin' : 'User'}</Table.Cell>
                  <Table.Cell>
                      <button 
                      onClick={() => {
                        setShowModal(true);
                        setUserDelete(user._id)
                      }}
                      className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer'
                      >
                      Delete
                      </button>
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
        <p>There are no users yet</p>
      )}
      <Modal show={showModal} onClose={() =>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400  dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteUser}>Yes</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    </div>
  )
}
