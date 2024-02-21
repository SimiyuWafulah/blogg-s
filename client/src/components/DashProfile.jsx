import React, { useEffect, useState } from 'react'
import {useSelector} from 'react-redux'
import {Alert, Button, TextInput} from 'flowbite-react'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateUserStart,updateUserSuccess,updateUserFailure } from '../redux/user/user.slice'
import { useDispatch } from 'react-redux'


export default function DashProfile() {
    const {currentUser} = useSelector(state => state.user)
    const [imgFile, setImgFile] = useState(null)
    const [imgUrl,setImgUrl] = useState(null)
    const fileRef = useRef()
    const [imgProgress, setImgProgress] = useState(null);
    const [imgUploadError, setImgUploadError] = useState(null)
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const userId = currentUser._id

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
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            localStorage.setItem('imgUrl', downloadUrl);
            setImgUrl(downloadUrl);
            setImgProgress(null)
            setFormData({...formData, profilePic: downloadUrl})
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
      if(Object.keys(formData).length === 0) {
        return;
      }
      dispatch(updateUserStart())
      try {
        const res = await fetch(`http://localhost:3000/api/user/update/${userId}`,{
          method: 'PUT',
          mode: 'cors',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(formData)
        })
        const data = await res.json()
        if(data.success === false){
          dispatch(updateUserFailure(data.message))
        }else{
          dispatch(updateUserSuccess(data))
        }
      } catch (error) {
        dispatch(updateUserFailure(error.message))
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
              className={`rouned-full w-full h-full object-cover border-8 border-[lightgray] ${imgProgress < 100 && 'opacity-60'}`}
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
          <span className='cursor-pointer'>Delete Account</span>
          <span className='cursor-pointer'>Sign Out</span>
        </div>
    </div>
  )
}
