import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Alert, Button, Modal, TextInput} from 'flowbite-react'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure,signOutSuccess} from '../redux/user/user.slice'
import { useDispatch } from 'react-redux'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie'

const cookies = new Cookies()


export default function DashProfile() {
    const {currentUser, error} = useSelector(state => state.user)
    const [imgFile, setImgFile] = useState(null)
    const [imgUrl,setImgUrl] = useState(null)
    const fileRef = useRef()
    const [imgProgress, setImgProgress] = useState(null);
    const [imgUploadError, setImgUploadError] = useState(null)
    const [updateSuccess, setUpdateSuccess] = useState(null)
    const [updateError, setUpdateError] = useState(null)
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const userId = currentUser._id
    const [imgFileUploading, setImgFileUploading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
      const imgUrlFromLocalStorage = localStorage.getItem('imgUrl');
      if (imgUrlFromLocalStorage) {
        setImgUrl(imgUrlFromLocalStorage);
      }
    }, []);


    const handleImgChange = (e) => {
      const file = e.target.files[0]
      if(file) {
        setImgFile(file);
        setImgUrl(URL.createObjectURL(file))
      }
    }

    useEffect(() => {
      if(imgFile){
        uploadImage();
      }
    },[imgFile])

    const uploadImage = async () => {
      setImgFileUploading(true)
      setImgUploadError(null)
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imgFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imgFile)
      

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImgProgress(progress.toFixed(0)) 
        },
        (error) => {
          setImgUploadError('could not upload image')
          setImgFile(null)
          setImgUrl(null)
          setImgFileUploading(false)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            localStorage.setItem('imgUrl', downloadUrl);
            setImgUrl(downloadUrl);
            setImgProgress(null)
            setFormData({...formData, profilePic: downloadUrl});
            setImgFileUploading(false)
          })
        }
      )
    } 

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id] : e.target.value
      })
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      setUpdateError(null)
      setUpdateSuccess(null)
      if(Object.keys(formData).length === 0) {
        setUpdateError('No changes made')
        return;
      }
      if(imgFileUploading) {
        setUpdateError('Please wait for image to upload')
        return
      }
      try {
        dispatch(updateUserStart())

        const accessToken = cookies.get('access_token')
        const res = await fetch(`http://localhost:3000/api/user/update/${userId}`,{
          method: 'PUT',
          mode: 'cors',
          credentials : 'include',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        })
        const data = await res.json()
        if(data.success === false){
          dispatch(updateUserFailure(data.message))
        }else{
          dispatch(updateUserSuccess(data))
          setUpdateSuccess('Update Successsful')
        }
      } catch (error) {
        dispatch(updateUserFailure(error.message))
      }
    }

    const handleDelete = async () => {
      setShowModal(false)
      try {
        dispatch(deleteUserStart())
        const res = await fetch (`http://localhost:3000/api/user/delete/${userId}`, {
          method: 'DELETE'
        }) 

        const data = await res.json()
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message))
        }
        if(res.ok) {
          dispatch(deleteUserSuccess(data))
          navigate('/signin')
        }
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
    }

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
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' accept='image/*' hidden onChange={handleImgChange} ref={fileRef}/>
          <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() =>fileRef.current.click()}>
          {imgProgress && (
            <CircularProgressbar 
            value={imgProgress || 0} text={`${imgProgress}%`}
            strokeWidth={5}
            styles={{
              root : {
                height : '100%',
                width : '100%',
                position: 'absolute',
                top: 0,
                left: 0,
              },
              path : {
                stroke : `rgba(62,152,199), ${imgProgress / 100}`
              }
            }}
            />
          )}
            <img
              src={imgUrl || currentUser.profilePic}
              alt='user'
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imgProgress < 100 && ''}`}
            />
          </div>
          {imgUploadError && (
            <Alert color='failure'>
              {imgUploadError}
            </Alert>
          )}
          <TextInput
            type='text'
            id= 'username'
            placeholder='username'
            defaultValue={currentUser.username}
            onChange={handleChange}
          />
           <TextInput
            type='email'
            id= 'email'
            placeholder='example@gmail.com'
            defaultValue={currentUser.email}
            onChange={handleChange}
          />
           <TextInput
            type='password'
            id= 'password'
            placeholder='password'
            onChange={handleChange}
          />
          <Button gradientDuoTone='purpleToBlue' type='submit'>
            Update
          </Button>
        </form>
        <div className='text-red-500 flex justify-between mt-5'>
          <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
          <span className='cursor-pointer'onClick={handleSignOut}>Sign Out</span>
        </div>
        {updateSuccess && (
          <Alert color='success' className='mt-5'>
            {updateSuccess}
          </Alert>
        )}
        {updateError && (
          <Alert color='failure' className='mt-5'>
            {updateError}
          </Alert>
        )}
        {error && (
          <Alert color='failure' className='mt-5'>
            {error}
          </Alert>
        )}
        <Modal show={showModal} onClose={() =>setShowModal(false)} popup size='md'>
          <Modal.Header/>
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400  dark:text-gray-200 mb-4 mx-auto'/>
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this account?</h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDelete}>Yes</Button>
                <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
    </div>
  )
}