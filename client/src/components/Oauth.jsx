import React from 'react'
import {Button} from 'flowbite-react'
import {AiFillGoogleCircle} from 'react-icons/ai'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signInStart, signInSuccess} from '../redux/user/user.slice'

export default function Oauth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = getAuth(app);

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt : 'select_account'})
        try {
            dispatch(signInStart())
            const result = await signInWithPopup(auth, provider)
            const res = await fetch('http://localhost:3000/api/auth/google', {
                method:'POST',
                mode: 'cors',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    name : result.user.displayName,
                    email: result.user.email,
                    photo : result.user.photoURL
                })
            })
            const data = await res.json();
            if(res.ok) {
                dispatch(signInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <Button gradientDuoTone='pinkToOrange' outline type='button' onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
